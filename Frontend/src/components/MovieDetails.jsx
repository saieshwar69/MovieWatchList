import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieGrid from "./MovieGrid";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE = "https://image.tmdb.org/t/p/original";
const POSTER = "https://image.tmdb.org/t/p/w500";

const MovieDetails = ({ refreshWatchlistCount, watchlistIds }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState([]);
    const [director, setDirector] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [providers, setProviders] = useState(null);

    // Scroll to top whenever movie changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, [id]);

    useEffect(() => {
        const fetchEverything = async () => {
            try {
                const [
                    movieRes,
                    videoRes,
                    castRes,
                    similarRes,
                    reviewRes,
                    providerRes
                ] = await Promise.all([
                    // Movie details
                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
                    ),
                    // Trailers
                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
                    ),
                    // Cast + Crew
                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
                    ),
                    // Similar movies
                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
                    ),
                    // Reviews
                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}`
                    ),
                    // Streaming providers
                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
                    )
                ]);

                const [
                    movieData,
                    videoData,
                    castData,
                    similarData,
                    reviewData,
                    providerData
                ] = await Promise.all([
                    movieRes.json(),
                    videoRes.json(),
                    castRes.json(),
                    similarRes.json(),
                    reviewRes.json(),
                    providerRes.json()
                ]);

                // Movie
                setMovie(movieData);

                // Trailer
                const trailerVideo = videoData.results?.find(
                    video =>
                        video.site === "YouTube" &&
                        video.type === "Trailer"
                );
                setTrailer(trailerVideo || null);

                // Cast
                setCast(
                    castData.cast?.slice(0, 12) || []
                );

                // Director
                const movieDirector = castData.crew?.find(
                    person => person.job === "Director"
                );
                setDirector(movieDirector || null);

                // Similar movies
                setSimilarMovies(
                    similarData.results?.slice(0, 12) || []
                );

                // Reviews
                setReviews(
                    reviewData.results?.slice(0, 5) || []
                );

                // Streaming providers - India
                setProviders(
                    providerData.results?.IN || null
                );
            } catch (err) {
                console.error("Movie details error:", err);
            }
        };

        fetchEverything();
    }, [id]);

    // Add movie to user's watchlist
    const handleAddToList = async (movie) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        try {
            // Fetch streaming provider
            const providerRes = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
            );

            const providerData = await providerRes.json();
            const india = providerData.results?.IN;

            let providerName = null;
            let providerLogo = null;
            let providerId = null;

            if (india?.flatrate?.length) {
                providerName =
                    india.flatrate[0].provider_name;
                providerLogo =
                    india.flatrate[0].logo_path;
                providerId =
                    india.flatrate[0].provider_id;
            }

            const res = await fetch(
                `${API_BASE}/api/movies`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tmdbId: movie.id,
                        title: movie.title,
                        rating: movie.vote_average || 0,
                        watched: false,
                        posterPath: movie.poster_path,
                        backdropPath: movie.backdrop_path,
                        overview: movie.overview,
                        releaseDate: movie.release_date,
                        providerName,
                        providerLogo,
                        providerId
                    })
                }
            );

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                alert(
                    errorData?.message ||
                    "Movie could not be added"
                );
                return;
            }

            // Refresh global watchlist state
            refreshWatchlistCount();
        } catch (err) {
            console.error("Add movie error:", err);
        }
    };

    // Loading state
    if (!movie) {
        return (
            <div className="movie-loading">
                <div className="loader"></div>
                <h2>
                    Loading Movie...
                </h2>
            </div>
        );
    }

    // Check whether movie is already in user's list
    const inlist =
        watchlistIds?.has(Number(movie.id));

    return (
        <div className="movie-page">
            {/* =====================================================
                BACK BUTTON
            ====================================================== */}
            <div
                className="back-btn"
                onClick={() => navigate("/")}
                title="Back to Explore"
            >
                X
            </div>

            {/* =====================================================
                HERO
            ====================================================== */}
            <div
                className="movie-hero"
                style={{
                    backgroundImage:
                        `url(${IMAGE}${movie.backdrop_path})`
                }}
            >
                <div className="movie-hero-inner">
                    {/* POSTER */}
                    <div className="movie-left">
                        <img
                            src={`${POSTER}${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <div className="movie-rating-badge">
                            <span className="badge-num">
                                {movie.vote_average?.toFixed(1)}
                            </span>
                            <span className="badge-lbl">
                                IMDb
                            </span>
                        </div>
                    </div>

                    {/* MOVIE INFORMATION */}
                    <div className="movie-right">
                        {/* Genre + Year */}
                        <div className="movie-eyebrow">
                            <span className="movie-eyebrow-tag">
                                {movie.genres?.[0]?.name || "Film"}
                            </span>
                            <span className="movie-eyebrow-year">
                                {movie.release_date?.slice(0, 4)}
                            </span>
                        </div>

                        {/* Title */}
                        <h1>
                            {movie.title}
                        </h1>

                        {/* Meta */}
                        <div className="movie-meta">
                            <span className="movie-meta-item is-rating">
                                ★ {movie.vote_average?.toFixed(1)}
                            </span>
                            <span className="movie-meta-item">
                                {movie.release_date || "N/A"}
                            </span>
                            <span className="movie-meta-item">
                                {movie.runtime
                                    ? `${movie.runtime} mins`
                                    : "Runtime N/A"
                                }
                            </span>
                        </div>

                        {/* Genres */}
                        <div className="movie-genres">
                            {movie.genres?.map(g => (
                                <span key={g.id}>
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        {/* Overview */}
                        <p className="movie-overview">
                            {movie.overview ||
                                "No description available for this movie."
                            }

                            {/* Director */}
                            {director && (
                                <div className="movie-director">
                                    <span>
                                        Director :
                                    </span>
                                    <strong>
                                        {director.name}
                                    </strong>
                                </div>
                            )}
                        </p>

                        {/* Add Button */}
                        <div className="movie-actions">
                            <button
                                className="btn-add-list"
                                disabled={inlist}
                                onClick={() =>
                                    handleAddToList(movie)
                                }
                            >
                                {inlist
                                    ? "✔ Added"
                                    : "+ Add To List"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                BELOW HERO
            ====================================================== */}
            <div className="movie-sections">
                {/* =================================================
                    STREAMING PLATFORMS
                ================================================== */}
                <div className="streaming-section">
                    <div className="section-heading">
                        <h2>
                            Available On
                        </h2>
                    </div>

                    {providers?.flatrate?.length ? (
                        <div className="provider-list">
                            {providers.flatrate.map(provider => (
                                <div
                                    key={provider.provider_id}
                                    className="provider-card"
                                >
                                    <img
                                        src={
                                            `https://image.tmdb.org/t/p/original${provider.logo_path}`
                                        }
                                        alt={provider.provider_name}
                                    />
                                    <p>
                                        {provider.provider_name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="provider-none">
                            Currently unavailable for
                            streaming in India.
                        </p>
                    )}
                </div>

                {/* =================================================
                    OFFICIAL TRAILER
                ================================================== */}
                {trailer && (
                    <div className="trailer-section">
                        <div className="section-heading">
                            <h2>
                                Official Trailer
                            </h2>
                        </div>

                        <div className="trailer-player">
                            <iframe
                                src={
                                    `https://www.youtube.com/embed/${trailer.key}`
                                }
                                title={`${movie.title} Official Trailer`}
                                allow="
                                    accelerometer;
                                    autoplay;
                                    clipboard-write;
                                    encrypted-media;
                                    gyroscope;
                                    picture-in-picture;
                                    web-share
                                "
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {/* =================================================
                    CAST
                ================================================== */}
                {cast.length > 0 && (
                    <div className="cast-section">
                        <div className="section-heading">
                            <h2>
                                Top Cast of {movie.title}
                            </h2>
                        </div>

                        <div className="cast-grid">
                            {cast.map(person => (
                                <div
                                    key={person.id}
                                    className="cast-card"
                                >
                                    {person.profile_path ? (
                                        <img
                                            src={
                                                `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                            }
                                            alt={person.name}
                                        />
                                    ) : (
                                        <div className="cast-placeholder">
                                            No Image
                                        </div>
                                    )}

                                    <div className="cast-info">
                                        <p className="cast-name">
                                            {person.name}
                                        </p>
                                        <p className="cast-character">
                                            {person.character}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* =================================================
                    REVIEWS
                ================================================== */}
                

                    {reviews.length > 0 ? (
                        <div className="reviews-section">
                            <div className="section-heading">
                    <h2>
                        User Reviews
                    </h2>
                    </div>
                            <div className="reviews-list">
                                {reviews.map(review => (
                                    <div
                                        key={review.id}
                                        className="review-card"
                                    >
                                        <div className="review-header">
                                            <div>
                                                <h3>
                                                    {review.author}
                                                </h3>
                                                <span>
                                                    {review.created_at
                                                        ? new Date(
                                                            review.created_at
                                                        ).toLocaleDateString()
                                                        : ""
                                                    }
                                                </span>
                                            </div>

                                            {review.author_details?.rating && (
                                                <div className="review-rating">
                                                    ★{" "}
                                                    {review.author_details.rating}
                                                    /10
                                                </div>
                                            )}
                                        </div>

                                        <p className="review-content">
                                            {review.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                    ) :
                    (
                        <>
                        <div className="section-heading">
                            <h2>
                                User Reviews
                            </h2>
                        </div>
                        <div className="reviews-list">
                            <h2>No reviewS atttttttt</h2>
                        </div>
                        </>
                        
                    )}
                

                {/* =================================================
                    SIMILAR MOVIES
                ================================================== */}
                {similarMovies.length > 0 && (
                    <div className="similar-section">
                        <div className="section-heading">
                            <h2>
                                You May Also Like
                            </h2>
                        </div>

                        <MovieGrid
                            movies={similarMovies}
                            onAdd={handleAddToList}
                            watchlistIds={watchlistIds}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;