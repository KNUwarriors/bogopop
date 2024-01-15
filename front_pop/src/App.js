import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Movies from './pages/Movies';
import Ranks from './pages/Ranks';
import Lists from './pages/Lists';
import User from './pages/User';

function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <Navbar />
                <Routes>
                    <Route path="/main" element={<Main />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/ranks" element={<Ranks />} />
                    <Route path="/lists" element={<Lists />} />
                    <Route path="/user" element={<User />} />
                </Routes>
            </div>

        </BrowserRouter>
    );
}

export default App;
