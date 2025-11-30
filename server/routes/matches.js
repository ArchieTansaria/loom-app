const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Match = require('../models/Match');
const Profile = require('../models/Profile');
const User = require('../models/User');
const compatibilityEngine = require('../utils/compatibilityEngine');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/matches/discover
// @desc    Get potential matches for the current user
// @access  Private
router.get('/discover', auth, async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    
    // Get current user's profile
    const currentProfile = await Profile.findOne({ userId: req.userId })
      .populate('userId', 'gender interestedIn location');
    
    if (!currentProfile || !currentProfile.quizCompleted) {
      return res.status(400).json({ 
        message: 'Please complete your personality quiz to discover matches' 
      });
    }

    const currentUser = currentProfile.userId;
    
    // Find potential matches based on preferences
    const potentialMatches = await Profile.find({
      userId: { $ne: req.userId },
      isVisible: true,
      quizCompleted: true
    })
    .populate('userId', 'firstName lastName age gender location interestedIn')
    .limit(parseInt(limit))
    .skip(parseInt(skip));

    // Filter by gender preference and age range
    const filteredMatches = potentialMatches.filter(profile => {
      const user = profile.userId;

  //       console.log({
  //   currentGender: currentUser.gender,
  //   currentInterestedIn: currentUser.interestedIn,
  //   candidateGender: user.gender,
  //   candidateInterestedIn: user.interestedIn,
  //   candidateAge: user.age
  // });
      
      // Check gender preference
      if (!currentUser.interestedIn.includes(user.gender)) {
        return false;
      }
      
      // Check if they're interested in current user's gender
      if (!user.interestedIn || !user.interestedIn.includes(currentUser.gender)) {
        return false;
      }
      
      // Age range filtering (18-65 for now)
      if (user.age < 18 || user.age > 65) {
        return false;
      }
      
      return true;
    });

    // Calculate compatibility for each potential match
    const matchesWithCompatibility = await Promise.all(
      filteredMatches.map(async (profile) => {
        const compatibility = compatibilityEngine.calculateCompatibility(
          currentProfile,
          profile
        );

        return {
          profile: {
            id: profile._id,
            userId: profile.userId._id,
            firstName: profile.userId.firstName,
            lastName: profile.userId.lastName,
            age: profile.userId.age,
            bio: profile.bio,
            photos: profile.photos,
            interests: profile.interests,
            occupation: profile.occupation,
            location: profile.userId.location
          },
          compatibility: compatibility.compatibilityScore,
          compatibilityBreakdown: compatibility.compatibilityBreakdown,
          explanation: compatibility.explanation,
          isHighQuality: compatibility.isHighQuality
        };
      })
    );

    // Sort by compatibility score
    matchesWithCompatibility.sort((a, b) => b.compatibility - a.compatibility);

    res.json({
      matches: matchesWithCompatibility,
      total: matchesWithCompatibility.length
    });
  } catch (error) {
    console.error('Discover matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/matches/:userId/like
// @desc    Like or pass on a potential match
// @access  Private
router.post('/:userId/like', auth, [
  body('action').isIn(['like', 'pass'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { action } = req.body;

    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot like yourself' });
    }

    // Check if match already exists
    let match = await Match.findOne({
      $or: [
        { user1: req.userId, user2: userId },
        { user1: userId, user2: req.userId }
      ]
    });

    if (!match) {
      // Create new match record
      const user1Id = req.userId < userId ? req.userId : userId;
      const user2Id = req.userId < userId ? userId : req.userId;
      
      // Get profiles for compatibility calculation
      const [profile1, profile2] = await Promise.all([
        Profile.findOne({ userId: user1Id }),
        Profile.findOne({ userId: user2Id })
      ]);

      if (!profile1 || !profile2) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      const compatibility = compatibilityEngine.calculateCompatibility(profile1, profile2);

      match = new Match({
        user1: user1Id,
        user2: user2Id,
        compatibilityScore: compatibility.compatibilityScore,
        compatibilityBreakdown: compatibility.compatibilityBreakdown,
        explanation: compatibility.explanation,
        isHighQuality: compatibility.isHighQuality
      });
    }

    // Update match based on action
    if (action === 'like') {
      if (match.user1.toString() === req.userId.toString()) {
        match.user1Liked = true;
        match.user1LikedAt = new Date();
      } else {
        match.user2Liked = true;
        match.user2LikedAt = new Date();
      }
    } else if (action === 'pass') {
      match.status = 'declined';
    }

    await match.save();

    // Check if it's now a mutual match
    if (match.user1Liked && match.user2Liked && match.status !== 'declined') {
      match.status = 'mutual';
      // console.log("Generated chatRoomId:", match.generateChatRoomId());
      match.chatRoomId = match.generateChatRoomId();
      await match.save();

      return res.json({
        message: 'It\'s a match!',
        isMatch: true,
        match: {
          id: match._id,
          chatRoomId: match.chatRoomId,
          compatibilityScore: match.compatibilityScore,
          explanation: match.explanation
        }
      });
    }

    res.json({
      message: action === 'like' ? 'Liked successfully' : 'Passed successfully',
      isMatch: false
    });
  } catch (error) {
    console.error('Like/pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/matches/mutual
// @desc    Get mutual matches for the current user
// @access  Private
router.get('/mutual', auth, async (req, res) => {
  try {
    const matches = await Match.findMutualMatches(req.userId);
    
    const mutualMatches = matches.map(match => {
      const otherUser = match.user1.toString() === req.userId.toString() 
        ? match.user2 
        : match.user1;
      
      return {
        id: match._id,
        chatRoomId: match.chatRoomId,
        compatibilityScore: match.compatibilityScore,
        explanation: match.explanation,
        user: {
          id: otherUser._id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          age: otherUser.age,
          photos: otherUser.photos
        },
        matchedAt: match.updatedAt
      };
    });

    res.json({ matches: mutualMatches });
  } catch (error) {
    console.error('Get mutual matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/matches/stats
// @desc    Get user's match statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    console.log("Stats requested for user:", req.userId);
    const [totalLikes, mutualMatches, highQualityMatches] = await Promise.all([
      Match.countDocuments({
        $and: [
          { $or: [{ user1: req.userId }, { user2: req.userId }] },
          { $or: [{ user1Liked: true }, { user2Liked: true }] }
        ]
      }),
      Match.countDocuments({
        $or: [{ user1: req.userId }, { user2: req.userId }],
        status: 'mutual'
      }),
      Match.countDocuments({
        $or: [{ user1: req.userId }, { user2: req.userId }],
        status: 'mutual',
        isHighQuality: true
      })
    ]);

    res.json({
      totalLikes,
      mutualMatches,
      highQualityMatches,
      matchRate: totalLikes > 0 ? Math.round((mutualMatches / totalLikes) * 100) : 0
    });
  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/matches/:matchId
// @desc    Get detailed match information
// @access  Private
router.get('/:matchId', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const match = await Match.findOne({
      chatRoomId: `chat_${matchId}`,
      $or: [{ user1: req.userId }, { user2: req.userId }]
    }).populate('user1 user2', 'firstName lastName age photos bio interests');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const otherUser = match.user1.toString() === req.userId.toString() 
      ? match.user2 
      : match.user1;

    res.json({
      id: match._id,
      chatRoomId: match.chatRoomId,
      compatibilityScore: match.compatibilityScore,
      compatibilityBreakdown: match.compatibilityBreakdown,
      explanation: match.explanation,
      isHighQuality: match.isHighQuality,
      status: match.status,
      user: {
        id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        age: otherUser.age,
        bio: otherUser.bio,
        photos: otherUser.photos,
        interests: otherUser.interests
      },
      matchedAt: match.updatedAt
    });
  } catch (error) {
    console.error('Get match details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/matches/:matchId
// @desc    Unmatch with someone
// @access  Private
router.delete('/:matchId', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const match = await Match.findOne({
      _id: matchId,
      $or: [{ user1: req.userId }, { user2: req.userId }]
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Update match status to declined
    match.status = 'declined';
    await match.save();

    res.json({ message: 'Unmatched successfully' });
  } catch (error) {
    console.error('Unmatch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
