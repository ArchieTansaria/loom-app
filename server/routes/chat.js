const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Match = require('../models/Match');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/chat/conversations
// @desc    Get all conversations for the current user
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get all mutual matches (conversations)
    const matches = await Match.findMutualMatches(req.userId);
    
    const conversations = await Promise.all(
      matches.map(async (match) => {
        const otherUser = match.user1.toString() === req.userId.toString() 
          ? match.user2 
          : match.user1;
        
        // Get last message in the conversation
        const lastMessage = await Message.findOne({
          chatRoomId: match.chatRoomId,
          isDeleted: false
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'firstName lastName');

        // Get unread message count
        const unreadCount = await Message.getUnreadCount(req.userId, match.chatRoomId);

        return {
          matchId: match._id,
          chatRoomId: match.chatRoomId,
          user: {
            id: otherUser._id,
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
            photos: otherUser.photos
          },
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            sender: lastMessage.sender.firstName,
            createdAt: lastMessage.createdAt,
            isRead: lastMessage.isRead
          } : null,
          unreadCount,
          compatibilityScore: match.compatibilityScore,
          matchedAt: match.updatedAt
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/:chatRoomId/messages
// @desc    Get messages for a specific chat room
// @access  Private
router.get('/:chatRoomId/messages', auth, async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Verify user has access to this chat room
    const match = await Match.findOne({
      chatRoomId,
      $or: [{ user1: req.userId }, { user2: req.userId }],
      status: 'mutual'
    });

    if (!match) {
      return res.status(404).json({ message: 'Chat room not found or access denied' });
    }

    // Get messages
    const messages = await Message.getConversation(chatRoomId, parseInt(limit), parseInt(skip));

    // Mark messages as read
    await Message.markChatAsRead(chatRoomId, req.userId);

    res.json({ messages: messages.reverse() }); // Reverse to show oldest first
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/:chatRoomId/messages
// @desc    Send a message to a chat room
// @access  Private
router.post('/:chatRoomId/messages', auth, [
  body('content').trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatRoomId } = req.params;
    const { content, messageType = 'text' } = req.body;

    // Verify user has access to this chat room
    const match = await Match.findOne({
      chatRoomId,
      $or: [{ user1: req.userId }, { user2: req.userId }],
      status: 'mutual'
    });

    if (!match) {
      return res.status(404).json({ message: 'Chat room not found or access denied' });
    }

    // Determine recipient
    const recipient = match.user1.toString() === req.userId.toString() 
      ? match.user2 
      : match.user1;

    // Create message
    const message = new Message({
      chatRoomId,
      sender: req.userId,
      recipient,
      content,
      messageType
    });

    await message.save();

    // Populate sender info for response
    await message.populate('sender', 'firstName lastName photos');

    // Emit message via Socket.IO
    const io = req.app.get('io');
    io.to(chatRoomId).emit('receive_message', {
      id: message._id,
      chatRoomId: message.chatRoomId,
      sender: {
        id: message.sender._id,
        firstName: message.sender.firstName,
        lastName: message.sender.lastName,
        photos: message.sender.photos
      },
      content: message.content,
      messageType: message.messageType,
      createdAt: message.createdAt,
      isRead: message.isRead
    });

    res.status(201).json({
      id: message._id,
      chatRoomId: message.chatRoomId,
      sender: {
        id: message.sender._id,
        firstName: message.sender.firstName,
        lastName: message.sender.lastName
      },
      content: message.content,
      messageType: message.messageType,
      createdAt: message.createdAt,
      isRead: message.isRead
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/chat/:chatRoomId/messages/:messageId/read
// @desc    Mark a message as read
// @access  Private
router.put('/:chatRoomId/messages/:messageId/read', auth, async (req, res) => {
  try {
    const { chatRoomId, messageId } = req.params;

    // Verify user has access to this chat room
    const match = await Match.findOne({
      chatRoomId,
      $or: [{ user1: req.userId }, { user2: req.userId }],
      status: 'mutual'
    });

    if (!match) {
      return res.status(404).json({ message: 'Chat room not found or access denied' });
    }

    // Find and mark message as read
    const message = await Message.findOne({
      _id: messageId,
      chatRoomId,
      recipient: req.userId,
      isRead: false
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or already read' });
    }

    await message.markAsRead();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get total unread message count for the current user
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const unreadCount = await Message.getUnreadCount(req.userId);
    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/:chatRoomId/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/:chatRoomId/messages/:messageId', auth, async (req, res) => {
  try {
    const { chatRoomId, messageId } = req.params;

    // Verify user has access to this chat room
    const match = await Match.findOne({
      chatRoomId,
      $or: [{ user1: req.userId }, { user2: req.userId }],
      status: 'mutual'
    });

    if (!match) {
      return res.status(404).json({ message: 'Chat room not found or access denied' });
    }

    // Find and delete message (soft delete)
    const message = await Message.findOne({
      _id: messageId,
      chatRoomId,
      sender: req.userId
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or access denied' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
