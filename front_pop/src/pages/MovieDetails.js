import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './moviedetails.css';
import Reviews from './Reviews';
import SignIn from '../components/SignIn.js';
import YouTube from 'react-youtube';

function MovieDetails() {
    const { id } = useParams();
    const [movieData, setMovieData] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [ReviewPopup, setReviewPopup] = useState(false);
    const [LoginPopup, setLoginPopup] = useState(false);
    const [isLiked, setIsLiked] = useState(false); // 영화 좋아요 여부 상태
    const [comments, setComments] = useState([]);
    const [commentInputs, setCommentInputs] = useState(Array(reviews.length).fill(false));
    const [liked, setLiked] = useState(false)   // 리뷰 좋아요 여부

    const checkAuthentication = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoggedIn(false);
                return;
            }
            const response = await axios.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
            setLoggedIn(false); // 로그인되어 있지 않음
        }
    };
    // 영화 좋아요 조회
    const checkLikeStatus = async () => {
        try {
            const token = localStorage.getItem('token'); // 사용자 토큰 가져오기
            const response = await axios.get(`/movies/checkLike?movieId=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함하여 보내기
                }
            });
            setIsLiked(response.data); // 좋아요 상태 업데이트
            // console.log(response.data)
        } catch (error) {
            console.error('좋아요 상태 확인 중 오류 발생:', error);
        }
    };
    // 영화 좋아요 버튼
    const handleLikeToggle = async () => {
        try {
            const token = localStorage.getItem('token'); // 사용자 토큰 가져오기
            if (!isLiked) {
                await axios.post(`/movies/addLike?movieId=${id}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함하여 보내기
                    }
                });
            } else {
                await axios.delete(`/movies/deleteLike?movieId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함하여 보내기
                    }
                });
            }
            // 상태 업데이트
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like status:', error);
        }
    };

    // 리뷰 좋아요 상태 확인
    const checkReviewLike = async (reviewId) => {
        try {
            const token = localStorage.getItem('token'); // 사용자 토큰 가져오기
            const response = await axios.get(`/reviews/checkLike?reviewId=${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함하여 보내기
                }
            });
            return response.data; // 좋아요 상태 반환
        } catch (error) {
            console.error('Error checking review like status:', error);
            return false;
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, [isLoggedIn]);

    useEffect(() => {
        axios.get(`/movies`)
            .then((response) => {
                // 가져온 데이터에서 이미지 URL만 추출하여 저장
                const moviesWithImages = response.data.map(movie => ({
                    id: movie.id,
                    korean_title: movie.korean_title,
                    original_title: movie.original_title,
                    poster_path: movie.poster_path,
                    pop_score: Math.round(movie.pop_score * 10) / 10,
                    overview: movie.overview,
                    release_year: movie.release_date.slice(0, 4),
                    release_date: movie.release_date,
                    directors: formatArrayToString(movie.directors),
                    cast: formatArrayToString(movie.cast),
                    trailer: getVideoIdFromUrl(movie.trailer),
                }));

                setMovieData(moviesWithImages);
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
                setMovieData([]);
            });

        if (id) {
            axios.get(`/reviews?movieId=${id}`)
                .then(async (response) => {
                    console.log(response.data);
                    const reviewsData = response.data;

                    // 리뷰 id 배열 생성
                    const reviewIds = reviewsData.map(review => review.id);

                    // 각 리뷰 id에 대한 댓글 가져오기
                    const commentRequests = reviewIds.map(reviewId =>
                        axios.get(`/comments?reviewId=${reviewId}`)
                    );


                    // 모든 댓글 요청을 병렬로 실행하고 기다림
                    const commentsData = await Promise.all(commentRequests);

                    // 리뷰와 댓글을 합치기 및 리뷰 ID 저장
                    const mergedReviews = reviewsData.map((review, index) => {
                        // 리뷰의 댓글 목록과 각 댓글의 id를 함께 저장
                        const commentsWithIds = commentsData[index].data.map(comment => ({
                            ...comment,
                            id: comment.id // 댓글의 id 저장
                        }));
                        return {
                            ...review,
                            comments: commentsWithIds, // 해당 리뷰의 댓글 목록 추가
                            reviewId: review.id // 수정된 부분: 리뷰 ID 저장
                        };
                    });

                    setReviews(mergedReviews);
                })
                .catch((error) => {
                    console.error('Error fetching reviews:', error);
                    setReviews([]);
                });
            checkLikeStatus();
            checkReviewLike(id);
        }

    }, [id]);



    // id에 해당하는 영화 정보 찾기
    const movie = movieData.find((movie) => movie.id === parseInt(id, 10));
    // id에 해당하는 영화가 없으면 에러 메시지 출력
    if (!movie) {
        return <div>영화를 찾을 수 없습니다.</div>;
    }
    // pop score
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const decimalPart = rating % 1 * 10;
        let cnt = 0;

        // 노란 별 추가
        for (let i = 0; i < fullStars; i++) {
            stars.push(<div key={`yellow-star-${i}`} className="star yellow-star"></div>);
            cnt += 1;
        }
        if (cnt < 5) {
            if (decimalPart < 4) {
                // 평점이 4.0 ~ 4.3인 경우에는 까만 별 1개 추가
                stars.push(<div key={`black-star`} className="star black-star"></div>);
                cnt += 1;
            } else if (decimalPart < 8) {
                // 평점이 4.4 ~ 4.7인 경우에는 회색 별 1개 추가
                stars.push(<div key={`grey-star`} className="star grey-star"></div>);
                cnt += 1;
            } else {
                // 그 외에는 노란 별 추가
                stars.push(<div key={`yellow-star`} className="star yellow-star"></div>);
                cnt += 1;
            }
        }

        if (cnt < 5) {
            for (let i = 0; i < 5 - cnt; i++) {
                stars.push(<div key={`black-star`} className="star black-star"></div>);
            }
        }
        return stars;
    };

    // 리뷰 좋아요 토글
    const handleReviewLikeToggle = async (reviewId) => {
        try {
            const liked = await checkReviewLike(reviewId); // 리뷰의 좋아요 상태 확인
            if (!liked) {
                await addReviewLike(reviewId); // 리뷰 좋아요 추가
                console.log("추가함", reviewId)
            } else {
                await deleteReviewLike(reviewId); // 리뷰 좋아요 삭제
                console.log("삭제함", reviewId)
            }
            // 좋아요 상태 업데이트
            const updatedReviews = reviews.map(review =>
                review.reviewId === reviewId ? { ...review, isLiked: !liked } : review
            );
            setReviews(updatedReviews);
        } catch (error) {
            console.error('Error toggling review like status:', error);
        }
    };
    // 리뷰 좋아요 추가
    const addReviewLike = async (reviewId) => {
        try {
            const token = localStorage.getItem('token'); // 사용자 토큰 가져오기
            await axios.post(`/reviews/addLike?reviewId=${reviewId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함하여 보내기
                }
            });
            console.log('됐심더.')

        } catch (error) {
            console.error('Error adding review like:', error);
        }
    };
    // 리뷰 좋아요 삭제
    const deleteReviewLike = async (reviewId) => {
        try {
            const token = localStorage.getItem('token'); // 사용자 토큰 가져오기
            await axios.delete(`/reviews/deleteLike?reviewId=${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함하여 보내기
                }
            });
            console.log('삭제 완!')

        } catch (error) {
            console.error('Error deleting review like:', error);
        }
    };


    // 리뷰쓰기 버튼 클릭 시
    const handleSubmitReview = () => {
        if (isLoggedIn) {
            setReviewPopup(true);
        } else {
            setLoginPopup(true);
        }
    };
    // 리뷰쓰기 팝업 창 닫기
    const closeModal = () => {
        setReviewPopup(false);
        setLoginPopup(false);
    };
    // 댓글 열기
    const handleCommentToggle = (index) => {
        setReviews(prevReviews => prevReviews.map((review, idx) => {
            if (idx === index) {
                return { ...review, showComments: !review.showComments };
            }
            return review;
        }));
    };
    // 댓글 쓰기 토글
    const handleCommentWriteToggle = (index) => {
        setCommentInputs(prevInputs => {
            const updatedInputs = [...prevInputs];
            updatedInputs[index] = !updatedInputs[index];
            return updatedInputs;
        });
    };
    // 댓글 제출
    const handleSubmitComment = async (reviewId, index) => {
        try {
            const token = localStorage.getItem('token'); // 사용자 토큰 가져오기
            const response = await axios.post(`/comments/write?reviewId=${reviewId}`, {
                content: comments[index]
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 포함하여 보내기
                }
            });
            // 댓글 목록 업데이트
            setReviews(prevReviews => prevReviews.map((review, idx) => {
                if (idx === index) {
                    return { ...review, comments: [...review.comments, response.data] };
                }
                return review;
            }));
            // 댓글 입력란 초기화
            setComments(prevComments => {
                const updatedComments = [...prevComments];
                updatedComments[index] = '';
                return updatedComments;
            });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };
    // 댓글 입력 값 변경
    const handleCommentChange = (e, index) => {
        const { value } = e.target;
        setComments(prevComments => {
            const updatedComments = [...prevComments];
            updatedComments[index] = value;
            return updatedComments;
        });
    };

    return (
        <div className="movie-details-container">
            <div className="poster-section">
                <img src={movie.poster_path} alt={movie.korean_title} className='poster-img' />
                {/* 좋아요 버튼 */}
                <img
                    src={isLiked ? '/img/heart_full.png' : '/img/heart_empty.png'}
                    className='movie_likes'
                    onClick={handleLikeToggle}
                />
                <div className="star-rating">{renderStars(movie.pop_score)} ({movie.pop_score})</div>
                {/* 리뷰 쓰기 버튼 */}
                <button className="review_btn" onClick={handleSubmitReview}>리뷰 쓰기</button>
                {ReviewPopup && (
                    <Reviews movieId={movie.id} movieTitle={movie.korean_title} isOpen={setReviewPopup} setLoggedIn={setLoggedIn} onClose={closeModal} />
                )}
                {LoginPopup && (
                    <SignIn isOpen={setLoginPopup} setLoggedIn={setLoggedIn} onClose={closeModal} />
                )}
            </div>

            <div className='info-container'>
                <div className="info-section">
                    <div className='title-section'>
                        <h2 className='korean_title'>{movie.korean_title}</h2>
                        <p className='release_year'>{movie.release_year}</p>
                    </div>
                    <p className='original_title'>{movie.original_title}</p>
                    <YouTube
                        videoId={movie.trailer}
                        opts={{
                            width: "560",
                            height: "315",
                            playerVars: {
                                autoplay: 1,
                                rel: 0,
                                modestbranding: 1,
                            },
                        }}
                        onEnd={(e) => { e.target.stopVideo(0); }}
                    />
                    <p className='overview'>{movie.overview}</p>
                    <p className='directors'>감독: {movie.directors}</p>
                    <p className='cast'>출연진: {movie.cast}</p>
                    <hr />
                    {/* 리뷰 목록 */}
                    <div className="reviews">
                        <h3>리뷰</h3>
                        {reviews.map((review, index) => (
                            <div className='review_list' key={index}>
                                <div className='reivew_up'>
                                    <img src={review.profile} alt='userimage' className='review_profile' />
                                    <p className='review_nickname'>{review.nickname}</p>
                                    <p className='review_popScore'>{review.popScore}</p>
                                    <img src='/img/corn_pop.png' alt='reivew_popCorn' className='review_popCorn' />
                                    {/* 댓글 쓰기 버튼 */}
                                    <img
                                        src='/img/comment.png'
                                        alt='write_comment'
                                        className='write_comment'
                                        onClick={() => handleCommentWriteToggle(index)}
                                    />
                                    {/* 좋아요 버튼 */}
                                    <img
                                        src={checkReviewLike(review.id) ? '/img/heart_full.png' : '/img/heart_empty.png'}
                                        alt='reivew_likes'
                                        className='review_likes'
                                        onClick={() => handleReviewLikeToggle(review.id)}
                                    />
                                </div>
                                <p className='review_content'>{review.content}</p>
                                <p className='comment_toggle' onClick={() => handleCommentToggle(index)}> ▼ 댓글 보기</p>
                                {/* 댓글 목록 */}
                                {review.comments && review.showComments && (
                                    <div className="comment-list">
                                        {review.comments.map((comment, commentIndex) => (
                                            <div key={commentIndex} className="comment">
                                                <p>{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* 댓글 입력란 */}
                                {isLoggedIn && commentInputs[index] && (
                                    <div className="comment-input">
                                        <input
                                            type="text"
                                            placeholder="댓글을 입력하세요..."
                                            value={comments[index] || ''}
                                            onChange={(e) => handleCommentChange(e, index)}
                                        />
                                        <button onClick={() => handleSubmitComment(review.reviewId, index)}>등록</button>
                                    </div>
                                )}
                                {!isLoggedIn && commentInputs[index] && (
                                    <div>
                                        <p>댓글을 작성하려면 로그인하세요.</p>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default MovieDetails;

function formatArrayToString(str) {
    if (typeof str === 'string') {
        // 대괄호와 작은 따옴표 제거
        return str.replace(/[\[\]']+/g, '').trim();
    }
    return str; // 문자열이 아닌 경우 그대로 반환
}

// YouTube URL에서 videoId 추출하는 함수
function getVideoIdFromUrl(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}