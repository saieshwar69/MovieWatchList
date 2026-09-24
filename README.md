# 🎬 CineStack - Movie Watchlist Platform

CineStack is a full-stack MERN application that helps users discover movies, build a personalized watchlist, and track their watching progress. It integrates with the TMDB API to provide real-time movie information while securely storing each user's watchlist using JWT authentication and MongoDB Atlas.

---

## 🌐 Live At

### Frontend (Vercel)

https://movie-watch-list-chi.vercel.app/

### Backend (Render)

https://moviewatchlist-b40k.onrender.com/
### Live Demo (Render)

https://drive.google.com/file/d/1ZGIQr2_uDBMOAlrjzfV6dQJOb7O9RDPs/view?usp=sharing

---

# ✨ Features

### 🔐 Authentication

* User Registration & Login
* JWT Authentication
* Password hashing using bcrypt
* Protected API routes

### 🎥 Discover Movies

* Search movies using the TMDB API
* Browse New Arrivals (current year releases)
* Browse Award Winning Movies
* Beautiful responsive movie cards

### 📋 Personal Watchlist

* Add movies to your personal watchlist
* Prevent duplicate movie additions
* Remove movies
* Mark movies as watched
* Persistent watchlist stored in MongoDB Atlas

### 🎞 Personalized Hero Section

* Dynamic Hero Slider
* Displays unwatched movies from the user's watchlist
* Automatically cycles through movies
* Displays:

  * Movie backdrop
  * Movie title
  * IMDb rating
  * Overview
  * Continue Watching button

### ⚡ Real-Time Updates

* Watchlist count updates instantly
* Hero slider updates instantly
* Dynamic rendering based on logged-in user

### 🎨 UI/UX

* Netflix-inspired interface
* Responsive design
* Modular CSS architecture
* Smooth hover animations
* Dark cinematic theme

---

# 🛠 Tech Stack

## Frontend

* React.js (Vite)
* React Router DOM
* Fetch API
* TMDB API
* CSS Modules / Modular CSS
* Vercel

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt
* Render

---

# 📂 Project Structure

```text
MovieWatchList
│
├── Backend
│   ├── middleware
│   │     └── authMiddleware.js
│   │
│   ├── models
│   │     ├── Movie.js
│   │     └── User.js
│   │
│   ├── routes
│   │     ├── authRoutes.js
│   │     └── movieRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── Frontend
│   ├── public
│   │
│   └── src
│       ├── components
│       │     ├── Hero.jsx
│       │     ├── HeroSlider.jsx
│       │     ├── Home.jsx
│       │     ├── Login.jsx
│       │     ├── Register.jsx
│       │     ├── MovieGrid.jsx
│       │     ├── MovieCard.jsx
│       │     ├── MovieDetails.jsx
│       │     ├── MyList.jsx
│       │     ├── Navbar.jsx
│       │     ├── SearchBar.jsx
│       │     └── Footer.jsx
│       │
│       ├── style
│       │     ├── Home.css
│       │     ├── HeroSlider.css
│       │     ├── MovieCard.css
│       │     ├── MovieGrid.css
│       │     ├── MovieDetails.css
│       │     ├── Login.css
│       │     ├── Navbar.css
│       │     ├── Footer.css
│       │     ├── Variables.css
│       │     ├── SearchBar.css
│       │     └── Global.css
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── README.md
```

---

# 🔐 Environment Variables

## Backend (.env)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Frontend (.env)

```env
VITE_API_BASE_URL=https://moviewatchlist-b40k.onrender.com
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

# ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/saieshwar69/MovieWatchList.git
```

---

## 2. Backend

```bash
cd Backend

npm install

npm run dev
```

---

## 3. Frontend

```bash
cd Frontend

npm install

npm run dev
```

---

# 📸 Current Features

* Secure User Authentication
* Personalized Watchlist With Date
* Dynamic Hero Slider that display Your WatchList
* Movie Detail Page contain some information of the movie,trailer,available on and Cast
* Search Movies using TMDB with some special contrains like Cast,Director,Release Date etc..
* New Arrivals Section
* Biopic's Section
* Based on True Story Section
* Award Winning Movies Section
* Add / Remove Movies
* Mark as Watched
* Responsive Netflix-style UI
* MongoDB Atlas Database
* JWT Protected APIs
* Cloud Deployment (Vercel + Render)


# 👨‍💻 Author

**Sai Eshwar**

GitHub:
https://github.com/saieshwar69
---

## ⭐ Support

If you enjoyed this project, please consider giving it a ⭐ on GitHub. It motivates future improvements.
