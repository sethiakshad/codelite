import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pendingFood, setPendingFood] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'food', or 'management'
    const [selectedUser, setSelectedUser] = useState(null); // For profile modal

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            // navigate('/'); 
        }
        fetchPendingUsers();
        fetchPendingFood();
        fetchAllUsers();
    }, [user]);

    const fetchPendingUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/users/pending`);
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
            const response = await fetch(`${API_URL}/api/admin/food/pending`);
            if (response.ok) {
                const data = await response.json();
                setPendingFood(data);
            }
        } catch (error) {
            console.error('Error fetching pending food:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/users`);
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    };

    const handleUserAction = async (id, status) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/users/${id}/${status}`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert(`User ${status === 'approved' ? 'Approved' : 'Rejected'}!`);
                fetchPendingUsers();
                fetchAllUsers();
                if (selectedUser && selectedUser.id === id) {
                    const updatedUser = { ...selectedUser, approvalStatus: status };
                    setSelectedUser(updatedUser);
                }
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('User deleted successfully!');
                fetchAllUsers();
                fetchPendingUsers();
                setSelectedUser(null);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleFoodAction = async (id, status) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/food/${id}/${status}`, {
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
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
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
                    <button
                        onClick={() => setActiveTab('management')}
                        className="btn"
                        style={{
                            background: activeTab === 'management' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '0.75rem 2rem'
                        }}
                    >
                        User Management ({allUsers.length})
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
                                        <p style={{ color: 'var(--text-muted)' }} className="mb-3">
                                            <strong>Registered:</strong> {new Date(pendingUser.createdAt).toLocaleDateString()}
                                        </p>
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
                                                Ignore
                                            </button>
                                            <button
                                                onClick={() => setSelectedUser(pendingUser)}
                                                className="btn btn-secondary text-sm"
                                                style={{ flex: 0.5 }}
                                            >
                                                👁️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* User Management Tab */}
                {activeTab === 'management' && (
                    <div>
                        <h2 className="text-xl mb-4 text-center" style={{ color: 'var(--text-muted)' }}>Registered Users & Control</h2>
                        {allUsers.length === 0 ? (
                            <p className="text-center text-white">No users found.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', color: 'white' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                            <th style={{ padding: '1rem' }}>Username</th>
                                            <th style={{ padding: '1rem' }}>Role</th>
                                            <th style={{ padding: '1rem' }}>Status</th>
                                            <th style={{ padding: '1rem' }}>Joined</th>
                                            <th style={{ padding: '1rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map((u) => (
                                            <tr key={u.id} className="glass-panel" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                                                    <strong>{u.username}</strong>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                                        {u.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        color: u.approvalStatus === 'approved' ? '#10b981' : u.approvalStatus === 'rejected' ? '#ef4444' : '#f59e0b',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        • {u.approvalStatus.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedUser(u)}
                                                            className="btn btn-secondary text-sm"
                                                            style={{ padding: '0.4rem 0.8rem' }}
                                                        >
                                                            Profile
                                                        </button>
                                                        {u.role !== 'admin' && (
                                                            <>
                                                                {u.approvalStatus === 'approved' ? (
                                                                    <button
                                                                        onClick={() => handleUserAction(u.id, 'rejected')}
                                                                        className="btn"
                                                                        style={{ padding: '0.4rem 0.8rem', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                                                                    >
                                                                        Block Access
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleUserAction(u.id, 'approved')}
                                                                        className="btn"
                                                                        style={{ padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                                                                    >
                                                                        Grant Access
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id)}
                                                                    className="btn"
                                                                    style={{ padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

            {/* Profile Detail Modal */}
            {selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '1rem'
                }}>
                    <div className="glass-panel" style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <button
                            onClick={() => setSelectedUser(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ×
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'var(--primary)',
                                borderRadius: '50%',
                                margin: '0 auto 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                color: 'white'
                            }}>
                                {selectedUser.username.charAt(0).toUpperCase()}
                            </div>
                            <h2 style={{ color: 'white', margin: 0 }}>{selectedUser.username}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedUser.role.toUpperCase()}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                                <span style={{ color: selectedUser.approvalStatus === 'approved' ? '#10b981' : selectedUser.approvalStatus === 'rejected' ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>
                                    {selectedUser.approvalStatus.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>User ID</span>
                                <span style={{ color: 'white' }}>#{selectedUser.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Joined On</span>
                                <span style={{ color: 'white' }}>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {selectedUser.certificate && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Registration Document:</p>
                                <a
                                    href={`${API_URL}/${selectedUser.certificate}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ width: '100%', textAlign: 'center', display: 'block', padding: '0.75rem' }}
                                >
                                    📄 Open Document / Certificate
                                </a>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {selectedUser.role !== 'admin' && (
                                <>
                                    {selectedUser.approvalStatus === 'approved' ? (
                                        <button
                                            onClick={() => handleUserAction(selectedUser.id, 'rejected')}
                                            className="btn"
                                            style={{ flex: 1, background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                                        >
                                            Block Access
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUserAction(selectedUser.id, 'approved')}
                                            className="btn"
                                            style={{ flex: 1, background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                                        >
                                            Grant Access
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteUser(selectedUser.id)}
                                        className="btn"
                                        style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                    >
                                        Delete User
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
