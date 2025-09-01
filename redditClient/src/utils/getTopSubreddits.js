import API_BASE_URL from "../config/config";

export async function getTopSubreddits() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subreddits/popular`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // Return just the subreddit names
    return data.map(sub => sub.name);
  } catch (error) {
    console.error("Error fetching subreddits:", error);
    return [];
  }
}
