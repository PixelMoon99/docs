import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AccountDetailsPage } from '../Dashboard/AccountDetailsPage';
import MobileBottomNav from '../Home/MobileBottomNav';
import styles from './MobileAccount.module.css';

const MobileAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setShowAccountDetails(true);
  };

  const handleBackToAccount = () => {
    setShowAccountDetails(false);
  };

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      logout();
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const menuItems = [
    { icon: '👛', label: 'My Wallet', path: '/user-dashboard/wallet' },
    
    { icon: '🚪', label: 'Logout', action: 'logout', color: '#ef4444' }
  ];

  // If showing account details, render the AccountDetailsPage component
  if (showAccountDetails) {
    return (
      <div className={styles.accountDetailsWrapper}>
        <div className={styles.mobileHeader}>
          <button 
            className={styles.backButton}
            onClick={handleBackToAccount}
          >
            ‹
          </button>
          <h1>Edit Profile</h1>
        </div>
        <AccountDetailsPage onBack={handleBackToAccount} />
      </div>
    );
  }

  // Default account view
  return (
    <div className={styles.accountPage}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/home')}
        >
          ‹
        </button>
        <h1>My Account</h1>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            <span>{profileData.name.charAt(0).toUpperCase()}</span>
          </div>
          <h2>{profileData.name}</h2>
          <p>{profileData.email}</p>
          <span className={styles.verifiedBadge}>✓ Verified Account Holder</span>
          <button 
            className={styles.editButton}
            onClick={handleEditProfile}
          >
            EDIT PROFILE
          </button>
        </div>
      </div>

      <div className={styles.menuSection}>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={styles.menuItem}
            onClick={() => handleMenuItemClick(item)}
          >
            <div className={styles.menuIcon} style={{ color: item.color }}>
              {item.icon}
            </div>
            <span className={styles.menuLabel}>{item.label}</span>
            <span className={styles.menuArrow}>›</span>
          </div>
        ))}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileAccount;