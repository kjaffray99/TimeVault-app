import React, { useState } from 'react';

interface FeedbackWidgetProps {
    context: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ context }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Here you would typically send feedback to your analytics service
        console.log('Feedback submitted:', { context, feedback });

        setSubmitted(true);
        setTimeout(() => {
            setIsOpen(false);
            setSubmitted(false);
            setFeedback('');
        }, 2000);
    };

    return (
        <div className="feedback-widget">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="feedback-trigger"
                    aria-label="Send feedback"
                >
                    💬
                </button>
            ) : (
                <div className="feedback-form">
                    {!submitted ? (
                        <form onSubmit={handleSubmit}>
                            <h4>Send Feedback</h4>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="How can we improve TimeVault?"
                                rows={3}
                                required
                            />
                            <div className="form-actions">
                                <button type="submit" disabled={!feedback.trim()}>
                                    Send
                                </button>
                                <button type="button" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="success-message">
                            <h4>Thank you!</h4>
                            <p>Your feedback has been received.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackWidget;
