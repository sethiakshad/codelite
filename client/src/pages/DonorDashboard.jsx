import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!storedUsername || role !== 'donor') {
            navigate('/login');
            return;
        }

        setUsername(storedUsername);
        fetchDonations(storedUsername);
    }, [navigate]);

    const fetchDonations = async (user) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/food/user/${user}`);
            if (response.ok) {
                const data = await response.json();
                setDonations(data);
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalDonated = donations.reduce((acc, curr) => {
        // Assuming quantity is a string like "5 kg" or just "5". 
        // For now, let's just count the number of items or try to parse.
        // Let's just count items for simplicity as "Donations made"
        return acc + 1;
    }, 0);

    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '100px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    Welcome, {username}!
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Thank you for your contributions to reducing food waste.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--primary)', fontSize: '3rem', fontWeight: 'bold' }}>{donations.length}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Total Donations</p>
                </div>
                {/* Placeholder for other stats */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--secondary)', fontSize: '3rem', fontWeight: 'bold' }}>0</h3>
                    <p style={{ color: 'var(--text-muted)' }}>kg of Food Saved</p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: '#10b981', fontSize: '3rem', fontWeight: 'bold' }}>0</h3>
                    <p style={{ color: 'var(--text-muted)' }}>People Impacted</p>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>Your Donation History</h2>
                    <button
                        onClick={() => navigate('/donate')}
                        className="btn btn-primary"
                    >
                        Make a New Donation
                    </button>
                </div>

                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : donations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        You haven't made any donations yet.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Donation Details</th>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((donation) => (
                                    <tr key={donation._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-2">{donation.title}</h3>
                                                {donation.ingredients && donation.ingredients.length > 0 && (
                                                    <div className="grid gap-2 mb-2">
                                                        {donation.ingredients.map((ing, i) => (
                                                            <div key={i} className="flex flex-wrap gap-2 items-center" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                                <span className="text-white">• {ing.name}</span>
                                                                <span style={{ opacity: 0.7 }}>({ing.quantity})</span>
                                                                <span style={{ fontSize: '0.75rem', color: ing.isVeg === 'Veg' ? '#10b981' : '#ef4444', border: '1px solid currentColor', padding: '0 4px', borderRadius: '4px' }}>
                                                                    {ing.isVeg === 'Veg' ? 'Veg' : 'Non-Veg'}
                                                                </span>
                                                                {ing.needsRefrigeration === 'Yes' && (
                                                                    <span style={{ fontSize: '0.75rem', color: '#60A5FA', border: '1px solid currentColor', padding: '0 4px', borderRadius: '4px' }}>❄️ Fridge</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{new Date(donation.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.8rem',
                                                background: donation.status === 'available' || donation.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' :
                                                    donation.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: donation.status === 'available' || donation.status === 'approved' ? '#10B981' :
                                                    donation.status === 'rejected' ? '#EF4444' : '#F59E0B'
                                            }}>
                                                {donation.status === 'available' ? 'Approved' : donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorDashboard;
