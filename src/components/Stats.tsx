"use client";

import { motion } from 'framer-motion';
import styles from './Stats.module.css';

const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "30+", label: "Happy Clients" },
    { value: "100%", label: "Satisfaction" }
];

export default function Stats() {
    return (
        <section className={styles.statsSection}>
            <div className={`container ${styles.container}`}>
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={styles.statItem}
                    >
                        <span className={styles.number}>{stat.value}</span>
                        <span className={styles.label}>{stat.label}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
