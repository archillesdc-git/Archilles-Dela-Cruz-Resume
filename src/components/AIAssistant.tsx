"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaEnvelope, FaSpinner } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import styles from './AIAssistant.module.css';

interface Message {
    role: 'ai' | 'user';
    content: string;
    showEmailButton?: boolean;
    isEmailCompose?: boolean;
}

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_rtivf1l";
const EMAILJS_TEMPLATE_ID = "template_bbw20uh";
const EMAILJS_PUBLIC_KEY = "zseLnDIgoVQw3j6Vz";

// Archilles' personality - Vibe Coder 🎯
const archillesInfo = {
    name: "Archilles D. Dela Cruz",
    nickname: "Archilles",
    title: "T3 Full Stack Developer",
    personality: "vibe coder",
    location: "General Santos City, Philippines",
    email: "archillesdelacruz@outlook.com",
    currentJob: "SEO Support Specialist at Nooice VA Services",
    school: "South East Asian Institute of Technology",
    degree: "BS Information Technology - Business Analytics",
    gradYear: "2025",
    skills: ["Next.js", "TypeScript", "React", "tRPC", "Prisma", "Tailwind CSS", "Node.js"],
    hobbies: ["coding", "building web apps", "learning new tech"],
};

// More natural, conversational responses
function generateResponse(input: string, isComposeMode: boolean): { response: string; showEmailButton: boolean; enterComposeMode: boolean; isEmailReady: boolean } {
    const lower = input.toLowerCase();

    // Email compose mode - they're writing a message
    if (isComposeMode) {
        return {
            response: `Nice! I got your message. Click the button below and I'll send it straight to Archilles. He usually responds pretty quick! 📨`,
            showEmailButton: true,
            enterComposeMode: false,
            isEmailReady: true
        };
    }

    // GREETINGS
    if (lower.match(/^(hi|hello|hey|yo|sup|what'?s up|kumusta|musta)/)) {
        const greetings = [
            `Hey there! 👋 I'm Archilles' AI assistant. He's a vibe coder from GenSan - chill but gets things done! What do you wanna know about him?`,
            `Yo! Welcome! 🚀 Archilles is currently vibing as a T3 Stack developer. Ask me anything about him!`,
            `What's up! 👋 Nice to meet you! I'm here to tell you all about Archilles - the vibe coder. What's on your mind?`,
        ];
        return { response: greetings[Math.floor(Math.random() * greetings.length)], showEmailButton: false, enterComposeMode: false, isEmailReady: false };
    }

    // WHO IS ARCHILLES / ABOUT
    if (lower.match(/(who is|who's|tell me about|about) archilles/) || lower.match(/^who (is he|are you)/)) {
        return {
            response: `Archilles D. Dela Cruz is basically a vibe coder from GenSan, Philippines 🇵🇭 He builds high-performance web apps using the T3 Stack - that's Next.js, TypeScript, tRPC, Prisma, and Tailwind CSS. He's chill but super passionate about coding! Currently working as an SEO Support Specialist at Nooice VA Services while doing freelance dev work. 💻✨`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // SKILLS / TECH STACK
    if (lower.match(/(skill|tech|stack|programming|code|develop|language|framework|what (can|does) he (do|know))/)) {
        return {
            response: `Archilles' main stack is the T3 Stack - basically the modern web dev meta! 🔥\n\n⚡ Next.js & React - for building sick UIs\n⚡ TypeScript - because type safety is life\n⚡ tRPC & Prisma - backend magic\n⚡ Tailwind CSS - styling with vibes\n⚡ Node.js - server-side stuff\n\nHe's always learning new tech and leveling up! The guy loves building things that look good AND work good. 💪`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // EDUCATION
    if (lower.match(/(school|study|education|college|university|degree|graduate|student)/)) {
        return {
            response: `Archilles studied at South East Asian Institute of Technology (SEAIT) 🎓 He took up BS Information Technology with a major in Business Analytics - pretty solid combo for both tech and business! He graduated in 2025. The guy was really into web dev even during college! 📚`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // WORK / EXPERIENCE / JOB
    if (lower.match(/(work|job|experience|company|career|employ|position|doing now)/)) {
        return {
            response: `Right now, Archilles is working as an SEO Support Specialist at Nooice VA Services! 💼 He handles Google Business Profiles, builds Google Sites, and does SEO magic to help businesses grow online. Before that, he did his OJT at BAC Secretariat (Feb-June 2024) where he learned about admin and procurement stuff. He's always grinding and leveling up! 🚀`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // LOCATION
    if (lower.match(/(where|location|from|live|based|city|country)/)) {
        return {
            response: `Archilles is based in General Santos City, Philippines! 🇵🇭 Also known as GenSan - the Tuna Capital! He's proud to be a Mindanaoan dev building cool stuff for the web. 🌴💻`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // CONTACT / EMAIL - wants to reach out
    if (lower.match(/(contact|reach|email|message|talk to|connect|get in touch)/)) {
        return {
            response: `You wanna reach Archilles? Nice! 📧 You can email him at archillesdelacruz@outlook.com or just click the button below and I'll help you send a message directly. He's pretty responsive! What's up?`,
            showEmailButton: true,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // HIRE / PROJECT / WORK TOGETHER
    if (lower.match(/(hire|project|freelance|available|work (with|together)|build|create|need|help me)/)) {
        return {
            response: `Oooh you got a project? 👀 Archilles is definitely open to opportunities! He loves building web apps, especially with the T3 Stack. Whether it's a full website, dashboard, or any cool web project - he's your guy! Wanna send him a message about it? Just tell me what you need and I'll forward it to him! 🚀`,
            showEmailButton: true,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // DIRECT EMAIL REQUEST
    if (lower.match(/(email him directly|send (him )?(an? )?email|compose|write to him|message him directly|i want to email)/)) {
        return {
            response: `For sure! I got you. 💪 Just type your message below - whatever you wanna tell Archilles - and I'll send it straight to his inbox. He'll get back to you ASAP! What do you wanna say? ✍️`,
            showEmailButton: false,
            enterComposeMode: true,
            isEmailReady: false
        };
    }

    // TELL HIM / SEND / LET HIM KNOW
    if (lower.match(/(tell him|let him know|send this|forward|pass this)/)) {
        return {
            response: `Bet! 👌 What's the message you want me to send to Archilles? Just type it and I'll make sure he gets it!`,
            showEmailButton: false,
            enterComposeMode: true,
            isEmailReady: false
        };
    }

    // THANKS
    if (lower.match(/(thank|thanks|salamat|appreciate|helpful)/)) {
        const thanks = [
            `No problem! 😊 That's what I'm here for. Anything else you wanna know about Archilles?`,
            `You're welcome! 🙌 If you need anything else, just ask. I got you!`,
            `Glad I could help! ✨ Hit me up if you have more questions about Archilles!`,
        ];
        return { response: thanks[Math.floor(Math.random() * thanks.length)], showEmailButton: false, enterComposeMode: false, isEmailReady: false };
    }

    // GOODBYE
    if (lower.match(/(bye|goodbye|see you|later|gtg|gotta go)/)) {
        return {
            response: `Catch you later! 👋 If you ever need to reach Archilles or learn more about him, I'm always here. Take care! ✌️`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // CERTIFICATES
    if (lower.match(/(certificate|certification|award|achievement|seminar|training)/)) {
        return {
            response: `Archilles has some solid certs! 📜\n\n🏆 DICT Startup 102 Workshop (2022)\n🏆 12th PSITS Regional Convention - InnoTech Gala (2024)\n🏆 Cybersecurity, Data Privacy & Cisco Networking - Hackathon 2024\n\nHe's always leveling up and learning new things! 🚀`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // VIBE / PERSONALITY
    if (lower.match(/(vibe|personality|like|type of person|attitude)/)) {
        return {
            response: `Archilles? He's the definition of a vibe coder! 😎 Chill, laid-back, but super focused when it comes to building stuff. He believes in writing clean code while keeping the good vibes. No stress, just code and coffee! ☕💻`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // PORTFOLIO / WEBSITE / PROJECTS
    if (lower.match(/(portfolio|website|project|work sample|built|made)/)) {
        return {
            response: `You're literally on his portfolio right now! 😄 This whole website was built by Archilles using Next.js and the T3 Stack. He's worked on various projects including SEO tools, dashboards, and web apps. The guy loves building things that look clean and work smooth! ✨`,
            showEmailButton: false,
            enterComposeMode: false,
            isEmailReady: false
        };
    }

    // RANDOM / UNCLEAR - give helpful response
    const fallbacks = [
        `Hmm, I'm not sure what you mean, but I can tell you about Archilles! 🤔 Try asking about his skills, experience, education, or how to contact him!`,
        `Interesting question! 😅 I'm best at answering stuff about Archilles - like his tech stack, work experience, or how to reach him. What would you like to know?`,
        `I didn't quite catch that, pero no worries! 🙌 Ask me about Archilles' skills, background, or say "I want to email him" if you wanna connect!`,
    ];

    return {
        response: fallbacks[Math.floor(Math.random() * fallbacks.length)],
        showEmailButton: false,
        enterComposeMode: false,
        isEmailReady: false
    };
}

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: `Hey! 👋 I'm Archilles' AI assistant. He's a vibe coder from GenSan - chill but gets stuff done! Ask me anything about him, or if you wanna reach out, just say "I want to email him"! 🚀`, showEmailButton: false }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isComposeMode, setIsComposeMode] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendEmail = async () => {
        setIsSendingEmail(true);

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: "Portfolio Visitor (via AI)",
                    from_email: "ai-assistant@portfolio.com",
                    message: emailMessage || "Someone wants to connect with you via the AI Assistant on your portfolio!",
                    subject: "🤖 New Message via AI Assistant - Portfolio"
                },
                EMAILJS_PUBLIC_KEY
            );

            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Done! ✅ Your message is on its way to Archilles! He's pretty responsive so expect a reply soon. Anything else I can help you with? 😊`,
                showEmailButton: false
            }]);

            setEmailMessage('');
            setIsComposeMode(false);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Oops! 😅 Something went wrong while sending. Try again or use the contact form below instead. Sorry about that!`,
                showEmailButton: true
            }]);
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        // Random delay for more natural feel
        const delay = 800 + Math.random() * 700;

        setTimeout(() => {
            const { response, showEmailButton, enterComposeMode, isEmailReady } = generateResponse(userMessage, isComposeMode);

            if (enterComposeMode) {
                setIsComposeMode(true);
            }

            if (isComposeMode && !enterComposeMode) {
                setEmailMessage(userMessage);
                setIsComposeMode(false);
            }

            setMessages(prev => [...prev, {
                role: 'ai',
                content: response,
                showEmailButton,
                isEmailCompose: isEmailReady
            }]);
            setIsTyping(false);
        }, delay);
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
                                    <FaRobot />
                                </div>
                                <div>
                                    <h4 className={styles.aiName}>AI'k Assistant</h4>
                                    <span className={styles.aiStatus}>
                                        <span className={styles.statusDot}></span>
                                        {isComposeMode ? '✍️ Writing...' : '🟢 Online'}
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
                                    {(msg.showEmailButton || msg.isEmailCompose) && msg.role === 'ai' && (
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
                                                <><FaEnvelope /> {msg.isEmailCompose ? '📨 Send to Archilles' : '✉️ Email Archilles'}</>
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
                                placeholder={isComposeMode ? "Type your message for Archilles..." : "Ask me anything..."}
                                className={styles.input}
                            />
                            <button
                                className={styles.sendButton}
                                onClick={handleSend}
                                disabled={!input.trim()}
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
