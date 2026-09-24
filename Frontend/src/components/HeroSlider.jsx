import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const HeroSlider = ({ currentMovie, fade, watchlistCount}) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const today = new Date();

  const released =
    currentMovie &&
    new Date(currentMovie.releaseDate) <= today;

  const formattedDate = currentMovie
    ? new Date(currentMovie.releaseDate).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    )
    : "";

  const backgroundImage = currentMovie?.backdropPath
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdropPath}`
    : `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80`;

  return (
    <section className="hero-slider">

      <Navbar watchlistCount={watchlistCount} />

      {/* Background */}
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className={`hero-info ${fade ? "content-show" : "content-hide"}`}>

        {token && currentMovie ? (

          /* ── LOGGED-IN STATE ── */
          <>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span className="hero-subtitle">Continue Watching</span>
            </div>

            <h1>{currentMovie.title}</h1>

            <div className="hero-meta">
              <span className="hero-meta-item is-rating">
                ★ {currentMovie.rating.toFixed(1)}
              </span>
              <span className="hero-meta-item">
                {formattedDate.split(" ").pop()}
              </span>
            </div>

            <p>{currentMovie.overview}</p>

            {released && currentMovie.providerName ? (

              <div className="provider">
                <span className="provider-label">Available on</span>
                <div className="provider-info">
                  <img
                    src={`https://image.tmdb.org/t/p/original${currentMovie.providerLogo}`}
                    alt={currentMovie.providerName}
                  />
                  <span className="provider-name">
                    {currentMovie.providerName}
                  </span>
                </div>
              </div>

            ) : (

              <div className="provider">
                <span className="provider-label">🎬 In theatres from</span>
                <strong className="provider-date">{formattedDate}</strong>
              </div>

            )}
          </>

        ) : (

          /* ── GUEST STATE ── */
          <>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span className="hero-subtitle">Welcome to CineStack</span>
            </div>

            <h1 className="hero-guest-count">
              3,51,89,546<span className="hero-count-accent">+</span>
              <br />Movies
            </h1>

            <h2>How many did You Watch?</h2>

            <p>
              Track your favorites.
              Organize your binge-watching.
              All in one place.
            </p>
          {
            !token?  (
            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Get Started →
            </button>
            ):(
               <button
              className="primary-btn"
              onClick={() => navigate("#")}
            >
              Add Movies to your List
            </button>
            )
          }
          </>

        )}

      </div>

    </section>
  );
};

export default HeroSlider;