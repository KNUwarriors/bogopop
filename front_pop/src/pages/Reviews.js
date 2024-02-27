import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './reviews.css'

const Reviews = ({ isLoggedIn, setLoggedIn, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef(null);



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
                <h2>리뷰 쓰기</h2>
                <form>
                    <label>
                        리뷰 여기다 써라:
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <hr />
                </form>
            </div>
        </div>
    );
};

export default Reviews;
