// src/components/NotificationBar/NotificationBar.jsx
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Info, AlertTriangle, CheckCircle, XCircle, Tag } from 'lucide-react';
import styles from './NotificationBar.module.css';

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifications.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % notifications.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [notifications.length, isPaused]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/active`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && (data.notifications||[]).length > 0) {
          setNotifications(data.notifications);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    } catch (error) {
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('notificationBarDismissed', Date.now().toString());
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      if (notification.link.startsWith('http')) window.open(notification.link, '_blank');
      else window.location.href = notification.link;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} />;
      case 'success': return <CheckCircle size={16} />;
      case 'error': return <XCircle size={16} />;
      case 'promotion': return <Tag size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'warning': return styles.warning;
      case 'success': return styles.success;
      case 'error': return styles.error;
      case 'promotion': return styles.promotion;
      default: return styles.info;
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];

  return (
    <div 
      className={`${styles.notificationBar} ${getTypeClass(currentNotification.type)}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.icon}>
            {getIcon(currentNotification.type)}
          </div>
          
          <div 
            className={`${styles.message} ${currentNotification.link ? styles.clickable : ''}`}
            onClick={() => handleNotificationClick(currentNotification)}
          >
            <span className={styles.scrollingText}>
              {currentNotification.message}
            </span>
            {currentNotification.link && (
              <ExternalLink size={14} className={styles.linkIcon} />
            )}
          </div>

          {notifications.length > 1 && (
            <div className={styles.indicators}>
              {notifications.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBar;