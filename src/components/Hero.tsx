"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaFacebook, FaStar, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import styles from './Hero.module.css';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_rtivf1l";
const EMAILJS_TEMPLATE_ID = "template_bbw20uh";
const EMAILJS_PUBLIC_KEY = "zseLnDIgoVQw3j6Vz";

export default function Hero() {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        const hasRatedBefore = localStorage.getItem('portfolio_rated');
        if (hasRatedBefore) {
            setHasRated(true);
        }
    }, []);

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
            <section className={styles.heroSection}>
                {/* Background decoration */}
                <div className={styles.backgroundDecoration1}></div>
                <div className={styles.backgroundDecoration2}></div>

                <div className={`container ${styles.grid}`}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className={styles.subtitle}>
                            T3 Full Stack Developer
                        </span>
                        <h1 className={styles.title}>
                            Hello, I'm <br />
                            <span className="gradient-text">Archilles</span>
                        </h1>
                        <p className={styles.description}>
                            Building high-performance web apps with the T3 Stack — Next.js, TypeScript, tRPC, Prisma, and Tailwind CSS.
                        </p>

                        <div className={styles.ctaGroup}>
                            <Link href="#contact" className="btn btn-primary">
                                Hire Me
                            </Link>
                            <a href="/resume.pdf" download className="btn btn-outline">
                                Download CV
                            </a>
                        </div>

                        <div className={styles.socials}>
                            <a href="https://www.facebook.com/archillesdc" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <FaFacebook />
                            </a>
                            <a href="https://github.com/archillesdc-git" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <FaGithub />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.imageWrapper}
                    >
                        <div className={styles.profileContainer}>
                            <div className={`${styles.glow} animate-pulse`}></div>
                            <div className={styles.imageFrame}>
                                <Image
                                    src="/profile.jpg"
                                    alt="Archilles De La Cruz"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Star Rating Badge */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className={`${styles.floatingBadge} ${styles.badgeTop}`}
                            >
                                <div className={styles.ratingBadge}>
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
                                    {hasRated && <span className={styles.ratedText}>Thanks! 🙏</span>}
                                </div>
                            </motion.div>

                            {/* Employer Badge */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className={`${styles.floatingBadge} ${styles.badgeBottom}`}
                            >
                                <a
                                    href="https://www.facebook.com/NooiceVAServices"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.employerLink}
                                >
                                    <Image
                                        src="/nooice-logo.jpg"
                                        alt="Nooice VA Services"
                                        width={24}
                                        height={24}
                                        className={styles.employerLogo}
                                    />
                                    <span className={styles.employerText}>
                                        <span className={styles.employerLabel}>Employer</span>
                                        <span className={styles.employerName}>Nooice VA Services</span>
                                    </span>
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className={styles.modalOverlay} onClick={() => setShowRatingModal(false)}>
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
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
                </div>
            )}
        </>
    );
}
