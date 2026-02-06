import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pendingFood, setPendingFood] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'food'

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            // navigate('/'); // In real app, secure this. For now let's show it or redirect
            // Assuming we have a way to be admin
        }
        fetchPendingUsers();
        fetchPendingFood();
    }, [user]);

    const fetchPendingUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/admin/users/pending');
            if (response.ok) {
                const data = await response.json();
                setPendingUsers(data);
            }
        } catch (error) {
            console.error('Error fetching pending users:', error);
        }
    };

    const fetchPendingFood = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/admin/food/pending');
            if (response.ok) {
                const data = await response.json();
                setPendingFood(data);
            }
        } catch (error) {
            console.error('Error fetching pending food:', error);
        }
    };

    const handleUserAction = async (id, status) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/admin/users/${id}/${status}`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert(`User ${status === 'approved' ? 'Approved' : 'Rejected'}!`);
                fetchPendingUsers();
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleFoodAction = async (id, status) => {
        try {
            // status should be 'available' (approve) or 'rejected'
            const response = await fetch(`http://127.0.0.1:5000/api/admin/food/${id}/${status}`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert(`Donation ${status === 'available' ? 'Approved' : 'Rejected'}!`);
                fetchPendingFood();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', padding: '2rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="section-title text-center">Admin Dashboard</h1>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('users')}
                        className="btn"
                        style={{
                            background: activeTab === 'users' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '0.75rem 2rem'
                        }}
                    >
                        Pending Users ({pendingUsers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('food')}
                        className="btn"
                        style={{
                            background: activeTab === 'food' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '0.75rem 2rem'
                        }}
                    >
                        Pending Donations ({pendingFood.length})
                    </button>
                </div>

                {/* Pending Users Tab */}
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-xl mb-4 text-center" style={{ color: 'var(--text-muted)' }}>Pending User Registrations</h2>
                        {pendingUsers.length === 0 ? (
                            <p className="text-center text-white">No pending user registrations.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingUsers.map((pendingUser) => (
                                    <div key={pendingUser.id} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
                                        <h3 className="text-lg font-bold text-white mb-2">{pendingUser.username}</h3>
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-1">
                                            <strong>Role:</strong> {pendingUser.role.toUpperCase()}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-1">
                                            <strong>Status:</strong> {pendingUser.approvalStatus}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-3">
                                            <strong>Registered:</strong> {new Date(pendingUser.createdAt).toLocaleDateString()}
                                        </p>
                                        {pendingUser.certificate && (
                                            <div className="mb-3">
                                                <a
                                                    href={`http://127.0.0.1:5000/${pendingUser.certificate}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary text-sm"
                                                    style={{ width: '100%', marginBottom: '0.5rem' }}
                                                >
                                                    📄 View Certificate
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUserAction(pendingUser.id, 'approved')}
                                                className="btn btn-primary text-sm"
                                                style={{ flex: 1 }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleUserAction(pendingUser.id, 'rejected')}
                                                className="btn btn-secondary text-sm"
                                                style={{ flex: 1, background: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.5)' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pending Food Tab */}
                {activeTab === 'food' && (
                    <div>
                        <h2 className="text-xl mb-4 text-center" style={{ color: 'var(--text-muted)' }}>Pending Donations</h2>
                        {pendingFood.length === 0 ? (
                            <p className="text-center text-white">No pending donations.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingFood.map((item) => (
                                    <div key={item._id} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
                                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-1"><strong>Details:</strong> {item.description}</p>
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-1"><strong>Quantity:</strong> {item.quantity}</p>
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-1"><strong>Location:</strong> {item.location}</p>
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-3"><strong>Posted By:</strong> {item.postedBy}</p>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleFoodAction(item._id, 'available')}
                                                className="btn btn-primary text-sm"
                                                style={{ flex: 1 }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleFoodAction(item._id, 'rejected')}
                                                className="btn btn-secondary text-sm"
                                                style={{ flex: 1, background: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.5)' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
