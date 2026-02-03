import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Donate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        quantity: '',
        location: '',
        description: '',
        postedBy: localStorage.getItem('username') || 'Anonymous' // Ideally from context
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('token')) {
            alert('You must be logged in to donate!');
            navigate('/login');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/food', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If middleware existed
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Food Posted Successfully!');
                navigate('/');
            } else {
                alert('Failed to post food.');
            }
        } catch (error) {
            console.error('Post error:', error);
        }
    };

    return (
        <div className="container flex justify-center items-center" style={{ minHeight: '100vh', paddingTop: '80px' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
                <h2 className="section-title" style={{ fontSize: '2rem' }}>Donate Surplus Food</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Food Title (e.g. 50 Meals of Rice)</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Quantity (kg / plates)</label>
                        <input
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Pickup Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Description / Restrictions</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '100px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem' }}>Post Surplus</button>
                </form>
            </div>
        </div>
    );
};

export default Donate;
