import React from 'react';
import { useParams } from 'react-router-dom';
import './moviedetails.css'; // 스타일 파일을 불러옵니다.

function MovieDetails() {
    const { id } = useParams();

    const movieData = [
        { id: 1, title: '위시', poster: '/img/poster_1.jpg', rating: 4.9 },
        { id: 2, title: '로키', poster: '/img/poster_2.jpg', rating: 4.5 },
        { id: 3, title: '오펜하이머', poster: '/img/poster_3.jpg', rating: 4.3 },
        { id: 4, title: '아메리칸 셰프', poster: '/img/poster_4.jpg', rating: 4.1 },
        { id: 5, title: '짱구', poster: '/img/poster_5.jpg', rating: 3.7 },
        { id: 6, title: '콜바넴', poster: '/img/poster_6.jpg', rating: 3.4 },
        { id: 7, title: '작은 아씨들', poster: '/img/poster_7.jpg', rating: 2.6 },
    ];

    // id에 해당하는 영화 정보 찾기
    const movie = movieData.find((movie) => movie.id === parseInt(id, 10));

    // id에 해당하는 영화가 없으면 에러 메시지 출력
    if (!movie) {
        return <div>영화를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="movie-details-container">
            <div className="poster-section">
                <img src={movie.poster} alt={movie.title} className='poster-img' />
                <h3 className='ratings'>평점: {movie.rating}</h3>
            </div>
            <div className='info-container'>
                <div className="info-section">
                    <h2 className='movie-title'>{movie.title}</h2>
                    <h2 className='content'>제81회 골든 글로브 장편 애니메이션상 노미네이트
                        '겨울왕국' 시리즈, '모아나'를 잇는 디즈니 100주년 기념작<br />
                        <br />
                        "나 이렇게 소원을 빌어.<br />
                        지금보다 더 큰 꿈 꿀 수 있는 우리"<br />
                        <br />
                        소원이 실제로 이루어지는 마법의 왕국 ‘로사스’.<br />
                        그 곳에 살고 있는 총명하고 꿈 많은 소녀 '아샤'는<br />
                        마음 속 깊이 사랑하는 ‘로사스’에 도움이 되기 위해<br />
                        모두의 존경을 받는 '매그니피코 왕'을 찾아갔다가 그의 숨겨진 계획을 알게 된다.<br />
                        <br />
                        혼란에 빠진 '아샤'의 간절한 부름에 무한한 에너지를 지닌 특별한 ‘별’이 하늘에서 내려오고<br />
                        귀여운 염소 친구 '발렌티노'와 함께 이들은 진심 어린 소원과 용기가 얼마나 놀라운 일들을 만들어낼 수 있는지 증명하기 위해 '매그니피코 왕'에 맞서기로 결심한다.<br />
                        <br />
                        그러나 '매그니피코 왕'은 자신의 힘을 이용해 '아샤'와 친구들을 위협하게 되고<br />
                        이들은 큰 난관에 부딪히게 되는데...<br />
                        <br />
                        2024년 새해, '겨울왕국' 시리즈 제작진이 선사하는<br />
                        마법 같은 이야기가 찾아옵니다.<br /></h2>
                </div>
            </div>

        </div>
    );
}

export default MovieDetails;
