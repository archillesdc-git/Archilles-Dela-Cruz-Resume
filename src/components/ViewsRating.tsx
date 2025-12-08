"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaEye, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import styles from './ViewsRating.module.css';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_rtivf1l";
const EMAILJS_TEMPLATE_ID = "template_bbw20uh";
const EMAILJS_PUBLIC_KEY = "zseLnDIgoVQw3j6Vz";

function ViewsRatingContent() {
    const searchParams = useSearchParams();
    const isOwner = searchParams.get('owner') === 'archilles';

    const [views, setViews] = useState<number | null>(null);
    const [isLoadingViews, setIsLoadingViews] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        // Check if user has already rated
        const hasRatedBefore = localStorage.getItem('portfolio_rated');
        if (hasRatedBefore) {
            setHasRated(true);
        }

        // Track this visit via API (IP-based)
        const trackVisit = async () => {
            try {
                await fetch('/api/views', { method: 'POST' });
            } catch (error) {
                console.error('Failed to track visit:', error);
            }
        };

        // Get view count if owner
        const getViews = async () => {
            if (isOwner) {
                try {
                    const response = await fetch('/api/views?owner=archilles');
                    const data = await response.json();
                    setViews(data.views);
                } catch (error) {
                    console.error('Failed to get views:', error);
                    setViews(0);
                }
            }
            setIsLoadingViews(false);
        };

        trackVisit();
        getViews();
    }, [isOwner]);

    const handleStarClick = (rating: number) => {
        if (hasRated) return;
        setSelectedRating(rating);
        setShowRatingModal(true);
    };

    const handleSubmitRating = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !selectedRating) return;

        setIsSending(true);

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: `Portfolio Rating: ${selectedRating} Stars`,
                    from_email: email,
                    message: `⭐ New Rating Received!\n\nRating: ${'★'.repeat(selectedRating)}${'☆'.repeat(5 - selectedRating)} (${selectedRating}/5 stars)\nEmail: ${email}\nFeedback: ${feedback || 'No feedback provided'}\n\n---\nSent via Portfolio Rating System`,
                    subject: `⭐ New ${selectedRating}-Star Rating on Your Portfolio!`
                },
                EMAILJS_PUBLIC_KEY
            );

            setIsSuccess(true);
            setHasRated(true);
            localStorage.setItem('portfolio_rated', 'true');
            localStorage.setItem('portfolio_user_rating', selectedRating.toString());

            setTimeout(() => {
                setShowRatingModal(false);
                setIsSuccess(false);
            }, 2000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            alert('Failed to submit rating. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                {/* Tab that sticks out */}
                <div className={styles.tab}>
                    <FaStar className={styles.tabIcon} />
                    RATE
                </div>

                <div className={styles.container}>
                    {/* Views Counter - ONLY visible to owner */}
                    {isOwner && (
                        <div className={styles.viewsBox}>
                            <FaEye className={styles.viewsIcon} />
                            <span className={styles.viewsCount}>
                                {isLoadingViews ? (
                                    <FaSpinner className={styles.spinner} />
                                ) : (
                                    views ?? 0
                                )}
                            </span>
                            <span className={styles.viewsLabel}>Views</span>
                        </div>
                    )}

                    {/* Star Rating - Visible to everyone */}
                    <div className={styles.ratingBox}>
                        <span className={styles.ratingLabel}>Rate Me</span>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`${styles.starButton} ${hasRated ? styles.disabled : ''}`}
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => !hasRated && setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    disabled={hasRated}
                                >
                                    <FaStar
                                        className={`${styles.star} ${(hoverRating >= star || (hasRated && parseInt(localStorage.getItem('portfolio_user_rating') || '0') >= star))
                                            ? styles.starFilled
                                            : styles.starEmpty
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {hasRated && <span className={styles.ratedText}>Thanks for rating! 🙏</span>}
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            <AnimatePresence>
                {showRatingModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowRatingModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={styles.closeButton} onClick={() => setShowRatingModal(false)}>
                                <FaTimes />
                            </button>

                            {isSuccess ? (
                                <div className={styles.successMessage}>
                                    <div className={styles.successIcon}>✓</div>
                                    <h3>Thank You!</h3>
                                    <p>Your rating has been submitted.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className={styles.modalTitle}>Rate My Portfolio</h3>

                                    <div className={styles.ratingDisplay}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`${styles.modalStar} ${selectedRating >= star ? styles.starFilled : styles.starEmpty}`}
                                                onClick={() => setSelectedRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <p className={styles.ratingText}>{selectedRating} out of 5 stars</p>

                                    <form onSubmit={handleSubmitRating} className={styles.form}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="rating-email">Your Email *</label>
                                            <input
                                                type="email"
                                                id="rating-email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                                className={styles.input}
                                            />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="rating-feedback">Feedback (Optional)</label>
                                            <textarea
                                                id="rating-feedback"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                className={styles.textarea}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className={styles.submitButton}
                                            disabled={isSending || !email}
                                        >
                                            {isSending ? (
                                                <><FaSpinner className={styles.spinner} /> Sending...</>
                                            ) : (
                                                <><FaPaperPlane /> Submit Rating</>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Export with Suspense wrapper to handle useSearchParams
export default function ViewsRating() {
    return (
        <Suspense fallback={null}>
            <ViewsRatingContent />
        </Suspense>
    );
}
