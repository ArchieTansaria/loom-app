import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Heart, User, MessageCircle } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  const navigate = useNavigate();
  const { socket, joinRoom, leaveRoom, sendMessage } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatData();
    joinRoom(chatRoomId);

    // Listen for new messages
    if (socket) {
      socket.on('receive_message', handleNewMessage);
    }

    return () => {
      leaveRoom(chatRoomId);
      if (socket) {
        socket.off('receive_message', handleNewMessage);
      }
    };
  }, [chatRoomId, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatData = async () => {
    try {
      const [messagesResponse, matchResponse] = await Promise.all([
        axios.get(`/api/chat/${chatRoomId}/messages`),
        axios.get(`/api/matches/${chatRoomId.split('_')[1]}_${chatRoomId.split('_')[2]}`)
      ]);
      
      setMessages(messagesResponse.data.messages);
      setMatchInfo(matchResponse.data);
    } catch (error) {
      console.error('Error fetching chat data:', error);
      toast.error('Failed to load chat');
      navigate('/chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (messageData) => {
    setMessages(prev => [...prev, messageData]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await axios.post(
        `/api/chat/${chatRoomId}/messages`,
        {
          content : newMessage.trim(),
          messageType : 'text'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const messageData = response.data;
      // setMessages((prev) => [...prev, messageData]);

      // const messageData = {
      //   chatRoomId,
      //   content: newMessage.trim(),
      //   messageType: 'text'
      // };

      sendMessage(messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!matchInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat not found</h2>
          <p className="text-gray-600 mb-6">This conversation may have been deleted or you don't have access to it.</p>
          <button onClick={() => navigate('/chat')} className="btn-primary">
            Back to Conversations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/chat')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-lg font-bold text-white">
                {matchInfo.user.firstName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {matchInfo.user.firstName} {matchInfo.user.lastName}
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <Heart className="w-4 h-4 mr-1" />
                {matchInfo.compatibilityScore}% match
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start the conversation!
              </h3>
              <p className="text-gray-600">
                Send a message to {matchInfo.user.firstName} to begin your connection.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.id === matchInfo.user.id ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender.id === matchInfo.user.id
                        ? 'bg-white border border-gray-200'
                        : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender.id === matchInfo.user.id
                          ? 'text-gray-500'
                          : 'text-white/70'
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${matchInfo.user.firstName}...`}
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isSending}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
