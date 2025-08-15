import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitch, FaInstagram, FaLinkedin, FaYoutube, FaDiscord, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiQuora } from 'react-icons/si';
import { ThemeContext } from '../context/ThemeContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <footer className={`${styles.footer} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className="container">
        <div className="row">
          <div className={`col-md-4 ${styles.footerColumn}`}>
            <h4>About Us</h4>
            <p>
              Pixelmoon is your trusted platform for instant digital top-ups for your 
              favorite games, gift cards, and subscriptions with secure payment options 
              and 24/7 customer support.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://goo.su/TSZ1vD" aria-label="Facebook" className={styles.socialIcon}>
                <FaFacebook />
              </a>
              <a href="https://twitch.tv/death_by_pixel" aria-label="Twitch" className={styles.socialIcon}>
                <FaTwitch />
              </a>
              <a href="https://rb.gy/sxo2f9" aria-label="Instagram" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="https://wa.link/oskfd2" aria-label="Whatsapp" className={styles.socialIcon}>
                <FaWhatsapp />
              </a>
              <a href="http://www.youtube.com/@PixelMoon-v9p" aria-label="YouTube" className={styles.socialIcon}>
                <FaYoutube />
              </a>
              <a href="https://discord.gg/vruwvU8Z" aria-label="Discord" className={styles.socialIcon}>
                <FaDiscord />
              </a>
              <a href="https://x.com/PixelMoonStores?t=UmMMSrAoFhIh1pV31VoBjQ&s=08" aria-label="Twitter/X" className={styles.socialIcon}>
                <FaXTwitter />
              </a>
              <a href="https://www.quora.com/profile/Pixel-Moon?ch=3&oid=3034228526&share=b6744125&srid=5nklmE&target_type=user" aria-label="Quora" className={styles.socialIcon}>
                <SiQuora />
              </a>
            </div>
            <div className={styles.trustpilot}>
              <a href="https://www.trustpilot.com/review/pixelmoonstore.in" target="_blank" rel="noopener noreferrer" className={styles.trustpilotLink}>
                <img src="/trustpilot.png" alt="Trustpilot" style={{height:'24px'}} />
                <span className="ms-2">Reviewed on Trustpilot</span>
              </a>
            </div>
          </div>
          
          <div className={`col-md-4 ${styles.footerColumn} ${styles.linksSection}`}>
            <div className="row">
              <div className="col-6">
                <h4>Quick Links</h4>
                <ul className={styles.footerLinks}>
                  <li><Link to="/home">Home</Link></li>
                  <li><Link to="/games">Games</Link></li>
                  <li><Link to="/blogs">Blogs</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/developer" className={styles.highlightLink}>Developer Page</Link></li>
                </ul>
              </div>
              <div className="col-6">
                <h4>Popular Games</h4>
                <ul className={styles.footerLinks}>
                  <li><Link to="/games/mobile-legends">Mobile Legends</Link></li>
                  <li><Link to="/games/pubg">PUBG Mobile</Link></li>
                  <li><Link to="/games/free-fire">Free Fire</Link></li>
                  <li><Link to="/games/call-of-duty">Call of Duty Mobile</Link></li>
                  <li><Link to="/games/valorant">Valorant</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={`col-md-4 ${styles.footerColumn}`}>
            <h4>Contact Us</h4>
            <ul className={styles.contactInfo}>
              <li>
                <a href="mailto:support@pixelmoonstore.in" className={styles.emailLink}>
                  Email: support@pixelmoonstore.in
                </a>
              </li>
              <li>Working Hours: 24/7 Support</li>
            </ul>
            
            <div className={styles.paymentMethods}>
              <h5>Payment Methods</h5>
              <div className={styles.paymentIcons}>
                <span className={styles.paymentIcon}>Wallet</span>
                <span className={styles.paymentIcon}>Phonepe</span>
                <span className={styles.paymentIcon}>UPI</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} PixelMoon. All Rights Reserved.</p>
          <div className={styles.footerBottomLinks}>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/refund">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;