import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Donate = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', isVeg: 'Veg', needsRefrigeration: 'No' }]);
    const postedBy = localStorage.getItem('username') || 'Anonymous';

    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...ingredients];
        list[index][name] = value;
        setIngredients(list);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', isVeg: 'Veg', needsRefrigeration: 'No' }]);
    };

    const removeIngredient = (index) => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!localStorage.getItem('token')) {
            alert('You must be logged in to donate!');
            navigate('/login');
            return;
        }

        const donationData = {
            title,
            ingredients,
            location,
            description,
            postedBy
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/food', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });
            if (response.ok) {
                alert('Food Posted Successfully!');
                navigate('/donor-dashboard'); // Redirect to dashboard to see pending status
            } else {
                alert('Failed to post food.');
            }
        } catch (error) {
            console.error('Post error:', error);
        }
    };

    return (
        <div className="container flex justify-center items-center" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '3rem' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '700px' }}>
                <h2 className="section-title" style={{ fontSize: '2rem' }}>Donate Surplus Food</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Donation Title (e.g. Wedding Leftovers)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>



                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Ingredients / Items</label>
                        {ingredients.map((item, index) => (
                            <div key={index} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="flex gap-4 mb-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Item Name (e.g. Rice)"
                                        value={item.name}
                                        onChange={(e) => handleIngredientChange(index, e)}
                                        style={{ flex: 2, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="quantity"
                                        placeholder="Qty (e.g. 5kg)"
                                        value={item.quantity}
                                        onChange={(e) => handleIngredientChange(index, e)}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        required
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        name="isVeg"
                                        value={item.isVeg}
                                        onChange={(e) => handleIngredientChange(index, e)}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.9)', color: 'white', fontSize: '0.9rem' }}
                                    >
                                        <option value="Veg">Vegetarian</option>
                                        <option value="Non-Veg">Non-Vegetarian</option>
                                    </select>
                                    <select
                                        name="needsRefrigeration"
                                        value={item.needsRefrigeration}
                                        onChange={(e) => handleIngredientChange(index, e)}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.9)', color: 'white', fontSize: '0.9rem' }}
                                    >
                                        <option value="No">No Fridge Needed</option>
                                        <option value="Yes">Needs Fridge</option>
                                    </select>
                                    {ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            className="btn"
                                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '0.75rem', height: 'fit-content' }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="btn btn-secondary text-sm w-full"
                            style={{ marginTop: '0.5rem' }}
                        >
                            + Add Another Item
                        </button>
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Pickup Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter pickup address (e.g., 123 Main Street, City)"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Description / Restrictions</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
