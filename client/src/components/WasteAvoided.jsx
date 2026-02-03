import React from 'react';

const WasteAvoided = () => {
    return (
        <section className="py-20" style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.05), transparent)',
                pointerEvents: 'none'
            }}></div>

            <div className="container text-center">
                <div style={{
                    background: 'var(--primary-dark)',
                    display: 'inline-block',
                    padding: '0.25rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    color: '#fff'
                }}>
                    Impact Prevention
                </div>
                <h2 className="section-title">Potential Waste Avoided</h2>
                <p className="section-subtitle">Insights to help responsible planning.</p>

                <div className="flex justify-center gap-8 flex-wrap">
                    <div className="glass-panel" style={{ padding: '2rem', minWidth: '250px', borderTop: '4px solid var(--accent)' }}>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)' }}>120<span style={{ fontSize: '1.5rem', opacity: 0.7 }}>kg</span></div>
                        <div style={{ color: 'var(--text-muted)' }}>Estimated Food Saved</div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', minWidth: '250px', borderTop: '4px solid var(--primary)' }}>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)' }}>85<span style={{ fontSize: '1.5rem', opacity: 0.7 }}>%</span></div>
                        <div style={{ color: 'var(--text-muted)' }}>Potential Waste Avoided</div>
                    </div>
                </div>
                <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                    * These are informational indicators based on planning estimates, not verified claims.
                </p>
            </div>
        </section>
    );
};

export default WasteAvoided;
