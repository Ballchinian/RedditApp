Reddit Browser

This project was made to simulate a Reddit browsing experience. The aim was to provide a clean interface to explore subreddits, view posts, and load images seamlessly.

Some of the main features include:
- Flask backend (API and image proxy)
- React frontend (subreddit search, posts display, load more)

- Redux Toolkit (State management for open subreddit and suggestions)
- Axios (API requests from frontend)
- CORS handling (Allow frontend and backend to communicate locally)
- Image Proxy (Fallback to stable i.redd.it images, full preview, or thumbnail if necessary)

When building this I wanted to bring everything I know about frontend and backend integration into one place:

- REST API design and endpoints
- Python/Flask for backend logic and requests
- React + Redux for dynamic frontend rendering
- Handling pagination (after tokens) for Reddit hot posts
- Suggestions bar powered by Reddit’s autocomplete API
- Backend API Endpoints

/api/posts/:subreddit/ [GET]
Fetch hot posts for a subreddit. Supports pagination with /api/posts/:subreddit/:after.

/api/image-proxy [GET]
Proxies Reddit images to prevent CORS issues. Tries to use stable i.redd.it images, full previews, or thumbnail fallbacks.

/api/subreddits/popular [GET]
Returns a list of popular subreddits with name, title, and subscriber count.

/api/suggestions/:query [GET]
Returns subreddit suggestions matching the search query.

This project is focused on API integration, state management, and smooth frontend-backend interaction
