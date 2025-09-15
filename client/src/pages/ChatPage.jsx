import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Clock, User } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/chat/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Conversations
          </h1>
          <p className="text-gray-600">
            Connect with your matches through meaningful conversations
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No conversations yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get matched with someone to start chatting!
            </p>
            <Link to="/discover" className="btn-primary">
              Find Matches
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.chatRoomId}
                to={`/chat/${conversation.chatRoomId}`}
                className="card p-6 hover:shadow-lg transition-all duration-200 block"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-white">
                      {conversation.user.firstName.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {conversation.user.firstName} {conversation.user.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {conversation.unreadCount > 0 && (
                          <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : formatTime(conversation.matchedAt)}
                        </span>
                      </div>
                    </div>
                    
                    {conversation.lastMessage ? (
                      <p className="text-gray-600 truncate">
                        <span className="font-medium">
                          {conversation.lastMessage.sender}:
                        </span>{' '}
                        {conversation.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        Start the conversation!
                      </p>
                    )}
                    
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-sm text-gray-500 mr-4">
                        <Heart className="w-4 h-4 mr-1" />
                        {conversation.compatibilityScore}% match
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Matched {new Date(conversation.matchedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
