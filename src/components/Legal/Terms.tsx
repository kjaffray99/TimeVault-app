/**
 * Terms of Service Component
 */

import React from 'react';
import { FileText } from 'lucide-react';

const Terms: React.FC = () => {
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

export default Terms;
