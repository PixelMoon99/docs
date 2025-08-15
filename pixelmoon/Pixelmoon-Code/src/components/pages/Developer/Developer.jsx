import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope, FaCode, FaRocket } from 'react-icons/fa';
import styles from './Developer.module.css';
import { useTheme } from '../../context/ThemeContext';
const Developer = () => {
    const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in discussing a web project with you.");
    window.open(`https://wa.me/918855824791?text=${message}`, '_blank');
  };

  return (
    <div className={`${styles.developerPage} ${theme === 'dark' ? styles.dark : styles.light}`}>
    <div className={styles.developerPage}>
      {/* Subtle Background Effects */}
      <div className={styles.backgroundGrid}></div>
      
      <div 
        className={styles.mouseGlow} 
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150
        }}
      ></div>

      <div className="container">
        <div className={styles.heroSection}>
          {/* Clean Title */}
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              <span className={styles.meetText}>Meet Our</span>
              <span className={styles.developerText}>Developer</span>
            </h1>
          </div>

          {/* Main Card */}
          <div className={styles.developerCard}>
            {/* Professional Avatar */}
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <span className={styles.avatarText}>R</span>
              </div>
              <div className={styles.nameSection}>
                <h2 className={styles.name}>Rushikesh Palav</h2>
                <div className={styles.titleBadge}>
                  <FaCode className={styles.badgeIcon} />
                  <span>MERN Stack Developer</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.description}>
              <div className={styles.quote}>
                "Crafting digital experiences with precision and passion"
              </div>
              <p className={styles.bio}>
                Full-stack developer specializing in the MERN ecosystem. I build scalable, 
                modern web applications with a focus on clean code, optimal performance, 
                and exceptional user experiences.
              </p>
            </div>

            {/* Social Links */}
            <div className={styles.socialContainer}>
              <a 
                href="https://www.linkedin.com/in/rushi-palav-88ab721b8/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.linkedin}`}
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
              
              <a 
                href="https://github.com/DecroXX69" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.github}`}
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
              
              <button 
                onClick={handleWhatsAppClick}
                className={`${styles.socialLink} ${styles.whatsapp}`}
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </button>
              
              <a 
                href="mailto:rushikeshpalav23@gmail.com"
                className={`${styles.socialLink} ${styles.email}`}
              >
                <FaEnvelope />
                <span>Email</span>
              </a>
            </div>

            {/* Skills */}
            <div className={styles.skillsSection}>
              <h3 className={styles.skillsTitle}>Expertise</h3>
              <div className={styles.skillsGrid}>
                {['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript', 'HTML/CSS', 'Git', 'REST APIs'].map((skill, index) => (
                  <div key={skill} className={styles.skillTag} style={{ animationDelay: `${index * 0.1}s` }}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
              <h3 className={styles.ctaTitle}>
                <FaRocket className={styles.rocketIcon} />
                Ready to Build Something Amazing?
              </h3>
              <p className={styles.ctaSubtitle}>
                Let's discuss your project and bring your vision to life
              </p>
              <button onClick={handleWhatsAppClick} className={styles.ctaButton}>
                Start a Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Developer;