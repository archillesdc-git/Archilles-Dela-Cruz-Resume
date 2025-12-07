"use client";

import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="py-8 bg-[var(--bg-color)] border-t border-[var(--glass-border)] text-center">
            <div className="container">
                <p className="text-sm text-[var(--text-muted)]">
                    &copy; {new Date().getFullYear()} Archilles D. Dela Cruz. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
