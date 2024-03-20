import React from 'react';
import './searchResult.css';
import { useLocation } from "react-router-dom";

const SearchResult = () => {
    const location = useLocation();
    const { searchResult, keyword } = location.state;
    console.log("in searchresult.js:", searchResult);
    console.log("Search keyword:", keyword);
    // const searchResult = location.state.searchResult;
    const resultLen = searchResult.length;
    console.log("in searchresult.js:", searchResult.length);

    return (
        <div>
            <h2 className='search_result'> "{keyword}"에 대한 검색 결과: {resultLen}개</h2>
            <hr></hr>
            {searchResult.map((result, index) => (
                <div key={index} >
                    <div className='search_result_movie'>
                        <img src={result.poster_path} className='search_result_poster'></img>
                        <div>
                            <div className='search_result_title_area'>
                                <p className='search_result_title'>{result.koreanTitle}</p>
                                <p className='search_result_title_origin'>{result.originalTitle}</p>
                                <p className='search_result_release_year'>{new Date(result.release_date).getFullYear()}</p>
                            </div>
                            <div className='search_result_dc'>
                                <p className='search_result_directors'>{result.directors}</p>
                                <p className='search_result_cast'>{result.cast}</p>
                            </div>
                        </div>
                    </div>
                    <hr />

                </div>

            ))}
        </div>
    );
};

export default SearchResult;