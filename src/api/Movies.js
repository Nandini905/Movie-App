import axios from 'axios';
import { setMovies } from '../slice/movieslice';

// Sample movie data for testing and as a fallback
const sampleMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-18",
    vote_average: 8.5,
    genre_ids: [28, 80, 18],
    director: "Christopher Nolan",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    writers: ["Jonathan Nolan", "Christopher Nolan"]
  },
  {
    id: 2,
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    genre_ids: [28, 878, 53],
    director: "Christopher Nolan",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    writers: ["Christopher Nolan"]
  },
  {
    id: 3,
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    release_date: "1994-10-14",
    vote_average: 8.9,
    genre_ids: [80, 18],
    director: "Quentin Tarantino",
    actors: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"],
    writers: ["Quentin Tarantino", "Roger Avary"]
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    release_date: "1994-09-23",
    vote_average: 9.3,
    genre_ids: [18, 80],
    director: "Frank Darabont",
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    writers: ["Frank Darabont", "Stephen King"]
  },
  {
    id: 5,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    release_date: "1972-03-24",
    vote_average: 9.2,
    genre_ids: [80, 18],
    director: "Francis Ford Coppola",
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
    writers: ["Mario Puzo", "Francis Ford Coppola"]
  },
  {
    id: 6,
    title: "Forrest Gump",
    overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    release_date: "1994-07-06",
    vote_average: 8.8,
    genre_ids: [35, 18, 10749],
    director: "Robert Zemeckis",
    actors: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    writers: ["Winston Groom", "Eric Roth"]
  }
];

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

function mapTmdbMovies(results) {
  const list = Array.isArray(results) ? results : [];
  return list.map((m) => ({
    id: m?.id,
    title: m?.title || m?.name || 'Unknown',
    overview: m?.overview || '',
    poster_path: m?.poster_path || null,
    release_date: m?.release_date || m?.first_air_date || '',
    vote_average: typeof m?.vote_average === 'number' ? m.vote_average : 0,
    genre_ids: Array.isArray(m?.genre_ids) ? m.genre_ids : [],
  }));
}

export const getMovies = () => {
  return async (dispatch) => {
    // If no key, fall back immediately
    if (!TMDB_API_KEY) {
      dispatch(setMovies(sampleMovies));
      return;
    }
    try {
      const url = `${TMDB_BASE}/movie/popular?api_key=${encodeURIComponent(TMDB_API_KEY)}&page=1`;
      const res = await axios.get(url);
      const mapped = mapTmdbMovies(res?.data?.results);
      if (mapped.length > 0) {
        dispatch(setMovies(mapped));
      } else {
        dispatch(setMovies(sampleMovies));
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      dispatch(setMovies(sampleMovies));
    }
  };
};

// Remote search with graceful fallback to local filtering
export const searchMovies = (query) => {
  return async (dispatch) => {
    const q = (query || '').trim();
    if (!q) {
      dispatch(getMovies());
      return;
    }

    if (!TMDB_API_KEY) {
      // Fallback: filter local sample set if no key
      const lower = q.toLowerCase();
      const filtered = sampleMovies.filter((m) => {
        const title = (m?.title || '').toLowerCase();
        const overview = (m?.overview || '').toLowerCase();
        const director = (m?.director || '').toLowerCase();
        const actors = (Array.isArray(m?.actors) ? m.actors : []).map(String).join(' ').toLowerCase();
        const writers = (Array.isArray(m?.writers) ? m.writers : []).map(String).join(' ').toLowerCase();
        return (
          title.includes(lower) ||
          overview.includes(lower) ||
          director.includes(lower) ||
          actors.includes(lower) ||
          writers.includes(lower)
        );
      });
      dispatch(setMovies(filtered));
      return;
    }

    try {
      const url = `${TMDB_BASE}/search/movie?api_key=${encodeURIComponent(TMDB_API_KEY)}&query=${encodeURIComponent(q)}&page=1&include_adult=false`;
      const res = await axios.get(url);
      const mapped = mapTmdbMovies(res?.data?.results);
      if (mapped.length > 0) {
        dispatch(setMovies(mapped));
        return;
      }
    } catch (error) {
      console.warn('TMDB search failed, using local fallback:', error?.message);
    }

    // Fallback to local sample filtering
    const lower = q.toLowerCase();
    const filtered = sampleMovies.filter((m) => {
      const title = (m?.title || '').toLowerCase();
      const overview = (m?.overview || '').toLowerCase();
      const director = (m?.director || '').toLowerCase();
      const actors = (Array.isArray(m?.actors) ? m.actors : []).map(String).join(' ').toLowerCase();
      const writers = (Array.isArray(m?.writers) ? m.writers : []).map(String).join(' ').toLowerCase();
      return (
        title.includes(lower) ||
        overview.includes(lower) ||
        director.includes(lower) ||
        actors.includes(lower) ||
        writers.includes(lower)
      );
    });
    dispatch(setMovies(filtered));
  };
};

// Fetch genres from TMDB with fallback to a local list
export const getAllGenres = async () => {
  const fallback = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
    // Common non-TMDB labels users may expect
    { id: 100001, name: 'Biography' },
  ];

  if (!TMDB_API_KEY) return fallback;
  try {
    const url = `${TMDB_BASE}/genre/movie/list?api_key=${encodeURIComponent(TMDB_API_KEY)}&language=en-US`;
    const res = await axios.get(url);
    const list = Array.isArray(res?.data?.genres) ? res.data.genres : [];
    return list.length ? list : fallback;
  } catch (e) {
    console.warn('Failed to fetch TMDB genres, using fallback');
    return fallback;
  }
};
