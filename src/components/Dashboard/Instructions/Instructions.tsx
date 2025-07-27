/**
 * Instructions Component
 * How-to guides for using TimeVault features
 */

import React from 'react';
import { FileText, Calculator, Crown, Coins, HelpCircle } from 'lucide-react';

const Instructions: React.FC = () => {
  const instructionSections = [
    {
      id: 'calculator',
      title: 'Using the Calculator',
      icon: Calculator,
      steps: [
        'Select your cryptocurrency from the dropdown menu',
        'Enter the amount you want to convert',
        'Set your hourly wage for time calculations',
        'View instant conversions to precious metals and time',
        'Use the refresh button to get latest market prices',
      ],
    },
    {
      id: 'premium',
      title: 'Premium Features',
      icon: Crown,
      steps: [
        'Click on any premium feature button',
        'Review the premium benefits modal',
        'Start your free trial or subscribe',
        'Access advanced charts and AI insights',
        'Set up price alerts and portfolio tracking',
      ],
    },
    {
      id: 'minting',
      title: 'NFT Minting',
      icon: Coins,
      steps: [
        'Connect your crypto wallet',
        'Browse available educational NFTs',
        'Select the NFT you want to mint',
        'Confirm the transaction in your wallet',
        'View your NFTs in your profile',
      ],
    },
  ];

  return (
    <div className="instructions-page">
      <div className="instructions-header">
        <FileText size={48} className="header-icon" />
        <div className="header-content">
          <h1>How to Use TimeVault</h1>
          <p>Step-by-step instructions for all features</p>
        </div>
      </div>

      <div className="instructions-sections">
        {instructionSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <div key={section.id} className="instruction-section">
              <div className="section-header">
                <IconComponent size={32} className="section-icon" />
                <h2>{section.title}</h2>
              </div>
              
              <div className="steps-list">
                {section.steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="instructions-help">
        <div className="help-card">
          <HelpCircle size={48} />
          <h2>Need More Help?</h2>
          <p>Can't find what you're looking for? Our support team is here to help!</p>
          <button className="contact-support-btn">
            Contact Support
          </button>
        </div>
      </div>

      <div className="instructions-tips">
        <h2>💡 Pro Tips</h2>
        <div className="tips-grid">
          <div className="tip-item">
            <strong>Bookmarks:</strong> Bookmark frequently used conversion amounts for quick access
          </div>
          <div className="tip-item">
            <strong>Streaks:</strong> Use TimeVault daily to build your calculation streak and unlock achievements
          </div>
          <div className="tip-item">
            <strong>Notifications:</strong> Enable browser notifications for price alerts (Premium feature)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
