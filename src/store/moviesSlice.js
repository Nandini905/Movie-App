import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Replace the URL with your real endpoint
export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const res = await axios.get('https://api.example.com/movies');
  return res.data;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default moviesSlice.reducer;