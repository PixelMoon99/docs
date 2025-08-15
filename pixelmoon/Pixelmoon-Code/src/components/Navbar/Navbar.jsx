import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const { theme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (expanded && !event.target.closest('.navbar-container')) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [expanded]);

  // Fetch wallet balance
  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletBalance();
    }
  }, [isAuthenticated]);

 const fetchWalletBalance = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet/balance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      setWalletBalance(parseFloat(data.data.balanceRupees) || 0);
    }
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
  }
};

  return (
  <nav className={`${styles.navbar} ${theme === 'dark' ? styles.dark : ''}`}>
    <div className={`${styles.container} navbar-container`}>
      <Link to="/home" className={styles.logoContainer}>
        <video 
          className={styles.logoVideo}
          autoPlay 
          muted 
          loop 
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        >
          <source src="videos/pixel.mp4" type="video/mp4" />
        </video>
      </Link>

      {/* Mobile Controls Container */}
      <div className={styles.mobileControls}>
        <div className={styles.searchIcon} onClick={() => { setShowSearchOverlay(true); setExpanded(false); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>

        <button 
          className={styles.toggleButton} 
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        >
          <span className={styles.toggleBar}></span>
          <span className={styles.toggleBar}></span>
          <span className={styles.toggleBar}></span>
        </button>
      </div>

      <div className={`${styles.navLinks} ${expanded ? styles.expanded : ''}`}>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link to="/games" className={styles.navLink} onClick={() => setExpanded(false)}>Games</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/blogs" className={styles.navLink} onClick={() => setExpanded(false)}>Blogs</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/about" className={styles.navLink} onClick={() => setExpanded(false)}>About</Link>
          </li>
          {isAuthenticated && (
            <li className={styles.navItem}>
              <Link to="/user-dashboard" className={styles.navLink} onClick={() => setExpanded(false)}>Dashboard</Link>
            </li>
          )}
        </ul>

        <div className={styles.navRight}>
          {/* Search icon for desktop only - remove from here on mobile */}
          <div className={`${styles.searchIcon} ${styles.desktopOnly}`} onClick={() => setShowSearchOverlay(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
          
          <div className={styles.themeToggleWrapper}>
            <ThemeToggle />
          </div>
          
          {isAuthenticated ? (
            <div className={styles.userActions}>
              <Link to="/user-dashboard/wallet" className={styles.walletButton} onClick={() => setExpanded(false)}>
                <div className={styles.walletIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm2 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 3 7zm0 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 3 9z"/>
                  </svg>
                </div>
                <span className={styles.walletAmount}>₹{walletBalance}</span>
              </Link>

              <Link to="/user-dashboard/my-account" className={styles.profileButton} onClick={() => setExpanded(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
              </Link>
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton} onClick={() => setExpanded(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
    
    {/* Mobile Backdrop Overlay */}
    {expanded && <div className={styles.mobileOverlay} onClick={() => setExpanded(false)} />}
    
    <SearchOverlay 
      isOpen={showSearchOverlay}
      onClose={() => setShowSearchOverlay(false)}
    />
  </nav>
);
};

export default Navbar;