import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit, Camera, Heart, Brain, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    interests: [],
    hobbies: [],
    occupation: '',
    education: '',
    height: '',
    relationshipGoals: '',
    values: [],
    dealBreakers: [],
    mustHaves: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile/me');
      setProfile(response.data);
      setFormData({
        bio: response.data.bio || '',
        interests: response.data.interests || [],
        hobbies: response.data.hobbies || [],
        occupation: response.data.occupation || '',
        education: response.data.education || '',
        height: response.data.height || '',
        relationshipGoals: response.data.relationshipGoals || '',
        values: response.data.values || [],
        dealBreakers: response.data.dealBreakers || [],
        mustHaves: response.data.mustHaves || []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/profile/me', formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const getCompletionPercentage = () => {
    if (!profile) return 0;
    return profile.profileCompletionPercentage || 0;
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile information and preferences
          </p>
        </div>

        {/* Profile Completion */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Completion</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCompletionColor(getCompletionPercentage())}`}>
              {getCompletionPercentage()}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-black dark:bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          {getCompletionPercentage() < 80 && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Complete your profile to get better matches and increase your visibility.
            </p>
          )}
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-gray-600 dark:text-gray-300">
                    {user?.firstName?.charAt(0)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{user?.age} years old</p>
                
                {user?.location && (
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location.city}, {user.location.state}</span>
                  </div>
                )}

                <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-6 rounded-full transition-all duration-200 w-full flex items-center justify-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photos
                </button>
              </div>
            </div>

            {/* Quiz Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personality Assessment</h3>
              {profile?.quizCompleted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-semibold mb-2">Quiz Completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Your personality profile is helping us find better matches.
                  </p>
                  <Link to="/quiz" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                    Retake Quiz
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold mb-2">Quiz Not Completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Complete the personality assessment to get better matches.
                  </p>
                  <Link to="/quiz" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Take Quiz
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-full border border-gray-200 dark:border-gray-600 transition-all duration-200 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="What do you do for work?"
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Your educational background"
                    />
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interests
                    </label>
                    <input
                      type="text"
                      value={formData.interests.join(', ')}
                      onChange={(e) => handleArrayInputChange('interests', e.target.value)}
                      className="input-field"
                      placeholder="Enter your interests separated by commas"
                    />
                  </div>

                  {/* Values */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Core Values
                    </label>
                    <input
                      type="text"
                      value={formData.values.join(', ')}
                      onChange={(e) => handleArrayInputChange('values', e.target.value)}
                      className="input-field"
                      placeholder="What values are important to you?"
                    />
                  </div>

                  {/* Relationship Goals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship Goals
                    </label>
                    <select
                      name="relationshipGoals"
                      value={formData.relationshipGoals}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select your relationship goals</option>
                      <option value="casual">Casual Dating</option>
                      <option value="serious">Serious Relationship</option>
                      <option value="marriage">Marriage</option>
                      <option value="friendship">Friendship</option>
                      <option value="not-sure">Not Sure</option>
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <button onClick={handleSave} className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-full border border-gray-200 dark:border-gray-600 transition-all duration-200">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Bio */}
                  {profile?.bio && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About Me</h4>
                      <p className="text-gray-900 dark:text-white">{profile.bio}</p>
                    </div>
                  )}

                  {/* Occupation */}
                  {profile?.occupation && (
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Occupation</h4>
                        <p className="text-gray-900 dark:text-white">{profile.occupation}</p>
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {profile?.education && (
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Education</h4>
                        <p className="text-gray-900 dark:text-white">{profile.education}</p>
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {profile?.interests && profile.interests.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
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

                  {/* Values */}
                  {profile?.values && profile.values.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Core Values</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.values.map((value, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Relationship Goals */}
                  {profile?.relationshipGoals && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Relationship Goals</h4>
                      <p className="text-gray-900 dark:text-white capitalize">{profile.relationshipGoals.replace('-', ' ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
