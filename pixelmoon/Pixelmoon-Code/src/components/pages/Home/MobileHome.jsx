import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import MobileBottomNav from './MobileBottomNav';
import MobileGameCard from './MobileGameCard';
import styles from './MobileHome.module.css';
import { bannerAPI, handleApiError } from '../../utils/api';
import BlogMiniSection from './BlogMiniSection';

const MobileHome = () => {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    fetchGames();
    fetchBanners();
    if (isAuthenticated) {
      fetchWalletBalance();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prev => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const data = await bannerAPI.getPublicBanners();
      setBanners(data);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setBanners([{
        _id: '1',
        imageUrl: 'https://digitaltopup.in/banners/1745071699852--photo-output.jpeg',
        altText: 'Promo Banner'
      }]);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/games?limit=12`);
      const data = await response.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.data.balanceRupees || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const quickActions = [
    { icon: '💸', label: 'Add Money', path: '/user-dashboard/wallet', color: '#4ade80' },
    { icon: '👛', label: 'My Wallet', path: '/user-dashboard/wallet', color: '#f59e0b' },
    { icon: '🛒', label: 'Purchase', path: '/user-dashboard/orders', color: '#3b82f6' },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard', color: '#ef4444' }
  ];

  return (
    <div className={`${styles.mobileHome} ${theme === 'dark' ? styles.dark : ''}`}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.logoText}>PixelMoon</h1>
          <div className={styles.walletInfo}>
            <span className={styles.walletIcon}>💰</span>
            <span className={styles.walletBalance}>₹{walletBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Banner */}
     <div className={styles.bannerContainer}>
  {banners.map((banner, index) => (
    <div 
      key={banner._id}
      className={`${styles.banner} ${index === currentBannerIndex ? styles.active : ''}`}
      onClick={() => banner.link && (window.location.href = banner.link)}
      style={{ cursor: banner.link ? 'pointer' : 'default' }}
    >
      <img src={banner.imageUrl} alt={banner.altText} />
      <div className={styles.bannerOverlay}>
        <h2>{banner.title || 'NEOBEAST UNLEASHED'}</h2>
      </div>
    </div>
  ))}
  
  {banners.length > 1 && (
    <div className={styles.bannerDots}>
      {banners.map((_, index) => (
        <span 
          key={index}
          className={`${styles.dot} ${index === currentBannerIndex ? styles.activeDot : ''}`}
          onClick={() => setCurrentBannerIndex(index)}
        />
      ))}
    </div>
  )}
</div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} className={styles.actionButton}>
              <div className={styles.actionIcon} style={{ backgroundColor: action.color }}>
                <span>{action.icon}</span>
              </div>
              <span className={styles.actionLabel}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
{/* Categories */}
<div className={styles.categoriesSection}>
  <h2 className={styles.sectionTitle}>Categories</h2>
  <div className={styles.categoriesScroll}>
    {[
      { name: 'Mobile Games', icon: '📱', color: '#ef4444' },
      { name: 'Pc Games', icon: '🖥️', color: '#3b82f6' },
      { name: 'Game Vouchers', icon: '🎫', color: '#f59e0b' },
      { name: 'OTT Accounts', icon: '🎬', color: '#8b5cf6' },
      { name: 'Social Media Services', icon: '📲', color: '#10b981' }
    ].map((category, index) => (
      <div 
        key={index} 
        className={`${styles.categoryCard} ${selectedCategory === category.name ? styles.active : ''}`}
        onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
      >
        <div 
          className={styles.categoryIcon} 
          style={{ backgroundColor: category.color }}
        >
          <span>{category.icon}</span>
        </div>
        <span className={styles.categoryName}>{category.name}</span>
      </div>
    ))}
  </div>
</div>

      {/* Popular Games - Horizontal Scroll */}
      <div className={styles.section}>
  <h2 className={styles.sectionTitle}>
    {selectedCategory ? `${selectedCategory}` : 'Popular Games'}
  </h2>
  <div className={styles.horizontalScroll}>
    {games.filter(game => !selectedCategory || game.category === selectedCategory)
          .slice(0, 6)
          .map(game => (
      <MobileGameCard key={game._id} game={game} variant="horizontal" />
    ))}
  </div>
</div>
      {/* All Games - Grid */}
      <div className={styles.section}>
  <h2 className={styles.sectionTitle}>
    {selectedCategory ? `All ${selectedCategory}` : 'All Games'}
  </h2>
  <div className={styles.gamesGrid}>
    {games.filter(game => !selectedCategory || game.category === selectedCategory)
          .map(game => (
      <MobileGameCard key={game._id} game={game} variant="square" />
    ))}
  </div>
</div>

      <div className={styles.blogSection}>
  <h2 className={styles.sectionTitle}>Blogs & More</h2>
  <BlogMiniSection />
  <div className="text-center">
    <Link to="/blogs" className={styles.viewAllButton}>
      View All
      <span>→</span>
    </Link>
  </div>
</div>

{/* Trustpilot Section */}
<div className={styles.trustpilotSection}>
  <h2 className={styles.sectionTitle}>Customer Reviews</h2>
  <div 
    className="trustpilot-widget" 
    data-locale="en-US" 
    data-template-id="56278e9abfbbba0bdcd568bc" 
    data-businessunit-id="685b92af885e63ea1c7b3d54" 
    data-style-height="52px" 
    data-style-width="100%" 
  >
    <a href="https://www.trustpilot.com/review/pixelmoonstore.in" target="_blank" rel="noopener">
      Trustpilot
    </a>
  </div>
</div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileHome;