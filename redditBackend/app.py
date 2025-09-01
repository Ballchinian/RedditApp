import os
import requests
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
from urllib.parse import unquote
from reddit_api import reddit_get



#Initialize Flask app
app = Flask(__name__)
#Enable CORS so React frontend can call backend
CORS(app)

#Set Reddit User-Agent from environment or use default

USER_AGENT = os.getenv("USER_AGENT", "myredditapp/0.1 by yourusername")

#----Get Posts from subreddit (with pagination)----
@app.route("/api/posts/<subreddit>/", defaults={"after": None})
@app.route("/api/posts/<subreddit>/<after>")
def get_posts(subreddit, after=None):
    try:
        #Build Reddit API URL
        params = {"limit": 10}
        if after:
            params["after"] = after  #Use after token for pagination

        data = reddit_get(f"/r/{subreddit}/hot", params=params)

        posts = []
        for child in data["data"]["children"]:
            submission = child["data"]

            preview_image = None

            #Try stable i.redd.it image first
            url_field = submission.get("url")
            if url_field and url_field.startswith("https://i.redd.it/"):
                preview_image = url_field

            #Fall back to full preview image if no stable i.redd.it image
            elif "preview" in submission and submission["preview"]["images"]:
                preview_image = submission["preview"]["images"][0]["source"]["url"]

            #Fall back to lower-res preview (thumbnail)
            if not preview_image and submission.get("thumbnail") and submission["thumbnail"].startswith("http"):
                preview_image = submission["thumbnail"]

            #Wrap valid images with backend proxy
            if preview_image and preview_image.startswith("http"):
                preview_image = f"https://redditapp-ynpl.onrender.com/api/image-proxy?url={preview_image}"
            else:
                preview_image = None

            #Append post info to posts list
            posts.append({
                "title": submission["title"],
                "url": submission["url"],
                "score": submission["score"],
                "author": submission["author"],
                "permalink": submission["permalink"],
                "thumbnail": preview_image,
                "name": submission["name"],  #fullname for pagination
            })

        #Set after token for pagination if posts exist
        after_token = posts[-1]["name"] if posts else None
        return jsonify({"posts": posts, "after": after_token})

    except Exception as e:
        #Return error if any exception occurs
        return jsonify({
            "error": str(e),
            "response": getattr(e.response, "text", "")[:500]
        }), 500


#---New endpoint to proxy Reddit images----
@app.route("/api/image-proxy")
def image_proxy():
    img_url = request.args.get("url")
    if not img_url:
        #Return error if no URL provided
        return jsonify({"error": "No URL provided"}), 400

    #Properly decode URL and rebuild query
    from urllib.parse import urlsplit, urlunsplit, urlencode, parse_qsl
    split_url = urlsplit(img_url)
    query = dict(parse_qsl(split_url.query))
    img_url = urlunsplit((split_url.scheme, split_url.netloc, split_url.path, urlencode(query), split_url.fragment))

    try:
        #Set headers for image request
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/115.0.0.0 Safari/537.36",
            "Accept": "image/*"
        }

        #Fetch image from Reddit or fallback URL
        resp = requests.get(img_url, headers=headers)
        resp.raise_for_status()  #Raise error if request fails

        #Get content type or fallback to jpeg
        content_type = resp.headers.get("Content-Type", "image/jpeg")
        return Response(resp.content, status=resp.status_code, content_type=content_type)
    except requests.exceptions.RequestException as e:
        #Return error if image request fails
        return jsonify({"error": str(e)}), 500


#----Get Popular Subreddits----
@app.route("/api/subreddits/popular")
def get_popular_subreddits():
    try:

        data = data = reddit_get("/subreddits/popular", params={"limit": 15})

        subreddits = []
        for child in data["data"]["children"]:
            sr = child["data"]
            subreddits.append({
                "name": sr["display_name"],
                "title": sr["title"],
                "subscribers": sr["subscribers"],
            })

        return jsonify(subreddits)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/suggestions/<query>", strict_slashes=False)
def get_suggestions(query):
    try:
        data = reddit_get(f"/api/subreddit_autocomplete_v2.json", params={"query": query})
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    #Run app on port 5000 in debug mode
    app.run(port=5000, debug=True)
