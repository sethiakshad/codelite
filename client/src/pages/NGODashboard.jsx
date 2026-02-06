import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const NGODashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [availableFood, setAvailableFood] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!storedUsername || role !== 'ngo') {
            navigate('/login');
            return;
        }

        setUsername(storedUsername);
        fetchAvailableFood();
    }, [navigate]);

    const fetchAvailableFood = async () => {
        try {
            const response = await fetch(`${API_URL}/api/food`);
            if (response.ok) {
                const data = await response.json();
                // Filter only available food
                const available = data.filter(item => item.status === 'available');
                setAvailableFood(available);
            }
        } catch (error) {
            console.error('Error fetching food:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (foodId) => {
        // Placeholder for claim functionality
        alert(`Request to claim food ID: ${foodId} sent! (Feature coming soon)`);
    };

    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '100px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    Hello, {username}!
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Here are the available food donations near you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p style={{ color: 'white' }}>Loading available donations...</p>
                ) : availableFood.length === 0 ? (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No donations currently available.</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Check back later!</p>
                    </div>
                ) : (
                    availableFood.map((food) => (
                        <div key={food._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="flex justify-between items-start">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{food.title}</h3>
                                <span style={{
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    color: '#10b981',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.75rem'
                                }}>
                                    Available
                                </span>
                            </div>

                            <div className="mb-3">
                                <h4 className="text-sm text-gray-400 mb-2">Items:</h4>
                                <ul style={{ paddingLeft: '0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {food.ingredients && food.ingredients.map((ing, i) => (
                                        <li key={i} className="glass-panel" style={{ padding: '0.5rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-white">{ing.name}</span>
                                                <span>{ing.quantity}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span style={{ fontSize: '0.75rem', color: ing.isVeg === 'Veg' ? '#10b981' : '#ef4444' }}>
                                                    {ing.isVeg === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                                                </span>
                                                {ing.needsRefrigeration === 'Yes' && (
                                                    <span style={{ fontSize: '0.75rem', color: '#60A5FA' }}>❄️ Needs Fridge</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>


                                <p className="mb-2" style={{ color: 'var(--text-muted)' }}>
                                    <strong>Location:</strong> {food.location}
                                </p>
                                <p><strong>Posted by:</strong> {food.postedBy}</p>
                                <p style={{ marginTop: '0.5rem' }}>{food.description}</p>
                            </div>

                            <button
                                onClick={() => handleClaim(food._id)}
                                className="btn btn-primary"
                                style={{ marginTop: 'auto', width: '100%' }}
                            >
                                Claim Donation
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NGODashboard;
