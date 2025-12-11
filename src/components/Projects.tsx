"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './Projects.module.css';

const projects = [
    {
        title: "Tasking Calendar",
        description: "A productivity tool for organizing, scheduling, and visualizing tasks with deadlines. Features calendar view, multiple themes, cloud sync, notes & folders, and Google authentication.",
        image: "/tasking-calendar.png",
        tech: ["Next.js", "TypeScript", "tRPC", "Tailwind CSS", "Firebase"],
        github: "https://github.com/archillesdc-git/task-calendar",
        demo: null
    },
    {
        title: "SaaS Analytics Dashboard",
        description: "A comprehensive analytics platform for tracking user engagement and retention. Features real-time data visualization and customizable reporting.",
        image: "/project1.png",
        tech: ["Next.js", "TypeScript", "Chart.js", "Supabase"],
        github: "https://github.com",
        demo: "https://example.com"
    },
    {
        title: "E-Commerce Platform",
        description: "Full-featured online store with cart functionality, payment gateway integration, and admin dashboard for inventory management.",
        image: "/project1.png", // Reuse for now
        tech: ["React", "Node.js", "MongoDB", "Stripe"],
        github: "https://github.com",
        demo: "https://example.com"
    },
    {
        title: "Task Management Application",
        description: "Collaborative project management tool with drag-and-drop kanban boards, real-time updates, and team notifications.",
        image: "/project1.png", // Reuse for now
        tech: ["Vue.js", "Firebase", "Tailwind CSS"],
        github: "https://github.com",
        demo: "https://example.com"
    }
];

export default function Projects() {
    return (
        <section id="projects" className={`section ${styles.projectsSection}`}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h2>Featured Projects</h2>
                    <p>A selection of projects that showcase my technical skills and problem-solving abilities.</p>
                </motion.div>

                <div className={styles.grid}>
                    {projects.map((project, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={styles.card}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{project.title}</h3>
                                <p className={styles.description}>{project.description}</p>
                                <div className={styles.techStack}>
                                    {project.tech.map((t) => (
                                        <span key={t} className={styles.techTag}>{t}</span>
                                    ))}
                                </div>
                                <div className={styles.links}>
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm py-2 px-4 flex items-center gap-2">
                                        <FaGithub /> Code
                                    </a>
                                    {project.demo && (
                                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm py-2 px-4 flex items-center gap-2">
                                            <FaExternalLinkAlt /> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
