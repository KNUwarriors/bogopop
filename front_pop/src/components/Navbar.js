import { Link, useNavigate, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import './navbar.css';
import SignIn from './SignIn';

function Navbar() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [LoginPopup, setLoginPopup] = useState(false);
    const navigate = useNavigate();

    const handleSearch = () => {
        console.log("검색 버튼이 눌림요.");
    };

    const handleUserClick = () => {
        if (isLoggedIn) {
            navigate('/user');
        } else {
            setLoginPopup(true);
        }
    };

    const closeModal = () => {
        setLoginPopup(false);
    };

    return (
        <div>
            <div className="navbar">
                <div className='navbarLeft'>
                    <Link className='navbarLogo' to={'/main'}>
                        <img src='/img/logo.png' alt="Logo" className="logoImage" />
                        <span className='logoText'>BOGO<br />POP</span>
                    </Link>
                    <Link className="navbarMenu" to={'/movies'}>영화</Link>
                    <Link className="navbarMenu" to={'/ranks'}>랭킹</Link>
                    <Link className="navbarMenu" to={'/lists'}>리스트</Link>
                </div>

                <div className='navbarRight'>
                    <input type="text" placeholder="검색" className="searchBar" />
                    <button className='searchButton' onClick={handleSearch}>
                        <img src='/img/search.png' alt='Search' className='searchIcon' />
                    </button>
                    <div className='userButton' onClick={handleUserClick}>
                        <img src='/img/poco.png' alt="User" className='userImage' />
                    </div>
                </div>
                {LoginPopup && (
                    <SignIn isOpen={setLoginPopup} setLoggedIn={setLoggedIn} onClose={closeModal} />
                )}

            </div>
        </div>
    );
}
export default Navbar;
