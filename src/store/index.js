import { configureStore, createSlice } from '@reduxjs/toolkit';

// Simple placeholder user slice — replace with your real reducers
const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    // add reducers here, e.g. setUser: (state, action) => { ... }
  },
});

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;