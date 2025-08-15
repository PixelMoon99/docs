import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './MobileDrawer.module.css';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '👤', label: 'My Account', path: '/account' },
    { icon: '🎁', label: 'Blogs', path: '/blogs' },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
    { icon: '🔒', label: 'Privacy & Policy', path: '/privacy' },
    { icon: '📋', label: 'Terms & Conditions', path: '/terms' },
    { icon: '💰', label: 'Refund Policy', path: '/refund' },
  ];

  const bottomActions = [
    { icon: '💸', label: 'Add Money', path: '/user-dashboard/wallet' },
    { icon: '📊', label: 'Reports', path: '/reports' },
  ];

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''} ${theme === 'dark' ? styles.dark : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Welcome Back</h2>
          <p>{user?.name || 'Guest'}</p>
          <div className={styles.profileImage}>
            <div className={styles.avatarInitial}>
              {user?.name?.charAt(0)?.toUpperCase() || 'G'}
            </div>
          </div>
        </div>

        <div className={styles.drawerContent}>
          {/* Theme Toggle */}
          <div className={styles.themeToggle} onClick={toggleTheme}>
            <span className={styles.themeIcon}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
            <span className={styles.themeLabel}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>

          <div className={styles.menuList}>
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={styles.menuItem}
                onClick={onClose}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
                <span className={styles.menuArrow}>›</span>
              </Link>
            ))}
          </div>

          <div className={styles.bottomActions}>
            {bottomActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={styles.actionCircle}
                onClick={onClose}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </Link>
            ))}
          </div>

          <Link to="/user-dashboard" className={styles.dashboardButton} onClick={onClose}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;