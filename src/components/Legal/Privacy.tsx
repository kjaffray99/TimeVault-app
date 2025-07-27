/**
 * Legal Components
 * Privacy Policy and Terms of Service
 */

import React from 'react';
import { Shield, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Shield size={48} className="header-icon" />
        <div className="header-content">
          <h1>Privacy Policy</h1>
          <p>How we protect and handle your data</p>
        </div>
      </div>
      <div className="legal-content">
        <p>Privacy policy content will be implemented based on final data handling requirements.</p>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <FileText size={48} className="header-icon" />
        <div className="header-content">
          <h1>Terms of Service</h1>
          <p>Terms and conditions for using TimeVault</p>
        </div>
      </div>
      <div className="legal-content">
        <p>Terms of service content will be implemented based on final legal requirements.</p>
      </div>
    </div>
  );
};
