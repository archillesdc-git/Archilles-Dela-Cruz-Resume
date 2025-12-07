"use client";

import { motion } from 'framer-motion';
import styles from './Education.module.css';

const education = [
    {
        school: "South East Asian Institute of Technology",
        degree: "Bachelor of Science in Information Technology",
        year: "2021 - 2025",
        description: "Major in Business Analytics. Focused on modern web development, database management, and business intelligence systems."
    },
    {
        school: "North High School",
        degree: "North High School",
        year: "2016 - 2019",
        description: "Completed secondary education with focus on technology and computer subjects."
    },
    {
        school: "Jose P. Laurel Elementary School",
        degree: "Jose P. Laurel Elementary School",
        year: "2009 - 2015",
        description: "Foundation years of education."
    }
];

export default function Education() {
    return (
        <section id="education" className={`section ${styles.educationSection}`}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2>Education</h2>
                </motion.div>

                <div className={styles.grid}>
                    {education.map((edu, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={styles.card}
                        >
                            <div className={styles.year}>{edu.year}</div>
                            <div className={styles.content}>
                                <h3 className={styles.degree}>{edu.degree}</h3>
                                <p className={styles.description}>{edu.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
