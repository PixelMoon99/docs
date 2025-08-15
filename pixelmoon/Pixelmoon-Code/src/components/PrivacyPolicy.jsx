// src/components/Policies/PrivacyPolicy.jsx
import React from 'react';
import styles from './Policies.module.css';

const PrivacyPolicy = () => (
  <div className={`container ${styles.policyContainer}`}>  
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title text-primary mb-3">Privacy Policy</h2>
        <ol className="ps-3">
          <li className="mb-2"><strong>Information We Collect:</strong> We collect personal information such as your name, email address, and payment details when you place an order or sign up for our newsletter.</li>
          <li className="mb-2"><strong>How We Use Your Information:</strong> We use your information to process your orders, communicate with you, and improve our services.</li>
          <li className="mb-2"><strong>Cookies:</strong> We use cookies to personalize content, analyze our traffic, and improve your browsing experience.</li>
          <li className="mb-2"><strong>Data Security:</strong> We take precautions to protect your information both online and offline.</li>
          <li className="mb-2"><strong>Changes to This Privacy Policy:</strong> We reserve the right to update or change our Privacy Policy at any time.</li>
        </ol>
      </div>
    </div>
  </div>

);

export default PrivacyPolicy;