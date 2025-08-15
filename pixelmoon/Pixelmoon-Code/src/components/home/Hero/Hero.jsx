import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Hero.module.css';
import { bannerAPI, handleApiError } from '../../utils/api';

const Hero = () => {
  const { theme } = useTheme(); // Add theme context
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  useEffect(() => {
  const fetchBanners = async () => {
    try {
      const data = await bannerAPI.getPublicBanners();
      setBanners(data);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError(handleApiError(err, 'Failed to load banners'));
      // Keep your existing fallback banners
      setBanners([
        {
          _id: '1',
          imageUrl: 'https://digitaltopup.in/banners/1745071699852--photo-output.jpeg',
          altText: 'Mobile Legends Banner',
          link: '/games/mobile-legends',
          title: 'Mobile Legends',
          category: 'games'
        },
        {
          _id: '2',
          imageUrl: 'https://digitaltopup.in/banners/1742994015836--Blog_MLBB_1.jpg',
          altText: 'Free Fire Banner',
          link: '/games/free-fire',
          title: 'Free Fire',
          category: 'games'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  fetchBanners();
}, []);



   useEffect(() => {
    if (banners.length <= 2) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide >= banners.length - 1 ? 0 : prevSlide + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide >= banners.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === 0 ? banners.length - 1 : prevSlide - 1));
  };

  const handleBannerClick = (link) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = link;
    }
  };

  // Get banner position classes for 3D carousel
  const getBannerPosition = (index) => {
    const diff = index - currentSlide;
    if (diff === 0) return styles.center;
    if (diff === 1 || diff === -(banners.length - 1)) return styles.right;
    if (diff === -1 || diff === banners.length - 1) return styles.left;
    return styles.hidden;
  };


   if (loading) {
    return (
      <div className={`${styles.heroContainer} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading banners...</p>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className={`${styles.heroContainer} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <div className={styles.emptyState}>
          <h3>No banners available</h3>
          <p>Check back soon for exciting offers!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.heroContainer} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <div className={styles.carousel3D}>
        {banners.map((banner, index) => (
          <div 
            key={`banner-${banner._id}`} 
            className={`${styles.gameCard3D} ${getBannerPosition(index)}`}
            onClick={() => handleBannerClick(banner.link)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBannerClick(banner.link);
              }
            }}
            aria-label={`${banner.title || banner.altText} - Click to view`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.altText}
              className={styles.gameImage}
              loading={index < 3 ? 'eager' : 'lazy'}
            />
            {banner.title && (
              <div className={styles.bannerOverlay}>
                <h4 className={styles.bannerTitle}>{banner.title}</h4>
                <span className={styles.bannerCategory}>{banner.category}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button 
            className={`${styles.carouselControl} ${styles.prevControl}`} 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button 
            className={`${styles.carouselControl} ${styles.nextControl}`} 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>

          <div className={styles.carouselIndicators}>
            {banners.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {error && (
        <div className={styles.errorNotice}>
          <p>Using fallback banners due to connection issue</p>
        </div>
      )}
    </div>
  );
};

export default Hero;