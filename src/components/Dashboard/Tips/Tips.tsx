/**
 * Investment Tips Component
 * Educational tips and market insights
 */

import React from 'react';
import { Lightbulb, TrendingUp, Shield, DollarSign } from 'lucide-react';

const Tips: React.FC = () => {
  const tips = [
    {
      id: 1,
      category: 'Investment Strategy',
      icon: TrendingUp,
      title: 'Diversification is Key',
      content: 'Spread your investments across different asset classes including crypto, precious metals, and traditional investments.',
      difficulty: 'Beginner',
    },
    {
      id: 2,
      category: 'Risk Management',
      icon: Shield,
      title: 'Never Invest More Than You Can Afford to Lose',
      content: 'Digital assets are volatile. Only invest money you can afford to lose completely.',
      difficulty: 'Essential',
    },
    {
      id: 3,
      category: 'Market Analysis',
      icon: DollarSign,
      title: 'Dollar-Cost Averaging',
      content: 'Instead of investing a lump sum, consider regular smaller investments to reduce timing risk.',
      difficulty: 'Intermediate',
    },
  ];

  return (
    <div className="tips-page">
      <div className="tips-header">
        <Lightbulb size={48} className="header-icon" />
        <div className="header-content">
          <h1>Investment Tips</h1>
          <p>Educational insights for smarter investing</p>
        </div>
      </div>

      <div className="tips-disclaimer">
        <p><strong>⚠️ Educational Content Only:</strong> These tips are for educational purposes and do not constitute financial advice. Always consult with qualified professionals.</p>
      </div>

      <div className="tips-grid">
        {tips.map((tip) => {
          const IconComponent = tip.icon;
          return (
            <div key={tip.id} className="tip-card">
              <div className="tip-header">
                <IconComponent className="tip-icon" size={24} />
                <div className="tip-meta">
                  <span className="tip-category">{tip.category}</span>
                  <span className="tip-difficulty">{tip.difficulty}</span>
                </div>
              </div>
              
              <div className="tip-content">
                <h3>{tip.title}</h3>
                <p>{tip.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tips-cta">
        <h2>Want More Advanced Tips?</h2>
        <p>Upgrade to Premium for AI-powered insights and personalized recommendations</p>
        <button className="premium-cta-btn">
          Explore Premium Features
        </button>
      </div>
    </div>
  );
};

export default Tips;
