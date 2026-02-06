import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const searchParams = new URLSearchParams(location.search);
    const initialRole = searchParams.get('role') || 'donor';

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: initialRole,
        secretCode: ''
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: initialRole }));
    }, [initialRole]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple client-side validation for admin secret
        if (formData.role === 'admin' && formData.secretCode !== 'admin123') {
            alert('Invalid Admin Secret Code!');
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('username', formData.username);
            submitData.append('password', formData.password);
            submitData.append('role', formData.role);
            if (file) {
                submitData.append('certificate', file);
            }

            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                body: submitData,
            });
            const data = await response.json();
            if (response.ok) {
                // Auto-login via Context
                login({
                    token: data.token,
                    role: data.role,
                    username: data.username
                });

                alert('Registration Successful!');

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
                // Handle duplicate username or other errors
                if (data.error && data.error.includes('Validation error')) {
                    alert('Username already taken. Please choose another.');
                } else {
                    alert(data.error || 'Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('A network error occurred. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container flex justify-center items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
                <h2 className="section-title" style={{ fontSize: '2rem' }}>Join FoodLink</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>I am a...</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(30, 41, 59, 0.9)',
                                color: 'white'
                            }}
                        >
                            <option value="donor">Donor (Institution/Event)</option>
                            <option value="ngo">NGO / Volunteer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {formData.role === 'admin' && (
                        <div>
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Admin Secret Code</label>
                            <input
                                type="password"
                                name="secretCode"
                                value={formData.secretCode}
                                onChange={handleChange}
                                placeholder="Enter secret code"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--primary)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white'
                                }}
                                required
                            />
                        </div>
                    )}

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
                    {formData.role !== 'admin' && (
                        <div>
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                                {formData.role === 'ngo' ? 'Upload NGO Certificate' : 'Upload License/ID'}
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white'
                                }}
                            />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log In</Link>
                </p>
            </div >
        </div >
    );
};

export default Register;
