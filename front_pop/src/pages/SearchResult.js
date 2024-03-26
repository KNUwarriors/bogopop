import React from 'react';
import './searchResult.css';
import { useLocation, Link } from "react-router-dom";


const SearchResult = () => {
    const location = useLocation();
    const { searchResult, keyword } = location.state;
    console.log("in searchresult.js:", searchResult);
    console.log("Search keyword:", keyword);
    // searchResult가 배열이 아닌 경우, 빈 배열로 초기화
    const results = Array.isArray(searchResult) ? searchResult : [];
    const resultLen = results.length;
    console.log("in searchresult.js:", searchResult.length);

    return (
        <div className='result_page'>
            {resultLen > 0 ? (
                <>
                    <h2 className='search_result'> "{keyword}"에 대한 검색 결과: {resultLen}개</h2>
                    <hr></hr>
                    {searchResult.map((result, index) => (
                        <div key={index} >
                            <Link className='search_result_movie' to={`/movies/${result.id}`}>
                                <img src={result.poster_path} className='search_result_poster'></img>
                                <div>
                                    <div className='search_result_title_area'>
                                        <p className='search_result_title'>{result.koreanTitle}</p>
                                        <p className='search_result_title_origin'>{result.originalTitle}</p>
                                        <p className='search_result_release_year'>{new Date(result.release_date).getFullYear()}</p>
                                    </div>
                                    <div className='search_result_dc'>
                                        <p className='search_result_directors'>감독: {formatArrayToString(result.directors)}</p>
                                        <p className='search_result_cast'>출연진: {formatArrayToString(result.cast)}</p>
                                    </div>
                                </div>
                            </Link>
                            <hr />
                        </div>
                    ))}
                </>
            ) : (
                <h2 className='no_search_result'>"{keyword}"에 대한 검색 결과가 없습니다.</h2>
            )}
        </div>
    );
};

export default SearchResult;

function formatArrayToString(str) {
    if (typeof str === 'string') {
        return str.replace(/[\[\]']+/g, '').trim();
    }
    return str;
}