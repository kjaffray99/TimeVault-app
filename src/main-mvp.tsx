import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-MVP';
import './App-MVP.css';

// Performance monitoring
if (import.meta.env.PROD) {
    // Initialize performance monitoring in production
    console.log('TimeVault MVP loaded successfully');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
