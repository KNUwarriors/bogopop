import React from 'react';
import './user.css';

function User() {
    return (
        <div>
            <div className='UserTopImage'>
                <div className='gradientOverlay'></div>
                <img src='/img/오펜하이머.jpg' alt="TopImage" className="TopImage" />
                <img src='/img/poco.png' alt='UserImage' className='UserImage' />
            </div>
        </div>
    )
}
export default User;