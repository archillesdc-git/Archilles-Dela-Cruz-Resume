"use client";

import { motion } from 'framer-motion';
import styles from './Experience.module.css';

const experiences = [
    {
        role: "SEO Support Specialist",
        company: "NVAS Company",
        duration: "Present",
        description: "Providing SEO support services including Google Business Profile optimization, Google Sites development, and digital marketing assistance.",
        achievements: [
            "Managed and optimized Google Business Profiles (GBP) for clients.",
            "Developed and maintained Google Sites for business visibility.",
            "Implemented SEO strategies to improve search rankings.",
            "Collaborated with team to deliver quality digital solutions."
        ]
    },
    {
        role: "OJT / Intern",
        company: "BAC Secretariat",
        duration: "Feb 20 – June 5, 2024",
        description: "Completed on-the-job training at the Bids and Awards Committee (BAC) Secretariat, gaining hands-on experience in administrative processes and document management.",
        achievements: [
            "Assisted in the preparation and organization of bidding documents.",
            "Supported administrative tasks related to procurement processes.",
            "Maintained and organized records and documentation.",
            "Collaborated with team members on various secretariat duties."
        ]
    }
];

export default function Experience() {
    return (
        <section id="experience" className={`section ${styles.experienceSection}`}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2>Experience</h2>
                </motion.div>

                <div className={styles.timeline}>
                    {experiences.map((exp, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            className={styles.timelineItem}
                        >
                            <span className={styles.dot}></span>

                            <div className={styles.content}>
                                <span className={styles.duration}>{exp.duration}</span>
                                <h3 className={styles.role}>{exp.role}</h3>
                                <h4 className={styles.company}>{exp.company}</h4>
                                <p className={styles.description}>{exp.description}</p>
                                <ul className={styles.list}>
                                    {exp.achievements.map((ach, i) => (
                                        <li key={i} className={styles.listItem}>{ach}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
