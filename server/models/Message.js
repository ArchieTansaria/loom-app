const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
    required: true,
    index: true
  },
  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  messageType: {
    type: String,
    enum: ['text', 'image', 'emoji', 'system'],
    default: 'text'
  },
  
  // For future features
  attachments: [{
    type: String, // 'image', 'file', etc.
    url: String,
    filename: String,
    size: Number
  }],
  
  // Message status
  isRead: {
    type: Boolean,
    default: false
  },
  
  readAt: Date,
  
  // For message reactions (future feature)
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Message editing/deletion
  isEdited: {
    type: Boolean,
    default: false
  },
  
  editedAt: Date,
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ chatRoomId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// Virtual for message age
messageSchema.virtual('age').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return 'now';
});

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get conversation history
messageSchema.statics.getConversation = function(chatRoomId, limit = 50, skip = 0) {
  return this.find({
    chatRoomId: chatRoomId,
    isDeleted: false
  })
  .populate('sender', 'firstName lastName photos')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Static method to get unread message count for a user
messageSchema.statics.getUnreadCount = function(userId, chatRoomId = null) {
  const query = {
    recipient: userId,
    isRead: false,
    isDeleted: false
  };
  
  if (chatRoomId) {
    query.chatRoomId = chatRoomId;
  }
  
  return this.countDocuments(query);
};

// Static method to mark all messages in a chat as read
messageSchema.statics.markChatAsRead = function(chatRoomId, userId) {
  return this.updateMany(
    {
      chatRoomId: chatRoomId,
      recipient: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );
};

module.exports = mongoose.model('Message', messageSchema);
