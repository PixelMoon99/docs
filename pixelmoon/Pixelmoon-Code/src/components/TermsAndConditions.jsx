// src/components/Policies/TermsAndConditions.j
import React from 'react';
import styles from './Policies.module.css';

const TermsAndConditions = () => (
  <div className={`container ${styles.policyContainer}`}>    
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-primary mb-4">Terms and Conditions</h2>
        <ol className="ps-3">
          <li className="mb-2"><strong>Acceptance of Terms:</strong> By accessing or using PixelMoonstore's website, you agree to be bound by these Terms and Conditions.</li>
          <li className="mb-2"><strong>User Conduct:</strong> You agree not to engage in any activity that disrupts or interferes with the functioning of the website or its services.</li>
          <li className="mb-2"><strong>Intellectual Property:</strong> All content and materials available on the website are protected by intellectual property laws.</li>
          <li className="mb-2"><strong>Limitation of Liability:</strong> PixelMoonstore shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the website.</li>
          <li className="mb-2"><strong>Indemnification:</strong> You agree to indemnify and hold PixelMoonstore harmless from any claims, losses, liabilities, damages, costs, and expenses arising out of or relating to your use of the website.</li>
          <li className="mb-2"><strong>Governing Law:</strong> These Terms and Conditions shall be governed by and construed in accordance with the laws of India.</li>
        </ol>
      </div>
    </div>
  </div>
);

export default TermsAndConditions;