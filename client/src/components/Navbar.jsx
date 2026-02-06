import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        // Check login status on mount and when interactions happen
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            setIsLoggedIn(!!token);
            setUserRole(role);
        };

        checkLoginStatus();
        window.addEventListener('scroll', handleScroll);

        // Listen for storage events (in case of tab changes) or custom events
        window.addEventListener('storage', checkLoginStatus);

        // Optional: Custom event for immediate UI updates within same tab
        window.addEventListener('auth-change', checkLoginStatus);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('auth-change', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event('auth-change')); // Trigger update
        navigate('/');
    };

    const handleDashboardClick = () => {
        if (userRole === 'donor') {
            navigate('/donor-dashboard');
        } else if (userRole === 'ngo') {
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
                    {isLoggedIn ? (
                        <>
                            <button onClick={handleDashboardClick} className="btn btn-secondary">Dashboard</button>
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
