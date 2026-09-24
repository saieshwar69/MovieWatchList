import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import HeroSlider from "./HeroSlider";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";


const Hero = ({ refreshWatchlistCount, watchlistIds, watchlistCount }) => {

  const [movies, setMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const userEmail = localStorage.getItem("userEmail");
  const isMyListPage = location.pathname === "/my-list";
  const isLoginPage = location.pathname === "/login";
  const [fade, setFade] = useState(true);


  const fetchWatchlist = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const unwatched = data.filter(movie => !movie.watched);

      setWatchlistMovies(unwatched);

      if (unwatched.length > 0)
        setCurrentMovie(unwatched[0]);
      else
        setCurrentMovie(null);

    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount, intentional
  fetchWatchlist();
}, []);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const currentYear = new Date().getFullYear();

      const [nowPlayingRes, upcomingRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`
        )
      ]);

      const nowPlaying = await nowPlayingRes.json();
      const upcoming = await upcomingRes.json();

      const allMovies = [...nowPlaying.results, ...upcoming.results];

      // Remove duplicates
      const uniqueMovies = allMovies.filter(
        (movie, index, self) =>
          index === self.findIndex(m => m.id === movie.id)
      );

      const currentYearMovies = uniqueMovies
        .filter(
          movie =>
            movie.release_date &&
            new Date(movie.release_date).getFullYear() === currentYear
        )
        .sort(
          (a, b) =>
            new Date(b.release_date) - new Date(a.release_date)
        )
        .slice(0, 12);

      setMovies(currentYearMovies);
    };

    fetchNewArrivals();
  }, []);

  //Movie sliding 
  useEffect(() => {
    if (!token) return;

    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/movies`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        const unwatched = data.filter(movie => !movie.watched);

        setWatchlistMovies(unwatched);

        if (unwatched.length > 0) {
          setCurrentMovie(unwatched[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWatchlist();
  }, []);


  //Sliding
  useEffect(() => {
    if (watchlistMovies.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        index = (index + 1) % watchlistMovies.length;
        setCurrentMovie(watchlistMovies[index]);
        setFade(true);
      }, 500)

    }, 5000);

    return () => clearInterval(interval);
  }, [watchlistMovies]);



  useEffect(() => {
    const fetchTopRatedMovies = async () => {

      const currentYear = new Date().getFullYear();

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=1000&primary_release_date.gte=${currentYear - 1}-01-01&primary_release_date.lte=${currentYear}-12-31`
      );

      const data = await res.json();

      setTopRatedMovies(data.results.slice(0, 12));
    };

    fetchTopRatedMovies();
  }, []);

  const [biopics, setBiopics] = useState([]);

  useEffect(() => {

    const fetchBiopics = async () => {

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=5565&sort_by=popularity.desc`
      );

      const data = await res.json();

      setBiopics(data.results.slice(0, 12));
    };

    fetchBiopics();

  }, []);

  const [trueStories, setTrueStories] = useState([]);

  useEffect(() => {

    const fetchTrueStories = async () => {

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=9672&sort_by=popularity.desc`
      );

      const data = await res.json();

      setTrueStories(data.results.slice(0, 12));

    };

    fetchTrueStories();

  }, []);


  // ➕ Add to backend
  const handleAddToList = async (movie) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const providerRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
    );

    const providerData = await providerRes.json();

    const india = providerData.results?.IN;

    let providerName = null;
    let providerLogo = null;
    let providerId = null;

    if (india?.flatrate?.length) {
      providerName = india.flatrate[0].provider_name;
      providerLogo = india.flatrate[0].logo_path;
      providerId = india.flatrate[0].provider_id;
    }

    const res = await fetch(`${API_BASE}/api/movies`, {
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
    });

    if (!res.ok) return;

    refreshWatchlistCount();
    await fetchWatchlist();

  };

  return (
    <section className="hero">

      

      <HeroSlider currentMovie={currentMovie} fade={fade}  watchlistCount={watchlistCount} />

      <div className="content-section">

        {!isMyListPage && !isLoginPage && (
          <SearchBar handleAddToList={handleAddToList} watchlistIds={watchlistIds}/>
        )}

        
      </div>


      <div className="content-section">
        <h2>New Arrivals</h2>
        <MovieGrid movies={movies} onAdd={handleAddToList} watchlistIds={watchlistIds} />
      </div>

      <div className="content-section">
        <h2>Biopic's</h2>
        <MovieGrid movies={biopics} onAdd={handleAddToList} watchlistIds={watchlistIds} />
      </div>
      <div className="content-section">
        <h2>Based On TrueStories</h2>
        <MovieGrid movies={trueStories} onAdd={handleAddToList} watchlistIds={watchlistIds} />
      </div>
      <div className="content-section">
        <h2>Top Rated of the Year</h2>
        <MovieGrid movies={topRatedMovies} onAdd={handleAddToList} watchlistIds={watchlistIds} />
      </div>


    </section>
  );
};

export default Hero;

