import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---- Fetch initial posts ----
export const fetchPosts = createAsyncThunk(
  "openSubreddit/fetchPosts",
  async (subreddit, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${subreddit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMorePosts = createAsyncThunk(
  "openSubreddit/fetchMorePosts",
  async ({ subreddit, after }, { rejectWithValue }) => {
    try {
      const url = after
        ? `http://localhost:5000/api/posts/${subreddit}/${after}`
        : `http://localhost:5000/api/posts/${subreddit}`;
      const response = await axios.get(url);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const openSubredditSlice = createSlice({
  name: "openSubreddit",
  initialState: {
    openSubreddit: "learnprogramming",
    posts: [],
    after: null,
    loading: false,
    error: null,
  },
  reducers: {
    setOpenSubreddit: (state, action) => {
      state.openSubreddit = action.payload;
      state.posts = [];   // clear posts when switching subreddit
      state.after = null; // reset pagination
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Initial posts ----
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.after = action.payload.after; // save "t3_xxx" token
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Load more ----
      .addCase(fetchMorePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [...state.posts, ...action.payload.posts]; // append new posts
        state.after = action.payload.after; // update pagination token
      })
      .addCase(fetchMorePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setOpenSubreddit } = openSubredditSlice.actions;
export default openSubredditSlice.reducer;
