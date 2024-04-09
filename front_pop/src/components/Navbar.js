import { Link, useNavigate, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./navbar.css";
import SignIn from "./SignIn";
import axios from "axios";

function Navbar() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [LoginPopup, setLoginPopup] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    useEffect(() => {
        checkAuthentication();
    }, []);

    // 검색어 입력 핸들러
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = async () => {
        try {
            const response = await axios.get(`/movies/search?keyword=${searchTerm}`);
            const searchResult = response.data;

            if (searchResult === "noresult") {
                console.log("검색 결과가 없습니다.", searchResult);
                navigate("/SearchResult", { state: { searchResult, keyword: searchTerm } });


            } else {
                console.log("검색 결과:", searchResult);
                // 검색 결과 페이지로 이동
                navigate("/SearchResult", { state: { searchResult, keyword: searchTerm } });
            }
        } catch (error) {
            console.error("검색 중 에러 발생:", error);
        }
    };

    const handleUserClick = () => {
        if (isLoggedIn) {
            navigate(`/user`);
        } else {
            setLoginPopup(true);
        }
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error(
                    "토큰이 없습니다. 사용자는 이미 로그아웃된 상태일 수 있습니다."
                );
                return;
            }

            await axios.post(
                "/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // 로컬 스토리지에서 토큰 삭제
            localStorage.removeItem("token");
            setLoggedIn(false);
            navigate("/main");
        } catch (error) {
            console.error("로그아웃 에러:", error);
        }
    };

    const closeModal = () => {
        setLoginPopup(false);
    };

    const checkAuthentication = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // 토큰이 없으면 로그인되어 있지 않음
                setLoggedIn(false);
                return;
            }

            // 백엔드에 인증된 요청을 보냄
            const response = await axios.get("/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 응답에서 사용자 정보를 가져와 인증 상태 확인
            if (response.status === 200) {
                // 사용자가 인증되어 있는 경우
                setLoggedIn(true);

                // 사용자 정보에서 이메일 가져오기
                const userEmail = response.data.user.email;
                setUserEmail(userEmail);

                // 응답에서 사용자 데이터 추출
                const userData = response.data.user;

                // 사용자 데이터 설정
                setUserData(userData);
            } else {
                // 사용자가 인증되어 있지 않은 경우
                setLoggedIn(false);
            }
        } catch (error) {
            // 요청 실패 시 에러 처리
            console.error("Error checking authentication status:", error);
            setLoggedIn(false); // 로그인되어 있지 않음
        }
    };

    return (
        <div>
            <div className="navbar">
                <div className="navbarLeft">
                    <Link className="navbarLogo" to={"/main"}>
                        <img src="/img/logo.png" alt="Logo" className="logoImage" />
                        <span className="logoText">
                            BOGO
                            <br />
                            POP
                        </span>
                    </Link>
                    <Link className="navbarMenu" to={"/movies"}>
                        영화
                    </Link>
                    <Link className="navbarMenu" to={"/ranks"}>
                        랭킹
                    </Link>
                    <Link className="navbarMenu" to={"/lists"}>
                        리스트
                    </Link>
                </div>

                <div className="navbarRight">
                    <input
                        type="text"
                        placeholder="검색"
                        className="searchBar"
                        value={searchTerm}
                        onChange={handleSearchChange} // 검색어 입력 시 핸들러 호출
                    />
                    <button className="searchButton" onClick={handleSearch}>
                        <img src="/img/search.png" alt="Search" className="searchIcon" />
                    </button>

                    {isLoggedIn ? (
                        <div className="LoginRight">
                            <div className="LoginButton" onClick={handleLogout}>
                                로그아웃
                            </div>
                            <div className="userButton" onClick={handleUserClick}>
                                <img src={`/img/${userData.profile}`} alt="User" className="userImage" />
                            </div>
                        </div>
                    ) : (
                        <div className="LoginRight">
                            <div className="LoginButton" onClick={handleUserClick}>
                                로그인
                            </div>
                            <div className="userButton" onClick={handleUserClick}>
                                <img src="/img/poco.png" alt="User" className="userImage" />
                            </div>
                        </div>
                    )}
                </div>
                {LoginPopup && (
                    <SignIn
                        isOpen={setLoginPopup}
                        setLoggedIn={setLoggedIn}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
}
export default Navbar;
