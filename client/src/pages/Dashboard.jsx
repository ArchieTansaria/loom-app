import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MessageCircle, TrendingUp, Calendar, Star, ArrowRight, Brain, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, matchesResponse] = await Promise.all([
        axios.get('/api/matches/stats'),
        axios.get('/api/matches/mutual')
      ]);
      
      setStats(statsResponse.data);
      setRecentMatches(matchesResponse.data.matches.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCompletionStatus = () => {
    if (!user?.isProfileComplete) {
      return {
        title: 'Complete Your Profile',
        description: 'Add photos, interests, and complete your personality quiz to get better matches.',
        action: 'Complete Profile',
        link: '/profile',
        color: 'from-orange-500 to-red-500'
      };
    }
    return null;
  };

  const quickActions = [
    {
      title: 'Discover Matches',
      description: 'Find new people based on compatibility',
      icon: Users,
      link: '/discover',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'View Matches',
      description: 'See your mutual matches',
      icon: Heart,
      link: '/matches',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Start Chatting',
      description: 'Message your matches',
      icon: MessageCircle,
      link: '/chat',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Edit Profile',
      description: 'Update your information',
      icon: User,
      link: '/profile',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const completionStatus = getCompletionStatus();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGreeting()}, {user?.firstName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to find your perfect match? Let's see what's happening in your loom world.
          </p>
        </div>

        {/* Completion Status */}
        {completionStatus && (
          <div className="mb-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{completionStatus.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{completionStatus.description}</p>
                </div>
                <Link
                  to={completionStatus.link}
                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  {completionStatus.action}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.mutualMatches}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Matches</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.matchRate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Match Rate</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highQualityMatches}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Quality</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLikes}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Matches */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Matches</h2>
            {recentMatches.length > 0 ? (
              <div className="space-y-4">
                {recentMatches.map((match, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                        <span className="text-gray-600 dark:text-gray-300 font-bold text-lg">
                          {match.user.firstName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {match.user.firstName} {match.user.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {match.compatibilityScore}% compatible
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Matched {new Date(match.matchedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  to="/matches"
                  className="block w-full text-center py-3 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  View All Matches
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700">
                <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No matches yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start discovering potential matches to find your perfect connection.
                </p>
                <Link
                  to="/discover"
                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Start Discovering
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 pb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tips for Better Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Complete Your Quiz
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The personality assessment helps us understand your compatibility factors and find better matches.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Add Photos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Profiles with multiple photos get 3x more matches. Show your personality through your pictures.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Be Active
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Regular activity increases your visibility and helps you connect with more potential matches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
