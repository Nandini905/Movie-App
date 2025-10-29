import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    movies: [],
    searchQuery: "",
    selectedGenres: [], // array of genre names, e.g., ["Drama", "Biography"]
}
const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        setMovies: (state, action) => {
            state.movies = action.payload;
            console.log("Movies set in state:", state.movies);
        },
        setSearchValue: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSelectedGenres: (state, action) => {
            state.selectedGenres = Array.isArray(action.payload) ? action.payload : [];
        },
    },
});
export const { setMovies, setSearchValue, setSelectedGenres } = moviesSlice.actions;
export default moviesSlice.reducer;