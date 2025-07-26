import React from 'react';
import './App.css';
import Calculator from './components/Calculator/Calculator-MVP';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
    const { trackPageView } = useAnalytics();

    React.useEffect(() => {
        trackPageView('calculator_page');
    }, [trackPageView]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>TimeVault</h1>
                <p>Transform digital assets into precious metals and personal time</p>
            </header>

            <main>
                <Calculator />
            </main>

            <footer className="App-footer">
                <div className="footer-content">
                    <p>&copy; 2024 TimeVault. Transforming digital wealth into tangible value.</p>
                    <div className="footer-links">
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
