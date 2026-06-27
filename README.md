# Reddit Browser

A web app that gives you a clean Reddit browsing experience. Search subreddits, browse the hot posts, and look at images without the usual mess, all through a Flask backend that talks to Reddit's OAuth API and proxies the images so CORS doesn't get in the way.

## Features

- Subreddit search with live autocomplete suggestions
- Hot post browsing with pagination
- Popular subreddit discovery
- Image proxying with stable fallbacks
- Redux managed application state

Endpoint docs live in [ENDPOINTS.md](./ENDPOINTS.md).

## How it works

The frontend never talks to Reddit directly. Every request goes through the Flask backend, which authenticates with Reddit, shapes the response, and hands clean JSON back to the browser.

### Reddit authentication

The backend uses Reddit's OAuth **client-credentials** flow. It asks for an access token with the configured client ID and secret, caches that token in memory, and reuses it until shortly before it expires. Every Reddit request goes to `oauth.reddit.com` with a custom User Agent.

### Image proxying

Reddit's image URLs can't be loaded straight from the browser without running into CORS and referrer issues, so images are routed through the backend proxy instead. The proxy picks a source in priority order:

| Priority | Source |
| --- | --- |
| 1 | Stable `i.redd.it` image |
| 2 | Full-resolution preview image |
| 3 | Thumbnail fallback |

If none of those turn up anything usable, the post comes back without a thumbnail.

### Pagination

Hot posts are fetched ten at a time. Each response includes an `after` token (the Reddit fullname of the last post), which the frontend passes back to load the next page.

## State management

Redux Toolkit manages the shared frontend state.

| Slice | Responsibility |
| --- | --- |
| `openSubreddit` | The currently selected subreddit |
| `suggestions` | Autocomplete results for the search bar |

## Tech stack

- **Backend:** Python / Flask (REST API and image proxy)
- **Frontend:** React + Redux Toolkit
- **Requests:** Axios and the Fetch API
- **Reddit access:** OAuth client-credentials flow with token caching

## A typical browse

1. Search for a subreddit.
2. Autocomplete suggestions show up as you type.
3. Pick a subreddit and its hot posts load.
4. Images are pulled in through the backend proxy.
5. Loading more fetches the next page using the `after` token.

## Running locally

### Backend

```
cd redditBackend
pip install -r requirements.txt
python app.py
```

The backend runs on port `5000` and reads these from the environment:

| Variable | Description |
| --- | --- |
| `CLIENT_ID` | Reddit application client ID |
| `CLIENT_SECRET` | Reddit application client secret |
| `USER_AGENT` | User-Agent sent with Reddit requests |

### Frontend

```
cd redditClient
npm install
npm start
```

The frontend runs on port `3000`. The API base URL is picked automatically: the deployed backend in production, and `http://localhost:5000` in development.