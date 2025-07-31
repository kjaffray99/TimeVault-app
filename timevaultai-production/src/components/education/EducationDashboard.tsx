/**
 * 🎓 EDUCATION DASHBOARD COMPONENT
 * Interactive learning platform with gamification and premium conversions
 */

'use client';

import {
  Award,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Crown,
  GraduationCap,
  Play,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Educational content structure
interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  premium: boolean;
  progress: number;
  lessons: number;
  students: number;
  rating: number;
  category: string;
  thumbnail: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: number;
  timeLimit: string;
  difficulty: string;
  points: number;
  premium: boolean;
  category: string;
}

const CRYPTO_COURSES: Course[] = [
  {
    id: 'bitcoin-fundamentals',
    title: 'Bitcoin Fundamentals: Digital Gold Mastery',
    description: 'Master Bitcoin basics, mining, wallets, and investment strategies. Learn why Bitcoin is considered digital gold.',
    duration: '2.5 hours',
    difficulty: 'Beginner',
    premium: false,
    progress: 0,
    lessons: 12,
    students: 15847,
    rating: 4.9,
    category: 'Cryptocurrency',
    thumbnail: '/course-bitcoin.jpg'
  },
  {
    id: 'ethereum-defi',
    title: 'Ethereum & DeFi Revolution',
    description: 'Explore Ethereum ecosystem, smart contracts, DeFi protocols, and yield farming strategies.',
    duration: '3.5 hours',
    difficulty: 'Intermediate',
    premium: true,
    progress: 0,
    lessons: 18,
    students: 8934,
    rating: 4.8,
    category: 'DeFi',
    thumbnail: '/course-ethereum.jpg'
  },
  {
    id: 'precious-metals',
    title: 'Precious Metals Investment Strategy',
    description: 'Learn gold, silver, platinum investing and how to build a diversified precious metals portfolio.',
    duration: '2 hours',
    difficulty: 'Beginner',
    premium: false,
    progress: 0,
    lessons: 10,
    students: 12456,
    rating: 4.7,
    category: 'Precious Metals',
    thumbnail: '/course-gold.jpg'
  },
  {
    id: 'portfolio-optimization',
    title: 'Portfolio Optimization Masterclass',
    description: 'Advanced portfolio theory, risk management, and asset allocation strategies for crypto and traditional assets.',
    duration: '4 hours',
    difficulty: 'Advanced',
    premium: true,
    progress: 0,
    lessons: 20,
    students: 5632,
    rating: 4.9,
    category: 'Investment Strategy',
    thumbnail: '/course-portfolio.jpg'
  },
  {
    id: 'alt-coins',
    title: 'Alternative Cryptocurrencies Deep Dive',
    description: 'Explore Solana, Cardano, Polkadot, and other altcoins. Learn evaluation frameworks and investment strategies.',
    duration: '3 hours',
    difficulty: 'Intermediate',
    premium: true,
    progress: 0,
    lessons: 15,
    students: 7891,
    rating: 4.6,
    category: 'Cryptocurrency',
    thumbnail: '/course-altcoins.jpg'
  },
  {
    id: 'time-value-money',
    title: 'Time Value of Money in Crypto Age',
    description: 'Master time value concepts, compound interest, and how crypto investing relates to traditional financial principles.',
    duration: '2.5 hours',
    difficulty: 'Beginner',
    premium: false,
    progress: 0,
    lessons: 11,
    students: 9876,
    rating: 4.8,
    category: 'Financial Literacy',
    thumbnail: '/course-time-value.jpg'
  }
];

const CRYPTO_QUIZZES: Quiz[] = [
  {
    id: 'btc-basics',
    title: 'Bitcoin Basics Challenge',
    questions: 15,
    timeLimit: '10 minutes',
    difficulty: 'Beginner',
    points: 100,
    premium: false,
    category: 'Bitcoin'
  },
  {
    id: 'eth-advanced',
    title: 'Ethereum Expert Quiz',
    questions: 25,
    timeLimit: '20 minutes',
    difficulty: 'Advanced',
    points: 250,
    premium: true,
    category: 'Ethereum'
  },
  {
    id: 'defi-protocols',
    title: 'DeFi Protocols Mastery',
    questions: 20,
    timeLimit: '15 minutes',
    difficulty: 'Intermediate',
    points: 200,
    premium: true,
    category: 'DeFi'
  },
  {
    id: 'precious-metals-quiz',
    title: 'Precious Metals Investment Quiz',
    questions: 12,
    timeLimit: '8 minutes',
    difficulty: 'Beginner',
    points: 80,
    premium: false,
    category: 'Precious Metals'
  }
];

