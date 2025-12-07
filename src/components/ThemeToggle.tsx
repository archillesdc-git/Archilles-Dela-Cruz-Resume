"use client";

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                style={{
                    width: '56px',
                    height: '28px',
                    borderRadius: '9999px',
                    backgroundColor: '#e2e8f0'
                }}
            />
        );
    }

    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            style={{
                position: 'relative',
                width: '56px',
                height: '28px',
                borderRadius: '9999px',
                padding: '2px',
                border: 'none',
                cursor: 'pointer',
                background: isDark
                    ? 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)'
                    : 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
                boxShadow: isDark
                    ? '0 2px 10px rgba(99, 102, 241, 0.3)'
                    : '0 2px 10px rgba(14, 165, 233, 0.3)',
                overflow: 'hidden',
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle Dark Mode"
        >
            {/* Stars (Dark Mode) */}
            <motion.div
                animate={{ opacity: isDark ? 1 : 0 }}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
                <span style={{ position: 'absolute', width: '2px', height: '2px', background: 'white', borderRadius: '50%', top: '6px', left: '8px' }} />
                <span style={{ position: 'absolute', width: '2px', height: '2px', background: 'white', borderRadius: '50%', top: '14px', left: '14px', opacity: 0.7 }} />
                <span style={{ position: 'absolute', width: '1px', height: '1px', background: 'white', borderRadius: '50%', top: '18px', left: '6px', opacity: 0.5 }} />
            </motion.div>

            {/* Clouds (Light Mode) */}
            <motion.div
                animate={{ opacity: isDark ? 0 : 1 }}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
                <span style={{ position: 'absolute', width: '10px', height: '4px', background: 'rgba(255,255,255,0.6)', borderRadius: '9999px', top: '6px', left: '6px' }} />
                <span style={{ position: 'absolute', width: '8px', height: '3px', background: 'rgba(255,255,255,0.4)', borderRadius: '9999px', bottom: '6px', left: '10px' }} />
            </motion.div>

            {/* The Knob */}
            <motion.div
                style={{
                    position: 'relative',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isDark
                        ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
                        : 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                }}
                animate={{ x: isDark ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                <motion.div
                    key={isDark ? 'moon' : 'sun'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDark ? (
                        <FaMoon style={{ fontSize: '12px', color: '#6366f1' }} />
                    ) : (
                        <FaSun style={{ fontSize: '14px', color: '#b45309' }} />
                    )}
                </motion.div>
            </motion.div>
        </motion.button>
    );
}
