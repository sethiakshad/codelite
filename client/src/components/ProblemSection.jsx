import React from 'react';

const ProblemSection = () => {
    const problems = [
        {
            icon: "🍽",
            title: "Wasted Food",
            desc: "Large amounts of cooked food go unutilized."
        },
        {
            icon: "🤝",
            title: "Access Gap",
            desc: "NGOs lack real-time access to surplus food."
        },
        {
            icon: "🌍",
            title: "Environmental Harm",
            desc: "Preventable food waste harms people and the environment."
        }
    ];

    return (
        <section id="problem" className="py-20">
            <div className="container">
                <h2 className="section-title">The Problem We Address</h2>
                <div className="grid-3" style={{ marginTop: '3rem' }}>
                    {problems.map((item, index) => (
                        <div key={index} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.3s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
