import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Star, User, Calendar } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('/api/matches/mutual');
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600">
            People who liked you back and are ready to connect
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No matches yet
            </h2>
            <p className="text-gray-600 mb-6">
              Keep swiping to find your perfect match!
            </p>
            <Link to="/discover" className="btn-primary">
              Start Discovering
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-white">
                      {match.user.firstName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {match.user.firstName} {match.user.lastName}
                    </h3>
                    <p className="text-gray-600">{match.user.age} years old</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {match.compatibilityScore}%
                    </div>
                    <div className="text-sm text-gray-500">Match</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 text-sm">
                  {match.explanation}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Matched {new Date(match.matchedAt).toLocaleDateString()}
                  </div>
                  {match.isHighQuality && (
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      High Quality
                    </div>
                  )}
                </div>

                <Link
                  to={`/chat/${match.chatRoomId}`}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chatting
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
