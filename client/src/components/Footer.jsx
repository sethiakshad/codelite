import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--bg-card)', padding: '4rem 0 2rem', borderTop: '1px solid var(--glass-border)' }}>
            <div className="container">
                <div className="grid-3" style={{ marginBottom: '3rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Aaahar Bandhu.</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Helping institutions and events manage surplus food responsibly.</p>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Links</h4>
                        <ul style={{ color: 'var(--text-muted)' }}>
                            <li className="mb-2"><Link to="/">Home</Link></li>
                            <li className="mb-2"><a href="/#how-it-works">How It Works</a></li>
                            <li className="mb-2"><a href="/#impact">Impact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Credits</h4>
                        <p style={{ color: 'var(--text-muted)' }}>Developed for Hackathon 2026. <br /> Sustainability Track.</p>
                    </div>
                </div>
                <div className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                    &copy; 2026 Aaahar Bandhu. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
