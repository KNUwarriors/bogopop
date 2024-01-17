import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './signin.css'

const Sign = ({ isLoggedIn, setLoggedIn, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        setLoggedIn(true);
        onClose();
    };

    const handleOverlayClick = (e) => {

    };


    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <h2>Login</h2>
                <form>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button type="button" onClick={handleLogin}>Login</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Sign;
