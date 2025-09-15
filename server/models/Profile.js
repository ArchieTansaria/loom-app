const mongoose = require('mongoose');

const personalitySchema = new mongoose.Schema({
  // Big Five Personality Traits (0-100 scale)
  openness: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  conscientiousness: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  extraversion: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  agreeableness: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  neuroticism: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  }
});

const loveLanguageSchema = new mongoose.Schema({
  wordsOfAffirmation: { type: Number, min: 0, max: 100, default: 20 },
  actsOfService: { type: Number, min: 0, max: 100, default: 20 },
  receivingGifts: { type: Number, min: 0, max: 100, default: 20 },
  qualityTime: { type: Number, min: 0, max: 100, default: 20 },
  physicalTouch: { type: Number, min: 0, max: 100, default: 20 }
});

const communicationStyleSchema = new mongoose.Schema({
  directness: { type: Number, min: 0, max: 100, default: 50 },
  emotionalExpression: { type: Number, min: 0, max: 100, default: 50 },
  conflictResolution: { type: Number, min: 0, max: 100, default: 50 },
  humor: { type: Number, min: 0, max: 100, default: 50 }
});

const lifestyleSchema = new mongoose.Schema({
  socialActivity: { type: Number, min: 0, max: 100, default: 50 },
  adventure: { type: Number, min: 0, max: 100, default: 50 },
  routine: { type: Number, min: 0, max: 100, default: 50 },
  workLifeBalance: { type: Number, min: 0, max: 100, default: 50 }
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Profile Information
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  photos: [{
    url: String,
    isPrimary: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Interests and Hobbies
  interests: [String],
  hobbies: [String],
  music: [String],
  movies: [String],
  books: [String],
  
  // Lifestyle Information
  occupation: String,
  education: String,
  height: Number, // in cm
  relationshipGoals: {
    type: String,
    enum: ['casual', 'serious', 'marriage', 'friendship', 'not-sure']
  },
  
  // Psychological Profile (from quiz)
  personality: personalitySchema,
  loveLanguages: loveLanguageSchema,
  communicationStyle: communicationStyleSchema,
  lifestyle: lifestyleSchema,
  
  // Additional Compatibility Factors
  values: [String], // e.g., ['family', 'career', 'adventure', 'stability']
  dealBreakers: [String],
  mustHaves: [String],
  
  // Profile Completion Status
  quizCompleted: {
    type: Boolean,
    default: false
  },
  profileCompletionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Privacy Settings
  isVisible: {
    type: Boolean,
    default: true
  },
  showAge: {
    type: Boolean,
    default: true
  },
  showLocation: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate profile completion percentage
profileSchema.methods.calculateCompletion = function() {
  let completed = 0;
  let total = 0;
  
  // Basic info (40% weight)
  if (this.bio && this.bio.length > 10) completed += 1;
  total += 1;
  
  if (this.photos && this.photos.length > 0) completed += 1;
  total += 1;
  
  if (this.interests && this.interests.length > 0) completed += 1;
  total += 1;
  
  if (this.occupation) completed += 1;
  total += 1;
  
  // Quiz completion (60% weight)
  if (this.quizCompleted) completed += 3;
  total += 3;
  
  this.profileCompletionPercentage = Math.round((completed / total) * 100);
  return this.profileCompletionPercentage;
};

// Ensure love languages sum to 100
loveLanguageSchema.pre('save', function(next) {
  const total = Object.values(this.toObject()).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  if (total !== 100) {
    // Normalize to 100
    const factor = 100 / total;
    Object.keys(this.toObject()).forEach(key => {
      if (typeof this[key] === 'number') {
        this[key] = Math.round(this[key] * factor);
      }
    });
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
