import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MobileDrawer from './MobileDrawer';
import styles from './MobileBottomNav.module.css';

const MobileBottomNav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const navItems = [
   
    { icon: '👤', label: 'Account', path: '/account' },
    { icon: '🏠', label: 'Home', path: '/home', isActive: true },
    { icon: '📊', label: 'Reports', path: '/reports' },
    { icon: '☰', label: 'More', action: () => setDrawerOpen(true) }
  ];

  return (
    <>
      <nav className={styles.bottomNav}>
        {navItems.map((item, index) => (
          item.action ? (
            <button key={index} className={styles.navItem} onClick={item.action}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ) : (
            <Link
              key={index}
              to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          )
        ))}
      </nav>
      
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default MobileBottomNav;