import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import MovieGrid from "./MovieGrid";
import MovieCard from "./MovieCard";

const MyList = ({ refreshWatchlistCount }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("toWatch");

  const groupMoviesByDate = (movies, type) => {
    return movies.reduce((groups, movie) => {
      const date = new Date(
        type === "watched" ? movie.watchedAt : movie.createdAt
      );
      const key = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(movie);
      return groups;
    }, {});
  };

  const deleteMovie = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/movies/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return;
    setMovies(prev => prev.filter(m => m._id !== id));
    refreshWatchlistCount();
    // fetchWatchlist();
  };

  const toggleWatched = async (movie) => {
    if (movie.watched) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/movies/${movie._id}/toggle`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return;
    const updated = await res.json();
    alert("Great! Marked as watched 🎉");
    setMovies(prev => prev.map(m => (m._id === updated._id ? updated : m)));
    // fetchWatchlist();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view your list");
      navigate("/login");
      return;
    }
    fetch(`${API_BASE}/api/movies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toWatchMovies = movies.filter(movie => !movie.watched);
  const watchedMovies = movies.filter(movie => movie.watched);
  const groupedToWatch = groupMoviesByDate(toWatchMovies, "created");
  const groupedWatched = groupMoviesByDate(watchedMovies, "watched");

  const getFriendlyDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="movie-loading">
        <div className="loader"></div>
        <h2>Loading List...</h2>
      </div>
    );
  }

  const activeGroups = activeTab === "toWatch" ? groupedToWatch : groupedWatched;
  const activeCount = activeTab === "toWatch" ? toWatchMovies.length : watchedMovies.length;

  return (
    <div className="content-section">
      <div className="mylist-links">
        <span
          className={activeTab === "toWatch" ? "active-link" : ""}
          onClick={() => setActiveTab("toWatch")}
        >
          To Watch <span className="tab-count">{toWatchMovies.length}</span>
        </span>
        <span
          className={activeTab === "watched" ? "active-link" : ""}
          onClick={() => setActiveTab("watched")}
        >
          Watched <span className="tab-count">{watchedMovies.length}</span>
        </span>
        <div className="back-btn" onClick={() => navigate(`/`)}> X </div>
      </div>

      {movies.length === 0 ? (
        <p className="empty-state">No movies added yet</p>
      ) : activeCount === 0 ? (
        <p className="empty-state">
          {activeTab === "toWatch" ? "Nothing left to watch — add more!" : "You haven't watched anything yet"}
        </p>
      ) : (
        <div className="lists-wrapper">
          {Object.entries(activeGroups).map(([date, movies]) => (
            <div key={date} className="date-group">
              <h2 className="date-heading">
                {activeTab === "toWatch"
                  ? `Added on ${getFriendlyDate(date)}`
                  : `Watched on ${getFriendlyDate(date)}`}
              </h2>
              <div className="movies-grid">
                {movies.map(movie => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    isMyList={true}
                    onToggleWatched={toggleWatched}
                    onDelete={deleteMovie}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;