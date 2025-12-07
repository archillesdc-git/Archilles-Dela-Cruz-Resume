"use client";

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import styles from './Header.module.css';
import classNames from 'classnames';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header className={classNames(styles.header, { [styles.scrolled]: scrolled })}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    ARCHILLES<span className={styles.logoDot}>.</span>
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.desktopNav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={styles.navLink}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <ThemeToggle />
                    <Link href="#contact" className="btn btn-primary">
                        Hire Me
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={styles.navLink}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className={styles.mobileActions}>
                            <ThemeToggle />
                            <Link
                                href="#contact"
                                className="btn btn-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Hire Me
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
