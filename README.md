# Reddit Browser

A web application that simulates a clean Reddit browsing experience. It lets you search subreddits, browse hot posts, and view images seamlessly through a Flask backend that talks to Reddit's OAuth API and proxies images to avoid CORS issues.

## Features

* Subreddit search with live autocomplete suggestions
* Hot post browsing with pagination
* Popular subreddit discovery
* Image proxying with stable image fallbacks
* Redux-managed application state
* Local development with CORS handling

## Tech Stack

* **Backend** — Python / Flask (REST API and image proxy)
* **Frontend** — React + Redux Toolkit
* **Requests** — Axios and the Fetch API
* **Reddit Access** — OAuth client-credentials flow with token caching

## Documentation

* [API Endpoints](./ENDPOINTS.md)

---

# How the App Works

The frontend never talks to Reddit directly. Every request flows through the Flask backend, which authenticates with Reddit, shapes the response, and returns clean JSON to the browser.

## Reddit Authentication

The backend uses Reddit's OAuth **client-credentials** flow.

* An access token is requested with the configured client ID and secret.
* Tokens are cached in memory and reused until shortly before they expire.
* All Reddit requests are sent to `oauth.reddit.com` with a custom User-Agent.

## Image Proxying

Reddit image URLs cannot be loaded directly from the browser without CORS and referrer issues, so images are routed through the backend proxy.

The proxy selects an image source in priority order:

| Priority | Source                        |
| -------- | ----------------------------- |
| 1        | Stable `i.redd.it` image      |
| 2        | Full-resolution preview image |
| 3        | Thumbnail fallback            |

If no usable image is found, the post is returned without a thumbnail.

## Pagination

Hot posts are fetched in pages of ten. Each response includes an `after` token (the Reddit fullname of the last post) which the frontend passes back to load the next page.

---

# State Management

Redux Toolkit manages the shared frontend state.

| Slice           | Responsibility                          |
| --------------- | --------------------------------------- |
| `openSubreddit` | The currently selected subreddit        |
| `suggestions`   | Autocomplete results for the search bar |

---

# Configuration

## Backend

The backend reads the following environment variables:

| Variable        | Description                          |
| --------------- | ------------------------------------ |
| `CLIENT_ID`     | Reddit application client ID         |
| `CLIENT_SECRET` | Reddit application client secret     |
| `USER_AGENT`    | User-Agent sent with Reddit requests |

## Frontend

The API base URL is selected automatically:

* **Production** — the deployed backend URL
* **Development** — `http://localhost:5000`

---

# Running Locally

## Backend

```
cd redditBackend
pip install -r requirements.txt
python app.py
```

The backend runs on port `5000`.

## Frontend

```
cd redditClient
npm install
npm start
```

The frontend runs on port `3000`.

---

# Typical Flow

1. The user searches for a subreddit.
2. Autocomplete suggestions are fetched as they type.
3. A subreddit is selected and its hot posts are loaded.
4. Images are requested through the backend proxy.
5. Loading more fetches the next page using the `after` token.
