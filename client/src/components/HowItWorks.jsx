import React from 'react';

const HowItWorks = () => {
    const steps = [
        { title: "Plan", desc: "Institutions enter expected food requirements." },
        { title: "Estimate", desc: "System estimates potential surplus and waste avoided." },
        { title: "Post", desc: "Actual surplus food is posted in real time." },
        { title: "Notify", desc: "Nearby NGOs are notified and collect food." },
        { title: "Track", desc: "Redistribution and impact are tracked." }
    ];

    return (
        <section id="how-it-works" className="py-20" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="container">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">A seamless process from prevention to redistribution.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    {steps.map((step, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1.5rem',
                            position: 'relative'
                        }}>
                            {/* Step Number */}
                            <div style={{
                                background: 'var(--primary)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: 'white',
                                flexShrink: 0,
                                zIndex: 1
                            }}>
                                {index + 1}
                            </div>

                            {/* Connecting Line (except last) */}
                            {index < steps.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '19px',
                                    width: '2px',
                                    height: 'calc(100% + 2rem)',
                                    background: 'var(--glass-border)'
                                }}></div>
                            )}

                            <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>{step.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
