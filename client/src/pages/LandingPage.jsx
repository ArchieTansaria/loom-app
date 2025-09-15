import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Users, MessageCircle, ArrowRight, Star, CheckCircle, Sparkles, Zap, Target, Shield, Clock, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const { isDark } = useTheme();
  
  const features = [
    {
      icon: Brain,
      title: 'Psychological Matching',
      description: 'Advanced compatibility based on Big Five personality traits, love languages, and communication styles.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Heart,
      title: 'Meaningful Connections',
      description: 'Go beyond superficial bios to find partners who truly complement your personality and values.',
      color: 'from-pink-500 to-red-600'
    },
    {
      icon: Users,
      title: 'Smart Recommendations',
      description: 'Our algorithm learns from your preferences to suggest the most compatible matches.',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Connect instantly with your matches through our secure, real-time messaging system.',
      color: 'from-orange-500 to-yellow-600'
    }
  ];

  const stats = [
    { number: '95%', label: 'Compatibility Accuracy' },
    { number: '10K+', label: 'Successful Matches' },
    { number: '4.9★', label: 'User Rating' },
    { number: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      age: 28,
      text: 'loom helped me find my perfect match through psychological compatibility. We\'ve been together for 2 years!',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      age: 31,
      text: 'The personality quiz was so insightful. It helped me understand myself better and find someone who truly gets me.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      age: 26,
      text: 'Finally, a dating app that focuses on real compatibility instead of just looks. Highly recommend!',
      rating: 5
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-white'
    }`}>
      {/* Navigation */}
      <nav className="fixed top-4 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                loom
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className={`text-5xl lg:text-6xl font-bold leading-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Designed to be
                  <span className="block text-gray-600 dark:text-gray-300">
                    deleted
                  </span>
                </h1>
                
                <p className={`text-xl leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  loom is the dating app for people who want to get off dating apps. 
                  We use psychological compatibility to help you find meaningful connections 
                  that actually last.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                
                <button className={`px-8 py-4 rounded-full font-semibold text-lg border-2 transition-colors ${
                  isDark
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                }`}>
                  Learn More
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>95%</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Match Accuracy</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>10K+</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Successful Matches</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>4.9★</div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>App Store Rating</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Mockup/Visual */}
            <div className="relative">
              <div className="relative z-10">
                {/* Phone Mockup */}
                <div className="mx-auto w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="px-6 py-4">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-8 h-8 text-white dark:text-black" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Sarah, 28
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Software Engineer • San Francisco
                        </p>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            "Love hiking, photography, and trying new cuisines. Looking for someone to explore the world with!"
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                            Hiking
                          </span>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            Photography
                          </span>
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                            Travel
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          94% Match
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Excellent compatibility
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section
      <section className={`py-20 ${isDark ? 'bg-gray-50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-gray-900' : 'text-gray-900'
            }`}>
              Why loom works
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-gray-600' : 'text-gray-600'
            }`}>
              We use science-backed compatibility matching to help you find relationships that actually work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white dark:text-gray-900" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isDark ? 'text-gray-900' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    isDark ? 'text-gray-600' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className={`py-20 ${isDark ? 'bg-white' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-gray-900' : 'text-gray-900'
            }`}>
              How it works
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-gray-600' : 'text-gray-600'
            }`}>
              Three simple steps to find your perfect match
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${
                isDark ? 'text-gray-900' : 'text-gray-900'
              }`}>
                Take the Quiz
              </h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-600' : 'text-gray-600'
              }`}>
                Complete our personality assessment to understand your compatibility factors, 
                communication style, and relationship preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${
                isDark ? 'text-gray-900' : 'text-gray-900'
              }`}>
                Get Matched
              </h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-600' : 'text-gray-600'
              }`}>
                Our algorithm analyzes psychological compatibility to suggest 
                people who are truly compatible with you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${
                isDark ? 'text-gray-900' : 'text-gray-900'
              }`}>
                Start Dating
              </h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-600' : 'text-gray-600'
              }`}>
                Connect with your matches and start meaningful conversations 
                that lead to real relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-gray-900' : 'text-gray-900'
            }`}>
              Success stories
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-gray-600' : 'text-gray-600'
            }`}>
              Real people who found love through loom
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`p-8 rounded-2xl ${
                isDark 
                  ? 'bg-white' 
                  : 'bg-white'
              } shadow-sm`}>
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`mb-6 leading-relaxed ${
                  isDark ? 'text-gray-600' : 'text-gray-600'
                }`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-900 dark:bg-gray-900 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      isDark ? 'text-gray-900' : 'text-gray-900'
                    }`}>{testimonial.name}</p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>{testimonial.age} years old</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-white' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-gray-900' : 'text-gray-900'
          }`}>
            Ready to find your person?
          </h2>
          <p className={`text-xl mb-12 leading-relaxed ${
            isDark ? 'text-gray-600' : 'text-gray-600'
          }`}>
            Join thousands of people who have found meaningful connections through loom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-black dark:bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className={`border-2 border-gray-300 dark:border-gray-300 text-gray-700 dark:text-gray-700 hover:border-gray-400 dark:hover:border-gray-400 font-semibold py-4 px-8 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-50' : 'hover:bg-gray-50'
              }`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-gray-900" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              loom
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              The dating app designed to be deleted. Find meaningful connections through psychological compatibility.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              © 2024 loom. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
