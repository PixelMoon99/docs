import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    sponsorCode: '',
  });
  const [selectedCountryCode, setSelectedCountryCode] = useState('+00'); // Default to Indonesia
  const { register, error, isLoading } = useAuth();
  const navigate = useNavigate();

  // Country codes for your supported regions
// Replace the existing countryCodes array with this:
const countryCodes = [
  { code: '+00', country: 'International', flag: '🌍', format: 'xxxxxxxxxx' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', format: '8xx-xxxx-xxxx' },
];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine country code with phone number
    const fullPhoneNumber = selectedCountryCode.replace('+', '') + formData.phone;
    
    const registrationData = {
      ...formData,
      phone: fullPhoneNumber, // Send the complete phone number
    };

    const success = await register(registrationData);
    if (success) {
      navigate('/');
    }
  };

  // Get the selected country info for display
  const selectedCountry = countryCodes.find(c => c.code === selectedCountryCode);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Create Account</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.formInput}
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formInput}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Phone Number with Country Code */}
          <div className={styles.formGroup}>
            <div className={styles.phoneContainer}>
              <select
                value={selectedCountryCode}
                onChange={handleCountryCodeChange}
                className={styles.countrySelect}
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              
              <input
                type="tel"
                id="phone"
                name="phone"
                className={styles.phoneInput}
                placeholder={`Phone number (${selectedCountry?.format || 'xxxxxxxxxx'})`}
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{8,12}"
                title="Enter phone number without country code"
              />
            </div>
            <div className={styles.phoneHint}>
              Format: {selectedCountry?.code} {selectedCountry?.format}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              id="sponsorCode"
              name="sponsorCode"
              className={styles.formInput}
              placeholder="Enter sponsor code (Optional)"
              value={formData.sponsorCode}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.formInput}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Register now'}
          </button>
        </form>
        
        <div className={styles.authLinks}>
          <div className={styles.authLinkItem}>
            <span>Already a Customer?</span>
            <Link to="/login" className={styles.authLink}>Click here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;