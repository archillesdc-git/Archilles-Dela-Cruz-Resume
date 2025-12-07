"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import styles from './Hero.module.css';

export default function Hero() {
    return (
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
    );
}
