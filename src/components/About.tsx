"use client";

import { motion } from 'framer-motion';
import styles from './About.module.css';

export default function About() {
    return (
        <section id="about" className="section relative">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2>About Me</h2>
                </motion.div>

                <div className={styles.grid}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.glassPanel}>
                            <div className={styles.decoration}></div>
                            <h3 className={styles.subTitle}>Who I am</h3>
                            <p className={styles.text}>
                                I'm a Full Stack Web Developer specializing in modern, high-performance applications built using the T3 Stack. I focus on creating scalable systems with clean architecture, efficient database structures, and smooth end-to-end functionality. My approach blends strong technical execution with an eye for usability, ensuring every project is fast, secure, and user-friendly.
                            </p>
                            <p className={styles.text}>
                                Throughout my journey, I've built multiple systems ranging from management platforms to custom tools designed to solve real operational problems. I enjoy transforming complex ideas into functional, polished web applications while keeping code maintainable, organized, and ready for production. Continuous learning drives me, especially in exploring new technologies that elevate my development process.
                            </p>
                            <p className={styles.text}>
                                Beyond coding, I value simplicity, clarity, and continuous growth. I strive to create solutions that not only work well but also make a real difference to the users who depend on them. Every project I take on is an opportunity to improve, innovate, and deliver something meaningful.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={styles.cardsGrid}
                    >
                        <div className={styles.card} style={{ borderLeftColor: 'var(--primary)' }}>
                            <h4 className={styles.cardTitle}>Problem Solver</h4>
                            <p className={styles.cardText}>I approach every challenge with a logical mindset, breaking down complex issues into manageable solutions.</p>
                        </div>
                        <div className={styles.card} style={{ borderLeftColor: 'var(--secondary)' }}>
                            <h4 className={styles.cardTitle}>Continuous Learner</h4>
                            <p className={styles.cardText}>In the ever-evolving tech landscape, I stay ahead by constantly exploring new frameworks and best practices.</p>
                        </div>
                        <div className={styles.card} style={{ borderLeftColor: 'var(--primary)' }}>
                            <h4 className={styles.cardTitle}>Team Player</h4>
                            <p className={styles.cardText}>I thrive in collaborative environments, believing that the best software is built by diverse teams working together.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
