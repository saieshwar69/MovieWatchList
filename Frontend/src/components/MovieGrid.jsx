import { useRef } from "react";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, onAdd, watchlistIds }) => {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const scrollAmount = track.clientWidth * 0.85;
    track.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="movies-carousel">
      <button
        className="carousel-arrow carousel-arrow-left"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
      >
        ‹
      </button>

      <div className="movies-grid" ref={trackRef}>
        {movies.map(movie => (
          <MovieCard
            key={movie._id || movie.id}
            movie={movie}
            onAdd={onAdd}
            watchlistIds={watchlistIds}
          />
        ))}
      </div>

      <button
        className="carousel-arrow carousel-arrow-right"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
};

export default MovieGrid;