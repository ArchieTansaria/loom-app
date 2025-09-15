import React, { useState, useEffect } from 'react';
import { Heart, X, Star, User, MapPin, Briefcase, MessageCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const DiscoverPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/matches/discover');
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load potential matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!matches[currentMatchIndex]) return;

    setIsActionLoading(true);
    try {
      const response = await axios.post(`/api/matches/${matches[currentMatchIndex].profile.userId}/like`, {
        action: action
      });

      if (response.data.isMatch) {
        toast.success("It's a match! 🎉", {
          duration: 5000,
        });
      } else {
        toast.success(action === 'like' ? 'Liked!' : 'Passed');
      }

      // Move to next match
      setCurrentMatchIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Failed to perform action');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getCompatibilityColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityText = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Interesting Match';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (matches.length === 0 || currentMatchIndex >= matches.length) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No More Matches
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You've seen all available matches in your area. Check back later for new people!
          </p>
          <button
            onClick={() => {
              setCurrentMatchIndex(0);
              fetchMatches();
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Refresh Matches
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentMatchIndex];
  const { profile, compatibility, compatibilityBreakdown, explanation } = currentMatch;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Matches
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Swipe through potential matches based on psychological compatibility
          </p>
        </div>

        {/* Match Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
          {/* Photo Section */}
          <div className="relative h-96 bg-gray-100 dark:bg-gray-700">
            {profile.photos && profile.photos.length > 0 ? (
              <img
                src={profile.photos[0].url}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-600 dark:text-gray-300">
                    {profile.firstName.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Compatibility Badge */}
            <div className="absolute top-4 right-4">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getCompatibilityColor(compatibility)}`}>
                {compatibility}% Match
              </div>
            </div>

            {/* Age Badge */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 dark:text-white">
                {profile.age} years old
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <div className="flex items-center text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1 text-sm font-medium">
                  {getCompatibilityText(compatibility)}
                </span>
              </div>
            </div>

            {/* Location */}
            {profile.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{profile.location.city}, {profile.location.state}</span>
              </div>
            )}

            {/* Occupation */}
            {profile.occupation && (
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{profile.occupation}</span>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.slice(0, 5).map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compatibility Breakdown */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Compatibility Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(compatibilityBreakdown).map(([factor, score]) => (
                  <div key={factor} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {factor.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                        <div
                          className="h-2 bg-black dark:bg-white rounded-full"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                        {score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Why You Match</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => handleAction('pass')}
            disabled={isActionLoading}
            className="w-16 h-16 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-gray-300 dark:hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            <X className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </button>

          <button
            onClick={() => handleAction('like')}
            disabled={isActionLoading}
            className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {isActionLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Heart className="w-8 h-8 text-white dark:text-black" />
            )}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentMatchIndex + 1} of {matches.length} matches
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentMatchIndex + 1) / matches.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
