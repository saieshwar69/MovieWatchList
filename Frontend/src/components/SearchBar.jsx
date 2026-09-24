import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
import MovieGrid from "./MovieGrid";

const SearchBar = ({ handleAddToList, watchlistIds }) => {

    const [searchType, setSearchType] = useState("movie");
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {

        if (!searchQuery)  return;
        
        const fetchMovies = async () => {
            let url = "";
            switch (searchType) {
                case "movie":
                    url =
                        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`;
                    break;
                case "year":
                    url =
                        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${searchQuery}`;
                    break;
                case "rating":
                    url =
                        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&vote_average.gte=${searchQuery}&vote_count.gte=300`;
                    break;

                case "cast": {

                    const personRes = await fetch(
                        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${searchQuery}`
                    );

                    const personData = await personRes.json();

                    if (personData.results.length === 0) {

                        setSearchResults([]);

                        return;
                    }

                    const personId = personData.results[0].id;

                    const movieRes = await fetch(
                        `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${API_KEY}`
                    );

                    const movieData = await movieRes.json();

                    setSearchResults(movieData.cast);

                    return;
                }
                case "director": {

                    const personRes = await fetch(
                        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${searchQuery}`
                    );

                    const personData = await personRes.json();

                    if (personData.results.length === 0) {

                        setSearchResults([]);

                        return;
                    }

                    const personId = personData.results[0].id;

                    const movieRes = await fetch(
                        `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${API_KEY}`
                    );

                    const movieData = await movieRes.json();

                    const directedMovies =
                        movieData.crew.filter(movie =>

                            movie.job === "Director"

                        );

                    setSearchResults(directedMovies);

                    return;
                }
                default:
                    return;
            }

            const res = await fetch(url);
            const data = await res.json();
            setSearchResults(data.results || []);
        };
        fetchMovies();
    }, [searchQuery, searchType]);


    return (
        <div className="search-box">

            <input
                type="text"
                className="search-input"
                placeholder={
                    searchType === "movie"
                        ? "Search Movie..."
                        : searchType === "year"
                            ? "Enter Release Year..."
                            : searchType === "rating"
                                ? "Minimum Rating (0-10)..."
                                : "Search..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
                className="search-type"
                value={searchType}
                onChange={(e) => {

                    setSearchType(e.target.value);

                    setSearchQuery("");

                    setSearchResults([]);

                }}
            >

                <option value="movie">Movie</option>

                <option value="year">Release Year</option>

                <option value="rating">Minimum Rating</option>

                <option value="cast">Cast</option>

                <option value="director">Director</option>

            </select>

            {searchQuery.trim() !== "" && (
                <>
                    <h2>Search Results</h2>

                    {searchResults.length > 0 ? (
                        <MovieGrid
                            movies={searchResults}
                            onAdd={handleAddToList}
                            watchlistIds={watchlistIds}
                        />
                    ) : (
                        <h3>No Results Found</h3>
                    )}
                </>
            )}

        </div>
    );
};

export default SearchBar;
