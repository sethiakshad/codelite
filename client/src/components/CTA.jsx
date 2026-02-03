import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 text-center">
            <div className="container">
                <div className="glass-panel" style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, var(--glass), rgba(16,185,129,0.1))' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        Take a step toward sustainable food management.
                    </h2>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <button onClick={() => navigate('/register?role=donor')} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem' }}>Get Started as Donor</button>
                        <button onClick={() => navigate('/register?role=ngo')} className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem' }}>Register as NGO</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
