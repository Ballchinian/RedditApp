import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOpenSubreddit } from "../../store/openSubredditSlice";
import { getTopSubreddits } from "../../utils/getTopSubreddits"; 
import './Footer.css';

const Footer = () => {
  const [subreddits, setSubreddits] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchSubreddits() {
      const topSubs = await getTopSubreddits();
      setSubreddits(topSubs);
    }
    fetchSubreddits();
  }, []);

  return (
    <footer className="footer">
      <h2>Hot Subreddits</h2>
      <div className="subreddit-buttons">
        {subreddits.map((sub, index) => (
          <button 
            key={index} 
            onClick={() => dispatch(setOpenSubreddit(sub))} 
            className="subreddit-button"
          >
            {sub}
          </button>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
