import { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch movies from TMDB API (popular or search result)
  const fetchMovies = async (query = "popular") => {
    setLoading(true);

    let url = "";

    // Decide API endpoint based on query
    if (query === "popular") {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
    } else {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Save movies into state
    setMovies(data.results || []);

    setLoading(false);
  };

  // Run once when page loads (shows popular movies)
  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() !== "") {
      fetchMovies(search);
    }
  };

  return (
    <div className="container">
      <h1>Movie App</h1>

      {/* Search form */}
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {/* Loading message */}
      {loading && <h2 className="message">Loading...</h2>}

      <div className="movies-grid">
        {/* Map through movies and create MovieCard for each movie */}
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;