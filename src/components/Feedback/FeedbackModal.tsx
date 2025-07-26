/**
 * Customer Feedback Component
 * 
 * Collects user feedback at optimal moments to improve customer experience
 * Florida FDBR compliant data collection with explicit consent
 */

import { useWallet } from '@thirdweb-dev/react';
import React, { useEffect, useState } from 'react';
import { CustomerExperienceService } from '../../services/customerExperience';
import './FeedbackModal.css';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    trigger?: 'completion' | 'error' | 'time_based' | 'manual';
    feature?: string;
    context?: any;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    isOpen,
    onClose,
    trigger = 'manual',
    feature,
    context
}) => {
    const wallet = useWallet();
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [category, setCategory] = useState<'ui' | 'performance' | 'feature' | 'bug' | 'general'>('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasConsented, setHasConsented] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Track feedback modal opening for analytics
            CustomerExperienceService.trackUserJourney(
                (wallet as any)?.address || 'anonymous',
                'feedback_modal_opened',
                { trigger, feature, timestamp: Date.now() }
            );
        }
    }, [isOpen, (wallet as any)?.address, trigger, feature]);

    const handleRatingClick = (selectedRating: number) => {
        setRating(selectedRating);

        // Track rating selection
        CustomerExperienceService.trackUserJourney(
            (wallet as any)?.address || 'anonymous',
            'feedback_rating_selected',
            { rating: selectedRating, trigger, feature }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hasConsented) {
            alert('Please consent to data collection to submit feedback.');
            return;
        }

        if (rating === 0) {
            alert('Please select a rating before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit feedback to customer experience service
            CustomerExperienceService.collectFeedback({
                userId: (wallet as any)?.address || 'anonymous',
                rating,
                comment: comment.trim() || undefined,
                feature,
                timestamp: Date.now(),
                processed: false,
                category
            });

            // Track successful submission
            CustomerExperienceService.trackUserJourney(
                (wallet as any)?.address || 'anonymous',
                'feedback_submitted',
                {
                    rating,
                    hasComment: comment.length > 0,
                    category,
                    trigger,
                    responseTime: context?.responseTime
                }
            );

            setShowThankYou(true);

            // Auto-close after showing thank you
            setTimeout(() => {
                setShowThankYou(false);
                onClose();
                resetForm();
            }, 2000);

        } catch (error) {
            console.error('Failed to submit feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setRating(0);
        setComment('');
        setCategory('general');
        setHasConsented(false);
        setShowThankYou(false);
    };

    const handleClose = () => {
        // Track feedback modal closing without submission
        if (rating === 0 && comment.length === 0) {
            CustomerExperienceService.trackUserJourney(
                (wallet as any)?.address || 'anonymous',
                'feedback_modal_closed_without_action',
                { trigger, feature }
            );
        }

        onClose();
        resetForm();
    };

    if (!isOpen) return null;

    // Thank you state
    if (showThankYou) {
        return (
            <div className="feedback-modal-overlay">
                <div className="feedback-modal feedback-modal--thank-you">
                    <div className="feedback-thank-you">
                        <div className="feedback-thank-you__icon">✨</div>
                        <h3>Thank You!</h3>
                        <p>Your feedback helps us improve TimeVault for everyone.</p>
                        {rating <= 2 && (
                            <p className="feedback-thank-you__followup">
                                We'll reach out soon to address your concerns.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-modal-overlay" onClick={handleClose}>
            <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
                <div className="feedback-modal__header">
                    <h3>Help Us Improve TimeVault</h3>
                    <button
                        className="feedback-modal__close"
                        onClick={handleClose}
                        aria-label="Close feedback modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="feedback-form">
                    {/* Rating Section */}
                    <div className="feedback-section">
                        <label className="feedback-label">
                            How would you rate your experience?
                            <span className="feedback-required">*</span>
                        </label>
                        <div className="feedback-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`feedback-star ${rating >= star ? 'feedback-star--filled' : ''}`}
                                    onClick={() => handleRatingClick(star)}
                                    aria-label={`Rate ${star} out of 5 stars`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="feedback-rating-text">
                                {rating === 1 && "We're sorry to hear that. Please tell us how we can improve."}
                                {rating === 2 && "We'd like to do better. What can we improve?"}
                                {rating === 3 && "Thanks for the feedback. How can we make it better?"}
                                {rating === 4 && "Great! What would make it even better?"}
                                {rating === 5 && "Wonderful! We'd love to hear what you liked most."}
                            </p>
                        )}
                    </div>

                    {/* Category Selection */}
                    <div className="feedback-section">
                        <label htmlFor="feedback-category" className="feedback-label">
                            What area is this feedback about?
                        </label>
                        <select
                            id="feedback-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="feedback-select"
                        >
                            <option value="general">General Experience</option>
                            <option value="ui">User Interface</option>
                            <option value="performance">Performance/Speed</option>
                            <option value="feature">Features/Functionality</option>
                            <option value="bug">Bug/Technical Issue</option>
                        </select>
                    </div>

                    {/* Comment Section */}
                    <div className="feedback-section">
                        <label htmlFor="feedback-comment" className="feedback-label">
                            Tell us more (optional)
                        </label>
                        <textarea
                            id="feedback-comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Your feedback helps us improve TimeVault..."
                            className="feedback-textarea"
                            rows={4}
                            maxLength={500}
                        />
                        <div className="feedback-char-count">
                            {comment.length}/500 characters
                        </div>
                    </div>

                    {/* FDBR Compliance - Data Consent */}
                    <div className="feedback-section">
                        <label className="feedback-checkbox-label">
                            <input
                                type="checkbox"
                                checked={hasConsented}
                                onChange={(e) => setHasConsented(e.target.checked)}
                                className="feedback-checkbox"
                                required
                            />
                            <span className="feedback-checkbox-text">
                                I consent to TimeVault collecting this feedback data to improve the platform.
                                Your feedback is processed according to our{' '}
                                <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="feedback-link"
                                >
                                    Privacy Policy
                                </a>.
                                <span className="feedback-required">*</span>
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="feedback-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="feedback-button feedback-button--secondary"
                        >
                            Skip for now
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0 || !hasConsented}
                            className="feedback-button feedback-button--primary"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>

                {/* Legal Disclaimer */}
                <div className="feedback-disclaimer">
                    <small>
                        Your feedback helps us improve TimeVault. This data is used only for service improvement
                        and is handled according to Florida Digital Bill of Rights requirements.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
