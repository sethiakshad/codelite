import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                // Use Context login
                login({
                    token: data.token,
                    role: data.role,
                    username: data.username
                });

                alert('Login Successful!');

                if (data.role === 'donor') {
                    navigate('/donor-dashboard');
                } else if (data.role === 'ngo') {
                    navigate('/ngo-dashboard');
                } else if (data.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container flex justify-center items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
                <h2 className="section-title" style={{ fontSize: '2rem' }}>Welcome Back</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white'
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white'
                            }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem' }}>Log In</button>
                </form>
                <p className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
