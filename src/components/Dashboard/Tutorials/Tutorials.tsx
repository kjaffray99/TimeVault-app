/**
 * Tutorials Component
 * Video tutorials and step-by-step guides
 */

import React from 'react';
import { Play, Clock, BookOpen, Star } from 'lucide-react';

const Tutorials: React.FC = () => {
  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with TimeVault',
      description: 'Learn how to use the calculator and understand conversions',
      duration: '5:30',
      difficulty: 'Beginner',
      rating: 4.8,
      thumbnail: '🚀',
    },
    {
      id: 2,
      title: 'Understanding Precious Metals',
      description: 'Deep dive into gold, silver, platinum, and palladium markets',
      duration: '12:15',
      difficulty: 'Intermediate',
      rating: 4.9,
      thumbnail: '🥇',
    },
    {
      id: 3,
      title: 'Cryptocurrency Fundamentals',
      description: 'Complete guide to digital assets and blockchain technology',
      duration: '18:45',
      difficulty: 'Beginner',
      rating: 4.7,
      thumbnail: '₿',
    },
  ];

  return (
    <div className="tutorials-page">
      <div className="tutorials-header">
        <Play size={48} className="header-icon" />
        <div className="header-content">
          <h1>Video Tutorials</h1>
          <p>Learn with step-by-step video guides</p>
        </div>
      </div>

      <div className="tutorials-grid">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="tutorial-card">
            <div className="tutorial-thumbnail">
              <div className="thumbnail-icon">{tutorial.thumbnail}</div>
              <div className="play-overlay">
                <Play size={32} />
              </div>
              <div className="tutorial-duration">
                <Clock size={14} />
                <span>{tutorial.duration}</span>
              </div>
            </div>
            
            <div className="tutorial-content">
              <div className="tutorial-meta">
                <span className="tutorial-difficulty">{tutorial.difficulty}</span>
                <div className="tutorial-rating">
                  <Star size={14} />
                  <span>{tutorial.rating}</span>
                </div>
              </div>
              
              <h3>{tutorial.title}</h3>
              <p>{tutorial.description}</p>
              
              <button className="watch-tutorial-btn">
                <Play size={16} />
                Watch Tutorial
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="tutorials-coming-soon">
        <BookOpen size={48} />
        <h2>More Tutorials Coming Soon</h2>
        <p>We're working on adding more educational content. Check back regularly for new tutorials!</p>
      </div>
    </div>
  );
};

export default Tutorials;
