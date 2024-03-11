import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./user.css";

const User = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [movieData, setMovieData] = useState([]);
  const [isLeftButtonVisible, setIsLeftButtonVisible] = useState(true);
  const [isRightButtonVisible, setIsRightButtonVisible] = useState(true);
  const [movieInfoList, setMovieInfoList] = useState([]);

  const handleScroll = () => {
    const container = containerRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setIsLeftButtonVisible(container.scrollLeft > 0);
    setIsRightButtonVisible(container.scrollLeft < maxScrollLeft);
  };

  const scroll = (direction) => {
    const scrollAmount = 500;
    const currentScroll = containerRef.current.scrollLeft;

    if (direction === "left") {
      containerRef.current.scrollLeft = Math.max(
        currentScroll - scrollAmount,
        0
      );
    } else if (direction === "right") {
      containerRef.current.scrollLeft = Math.min(
        currentScroll + scrollAmount,
        containerRef.current.scrollWidth - containerRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data.user;
        setUserData(userData);

        const movieLikesResponse = await axios.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userLikes = movieLikesResponse.data.movieLikes.map(movie => movie.id);
        console.log("사용자가 좋아하는 영화 id 리스트:", userLikes);
        setMovieData(userLikes);
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMovieInfo = async () => {
      const movieInfoPromises = movieData.map(async (movieId) => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`/movies/${movieId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
        } catch (error) {
          console.error("영화 정보를 불러오는 데 실패했습니다:", error);
          return null;
        }
      });

      const movieInfoList = await Promise.all(movieInfoPromises);
      setMovieInfoList(movieInfoList.filter((movieInfo) => movieInfo !== null));
    };

    fetchMovieInfo();
  }, [movieData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="UserTop">
        <div className="gradientOverlay"></div>
        <img src={userData.background} alt="topimage" className="TopImage" />
        <div className="UserProfile">
          <img src={userData.profile} alt="userimage" className="UserImage" />
          <h1 className="UserName">{userData.email}</h1>
        </div>
      </div>
      <div className="UserBottom">
        <div className="favorites-container">
          <h2>좋아요한 영화</h2>
          <hr />
          {isLeftButtonVisible && (
            <button className="scrollButton left" onClick={() => scroll("left")}>
              &lt;
            </button>
          )}

          <div className="favorites" ref={containerRef}>
            {movieInfoList.map((movieInfo) => (
              <Link key={movieInfo.id} to={`/movies/${movieInfo.id}`}>
                <div className="MoviePoster">
                  <img src={movieInfo.poster_path} alt={movieInfo.korean_title} />
                </div>
              </Link>
            ))}
          </div>

          {isRightButtonVisible && (
            <button className="scrollButton right" onClick={() => scroll("right")}>
              &gt;
            </button>
          )}
        </div>
        <div className="favorites-container">
          <h2>리스트 보관함</h2>
          <hr />
          {isLeftButtonVisible && (
            <button className="scrollButton left" onClick={() => scroll("left")}>
              &lt;
            </button>
          )}

          <div className="favorites" ref={containerRef}>
            {movieInfoList.map((movieInfo) => (
              <Link key={movieInfo.id} to={`/movies/${movieInfo.id}`}>
                <div className="MoviePoster">
                  <img src={movieInfo.poster_path} alt={movieInfo.korean_title} />
                </div>
              </Link>
            ))}
          </div>

          {isRightButtonVisible && (
            <button className="scrollButton right" onClick={() => scroll("right")}>
              &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
