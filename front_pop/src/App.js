import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import Main from './pages/Main';
import Movies from './pages/Movies';
import Ranks from './pages/Ranks';
import Lists from './pages/Lists';
import MovieDetails from './pages/MovieDetails';
import User from './pages/User';
import SignIn from './components/SignIn';

function App() {
    const [data, setData] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [LoginPopup, setLoginPopup] = useState(false);

    const handleUserClick = () => {
        if (isLoggedIn) {
            return <Navigate to="/user" />;
        } else {
            setLoginPopup(true);
        }
    };

    const closeModal = () => {
        setLoginPopup(false);
    };

    useEffect(() => {
        axios.get('/api/data')
            .then(res => setData(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <BrowserRouter>
            <div className='App'>
                <Navbar />
                <Routes>
                    <Route path="" element={<Main />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/ranks" element={<Ranks />} />
                    <Route path="/lists" element={<Lists />} />
                    <Route path="/movies/:id" element={<MovieDetails />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/login"
                        element={<SignIn isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} onClose={closeModal} />}
                    />
                </Routes>
                <div>{data}</div>
            </div>

        </BrowserRouter>
    );
}

export default App;
