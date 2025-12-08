"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import styles from './AIAssistant.module.css';

interface Message {
    role: 'ai' | 'user';
    content: string;
}

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_rtivf1l";
const EMAILJS_TEMPLATE_ID = "template_bbw20uh";
const EMAILJS_PUBLIC_KEY = "zseLnDIgoVQw3j6Vz";

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: `Hello! 👋 I'm AI'k, Archilles' AI assistant. I can tell you about his skills, experience, and projects. If you'd like to contact him, just let me know!` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [collectingContact, setCollectingContact] = useState(false);
    const [contactInfo, setContactInfo] = useState({ name: '', email: '', message: '' });
    const [contactStep, setContactStep] = useState(0); // 0=not collecting, 1=ask name, 2=ask email, 3=ask message
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check if user wants to contact
    const wantsToContact = (message: string): boolean => {
        const lower = message.toLowerCase();
        return lower.includes('contact') ||
            lower.includes('email') ||
            lower.includes('hire') ||
            lower.includes('reach') ||
            lower.includes('message') ||
            lower.includes('get in touch') ||
            lower.includes('talk to') ||
            lower.includes('project') ||
            lower.includes('work with') ||
            lower.includes('services');
    };

    // Extract email from text
    const extractEmail = (text: string): string | null => {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const match = text.match(emailRegex);
        return match ? match[0] : null;
    };

    // Send email via EmailJS
    const sendContactEmail = async (name: string, email: string, message: string) => {
        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: name,
                    from_email: email,
                    message: `New inquiry from ${name} (${email}):\n\n${message}`,
                    subject: `🚀 New Contact from ${name} via AI'k`
                },
                EMAILJS_PUBLIC_KEY
            );
            return true;
        } catch (error) {
            console.error('EmailJS Error:', error);
            return false;
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            // STEP 1: Check if we're in contact collection mode
            if (collectingContact) {
                if (contactStep === 1) {
                    // Collecting name
                    setContactInfo(prev => ({ ...prev, name: userMessage }));
                    setContactStep(2);
                    setMessages(prev => [...prev, {
                        role: 'ai',
                        content: `Nice to meet you, ${userMessage}! 📧 What's your email address so Archilles can get back to you?`
                    }]);
                    setIsTyping(false);
                    return;
                } else if (contactStep === 2) {
                    // Collecting email
                    const email = extractEmail(userMessage) || userMessage;
                    if (!email.includes('@')) {
                        setMessages(prev => [...prev, {
                            role: 'ai',
                            content: `That doesn't look like a valid email. Please provide a valid email address:`
                        }]);
                        setIsTyping(false);
                        return;
                    }
                    setContactInfo(prev => ({ ...prev, email: email }));
                    setContactStep(3);
                    setMessages(prev => [...prev, {
                        role: 'ai',
                        content: `Got it! ✍️ What would you like to tell Archilles? Type your message:`
                    }]);
                    setIsTyping(false);
                    return;
                } else if (contactStep === 3) {
                    // Collecting message and sending
                    const finalInfo = { ...contactInfo, message: userMessage };
                    setMessages(prev => [...prev, {
                        role: 'ai',
                        content: `Sending your message to Archilles... ⏳`
                    }]);

                    const success = await sendContactEmail(finalInfo.name, finalInfo.email, finalInfo.message);

                    if (success) {
                        setMessages(prev => [...prev, {
                            role: 'ai',
                            content: `✅ Done! Your message has been sent to Archilles! He'll get back to you at ${finalInfo.email} soon. Is there anything else you'd like to know?`
                        }]);
                    } else {
                        setMessages(prev => [...prev, {
                            role: 'ai',
                            content: `❌ Sorry, there was an issue sending your message. Please try emailing directly at archillesdelacruz@outlook.com`
                        }]);
                    }

                    // Reset contact flow
                    setCollectingContact(false);
                    setContactStep(0);
                    setContactInfo({ name: '', email: '', message: '' });
                    setIsTyping(false);
                    return;
                }
            }

            // STEP 2: Check if user wants to contact (start collection)
            if (wantsToContact(userMessage) && !collectingContact) {
                setCollectingContact(true);
                setContactStep(1);
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: `Great! I'd be happy to help you get in touch with Archilles. 📝 First, what's your name?`
                }]);
                setIsTyping(false);
                return;
            }

            // STEP 3: Normal AI conversation
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
            setMessages(prev => [...prev, { role: 'ai', content: data.message }]);

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `I'm having trouble connecting. You can reach Archilles directly at archillesdelacruz@outlook.com`
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
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                                        {isTyping ? 'Typing...' : 'Online'}
                                    </span>
                                </div>
                            </div>
                            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className={styles.messages}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`${styles.message} ${msg.role === 'ai' ? styles.aiMessage : styles.userMessage}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {msg.content}
                                </motion.div>
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
                                placeholder={collectingContact ? "Type here..." : "Ask me anything about Archilles..."}
                                className={styles.input}
                            />
                            <motion.button
                                className={styles.sendButton}
                                onClick={handleSend}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!input.trim()}
                            >
                                <FaPaperPlane />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
