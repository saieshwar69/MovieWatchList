import { useNavigate } from "react-router-dom";

const MovieCard = ({
  movie,
  onAdd,
  watchlistIds = new Set(),
  isMyList = false,
  onToggleWatched,
  onDelete
}) => {

  const navigate = useNavigate();

  const tmdbId = movie.tmdbId || movie.id;

  const added = watchlistIds.has(Number(tmdbId));

  const posterPath = movie.poster_path || movie.posterPath;

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${tmdbId}`)}
    >

      <img
        src={
          posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.title}
      />

      {/* HOME / SEARCH / OTHER SECTIONS */}
      {!isMyList && (
        <button
          className={`add-btn ${added ? "watched" : ""}`}
          disabled={added}
          onClick={(e) => {
            e.stopPropagation();

            if (!added && onAdd) {
              onAdd(movie, "trending");
            }
          }}
        >
          {added ? "✔" : "+"}
        </button>
      )}

      {/* MY LIST */}
      {isMyList && (
        <div className="movie-actions">

          {!movie.watched && (
            <button
              className="add-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatched(movie);
              }}
            >
              ✔
            </button>
          )}

          {!movie.watched && (
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(movie._id);
              }}
            >
              ✕
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default MovieCard;