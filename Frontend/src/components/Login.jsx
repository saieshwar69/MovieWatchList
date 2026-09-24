import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG    = "https://image.tmdb.org/t/p/w500";

const Login = ({ onLogin }) => {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [isRegister, setIsRegister]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [showSuccess, setShowSuccess]   = useState(false);
  const [posters, setPosters]           = useState([]);

  const navigate = useNavigate();

  /* ── Fetch TMDB posters for the film strip ── */
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=vote_average.desc&vote_count.gte=3000&primary_release_date.gte=2020-01-01&primary_release_date.lte=2025-12-31`
        );
        const data = await res.json();
        const withPosters = (data.results || []).filter((m) => m.poster_path);
        setPosters(withPosters.slice(0, 10));
      } catch {
        /* silently fail — strip stays gradient-only */
      }
    };
    fetchPosters();
  }, []);

  /* ── Auth ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isRegister
      ? `${API_BASE_URL}/api/auth/register`
      : `${API_BASE_URL}/api/auth/login`;

    try {
      const res  = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (!isRegister) {
        localStorage.setItem("token",     data.token);
        localStorage.setItem("userEmail", data.user.email);
        onLogin();
        navigate("/", { replace: true });
      } else {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsRegister(false);
        }, 2200);
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setIsRegister(mode === "register");
    setError("");
  };

  /* Duplicate posters so the CSS scroll loop is seamless */
  const stripPosters = posters.length > 0 ? [...posters, ...posters] : [];

  return (
    <div className="auth-page">

      {/* ══ LEFT — Film strip ══ */}
      <div className="film-panel">

        <div className="film-columns">
          {/* Column A — scrolls upward */}
          <div className="film-col film-col--up">
            {stripPosters.map((m, i) => (
              <div className="film-card" key={`a-${i}`}>
                <img src={`${TMDB_IMG}${m.poster_path}`} alt={m.title} loading="lazy" />
              </div>
            ))}
          </div>

          {/* Column B — scrolls downward */}
          <div className="film-col film-col--down">
            {[...stripPosters].reverse().map((m, i) => (
              <div className="film-card" key={`b-${i}`}>
                <img src={`${TMDB_IMG}${m.poster_path}`} alt={m.title} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient fade edges */}
        <div className="film-fade-top"    />
        <div className="film-fade-bottom" />
        <div className="film-fade-right"  />

        {/* Brand overlay */}
        <div className="film-brand">
          <div className="film-logo">Cine<em>Stack</em></div>
          <div className="film-tagline">Your personal cinema</div>
        </div>

      </div>

      {/* ══ RIGHT — Form ══ */}
      <div className="form-panel">
        <div className="form-box">

          <div className="form-head">
            <h1 className="auth-title">
              <span className="cyan-dot" />
              {isRegister ? "Create account" : "Welcome back"}
            </h1>
            <p className="auth-subtitle">
              {isRegister
                ? "Start tracking movies you love"
                : "Sign in to manage your watchlist"}
            </p>
          </div>

          <div className="mode-tabs">
            <button
              type="button"
              className={`tab-btn ${!isRegister ? "tab-active" : "tab-inactive"}`}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`tab-btn ${isRegister ? "tab-active" : "tab-inactive"}`}
              onClick={() => switchMode("register")}
            >
              Create account
            </button>
          </div>

          {error && (
            <div className="error-box">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {showSuccess ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <p className="success-title">Account created!</p>
              <p className="success-sub">Switching to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">

              <div className="field">
                <label className="field-label">Email address</label>
                <div className="field-wrap">
                  <span className="field-icon">✉</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <span className="field-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    style={{ paddingRight: "44px" }}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword((p) => !p)}
                    role="button"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </span>
                ) : isRegister ? "Create account" : "Sign in"}
              </button>

            </form>
          )}

          {!showSuccess && (
            <p
              className="auth-toggle"
              onClick={() => switchMode(isRegister ? "login" : "register")}
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </p>
          )}

          {!showSuccess && (
            <div className="stats-row">
              <div className="stat"><strong>10K+</strong><span>Movies</span></div>
              <div className="stat"><strong>Free</strong><span>Always</span></div>
              <div className="stat"><strong>TMDB</strong><span>Powered</span></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;