import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './signin.css'

const SignIn = ({ isLoggedIn, setLoggedIn, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef(null);

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', { email, password });
            const { token } = response.data;

            localStorage.setItem('token', token);
            setLoggedIn(true);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('An error occurred during login');
            }
            console.error('Error during login:', error);
        }
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="modal-overlay" ref={modalRef}>
            <div className="modal-content">
                <h2>Login</h2>
                <form>
                    <label>
                        Username:
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
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

export default SignIn;
