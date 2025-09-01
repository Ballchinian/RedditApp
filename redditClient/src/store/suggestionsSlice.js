import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from "../config/config";

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setSuggestions(state, action) {
      state.suggestions = action.payload;
      state.loading = false;
    },
    setSuggestionsLoading(state) {
      state.loading = true;
    },
    setSuggestionsError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSuggestionsClear(state) {
      state.suggestions = [];
    },
  },
});

export const { setSuggestions, setSuggestionsLoading, setSuggestionsError, setSuggestionsClear } = suggestionsSlice.actions;

export const fetchSuggestions = (searchTerm) => async (dispatch) => {
  if (searchTerm.length === 0) {
    dispatch(setSuggestionsClear());
    return;
  }

  dispatch(setSuggestionsLoading()); // Set loading state

  try {
    const response = await axios.get(`${API_BASE_URL}/api/suggestions/${searchTerm}`);
    const suggestionList = response.data.data.children
      .slice(0, 5)
      .map(child => child.data.display_name);
    dispatch(setSuggestions(suggestionList));
  } catch (error) {
    dispatch(setSuggestionsError(error.message)); // Handle error
  }
};

export default suggestionsSlice.reducer;
