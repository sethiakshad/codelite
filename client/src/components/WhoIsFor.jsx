import React from 'react';

const WhoIsFor = () => {
    const users = [
        { title: "Institutions & Events", desc: "Plan better, reduce surplus, avoid waste.", color: "#3b82f6" },
        { title: "NGOs & Volunteers", desc: "Access surplus food in real time.", color: "#10b981" },
        { title: "Administrators", desc: "Monitor food waste reduction and impact.", color: "#f59e0b" }
    ];

    return (
        <section className="py-20">
            <div className="container">
                <h2 className="section-title">Who Can Use This Platform</h2>
                <div className="grid-3" style={{ marginTop: '3rem' }}>
                    {users.map((user, index) => (
                        <div key={index} className="glass-panel" style={{
                            padding: '2rem',
                            borderLeft: `5px solid ${user.color}`
                        }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{user.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{user.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhoIsFor;
