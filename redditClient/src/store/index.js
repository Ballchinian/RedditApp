import { configureStore, combineReducers } from '@reduxjs/toolkit';
import openSubredditReducer from "./openSubredditSlice";
import suggestionsReducer from "./suggestionsSlice";

export default configureStore({
    reducer: {
        openSubreddit: openSubredditReducer,
        suggestions: suggestionsReducer,
    }
});
