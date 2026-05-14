function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="movie-card">
      <img src={imageUrl} alt={movie.title} />

      <h2>{movie.title}</h2>

      <p>
        <strong>Release:</strong> {movie.release_date}
      </p>

      <p>{movie.overview?.slice(0, 120)}...</p>
    </div>
  );
}

export default MovieCard;