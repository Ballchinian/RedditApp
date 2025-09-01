import os
import time
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
USER_AGENT = os.getenv("USER_AGENT", "web:redditClient:v1.0 (by /u/Forward-Shine-9244)")

# --- Token caching ---
TOKEN_CACHE = {"token": None, "expires_at": 0}

def get_token():
    """Get OAuth token from Reddit with caching."""
    now = time.time()
    if TOKEN_CACHE["token"] and TOKEN_CACHE["expires_at"] > now + 10:
        return TOKEN_CACHE["token"]  # return cached token if still valid

    auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    data = {"grant_type": "client_credentials"}
    headers = {"User-Agent": USER_AGENT}
    res = requests.post("https://www.reddit.com/api/v1/access_token",
                        auth=auth, data=data, headers=headers)
    res.raise_for_status()
    token_data = res.json()
    TOKEN_CACHE["token"] = token_data["access_token"]
    TOKEN_CACHE["expires_at"] = now + token_data["expires_in"]
    return TOKEN_CACHE["token"]

def reddit_get(endpoint, params=None):
    """Generic GET request to Reddit OAuth API."""
    token = get_token()
    headers = {"Authorization": f"bearer {token}", "User-Agent": USER_AGENT}
    url = f"https://oauth.reddit.com{endpoint}"
    res = requests.get(url, headers=headers, params=params)
    res.raise_for_status()
    return res.json()

# --- Fetch hot posts ---
def fetch_hot(subreddit, limit=10, after=None):
    params = {"limit": limit}
    if after:
        params["after"] = after
    return reddit_get(f"/r/{subreddit}/hot", params=params)

# --- Fetch popular subreddits ---
def fetch_popular_subreddits(limit=15):
    params = {"limit": limit}
    return reddit_get("/subreddits/popular", params=params)

# --- Subreddit autocomplete / suggestions ---
def fetch_suggestions(query, limit=10):
    params = {"query": query, "include_over_18": "true", "limit": limit}
    return reddit_get("/api/subreddit_autocomplete_v2.json", params=params)
