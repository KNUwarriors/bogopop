import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import './moviedetails.css'; // 스타일 파일을 불러옵니다.
import YouTube from 'react-youtube';

function MovieDetails() {
    const { id } = useParams();
    const [movieData, setMovieData] = useState([]);


    useEffect(() => {
        axios.get(`/movies`)
            .then((response) => {
                // 가져온 데이터에서 이미지 URL만 추출하여 저장
                const moviesWithImages = response.data.map(movie => ({
                    id: movie.id,
                    korean_title: movie.korean_title,
                    poster_path: movie.poster_path,
                    pop_score: movie.pop_score,
                    overview: movie.overview,
                    directors: movie.directors,
                    cast: movie.cast,
                    trailer: movie.trailer
                }));

                setMovieData(moviesWithImages);
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
                setMovieData([]);
            });
    }, []);

    // id에 해당하는 영화 정보 찾기
    const movie = movieData.find((movie) => movie.id === parseInt(id, 10));

    // id에 해당하는 영화가 없으면 에러 메시지 출력
    if (!movie) {
        return <div>영화를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="movie-details-container">
            <div className="poster-section">
                <img src={movie.poster_path} alt={movie.korean_title} className='poster-img' />
                <h3 className='ratings'>평점: {movie.pop_score}</h3>
            </div>
            <div className='info-container'>
                <div className="info-section">
                    <h2 className='korean_title'>{movie.korean_title}</h2>
                    <h2 className='overview'>{movie.overview}</h2>
                    <p className='directors'>{movie.directors}</p>
                    <p className='cast'>{movie.cast}</p>

                </div>
            </div>

        </div>
    );
}

export default MovieDetails;
