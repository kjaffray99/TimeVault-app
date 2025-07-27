import { Award, BookOpen, Clock, Coins, Info, Lightbulb, Star, Trophy, Crown, Lock, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts';
import { educationalService } from '../../services/education';
import { PREMIUM } from '../../constants';
import type { EducationalContent, UserProfile } from '../../types';
import MintShowcase from '../MintShowcase/MintShowcase';
import './Dashboard.css';

interface DashboardProps {
  userProfile?: UserProfile;
  onQuizComplete?: (quizId: string, score: number) => void;
  onTutorialComplete?: (tutorialId: string) => void;
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  userProfile: _userProfile,
  onQuizComplete: _onQuizComplete,
  onTutorialComplete: _onTutorialComplete,
  className = '',
}) => {
  const { state: userState } = useUser();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'tips' | 'tutorials' | 'instructions' | 'mint'>('quizzes');
  const [content, setContent] = useState<EducationalContent>({
    quizzes: [],
    dailyTips: [],
    tutorials: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);

  // Load educational content
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const educationalContent = await educationalService.getEducationalContent();
      setContent(educationalContent);
    } catch (err) {
      setError('Failed to load educational content. Please try again.');
      console.error('Content loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: 'quizzes' as const,
      label: 'Quizzes',
      icon: Trophy,
      description: 'Test your knowledge and earn TVLT tokens',
      count: content.quizzes.length,
    },
    {
      id: 'tips' as const,
      label: 'Daily Tips',
      icon: Lightbulb,
      description: 'Bite-sized insights from crypto experts',
      count: content.dailyTips.length,
    },
    {
      id: 'tutorials' as const,
      label: 'Tutorials',
      icon: BookOpen,
      description: 'Step-by-step learning paths with NFT badges',
      count: content.tutorials.length,
    },
    {
      id: 'instructions' as const,
      label: 'Instructions',
      icon: Info,
      description: 'How to use TimeVault features',
      count: undefined,
    },
    {
      id: 'mint' as const,
      label: 'Mint NFTs',
      icon: Coins,
      description: 'Mint premium NFTs and TVLT tokens',
      count: undefined,
    },
  ];

  const renderQuizzes = () => (
    <div className="quizzes-section">
      <div className="section-header">
        <h3>Knowledge Quizzes</h3>
        <p>Complete quizzes to earn TVLT tokens and test your crypto knowledge</p>
      </div>

      {isLoading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="quiz-card loading" />
          ))}
        </div>
      ) : content.quizzes.length === 0 ? (
        <div className="empty-state">
          <Trophy className="empty-icon" />
          <h4>No quizzes available</h4>
          <p>Check back later for new quizzes to test your knowledge!</p>
        </div>
      ) : (
        <div className="quizzes-grid">
          {content.quizzes.map((quiz) => (
            <div key={quiz.id} className={`quiz-card ${quiz.completed ? 'completed' : ''}`}>
              <div className="quiz-header">
                <div className="quiz-category">
                  <span className={`category-badge ${quiz.category}`}>
                    {quiz.category.toUpperCase()}
                  </span>
                  <span className={`difficulty-badge ${quiz.difficulty}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                {quiz.completed && (
                  <div className="completion-badge">
                    <Star className="star-icon" />
                  </div>
                )}
              </div>

              <h4 className="quiz-title">{quiz.title}</h4>
              <p className="quiz-description">{quiz.description}</p>

              <div className="quiz-stats">
                <div className="stat">
                  <Clock className="stat-icon" />
                  <span>{quiz.estimatedTime} min</span>
                </div>
                <div className="stat">
                  <Award className="stat-icon" />
                  <span>{quiz.rewardTokens} TVLT</span>
                </div>
                <div className="stat">
                  <BookOpen className="stat-icon" />
                  <span>{quiz.questions.length} questions</span>
                </div>
              </div>

              {quiz.completed ? (
                <div className="quiz-result">
                  <span className="score">Score: {quiz.score}%</span>
                  <button className="btn btn-secondary btn-sm">Review</button>
                </div>
              ) : (
                <button
                  className="btn btn-primary quiz-cta"
                  onClick={() => {
                    // TODO: Implement quiz modal/navigation
                    console.log('Starting quiz:', quiz.id);
                  }}
                >
                  Start Quiz
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDailyTips = () => (
    <div className="tips-section">
      <div className="section-header">
        <h3>Daily Tips</h3>
        <p>Stay informed with bite-sized crypto insights delivered daily</p>
      </div>

      {isLoading ? (
        <div className="loading-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="tip-card loading" />
          ))}
        </div>
      ) : content.dailyTips.length === 0 ? (
        <div className="empty-state">
          <Lightbulb className="empty-icon" />
          <h4>No tips available</h4>
          <p>Check back tomorrow for fresh crypto insights!</p>
        </div>
      ) : (
        <div className="tips-list">
          {content.dailyTips.map((tip) => (
            <div key={tip.id} className={`tip-card ${tip.isRead ? 'read' : 'unread'}`}>
              <div className="tip-header">
                <div className="tip-meta">
                  <span className={`category-badge ${tip.category}`}>
                    {tip.category}
                  </span>
                  <span className="read-time">
                    <Clock className="time-icon" />
                    {tip.readTime} min read
                  </span>
                </div>
                <span className="tip-date">
                  {new Date(tip.date).toLocaleDateString()}
                </span>
              </div>

              <h4 className="tip-title">{tip.title}</h4>
              <p className="tip-content">{tip.content}</p>

              <div className="tip-tags">
                {tip.tags.map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>

              {!tip.isRead && (
                <button
                  className="btn btn-ghost btn-sm mark-read-btn"
                  onClick={() => {
                    // TODO: Mark tip as read
                    console.log('Marking tip as read:', tip.id);
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTutorials = () => (
    <div className="tutorials-section">
      <div className="section-header">
        <h3>Learning Tutorials</h3>
        <p>Complete step-by-step learning paths and earn exclusive NFT badges</p>
      </div>

      {isLoading ? (
        <div className="loading-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="tutorial-card loading" />
          ))}
        </div>
      ) : content.tutorials.length === 0 ? (
        <div className="empty-state">
          <BookOpen className="empty-icon" />
          <h4>No tutorials available</h4>
          <p>New learning paths are being prepared for you!</p>
        </div>
      ) : (
        <div className="tutorials-grid">
          {content.tutorials.map((tutorial) => (
            <div key={tutorial.id} className={`tutorial-card ${tutorial.completed ? 'completed' : ''}`}>
              <div className="tutorial-header">
                <div className="tutorial-meta">
                  <span className={`difficulty-badge ${tutorial.difficulty}`}>
                    {tutorial.difficulty}
                  </span>
                  {tutorial.completed && (
                    <div className="completion-badge">
                      <Award className="award-icon" />
                    </div>
                  )}
                </div>
                {tutorial.nftBadgeId && (
                  <div className="nft-badge-indicator">
                    <Award className="nft-icon" />
                    <span>NFT Badge</span>
                  </div>
                )}
              </div>

              <h4 className="tutorial-title">{tutorial.title}</h4>
              <p className="tutorial-description">{tutorial.description}</p>

              <div className="tutorial-stats">
                <div className="stat">
                  <Clock className="stat-icon" />
                  <span>{tutorial.estimatedTime} min</span>
                </div>
                <div className="stat">
                  <BookOpen className="stat-icon" />
                  <span>{tutorial.steps.length} steps</span>
                </div>
              </div>

              {tutorial.progress !== undefined && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${tutorial.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{tutorial.progress}% complete</span>
                </div>
              )}

              {tutorial.prerequisites.length > 0 && (
                <div className="prerequisites">
                  <span className="prereq-label">Prerequisites:</span>
                  <div className="prereq-list">
                    {tutorial.prerequisites.map((prereq, index) => (
                      <span key={index} className="prereq-item">{prereq}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className={`btn ${tutorial.completed ? 'btn-secondary' : 'btn-primary'} tutorial-cta`}
                onClick={() => {
                  // TODO: Implement tutorial navigation
                  console.log('Starting tutorial:', tutorial.id);
                }}
              >
                {tutorial.completed ? 'Review' : tutorial.progress ? 'Continue' : 'Start Tutorial'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInstructions = () => (
    <div className="instructions-section">
      <div className="section-header">
        <h3>How to Use TimeVault</h3>
        <p>Complete guide to maximize your TimeVault experience</p>
      </div>

      <div className="instructions-content">
        <div className="instruction-group">
          <h4>🧮 Calculator Features</h4>
          <ul>
            <li>Select any cryptocurrency to convert to precious metals or time</li>
            <li>Enter your hourly wage to see how long you'd need to work</li>
            <li>Compare gold and silver equivalents for better perspective</li>
            <li>Prices update automatically from live market data</li>
          </ul>
        </div>

        <div className="instruction-group">
          <h4>🎓 Educational Dashboard</h4>
          <ul>
            <li><strong>Quizzes:</strong> Complete knowledge tests to earn TVLT tokens</li>
            <li><strong>Daily Tips:</strong> Read daily insights to stay informed</li>
            <li><strong>Tutorials:</strong> Follow learning paths to earn NFT badges</li>
            <li><strong>Streaks:</strong> Maintain daily activity for bonus rewards</li>
          </ul>
        </div>

        <div className="instruction-group">
          <h4>🔐 Wallet Connection</h4>
          <ul>
            <li>Connect your XRPL wallet for premium features</li>
            <li>Unlock AI insights and advanced charts</li>
            <li>Mint TVLT tokens and TimePass NFTs</li>
            <li>Access subscription-only content</li>
          </ul>
        </div>

        <div className="instruction-group">
          <h4>💎 Token & NFT System</h4>
          <ul>
            <li><strong>TVLT Tokens:</strong> Earned through quizzes and daily activities</li>
            <li><strong>Edu NFT Badges:</strong> Minted upon tutorial completion</li>
            <li><strong>TimePass NFTs:</strong> Premium access tiers with special benefits</li>
            <li><strong>Streak Rewards:</strong> Bonus tokens for consistent engagement</li>
          </ul>
        </div>

        <div className="instruction-group">
          <h4>🌙 Dark Mode & Accessibility</h4>
          <ul>
            <li>Toggle dark mode for comfortable extended sessions</li>
            <li>High contrast mode available for better visibility</li>
            <li>Keyboard navigation supported throughout the app</li>
            <li>Screen reader compatible with proper ARIA labels</li>
          </ul>
        </div>

        <div className="cta-section">
          <h4>Ready to Get Started?</h4>
          <p>Connect your wallet to unlock the full TimeVault experience</p>
          <button className="btn btn-primary btn-lg connect-wallet-cta">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'quizzes':
        return renderQuizzes();
      case 'tips':
        return renderDailyTips();
      case 'tutorials':
        return renderTutorials();
      case 'instructions':
        return renderInstructions();
      case 'mint':
        return <MintShowcase />;
      default:
        return null;
    }
  };

  return (
    <div className={`dashboard ${className}`}>
      <div className="dashboard-header">
        <h2>Learning Dashboard</h2>
        <p>Expand your crypto knowledge and earn rewards</p>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={loadContent}>
            Try Again
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation" role="tablist">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
            >
              <IconComponent className="tab-icon" />
              <div className="tab-content">
                <span className="tab-label">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="tab-count">{tab.count}</span>
                )}
              </div>
              <span className="tab-description">{tab.description}</span>
            </button>
          );
        })}
      </div>

      {/* Premium Upsell Banner */}
      {!userState.isPremium && (
        <div className="premium-upsell-banner">
          <div className="upsell-content">
            <div className="upsell-icon">
              <Crown size={32} />
            </div>
            <div className="upsell-text">
              <h3>Unlock Premium Features</h3>
              <p>Get AI insights, advanced charts, and real-time alerts</p>
            </div>
            <div className="upsell-price">
              <span className="price-amount">${PREMIUM.SUBSCRIPTION_PRICE}</span>
              <span className="price-period">/month</span>
            </div>
            <Link to="/premium" className="upsell-cta">
              Start Free Trial
            </Link>
          </div>
          <button 
            className="upsell-close"
            onClick={() => setShowPremiumUpsell(false)}
            aria-label="Close premium banner"
          >
            ×
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div
        className="tab-content-area"
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
      >
        {renderTabContent()}
      </div>

      {/* Premium Feature Teaser */}
      {!userState.isPremium && activeTab === 'quizzes' && (
        <div className="premium-teaser">
          <div className="teaser-header">
            <Lock className="teaser-icon" />
            <h4>Premium Quiz Features</h4>
          </div>
          <div className="teaser-features">
            <div className="teaser-feature">
              <Zap size={16} />
              <span>AI-powered quiz recommendations</span>
            </div>
            <div className="teaser-feature">
              <Star size={16} />
              <span>Advanced progress tracking</span>
            </div>
            <div className="teaser-feature">
              <Trophy size={16} />
              <span>Exclusive premium quizzes</span>
            </div>
          </div>
          <Link to="/premium" className="teaser-cta">
            Unlock Premium
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
