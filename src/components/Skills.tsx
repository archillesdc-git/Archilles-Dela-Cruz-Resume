"use client";

import { motion } from 'framer-motion';
import { FaReact } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiPrisma, SiTrpc } from 'react-icons/si';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import styles from './Skills.module.css';

const skills = [
    {
        category: "T3 Stack",
        items: [
            { name: "Next.js", icon: <SiNextdotjs /> },
            { name: "TypeScript", icon: <SiTypescript className="text-[#3178c6]" /> },
            { name: "tRPC", icon: <SiTrpc className="text-[#2596be]" /> },
            { name: "Prisma", icon: <SiPrisma className="text-[#2d3748]" /> },
            { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#06b6d4]" /> },
            { name: "NextAuth.js", icon: <RiShieldKeyholeLine className="text-[#9333ea]" /> },
        ]
    },
    {
        category: "Core Technologies",
        items: [
            { name: "React", icon: <FaReact className="text-[#61dafb]" /> },
        ]
    }
];

const softSkills = [
    "Problem-Solving",
    "Critical Thinking",
    "Communication",
    "Adaptability",
    "Time Management",
    "Attention to Detail",
    "Collaboration & Teamwork",
    "Creativity",
    "Leadership",
    "Work Ethic",
    "Self-Motivation",
    "Accountability",
    "Decision-Making",
    "Patience & Persistence",
    "Client/Stakeholder Communication"
];

export default function Skills() {
    return (
        <section id="skills" className={`section ${styles.skillsSection}`}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2>Skills & Expertise</h2>
                    <p className={styles.description}>Specialized in the T3 Stack — the modern, type-safe approach to full-stack development.</p>
                </motion.div>

                <div className={styles.grid}>
                    {skills.map((category, idx) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <h3 className={styles.categoryTitle}>{category.category}</h3>
                            <div className={styles.skillsContainer}>
                                {category.items.map((skill) => (
                                    <div key={skill.name} className={styles.skillItem}>
                                        <span className={styles.icon}>{skill.icon}</span>
                                        <span className={styles.skillName}>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Soft Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h3 className={styles.categoryTitle}>Soft Skills</h3>
                        <div className={styles.skillsContainer}>
                            {softSkills.map((skill) => (
                                <span key={skill} className={styles.softSkillBadge}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
