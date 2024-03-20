import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import './movies.css';

const MovieContainer = ({ title, movieData }) => {
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
        const scrollAmount = 500;
        const currentScroll = containerRef.current.scrollLeft;

        if (direction === 'left') {
            containerRef.current.scrollLeft = Math.max(currentScroll - scrollAmount, 0);
        } else if (direction === 'right') {
            containerRef.current.scrollLeft = Math.min(
                currentScroll + scrollAmount,
                containerRef.current.scrollWidth - containerRef.current.clientWidth
            );
        }
    };

    return (
        <div className='movie-container'>
            <h2>{title}</h2>
            <hr />
            {isLeftButtonVisible && (
                <button className="scrollButton left" onClick={() => scroll('left')}>&lt;</button>
            )}
            <div className='movies' ref={containerRef}>
                {movieData.map((movie) => {
                    return (
                        <Link key={movie.id} to={`/movies/${movie.id}`}>
                            <div className="moviePoster">
                                <img src={movie.poster_path} alt={movie.korean_title} />
                            </div>
                        </Link>
                    );
                })}
            </div>
            {isRightButtonVisible && (
                <button className="scrollButton right" onClick={() => scroll('right')}>&gt;</button>
            )}
        </div>
    );
};

function Movies() {
    const [movieData, setMovieData] = useState([]);

    useEffect(() => {
        axios.get('/movies')
            .then((response) => {
                const moviesWithImages = response.data.map(movie => ({
                    id: movie.id,
                    korean_title: movie.korean_title,
                    poster_path: movie.poster_path,
                    pop_score: movie.popScore,
                    release_date: movie.release_date,
                    genres: movie.genres
                }));

                setMovieData(moviesWithImages);
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
                setMovieData([]);
            });
    }, []);

    const RomanceMovies = movieData.filter(movie => movie.genres && movie.genres.includes(10749));
    const AnimationMovies = movieData.filter(movie => movie.genres && movie.genres.includes(16));
    const FantasyMovies = movieData.filter(movie => movie.genres && movie.genres.includes(14));
    const ActionMovies = movieData.filter(movie => movie.genres && movie.genres.includes(28));
    const CrimeMovies = movieData.filter(movie => movie.genres && movie.genres.includes(80));
    const HorrorMovies = movieData.filter(movie => movie.genres && movie.genres.includes(27));


    return (
        <div>
            <MovieContainer title='최근 개봉한 영화' movieData={movieData} />
            <MovieContainer title='로맨스 영화' movieData={RomanceMovies} />
            <MovieContainer title='애니메이션 영화' movieData={AnimationMovies} />
            <MovieContainer title='판타지 영화' movieData={FantasyMovies} />
            <MovieContainer title='액션 영화' movieData={ActionMovies} />
            <MovieContainer title='범죄 영화' movieData={CrimeMovies} />
            <MovieContainer title='공포 영화' movieData={HorrorMovies} />

        </div>
    );
}

export default Movies;
