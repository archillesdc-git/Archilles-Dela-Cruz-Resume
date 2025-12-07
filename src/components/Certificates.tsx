"use client";

import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './Certificates.module.css';

const certificates = [
    {
        title: "Startup 102 Workshop",
        issuer: "DICT Region XII and Mainland BARMM",
        date: "October 20-21, 2022",
        link: "https://drive.google.com/file/d/1E5qLrtaJG4BzX3Vv0uAyNyEINA6QTN96/view?usp=drive_link"
    },
    {
        title: "12th PSITS Regional Convention 2024",
        issuer: "PSITS Region XII - InnoTech Gala",
        date: "May 4, 2024",
        link: "https://drive.google.com/file/d/1LEa8zW1-WaUU3v74oHxR5dhrvYBxc-od/view?usp=drive_link"
    },
    {
        title: "Cybersecurity, Data Privacy & Cisco Networking",
        issuer: "DICT - Hackaton 2024 IT Olympics",
        date: "2024",
        link: "https://drive.google.com/file/d/13N8jhqUXr9960nNSCbKejrxH_yW3TOvx/view?usp=drive_link"
    }
];

export default function Certificates() {
    return (
        <section id="certificates" className={`section ${styles.certificatesSection}`}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2>Certifications & Licenses</h2>
                </motion.div>

                <div className={styles.grid}>
                    {certificates.map((cert, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={styles.card}
                        >
                            <div className={styles.iconWrapper}>
                                <FaCertificate />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{cert.title}</h3>
                                <h4 className={styles.issuer}>{cert.issuer}</h4>
                                <span className={styles.date}>{cert.date}</span>
                            </div>
                            <a href={cert.link} className={styles.link} target="_blank" rel="noopener noreferrer">
                                <FaExternalLinkAlt />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
