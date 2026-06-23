# API Endpoints

This document describes the Reddit Browser backend API.

## Overview

The backend is a Flask service that authenticates with Reddit using the OAuth client-credentials flow, shapes Reddit responses into clean JSON, and proxies images to avoid CORS issues.

All endpoints are public. Reddit authentication is handled internally by the backend.

---

# Posts

## GET `/api/posts/<subreddit>/`

Retrieve hot posts for a subreddit.

### Parameters

* `subreddit` — the subreddit name
* `after` — optional pagination token (`/api/posts/<subreddit>/<after>`)

### Returns

* A list of posts
* An `after` token for the next page

### Post Fields

* Title
* URL
* Score
* Author
* Permalink
* Thumbnail (proxied image, when available)
* Name (Reddit fullname, used for pagination)

### Notes

* Posts are returned ten at a time.
* Image URLs are rewritten to point at the image proxy.

---

# Images

## GET `/api/image-proxy?url=`

Proxy a Reddit image to avoid CORS and referrer restrictions.

### Parameters

* `url` — the image URL to fetch

### Returns

* The image content with its original content type

### Errors

* `400` when no URL is provided
* `500` when the upstream image request fails

---

# Subreddits

## GET `/api/subreddits/popular`

Retrieve a list of popular subreddits.

### Returns

* Subreddit name
* Title
* Subscriber count

### Notes

Returns up to fifteen subreddits.

---

# Suggestions

## GET `/api/suggestions/<query>`

Retrieve subreddit autocomplete suggestions for a search query.

### Parameters

* `query` — the partial subreddit name to match

### Returns

* Reddit's subreddit autocomplete results

### Notes

Returns up to ten suggestions.
