const express = require('express');
const { body, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId })
      .populate('userId', 'firstName lastName age gender interestedIn location');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', auth, [
  body('bio').optional().isLength({ max: 500 }),
  body('interests').optional().isArray(),
  body('hobbies').optional().isArray(),
  body('occupation').optional().isString(),
  body('education').optional().isString(),
  body('height').optional().isNumeric(),
  body('relationshipGoals').optional().isIn(['casual', 'serious', 'marriage', 'friendship', 'not-sure']),
  body('values').optional().isArray(),
  body('dealBreakers').optional().isArray(),
  body('mustHaves').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.personality;
    delete updateData.loveLanguages;
    delete updateData.communicationStyle;
    delete updateData.lifestyle;
    delete updateData.quizCompleted;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      updateData,
      { new: true, runValidators: true, upsert: true }
    ).populate('userId', 'firstName lastName age gender interestedIn location');

    // Recalculate completion percentage
    profile.calculateCompletion();
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profile/quiz
// @desc    Submit personality quiz results
// @access  Private
router.post('/quiz', auth, [
  body('personality').isObject(),
  body('loveLanguages').isObject(),
  body('communicationStyle').isObject(),
  body('lifestyle').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { personality, loveLanguages, communicationStyle, lifestyle } = req.body;

    // Validate personality scores (0-100)
    const personalityTraits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    for (const trait of personalityTraits) {
      if (personality[trait] < 0 || personality[trait] > 100) {
        return res.status(400).json({ message: `Invalid ${trait} score. Must be between 0-100.` });
      }
    }

    // Validate love language scores (should sum to 100)
    const loveLanguageKeys = Object.keys(loveLanguages);
    const loveLanguageSum = loveLanguageKeys.reduce((sum, key) => sum + (loveLanguages[key] || 0), 0);
    if (Math.abs(loveLanguageSum - 100) > 5) { // Allow 5% tolerance
      return res.status(400).json({ message: 'Love language scores must sum to approximately 100.' });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        personality,
        loveLanguages,
        communicationStyle,
        lifestyle,
        quizCompleted: true
      },
      { new: true, runValidators: true, upsert: true }
    ).populate('userId', 'firstName lastName age gender interestedIn location');

    // Recalculate completion percentage
    profile.calculateCompletion();
    await profile.save();

    // Update user's profile completion status
    await User.findByIdAndUpdate(req.userId, { isProfileComplete: true });

    res.json(profile);
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profile/quiz
// @desc    Get personality quiz questions
// @access  Private
router.get('/quiz', auth, async (req, res) => {
  try {
    const quizQuestions = [
      {
        id: 'openness_1',
        category: 'personality',
        trait: 'openness',
        question: 'How much do you enjoy trying new experiences and activities?',
        options: [
          { value: 20, text: 'I prefer familiar routines' },
          { value: 40, text: 'I occasionally try new things' },
          { value: 60, text: 'I enjoy some variety' },
          { value: 80, text: 'I love exploring new experiences' },
          { value: 100, text: 'I constantly seek new adventures' }
        ]
      },
      {
        id: 'conscientiousness_1',
        category: 'personality',
        trait: 'conscientiousness',
        question: 'How organized and disciplined are you in your daily life?',
        options: [
          { value: 20, text: 'I prefer to go with the flow' },
          { value: 40, text: 'I have some structure' },
          { value: 60, text: 'I like to plan ahead' },
          { value: 80, text: 'I am very organized' },
          { value: 100, text: 'I am extremely disciplined' }
        ]
      },
      {
        id: 'extraversion_1',
        category: 'personality',
        trait: 'extraversion',
        question: 'How do you feel about social gatherings and meeting new people?',
        options: [
          { value: 20, text: 'I prefer quiet, intimate settings' },
          { value: 40, text: 'I enjoy small groups' },
          { value: 60, text: 'I like a mix of social and quiet time' },
          { value: 80, text: 'I enjoy large gatherings' },
          { value: 100, text: 'I thrive in large social events' }
        ]
      },
      {
        id: 'agreeableness_1',
        category: 'personality',
        trait: 'agreeableness',
        question: 'How do you typically handle disagreements?',
        options: [
          { value: 20, text: 'I stand my ground firmly' },
          { value: 40, text: 'I prefer to debate' },
          { value: 60, text: 'I try to find middle ground' },
          { value: 80, text: 'I often compromise' },
          { value: 100, text: 'I avoid conflict when possible' }
        ]
      },
      {
        id: 'neuroticism_1',
        category: 'personality',
        trait: 'neuroticism',
        question: 'How do you typically react to stressful situations?',
        options: [
          { value: 20, text: 'I stay calm and composed' },
          { value: 40, text: 'I handle stress well' },
          { value: 60, text: 'I get somewhat anxious' },
          { value: 80, text: 'I find stress challenging' },
          { value: 100, text: 'I get very anxious easily' }
        ]
      },
      {
        id: 'love_language_1',
        category: 'loveLanguages',
        question: 'What makes you feel most loved and appreciated?',
        options: [
          { value: 'wordsOfAffirmation', text: 'Hearing words of encouragement and appreciation' },
          { value: 'actsOfService', text: 'When someone does helpful things for me' },
          { value: 'receivingGifts', text: 'Receiving thoughtful gifts or surprises' },
          { value: 'qualityTime', text: 'Spending focused, uninterrupted time together' },
          { value: 'physicalTouch', text: 'Hugs, holding hands, and physical affection' }
        ]
      },
      {
        id: 'communication_1',
        category: 'communicationStyle',
        trait: 'directness',
        question: 'How direct are you in your communication?',
        options: [
          { value: 20, text: 'I hint at what I mean' },
          { value: 40, text: 'I sometimes beat around the bush' },
          { value: 60, text: 'I am moderately direct' },
          { value: 80, text: 'I am quite straightforward' },
          { value: 100, text: 'I am very blunt and direct' }
        ]
      },
      {
        id: 'lifestyle_1',
        category: 'lifestyle',
        trait: 'socialActivity',
        question: 'How often do you like to go out and be social?',
        options: [
          { value: 20, text: 'I prefer staying in most of the time' },
          { value: 40, text: 'I go out occasionally' },
          { value: 60, text: 'I like a good balance' },
          { value: 80, text: 'I go out frequently' },
          { value: 100, text: 'I am out almost every night' }
        ]
      }
    ];

    res.json({ questions: quizQuestions });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profile/:userId
// @desc    Get another user's public profile
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Don't allow users to view their own profile through this endpoint
    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: 'Use /api/profile/me to view your own profile' });
    }

    const profile = await Profile.findOne({ userId })
      .populate('userId', 'firstName lastName age gender location');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if profile is visible
    if (!profile.isVisible) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Filter sensitive information
    const publicProfile = {
      ...profile.toObject(),
      userId: {
        firstName: profile.userId.firstName,
        lastName: profile.userId.lastName,
        age: profile.userId.age,
        gender: profile.userId.gender,
        location: profile.showLocation ? profile.userId.location : undefined
      }
    };

    res.json(publicProfile);
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profile/photos
// @desc    Upload profile photos
// @access  Private
router.post('/photos', auth, async (req, res) => {
  try {
    // For now, we'll just return a success message
    // In a real implementation, you'd handle file uploads with multer and cloudinary
    res.json({ message: 'Photo upload endpoint - implement with multer and cloudinary' });
  } catch (error) {
    console.error('Upload photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
