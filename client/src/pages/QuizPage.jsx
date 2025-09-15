import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/profile/quiz');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // toast.error('Failed to load quiz questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const results = {
      personality: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50
      },
      loveLanguages: {
        wordsOfAffirmation: 20,
        actsOfService: 20,
        receivingGifts: 20,
        qualityTime: 20,
        physicalTouch: 20
      },
      communicationStyle: {
        directness: 50,
        emotionalExpression: 50,
        conflictResolution: 50,
        humor: 50
      },
      lifestyle: {
        socialActivity: 50,
        adventure: 50,
        routine: 50,
        workLifeBalance: 50
      }
    };

    // Process answers and calculate scores
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      if (question.category === 'personality' && question.trait) {
        results.personality[question.trait] = answer;
      } else if (question.category === 'loveLanguages') {
        // Reset all to 0 first
        Object.keys(results.loveLanguages).forEach(key => {
          results.loveLanguages[key] = 0;
        });
        // Set the selected one to 100
        results.loveLanguages[answer] = 100;
      } else if (question.category === 'communicationStyle' && question.trait) {
        results.communicationStyle[question.trait] = answer;
      } else if (question.category === 'lifestyle' && question.trait) {
        results.lifestyle[question.trait] = answer;
      }
    });

    return results;
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const results = calculateResults();
      await axios.post('/api/profile/quiz', results);
      toast.success('Quiz completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgress = () => {
    return ((Object.keys(answers).length / questions.length) * 100).toFixed(0);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'personality':
        return <Brain className="w-6 h-6" />;
      case 'loveLanguages':
        return <Heart className="w-6 h-6" />;
      default:
        return <Brain className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'personality':
        return 'from-blue-500 to-blue-600';
      case 'loveLanguages':
        return 'from-pink-500 to-pink-600';
      case 'communicationStyle':
        return 'from-green-500 to-green-600';
      case 'lifestyle':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No questions available</h2>
          <p className="text-gray-600 dark:text-gray-300">Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Personality Assessment
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Help us understand your personality to find your perfect matches
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-black dark:bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length} ({getProgress()}% complete)
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
          {/* Question Header */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 mr-4">
              {getCategoryIcon(currentQuestion.category)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {currentQuestion.category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      isSelected
                        ? 'border-black dark:border-white bg-black dark:bg-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-white dark:text-black" />}
                    </div>
                    <span className="text-lg font-medium">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={isFirstQuestion}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              isFirstQuestion
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="flex space-x-4">
            {isLastQuestion ? (
              <button
                onClick={submitQuiz}
                disabled={!hasAnswered || isSubmitting}
                className={`flex items-center px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                  hasAnswered && !isSubmitting
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Quiz
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!hasAnswered}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  hasAnswered
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Why This Quiz Matters
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our personality assessment helps us understand your communication style, 
              love languages, and compatibility factors. This information is used to 
              match you with people who complement your personality and share your values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
