import React, { useRef, useEffect, useState } from 'react';
import './main.css';
import { Link } from 'react-router-dom';

function Main() {
    const containerRef = useRef(null);
    const [isLeftButtonVisible, setIsLeftButtonVisible] = useState(true);
    const [isRightButtonVisible, setIsRightButtonVisible] = useState(true);

    const handleScroll = () => {
        const container = containerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        setIsLeftButtonVisible(container.scrollLeft > 0);
        setIsRightButtonVisible(container.scrollLeft < maxScrollLeft);
    };

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scroll = (direction) => {
        const scrollAmount = 500; // 스크롤 양 조절 가능
        const currentScroll = containerRef.current.scrollLeft;

        if (direction === 'left') {
            containerRef.current.scrollLeft = Math.max(currentScroll - scrollAmount, 0);
        } else if (direction === 'right') {
            containerRef.current.scrollLeft = Math.min(currentScroll + scrollAmount, containerRef.current.scrollWidth);
        }
    };

    return (
        <div>
            <Link className='MainTopImage' to={'/'}>
                <div className='gradientOverlay'></div>
                <img src='/img/오펜하이머.jpg' alt="MainImage" className="mainImage" />
                <div className='textOverlay'><h2>오펜하이머</h2></div>
            </Link>

            <h1>이번 주 인기 영화!</h1>

            <div className='MainPopularWrapper'>
                {isLeftButtonVisible && (
                    <button className="scrollButton left" onClick={() => scroll('left')}>&lt;</button>
                )}
                <div className='MainPopular' ref={containerRef}>
                    <div className='moviePoster'>
                        <img src='/img/poster_1.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_2.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_3.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_4.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_5.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_6.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_7.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_8.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_1.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_2.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_3.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_4.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_5.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_6.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_7.jpg' alt="Movie 1" />
                    </div>
                    <div className='moviePoster'>
                        <img src='/img/poster_8.jpg' alt="Movie 1" />
                    </div>
                </div>
                {isRightButtonVisible && (
                    <button className="scrollButton right" onClick={() => scroll('right')}>&gt;</button>
                )}
            </div>
        </div>
    );
}
export default Main;


