const mongoose = require('mongoose');

const compatibilityBreakdownSchema = new mongoose.Schema({
  personality: { type: Number, min: 0, max: 100 },
  loveLanguages: { type: Number, min: 0, max: 100 },
  communicationStyle: { type: Number, min: 0, max: 100 },
  lifestyle: { type: Number, min: 0, max: 100 },
  values: { type: Number, min: 0, max: 100 },
  interests: { type: Number, min: 0, max: 100 }
});

const matchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Compatibility Score (0-100)
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  
  // Detailed breakdown of compatibility
  compatibilityBreakdown: compatibilityBreakdownSchema,
  
  // Match explanation
  explanation: {
    type: String,
    maxlength: 500
  },
  
  // Match status
  status: {
    type: String,
    enum: ['potential', 'mutual', 'declined', 'blocked'],
    default: 'potential'
  },
  
  // User interactions
  user1Liked: {
    type: Boolean,
    default: false
  },
  user2Liked: {
    type: Boolean,
    default: false
  },
  
  user1LikedAt: Date,
  user2LikedAt: Date,
  
  // Chat room ID for matched users
  chatRoomId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Match quality indicators
  isHighQuality: {
    type: Boolean,
    default: false
  },
  
  // AI-generated icebreaker (future feature)
  icebreaker: {
    type: String,
    maxlength: 200
  },
  
  // Last interaction
  lastInteraction: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique matches (user1-user2 pair can only exist once)
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

// Virtual to check if it's a mutual match
matchSchema.virtual('isMutual').get(function() {
  return this.user1Liked && this.user2Liked;
});

// Method to generate chat room ID
matchSchema.methods.generateChatRoomId = function() {
  const ids = [this.user1.toString(), this.user2.toString()].sort();
  return `chat_${ids[0]}_${ids[1]}`;
};

// Pre-save middleware to set chat room ID for mutual matches
matchSchema.pre('save', function(next) {
  if (this.isMutual && !this.chatRoomId) {
    this.chatRoomId = this.generateChatRoomId();
    this.status = 'mutual';
  }
  next();
});

// Static method to find matches for a user
matchSchema.statics.findMatchesForUser = function(userId, status = 'potential') {
  return this.find({
    $or: [{ user1: userId }, { user2: userId }],
    status: status
  }).populate('user1 user2', 'firstName lastName photos bio');
};

// Static method to find mutual matches
matchSchema.statics.findMutualMatches = function(userId) {
  return this.find({
    $or: [{ user1: userId }, { user2: userId }],
    status: 'mutual'
  }).populate('user1 user2', 'firstName lastName photos bio');
};

module.exports = mongoose.model('Match', matchSchema);
