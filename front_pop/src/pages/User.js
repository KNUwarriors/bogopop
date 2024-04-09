import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./user.css";

const User = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isLeftButtonVisible, setIsLeftButtonVisible] = useState(true);
    const [isRightButtonVisible, setIsRightButtonVisible] = useState(true);
    const [movieInfoList, setMovieInfoList] = useState([]);
    const [profileData, setProfileData] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

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
                setUserData(userResponse.data.user);
                setMovieInfoList(userResponse.data.movieLikes);
                console.log("유저 데이터입니당: ", userData);

                const profileImages = await axios.get(`/profiles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfileData(profileImages.data);

                console.log(profileData);

            } catch (error) {
                console.error("데이터를 불러오는 데 실패했습니다:", error);
            }
        };
        fetchData();
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }
    const handleProfileClick = () => {
        setShowProfileModal(true);
    };
    const updateProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/profiles/updateProfile?imageName=${selectedProfile}`, { imageName: selectedProfile }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // 프로필 변경 후 새로고침
            window.location.reload();
        } catch (error) {
            console.error("프로필을 업데이트하는 데 실패했습니다:", error);
        }
    };

    return (
        <div>
            <div className="UserTop">
                <div className="gradientOverlay"></div>
                <img src={userData.background} alt="topimage" className="TopImage" />
                <div className="UserProfile">
                    <img src={`/img/${userData.profile}`} alt="userimage" className="UserImage" onClick={handleProfileClick} />
                    <h1 className="UserName">{userData.email}</h1>
                </div>
            </div>

            {showProfileModal && (
                <div className="ProfileModal">
                    <h2>프로필 선택</h2>
                    <div className="ProfileList">
                        {profileData.map((profile, index) => (
                            <img key={index} src={`/img/${profile}`} alt="profile" className="ProfileImage" onClick={() => setSelectedProfile(profile)} />
                        ))}
                    </div>
                    <p>{selectedProfile}</p>
                    <button onClick={updateProfile}>프로필 변경</button> {/* 프로필 선택 버튼 */}
                </div>
            )}

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
            </div>
        </div>
    );
}

export default User;
