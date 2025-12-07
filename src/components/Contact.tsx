"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane, FaDownload, FaCheck, FaSpinner } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import styles from './Contact.module.css';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_rtivf1l";
const EMAILJS_TEMPLATE_ID = "template_bbw20uh";
const EMAILJS_PUBLIC_KEY = "zseLnDIgoVQw3j6Vz";

export default function Contact() {
    const [formData, setFormData] = useState({
        from_name: '',
        from_email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.from_name,
                    from_email: formData.from_email,
                    message: formData.message,
                    subject: `Portfolio Contact from ${formData.from_name}`
                },
                EMAILJS_PUBLIC_KEY
            );

            setStatus('success');
            setFormData({ from_name: '', from_email: '', message: '' });

            // Reset status after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section id="contact" className={`section ${styles.contactSection}`}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2>Get In Touch</h2>
                    <p>Have a project in mind or want to say hello? I'd love to hear from you.</p>
                </motion.div>

                <div className={styles.grid}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={styles.infoCard}
                    >
                        <h3 className="text-xl font-bold mb-6">Contact Information</h3>

                        <div className={styles.contactMethod}>
                            <div className={styles.iconBox}><FaEnvelope /></div>
                            <div>
                                <span className={styles.methodLabel}>Email</span>
                                <span className={styles.methodValue}>archillesdelacruz@outlook.com</span>
                            </div>
                        </div>

                        <div className={styles.contactMethod}>
                            <div className={styles.iconBox}><FaPhoneAlt /></div>
                            <div>
                                <span className={styles.methodLabel}>Phone</span>
                                <span className={styles.methodValue}>+63 975 077 3561</span>
                            </div>
                        </div>

                        <div className={styles.contactMethod}>
                            <div className={styles.iconBox}><FaMapMarkerAlt /></div>
                            <div>
                                <span className={styles.methodLabel}>Location</span>
                                <span className={styles.methodValue}>General Santos City, Philippines</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-[var(--glass-border)]">
                            <a href="/resume.pdf" download="Archilles-Dela-Cruz-Resume.pdf" className="btn btn-outline w-full justify-center">
                                <FaDownload /> Download Resume
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="from_name" className={styles.label}>Your Name</label>
                                <input
                                    type="text"
                                    id="from_name"
                                    name="from_name"
                                    className={styles.input}
                                    placeholder="John Doe"
                                    value={formData.from_name}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="from_email" className={styles.label}>Your Email</label>
                                <input
                                    type="email"
                                    id="from_email"
                                    name="from_email"
                                    className={styles.input}
                                    placeholder="john@example.com"
                                    value={formData.from_email}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="message" className={styles.label}>Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className={styles.textarea}
                                    placeholder="Tell me about your project..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'sending'}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary justify-center ${status === 'success' ? styles.successBtn : ''}`}
                                disabled={status === 'sending'}
                            >
                                {status === 'idle' && <><FaPaperPlane /> Send Message</>}
                                {status === 'sending' && <><FaSpinner className={styles.spinner} /> Sending...</>}
                                {status === 'success' && <><FaCheck /> Message Sent!</>}
                                {status === 'error' && <><FaPaperPlane /> Try Again</>}
                            </button>
                            {status === 'error' && (
                                <p className={styles.errorText}>Something went wrong. Please try again.</p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
