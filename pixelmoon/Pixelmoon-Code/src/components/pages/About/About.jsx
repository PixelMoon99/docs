import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './AboutUs.module.css';
import { FaGamepad, FaHandshake, FaShoppingCart, FaUsers, FaStar, FaGift } from 'react-icons/fa';

const AboutUs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${styles.aboutContainer} ${theme === 'dark' ? styles.dark : ''}`}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} py-5 mb-5`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className={`${styles.heroTitle} display-4 fw-bold mb-4`}>
                Welcome to <span className={styles.brandText}>PixelMoonStore</span>
              </h1>
              <p className={`${styles.heroSubtitle} lead mb-4`}>
                Your ultimate destination for gaming deals, digital vouchers, and exclusive affiliate offers. 
                Join our community-driven marketplace where gamers and deal hunters unite.
              </p>
              <div className={`${styles.heroStats} d-flex gap-4`}>
                <div className="text-center">
                  <h3 className={styles.statNumber}>10K+</h3>
                  <small className={styles.statLabel}>Active Users</small>
                </div>
                <div className="text-center">
                  <h3 className={styles.statNumber}>50K+</h3>
                  <small className={styles.statLabel}>Deals Posted</small>
                </div>
                <div className="text-center">
                  <h3 className={styles.statNumber}>99%</h3>
                  <small className={styles.statLabel}>Satisfaction</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={`${styles.heroImage} text-center`}>
                <div className={`${styles.heroImagePlaceholder} rounded-3 d-flex align-items-center justify-content-center`}>
                  <FaGamepad size={120} className={styles.heroIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="container mb-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2 className={`${styles.sectionTitle} display-5 fw-bold mb-3`}>What We Do</h2>
            <p className={`${styles.sectionSubtitle} lead mb-5`}>
              PixelMoonStore bridges the gap between gamers, deal hunters, and digital commerce
            </p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className={`${styles.serviceCard} card h-100 border-0`}>
              <div className="card-body text-center p-4">
                <div className={`${styles.serviceIcon} mb-3`}>
                  <FaHandshake size={50} className={styles.iconPrimary} />
                </div>
                <h4 className={`${styles.cardTitle} mb-3`}>Affiliate Deals Platform</h4>
                <p className={`${styles.cardText}`}>
                  Users can post and discover amazing affiliate deals across various categories. 
                  Earn commissions while helping others save money on their favorite products.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`${styles.serviceCard} card h-100 border-0`}>
              <div className="card-body text-center p-4">
                <div className={`${styles.serviceIcon} mb-3`}>
                  <FaGamepad size={50} className={styles.iconSuccess} />
                </div>
                <h4 className={`${styles.cardTitle} mb-3`}>Gaming Vouchers</h4>
                <p className={`${styles.cardText}`}>
                  Extensive collection of gaming vouchers for popular platforms including Steam, 
                  PlayStation, Xbox, and more. Get instant digital delivery at competitive prices.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`${styles.serviceCard} card h-100 border-0`}>
              <div className="card-body text-center p-4">
                <div className={`${styles.serviceIcon} mb-3`}>
                  <FaGift size={50} className={styles.iconWarning} />
                </div>
                <h4 className={`${styles.cardTitle} mb-3`}>Digital Game Cards</h4>
                <p className={`${styles.cardText}`}>
                  Premium selection of digital game cards and gift cards. Perfect for gifting 
                  or expanding your own gaming library with the latest titles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className={`${styles.missionSection} py-5 mb-5`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className={`${styles.missionImage} text-center mb-4 mb-lg-0`}>
                <div className={`${styles.missionImagePlaceholder} rounded-3 d-flex align-items-center justify-content-center`}>
                  <FaUsers size={100} className={styles.missionIcon} />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className={`${styles.missionTitle} display-5 fw-bold mb-4`}>Our Mission</h2>
              <p className={`${styles.missionText} lead mb-4`}>
                To create a thriving community-driven marketplace where gamers and deal enthusiasts 
                can discover, share, and benefit from the best digital deals available.
              </p>
              <div className={`${styles.missionPoints}`}>
                <div className="d-flex align-items-start mb-3">
                  <FaStar className={`${styles.pointIcon} me-3 mt-1`} />
                  <div>
                    <h5 className={`${styles.pointTitle} mb-1`}>Community First</h5>
                    <p className={`${styles.pointText} mb-0`}>Building a trusted community where every member benefits</p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <FaShoppingCart className={`${styles.pointIcon} me-3 mt-1`} />
                  <div>
                    <h5 className={`${styles.pointTitle} mb-1`}>Best Deals</h5>
                    <p className={`${styles.pointText} mb-0`}>Curating the most attractive deals and offers for our users</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <FaGamepad className={`${styles.pointIcon} me-3 mt-1`} />
                  <div>
                    <h5 className={`${styles.pointTitle} mb-1`}>Gaming Focus</h5>
                    <p className={`${styles.pointText} mb-0`}>Specialized platform designed with gamers in mind</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mb-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2 className={`${styles.sectionTitle} display-5 fw-bold mb-3`}>Why Choose PixelMoonStore?</h2>
            <p className={`${styles.sectionSubtitle} lead`}>
              We're more than just a marketplace - we're your gaming and deals companion
            </p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className={`${styles.featureCard} text-center p-4`}>
              <div className={`${styles.featureIcon} mb-3`}>
                <div className={`${styles.featureIconCircle} rounded-circle d-inline-flex align-items-center justify-content-center`}>
                  <FaShoppingCart size={24} />
                </div>
              </div>
              <h5 className={`${styles.featureTitle} fw-bold mb-2`}>Instant Delivery</h5>
              <p className={`${styles.featureText} small`}>Get your digital products delivered instantly to your email</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className={`${styles.featureCard} text-center p-4`}>
              <div className={`${styles.featureIcon} mb-3`}>
                <div className={`${styles.featureIconCircle} rounded-circle d-inline-flex align-items-center justify-content-center`}>
                  <FaStar size={24} />
                </div>
              </div>
              <h5 className={`${styles.featureTitle} fw-bold mb-2`}>Verified Deals</h5>
              <p className={`${styles.featureText} small`}>All deals are verified by our community and moderators</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className={`${styles.featureCard} text-center p-4`}>
              <div className={`${styles.featureIcon} mb-3`}>
                <div className={`${styles.featureIconCircle} rounded-circle d-inline-flex align-items-center justify-content-center`}>
                  <FaUsers size={24} />
                </div>
              </div>
              <h5 className={`${styles.featureTitle} fw-bold mb-2`}>Community Support</h5>
              <p className={`${styles.featureText} small`}>Active community support and 24/7 customer service</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className={`${styles.featureCard} text-center p-4`}>
              <div className={`${styles.featureIcon} mb-3`}>
                <div className={`${styles.featureIconCircle} rounded-circle d-inline-flex align-items-center justify-content-center`}>
                  <FaHandshake size={24} />
                </div>
              </div>
              <h5 className={`${styles.featureTitle} fw-bold mb-2`}>Earn Commissions</h5>
              <p className={`${styles.featureText} small`}>Post deals and earn commissions on successful referrals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`${styles.ctaSection} py-5`}>
        <div className="container text-center">
          <h2 className={`${styles.ctaTitle} display-5 fw-bold mb-3`}>Ready to Start Your Journey?</h2>
          <p className={`${styles.ctaText} lead mb-4`}>
            Join thousands of gamers and deal hunters who trust PixelMoonStore for their digital needs
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className={`${styles.ctaButton} ${styles.ctaPrimary} btn btn-lg px-4`}>
              <FaUsers className="me-2" />
              Join Community
            </button>
            <button className={`${styles.ctaButton} ${styles.ctaSecondary} btn btn-lg px-4`}>
              <FaGamepad className="me-2" />
              Browse Deals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;