import './Home.css';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenSubreddit, fetchPosts, fetchMorePosts } from '../../store/openSubredditSlice';
import { fetchSuggestions, setSuggestionsClear } from '../../store/suggestionsSlice';
import Card from '../../components/Card/Card';

const Home = () => {
  const dispatch = useDispatch();

  //Get current subreddit and posts from Redux store
  const openSubreddit = useSelector((state) => state.openSubreddit.openSubreddit);
  const posts = useSelector((state) => state.openSubreddit.posts);
  const after = useSelector((state) => state.openSubreddit.after);
  const loading = useSelector((state) => state.openSubreddit.loading);
  const error = useSelector((state) => state.openSubreddit.error);

  //Get search suggestions from Redux store
  const suggestions = useSelector((state) => state.suggestions.suggestions);
  
  //Local state for search input and focus tracking
  const [searchTerm, setSearchTerm] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  //Fetch posts whenever the openSubreddit changes
  useEffect(() => {
    if (openSubreddit) {
      dispatch(fetchPosts(openSubreddit));
    }
  }, [openSubreddit, dispatch]);

  //Fetch subreddit suggestions when input is focused and search term changes
  useEffect(() => {
    if (isInputFocused && searchTerm.length > 0) {
      dispatch(fetchSuggestions(searchTerm));
    } else {
      dispatch(setSuggestionsClear()); //Clear suggestions when input loses focus or is empty
    }
  }, [searchTerm, isInputFocused, dispatch]);

  //Handle search button click
  const handleSearch = () => {
    if (searchTerm) {
      dispatch(setOpenSubreddit(searchTerm)); //Update open subreddit in Redux
      dispatch(fetchPosts(searchTerm)); //Fetch posts for the new subreddit
    }
  };

  //Handle click on a suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion); //Update search input
    dispatch(setOpenSubreddit(suggestion)); //Update open subreddit in Redux
    dispatch(fetchPosts(suggestion)); //Fetch posts for selected suggestion
    setIsInputFocused(false); //Close suggestion dropdown
  };

  //Handle loading more posts when "Load More" button is clicked
  const handleLoadMore = () => {
    if (after) {
      dispatch(fetchMorePosts({ subreddit: openSubreddit, after: after }));
    }
  };

  return (
    <div>
      {/*Search bar container*/}
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter subreddit name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} //Update searchTerm state
          onFocus={() => setIsInputFocused(true)} //Show suggestions
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)} //Hide suggestions after small delay
        />
        <button onClick={handleSearch}>Search</button>

        {/*Render suggestions dropdown when input is focused*/}
        {isInputFocused && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onMouseDown={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*Show loading or error messages*/}
      {loading && <p>Loading posts...</p>}
      {error && <p>Error fetching posts: {error}</p>}

      {/*Posts container*/}
      <div className="reddit-posts-container">
        <div className="reddit-posts">
          <h2>Hot Posts from r/{openSubreddit}:</h2>
          <ul>
            {/*Render posts with images first, then posts without images*/}
            {[...posts.filter(post => post.thumbnail), ...posts.filter(post => !post.thumbnail)]
              .map((post, index) => (
              <li key={index}>
                <Card>
                  {/*Post title linking to Reddit*/}
                  <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                  {/*Render thumbnail if available*/}
                  {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="post-thumbnail" />}
                  <p>Score: {post.score} | Author: {post.author}</p>
                </Card>
              </li>
            ))}
          </ul>

          {/*Render Load More button if more posts are available*/}
          {after && (
            <div className="load-more-container">
              <button onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;
