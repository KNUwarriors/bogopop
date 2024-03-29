import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './reviews.css'

// axios의 기본 설정 변경
axios.defaults.headers.post['Content-Type'] = 'application/json';

const Reviews = ({ movieId, movieTitle, isLoggedIn, setLoggedIn, onClose }) => {
    const modalRef = useRef(null);
    const textareaRef = useRef(null);
    const [popscore, setPopscore] = useState(0);
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // textarea
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // 평점 입력
    const handleRatingChange = (value) => {
        setPopscore(value);
    };

    // 리뷰 내용 입력
    const handleContentChange = (e) => {
        setContent(e.target.value);
        adjustTextareaHeight();
    };

    // 리뷰 등록
    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('토큰이 없습니다. 사용자는 로그인되어 있지 않습니다.');
                return;
            }
            console.log(popscore)
            const response = await axios.post(`/reviews/write?movieId=${movieId}`, {
                movieId: movieId,
                popScore: popscore,
                content: content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`    // 토큰 헤더에 포함해서 전달
                }
            });
            onClose();

        } catch (error) {
            if (error.response.status === 401) {
                setErrorMessage('로그인이 되어있지 않음.');
            } else {
                setErrorMessage('리뷰를 등록하는 중에 오류가 발생했습니다.');
            }
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
        <div className="review-overlay" ref={modalRef}>
            <div className="review-content">
                <h1>{movieTitle}</h1>
                <div className='review-rating'>
                    {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value, index) => (
                        <div
                            key={value}
                            className={`popcorn ${value <= popscore ? 'active' : ''} ${index % 2 === 1 ? 'flip-horizontal' : ''}`}
                            onClick={() => handleRatingChange(value)}
                        />
                    ))}
                </div>
                <div>
                    <textarea ref={textareaRef} value={content} onChange={handleContentChange} />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className='review-submit-btn' onClick={handleSubmitReview}>등록</button>
            </div>
        </div>
    );
};

export default Reviews;
