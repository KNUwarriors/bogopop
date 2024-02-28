import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './signin.css'

const SignIn = ({ isLoggedIn, setLoggedIn, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [isFirstTime, setIsFirstTime] = useState(false);
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

    const handleFirstTime = () => {
        setIsFirstTime(true); // Set the state to show the signup form
    };

    const handleSignUp = async () => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('nickname', nickname);

            const response = await axios.post('/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            handleLogin();
            console.log("Response:", response.data);
        } catch (error) {
            setError('이미 가입된 이메일입니다.')
            console.error('Error during sign up:', error);
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

    if (isFirstTime) {
        return (
            <div className="modal-overlay" ref={modalRef}>
                <div className="modal-content">
                    <h2>Sign Up</h2>
                    <form>
                        <label>Email:<input type="text" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                        <label>Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                        <label>Nickname:<input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} /></label>
                        <button type="button" onClick={handleSignUp}>Sign Up</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            </div>
        );
    }
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
                    <hr />
                    <div className='FirstTime' onClick={handleFirstTime}>보고팝이 처음이신가요?</div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
