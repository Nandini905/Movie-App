import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../component/Navbar';
import MovieCard from '../../component/moviecard';
import { getMovies, searchMovies, getAllGenres } from '../../api/Movies';
import { Box, Grid, Container, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { setSelectedGenres } from '../../slice/movieslice';
import filterMoviesByQuery from '../../utils/getMoviesbySearch';

const Home = () => {
  const dispatch = useDispatch();
  const { movies, searchQuery, selectedGenres } = useSelector((state) => state.movies);
  console.log("Movies in Home component:", movies);
  const [genres, setGenres] = React.useState([]);

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  // Load genres (TMDB or fallback)
  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await getAllGenres();
      if (mounted) setGenres(list);
    })();
    return () => { mounted = false; };
  }, []);

  // Debounced remote search when searchQuery changes
  useEffect(() => {
    const handle = setTimeout(() => {
      dispatch(searchMovies(searchQuery));
    }, 400);
    return () => clearTimeout(handle);
  }, [dispatch, searchQuery]);

  const toggleGenre = (name) => {
    const set = new Set(selectedGenres);
    if (set.has(name)) set.delete(name); else set.add(name);
    dispatch(setSelectedGenres(Array.from(set)));
  };

  const movieMatchesSelectedGenres = (movie) => {
    if (!selectedGenres || selectedGenres.length === 0) return true;
    const genreIdToName = (id) => genres.find((g) => g.id === id)?.name || '';
    const names = (Array.isArray(movie.genre_ids) ? movie.genre_ids : [])
      .map((id) => (genreIdToName(id) || '').toLowerCase());
    // Any-match: movie passes if it has at least one selected genre
    return selectedGenres.some((sel) => names.includes(sel.toLowerCase()));
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Movies
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {genres.map((g) => (
            <Chip
              key={g.id}
              label={g.name}
              color={selectedGenres.includes(g.name) ? 'primary' : 'default'}
              variant={selectedGenres.includes(g.name) ? 'filled' : 'outlined'}
              onClick={() => toggleGenre(g.name)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        <Grid container spacing={3}>
          {movies?.length > 0 ? (
            filterMoviesByQuery(movies, searchQuery)
              .filter((m) => movieMatchesSelectedGenres(m))
              .map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <MovieCard movie={movie} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary" textAlign="center">
                No movies available
              </Typography>
            </Grid>
          )}
          {movies?.length > 0 && filterMoviesByQuery(movies, searchQuery).filter((m) => movieMatchesSelectedGenres(m)).length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary" textAlign="center">
                No results for "{searchQuery}"{selectedGenres.length ? ` in ${selectedGenres.join(', ')}` : ''}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default Home;