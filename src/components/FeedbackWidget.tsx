import React, { useCallback, useState } from 'react';
import { analytics } from '../services/analyticsEnhanced';

interface FeedbackWidgetProps {
    context: string;
    onFeedbackSubmitted?: (rating: number, feedback: string) => void;
    className?: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
    context,
    onFeedbackSubmitted,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (rating === 0 || isSubmitting) return;

        setIsSubmitting(true);

        analytics.trackSatisfaction(rating, feedback, { context });

        try {
            // Store feedback locally since we don't have a backend yet
            const existingFeedback = JSON.parse(localStorage.getItem('timevault_feedback') || '[]');
            const newFeedback = {
                rating,
                feedback,
                context,
                timestamp: Date.now(),
                user_id: analytics.userId
            };

            existingFeedback.push(newFeedback);

            // Keep only last 50 feedback entries
            if (existingFeedback.length > 50) {
                existingFeedback.shift();
            }

            localStorage.setItem('timevault_feedback', JSON.stringify(existingFeedback));

            setSubmitted(true);
            onFeedbackSubmitted?.(rating, feedback);

            // Reset form after delay
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                setRating(0);
                setFeedback('');
                setIsSubmitting(false);
            }, 2000);

        } catch (error) {
            console.error('Failed to submit feedback:', error);
            analytics.trackError(error as Error, { context: 'feedback_submission' });
            setIsSubmitting(false);
        }
    }, [rating, feedback, context, onFeedbackSubmitted, isSubmitting]);

    const handleRatingClick = useCallback((selectedRating: number) => {
        setRating(selectedRating);
        analytics.trackEvent('feedback_rating_selected', {
            category: 'feedback',
            rating: selectedRating,
            context
        });
    }, [context]);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
        analytics.trackEvent('feedback_widget_opened', {
            category: 'feedback',
            context
        });
    }, [context]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        analytics.trackEvent('feedback_widget_closed', {
            category: 'feedback',
            context,
            rating_given: rating > 0
        });
    }, [context, rating]);

    if (!isOpen) {
        return (
            <button
                className={`feedback-trigger ${className}`}
                onClick={handleOpen}
                aria-label="Provide feedback"
                title="Share your feedback with us"
            >
                💬 Feedback
            </button>
        );
    }

    if (submitted) {
        return (
            <div className={`feedback-success ${className}`}>
                <div className="feedback-success-content">
                    <span className="success-icon">✅</span>
                    <span className="success-text">Thank you for your feedback!</span>
                    <div className="feedback-appreciation">
                        Your input helps us improve TimeVault for everyone.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`feedback-widget ${className}`}>
            <div className="feedback-header">
                <h4>How was your experience?</h4>
                <button
                    onClick={handleClose}
                    className="feedback-close"
                    aria-label="Close feedback"
                >
                    ×
                </button>
            </div>

            <div className="rating-section">
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            className={`star ${rating >= star ? 'filled' : ''}`}
                            onClick={() => handleRatingClick(star)}
                            aria-label={`Rate ${star} stars`}
                            title={`${star} star${star !== 1 ? 's' : ''}`}
                        >
                            ⭐
                        </button>
                    ))}
                </div>

                {rating > 0 && (
                    <div className="rating-label">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                    </div>
                )}
            </div>

            <div className="feedback-text-section">
                <textarea
                    placeholder="Tell us more about your experience... (optional)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="feedback-text"
                    maxLength={500}
                    rows={3}
                />
                <div className="character-count">
                    {feedback.length}/500
                </div>
            </div>

            <div className="feedback-actions">
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className="submit-feedback-btn"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {rating > 0 && (
                    <button
                        onClick={handleClose}
                        className="skip-feedback-btn"
                    >
                        Skip Comment
                    </button>
                )}
            </div>

            {rating >= 4 && (
                <div className="feedback-upsell">
                    <p>Love TimeVault? Consider upgrading to Premium for advanced features!</p>
                </div>
            )}
        </div>
    );
};

// Feedback widget styles (to be added to CSS)
export const feedbackWidgetStyles = `
.feedback-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #D4AF37, #B8860B);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.feedback-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.feedback-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  border: 2px solid #D4AF37;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #eee;
}

.feedback-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #001F3F;
}

.feedback-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-close:hover {
  color: #D4AF37;
}

.rating-section {
  padding: 16px 20px;
  text-align: center;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.star {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.2s ease;
  padding: 4px;
}

.star.filled {
  opacity: 1;
  transform: scale(1.1);
}

.star:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.rating-label {
  font-size: 14px;
  font-weight: 500;
  color: #D4AF37;
}

.feedback-text-section {
  padding: 0 20px 16px;
}

.feedback-text {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.feedback-text:focus {
  outline: none;
  border-color: #D4AF37;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.feedback-actions {
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.submit-feedback-btn {
  background: linear-gradient(135deg, #D4AF37, #B8860B);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-feedback-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #B8860B, #9A7209);
}

.submit-feedback-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.skip-feedback-btn {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skip-feedback-btn:hover {
  border-color: #D4AF37;
  color: #D4AF37;
}

.feedback-success {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  border: 2px solid #4CAF50;
  padding: 20px;
  min-width: 250px;
}

.feedback-success-content {
  text-align: center;
}

.success-icon {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
}

.success-text {
  font-weight: 600;
  color: #4CAF50;
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
}

.feedback-appreciation {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.feedback-upsell {
  padding: 12px 20px 16px;
  background: #f8f9fa;
  margin: 0 -1px -1px -1px;
  border-radius: 0 0 10px 10px;
  border-top: 1px solid #eee;
}

.feedback-upsell p {
  margin: 0;
  font-size: 13px;
  color: #D4AF37;
  font-weight: 500;
  text-align: center;
}

@media (max-width: 480px) {
  .feedback-widget {
    width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }
  
  .feedback-trigger {
    right: 20px;
    bottom: 20px;
  }
}
`;

export default FeedbackWidget;
