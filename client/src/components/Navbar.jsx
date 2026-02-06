import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Use Context

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDashboardClick = () => {
        if (user?.role === 'donor') {
            navigate('/donor-dashboard');
        } else if (user?.role === 'ngo') {
            navigate('/ngo-dashboard');
        } else {
            navigate('/');
        }
    };

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                background: scrolled ? 'var(--glass)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
                padding: scrolled ? '1rem 0' : '1.5rem 0'
            }}
        >
            <div className="container flex justify-between items-center">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    FoodLink<span style={{ color: 'white' }}>.</span>
                </Link>

                <ul className="flex gap-8" style={{ display: 'flex' }}>
                    <li><a href="/#problem" style={{ color: 'var(--text-main)' }}>The Problem</a></li>
                    <li><a href="/#how-it-works" style={{ color: 'var(--text-main)' }}>How It Works</a></li>
                    <li><a href="/#impact" style={{ color: 'var(--text-main)' }}>Impact</a></li>
                </ul>

                <div className="flex gap-4">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <button onClick={() => navigate('/admin-dashboard')} className="btn btn-secondary">Admin Panel</button>
                            ) : (
                                <button onClick={handleDashboardClick} className="btn btn-secondary">Dashboard</button>
                            )}
                            <button onClick={handleLogout} className="btn btn-primary" style={{ background: 'rgba(239, 68, 68, 0.8)', borderColor: 'transparent' }}>Log Out</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className="btn btn-secondary">Log In</button>
                            <button onClick={() => navigate('/register')} className="btn btn-primary">Join Now</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