export default function EducationDashboard() {
  const [activeTab, setActiveTab] = useState<'courses' | 'quizzes' | 'achievements' | 'progress'>('courses');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Get unique categories
  const categories = ['All', ...new Set(CRYPTO_COURSES.map(course => course.category))];

  // Filter courses by category
  const filteredCourses = selectedCategory === 'All'
    ? CRYPTO_COURSES
    : CRYPTO_COURSES.filter(course => course.category === selectedCategory);

  // Handle course enrollment
  const handleEnrollCourse = useCallback((course: Course) => {
    if (course.premium) {
      setShowPremiumModal(true);
      return;
    }

    // Start free course
    console.log(`Enrolled in: ${course.title}`);
    // TODO: Navigate to course content
  }, []);

  // Handle quiz start
  const handleStartQuiz = useCallback((quiz: Quiz) => {
    if (quiz.premium) {
      setShowPremiumModal(true);
      return;
    }

    // Start free quiz
    console.log(`Starting quiz: ${quiz.title}`);
    // TODO: Navigate to quiz interface
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] via-[#002855] to-[#003366]">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#001F3F] to-[#003366] border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="w-12 h-12 text-[#D4AF37] mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Education Center
              </h1>
            </div>
            <p className="text-[#C0C0C0] text-lg max-w-3xl mx-auto">
              Master cryptocurrency investing, precious metals strategies, and financial literacy
              through our comprehensive education platform
            </p>
          </div>

          {/* User Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 text-center">
              <Trophy className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userPoints}</div>
              <div className="text-[#C0C0C0] text-sm">Points Earned</div>
            </div>
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Level {userLevel}</div>
              <div className="text-[#C0C0C0] text-sm">Current Level</div>
            </div>
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 text-center">
              <BookOpen className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{completedCourses.length}</div>
              <div className="text-[#C0C0C0] text-sm">Courses Completed</div>
            </div>
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">24h</div>
              <div className="text-[#C0C0C0] text-sm">Study Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { key: 'courses', label: 'Courses', icon: BookOpen },
            { key: 'quizzes', label: 'Quizzes', icon: Brain },
            { key: 'achievements', label: 'Achievements', icon: Award },
            { key: 'progress', label: 'Progress', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.key
                  ? 'bg-[#D4AF37] text-[#001F3F]'
                  : 'bg-[#001F3F]/50 text-white hover:bg-[#D4AF37]/20'
                }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                      ? 'bg-[#D4AF37] text-[#001F3F]'
                      : 'bg-[#001F3F]/50 text-white hover:bg-[#D4AF37]/20'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <div
                  key={course.id}
                  className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg overflow-hidden hover:border-[#D4AF37]/40 transition-all group"
                >
                  {/* Course Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-[#D4AF37]/20 to-[#001F3F]/40 flex items-center justify-center">
                    {course.premium && (
                      <div className="absolute top-3 right-3">
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    )}
                    <div className="text-6xl">
                      {course.category === 'Cryptocurrency' && '₿'}
                      {course.category === 'DeFi' && 'Ξ'}
                      {course.category === 'Precious Metals' && '🥇'}
                      {course.category === 'Investment Strategy' && '📊'}
                      {course.category === 'Financial Literacy' && '🎯'}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                        {course.difficulty}
                      </span>
                      <div className="flex items-center text-[#D4AF37] text-sm">
                        <Star className="w-4 h-4 mr-1" />
                        {course.rating}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-[#C0C0C0] text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-[#C0C0C0] mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#C0C0C0] text-sm">
                        {course.lessons} lessons
                      </span>
                      <button
                        onClick={() => handleEnrollCourse(course)}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${course.premium
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] hover:from-[#B8941F] hover:to-[#D4AF37]'
                            : 'bg-[#003366] text-white hover:bg-[#004080]'
                          }`}
                      >
                        {course.premium && <Crown className="w-4 h-4 mr-2" />}
                        {course.premium ? 'Premium' : 'Start Free'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CRYPTO_QUIZZES.map(quiz => (
              <div
                key={quiz.id}
                className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Brain className="w-8 h-8 text-[#D4AF37]" />
                  {quiz.premium && <Crown className="w-6 h-6 text-[#D4AF37]" />}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>

                <div className="space-y-2 mb-4 text-sm text-[#C0C0C0]">
                  <div className="flex items-center justify-between">
                    <span>Questions:</span>
                    <span>{quiz.questions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time Limit:</span>
                    <span>{quiz.timeLimit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Points:</span>
                    <span className="text-[#D4AF37] font-medium">{quiz.points}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${quiz.premium
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] hover:from-[#B8941F] hover:to-[#D4AF37]'
                      : 'bg-[#003366] text-white hover:bg-[#004080]'
                    }`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {quiz.premium ? 'Premium Quiz' : 'Start Quiz'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'First Steps', description: 'Complete your first course', icon: '🎯', progress: 100, unlocked: true },
              { title: 'Bitcoin Scholar', description: 'Master Bitcoin fundamentals', icon: '₿', progress: 75, unlocked: true },
              { title: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: '🧠', progress: 60, unlocked: false },
              { title: 'DeFi Expert', description: 'Complete advanced DeFi course', icon: '🔗', progress: 0, unlocked: false },
              { title: 'Portfolio Pro', description: 'Build a diversified portfolio', icon: '📊', progress: 30, unlocked: false },
              { title: 'Time Master', description: 'Understand time value of money', icon: '⏰', progress: 90, unlocked: true }
            ].map((achievement, index) => (
              <div
                key={index}
                className={`bg-[#001F3F]/50 backdrop-blur-sm border rounded-lg p-6 ${achievement.unlocked ? 'border-[#D4AF37]/40' : 'border-[#D4AF37]/20'
                  }`}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-[#D4AF37]' : 'text-white'
                    }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-[#C0C0C0] text-sm">{achievement.description}</p>
                </div>

                <div className="w-full bg-[#003366] rounded-full h-2 mb-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full transition-all"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-[#C0C0C0]">
                  {achievement.progress}% Complete
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            {/* Learning Streak */}
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-8">
              <div className="text-center">
                <Zap className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">7 Day Streak!</h2>
                <p className="text-[#C0C0C0] mb-6">Keep learning every day to maintain your streak</p>

                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < 7 ? 'bg-[#D4AF37] text-[#001F3F]' : 'bg-[#003366] text-[#C0C0C0]'
                        }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-[#D4AF37]" />
                Weekly Goals
              </h3>

              <div className="space-y-4">
                {[
                  { goal: 'Complete 2 courses', progress: 1, target: 2 },
                  { goal: 'Take 5 quizzes', progress: 3, target: 5 },
                  { goal: 'Earn 500 points', progress: 320, target: 500 },
                  { goal: 'Study 10 hours', progress: 7.5, target: 10 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white">{item.goal}</span>
                      <span className="text-[#D4AF37]">{item.progress}/{item.target}</span>
                    </div>
                    <div className="w-full bg-[#003366] rounded-full h-2">
                      <div
                        className="bg-[#D4AF37] h-2 rounded-full transition-all"
                        style={{ width: `${(item.progress / item.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Upgrade Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#001F3F] border border-[#D4AF37] rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <Crown className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Upgrade to Premium</h3>
              <p className="text-[#C0C0C0] mb-6">
                Unlock advanced courses, expert quizzes, and exclusive content to accelerate your learning.
              </p>

              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold py-3 px-6 rounded-lg hover:from-[#B8941F] hover:to-[#D4AF37] transition-all">
                  Upgrade Now - $9.99/month
                </button>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#004080] transition-all"
                >
                  Continue with Free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
