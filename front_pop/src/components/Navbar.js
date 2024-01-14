import { Link } from 'react-router-dom';
import React from 'react';
import './navbar.css';

function Navbar() {
    const handleSearch = () => {
        console.log("검색 버튼이 눌림요.");
    };

    return (
        <div>
            <div className="navbar">

                <div className='navbarLeft'>
                    {/* 로고 */}
                    <Link className='navbarLogo' to={'/main'}>
                        <img src='/img/logo.png' alt="Logo" className="logoImage" />
                        <span className='logoText'>BOGO<br />POP</span>
                    </Link>
                    {/* 카테고리 */}
                    <Link className="navbarMenu" to={'/movies'}>영화</Link>
                    <Link className="navbarMenu" to={'/ranks'}>랭킹</Link>
                    <Link className="navbarMenu" to={'/lists'}>리스트</Link>
                </div>

                <div className='navbarRight'>
                    {/* 검색 창 */}
                    <input type="text" placeholder="검색" className="searchBar" />
                    <button className='searchButton' onClick={handleSearch}>
                        <img src='/img/search.png' alt='Search' className='searchIcon' />
                    </button>
                    {/* 사용자 프로필 */}
                    <Link to={'/user'} className='userButton'>
                        <img src='/img/poco.png' alt="User" className='userImage' />
                    </Link>
                </div>

            </div>
        </div>
    );
}
export default Navbar;
