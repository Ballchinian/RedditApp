export async function getTopSubreddits() {
  try {
    const response = await fetch("http://localhost:5000/api/subreddits/popular");

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
