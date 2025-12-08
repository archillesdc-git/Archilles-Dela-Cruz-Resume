"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaEnvelope, FaSpinner } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import styles from './AIAssistant.module.css';

interface Message {
    role: 'ai' | 'user';
    content: string;
    showEmailButton?: boolean;
}

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_rtivf1l";
const EMAILJS_TEMPLATE_ID = "template_bbw20uh";
const EMAILJS_PUBLIC_KEY = "zseLnDIgoVQw3j6Vz";

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: `Hey! 👋 I'm AI'k, Archilles' AI assistant. Ask me anything about him - his skills, experience, projects, or if you wanna reach out! What's up? 🚀`, showEmailButton: false }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [pendingEmailMessage, setPendingEmailMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check if message indicates user wants to contact/email
    const shouldShowEmailButton = (message: string): boolean => {
        const lower = message.toLowerCase();
        return lower.includes('email') ||
            lower.includes('contact') ||
            lower.includes('reach') ||
            lower.includes('hire') ||
            lower.includes('project') ||
            lower.includes('message him') ||
            lower.includes('get in touch');
    };

    const handleSendEmail = async () => {
        if (!pendingEmailMessage) return;
        setIsSendingEmail(true);

        try {
            // Fetch current weather
            let weatherInfo = '';
            try {
                const weatherRes = await fetch('/api/weather');
                const weather = await weatherRes.json();
                if (weather.icon && weather.description) {
                    weatherInfo = ` ${weather.icon} It's currently ${weather.description} (${weather.temp}°C) in GenSan right now!`;
                }
            } catch {
                // Weather fetch failed, continue without it
            }

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: "Portfolio Visitor (via AI'k)",
                    from_email: "ai-assistant@portfolio.com",
                    message: pendingEmailMessage,
                    subject: "🤖 New Message via AI'k Assistant - Portfolio"
                },
                EMAILJS_PUBLIC_KEY
            );

            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Done! ✅ Your message has been sent to Archilles!${weatherInfo} He usually responds quickly. Anything else I can help you with? 😊`,
                showEmailButton: false
            }]);

            setPendingEmailMessage('');
        } catch (error) {
            console.error('EmailJS Error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Oops! 😅 Something went wrong while sending. You can try again or email him directly at archillesdelacruz@outlook.com`,
                showEmailButton: false
            }]);
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            // Prepare conversation history for API (last 10 messages for context)
            const conversationHistory = messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            conversationHistory.push({ role: 'user', content: userMessage });

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const aiResponse = data.message;

            // Check if we should show email button
            const showEmail = shouldShowEmailButton(userMessage) || shouldShowEmailButton(aiResponse);

            // If user seems to be composing a message, save it for email
            if (userMessage.length > 50 && (
                messages[messages.length - 1]?.content.toLowerCase().includes('message') ||
                messages[messages.length - 1]?.content.toLowerCase().includes('tell him') ||
                messages[messages.length - 1]?.content.toLowerCase().includes('send')
            )) {
                setPendingEmailMessage(userMessage);
            }

            setMessages(prev => [...prev, {
                role: 'ai',
                content: aiResponse,
                showEmailButton: showEmail
            }]);

        } catch (error) {
            console.error('Chat Error:', error);
            // Fallback response if API fails
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Hmm, I'm having trouble connecting right now. 😅 But you can always reach Archilles directly at archillesdelacruz@outlook.com!`,
                showEmailButton: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <motion.button
                className={styles.floatingButton}
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 20 : 0 }}
                style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
            >
                <span className={styles.buttonLabel}>ASK AI'K</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.chatWindow}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={styles.header}>
                            <div className={styles.headerInfo}>
                                <div className={styles.aiAvatar}>
                                    <span className={styles.avatarEmoji}>🤖</span>
                                </div>
                                <div>
                                    <h4 className={styles.aiName}>AI'k Assistant</h4>
                                    <span className={styles.aiStatus}>
                                        <span className={styles.statusDot}></span>
                                        {isTyping ? '✨ Thinking...' : '🟢 Online'}
                                    </span>
                                </div>
                            </div>
                            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className={styles.messages}>
                            {messages.map((msg, idx) => (
                                <div key={idx}>
                                    <motion.div
                                        className={`${styles.message} ${msg.role === 'ai' ? styles.aiMessage : styles.userMessage}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {msg.content}
                                    </motion.div>
                                    {msg.showEmailButton && msg.role === 'ai' && (
                                        <motion.button
                                            className={styles.emailButton}
                                            onClick={handleSendEmail}
                                            disabled={isSendingEmail}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.2 }}
                                        >
                                            {isSendingEmail ? (
                                                <><FaSpinner className={styles.spinner} /> Sending...</>
                                            ) : (
                                                <><FaEnvelope /> ✉️ Email Archilles</>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className={`${styles.message} ${styles.aiMessage} ${styles.typing}`}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about Archilles..."
                                className={styles.input}
                                disabled={isTyping}
                            />
                            <button
                                className={styles.sendButton}
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                            >
                                {isTyping ? <FaSpinner className={styles.spinner} /> : <FaPaperPlane />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
