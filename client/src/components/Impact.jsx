import React from 'react';

const Impact = () => {
    return (
        <section id="impact" className="py-20" style={{ background: 'linear-gradient(to top, rgba(16,185,129,0.1), transparent)' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <h2 className="section-title">Why This Matters</h2>
                    <ul style={{
                        marginTop: '2rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2rem',
                        textAlign: 'left'
                    }}>
                        {[
                            "Prevents food waste before it occurs",
                            "Enables responsible redistribution",
                            "Supports social welfare",
                            "Reduces environmental impact"
                        ].map((item, idx) => (
                            <li key={idx} className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'var(--primary)', marginRight: '1rem', fontSize: '1.5rem' }}>✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Impact;
