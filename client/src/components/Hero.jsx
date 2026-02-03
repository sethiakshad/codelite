import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section style={{
            paddingTop: '8rem',
            paddingBottom: '4rem',
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Gradient Blob */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(15,23,42,0) 70%)',
                zIndex: -1
            }}></div>

            <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 500px', paddingRight: '2rem' }} className="animate-fade-in">
                    <h1 style={{
                        fontSize: '3.5rem',
                        lineHeight: '1.1',
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #fff, #a7f3d0)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '800'
                    }}>
                        Reduce Food Waste.<br />
                        Feed More People.
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-muted)',
                        marginBottom: '2.5rem',
                        maxWidth: '540px'
                    }}>
                        A web-based platform that helps institutions and events manage surplus food responsibly by enabling prevention, redistribution, and impact tracking.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/donate')} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Donate Surplus Food</button>
                        <button onClick={() => navigate('/register?role=ngo')} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Join as NGO</button>
                    </div>
                </div>

                <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                    <div className="glass-panel" style={{ padding: '1rem', transform: 'rotate(-2deg)' }}>
                        <img src={heroImg} alt="Food Sharing Illustration" style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
