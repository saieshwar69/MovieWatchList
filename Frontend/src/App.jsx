import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useEffect, useState } from "react";
import Hero from "./components/Home";
import MyList from "./components/MyList";
import Login from "./components/Login";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
const API_BASE = import.meta.env.VITE_API_BASE_URL;


const App = () => {

  
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  // fetch count from backend
  const fetchWatchlistCount = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      setWatchlistCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/movies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setWatchlistCount(data.length);
      const ids = new Set(data.map(movie => Number(movie.tmdbId)));
      setWatchlistIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  // load count on app start
 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount, intentional
  fetchWatchlistCount();
}, []);

  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Hero
          refreshWatchlistCount={fetchWatchlistCount} 
          watchlistIds={watchlistIds}
          watchlistCount={watchlistCount}/>} />
        <Route path="/my-list" element={<MyList refreshWatchlistCount={fetchWatchlistCount} />} />
        <Route path="/login" element={<Login onLogin={fetchWatchlistCount} />} />

        <Route
          path="/movie/:id"
          element={<MovieDetails  refreshWatchlistCount={fetchWatchlistCount}  watchlistIds={watchlistIds}/>}
        />
     
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
