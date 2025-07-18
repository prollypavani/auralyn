import { useState, useEffect } from 'react';
import './Home.css';
import LoginWithSpotify from '../components/LoginWithSpotify';
import { exchangeToken } from '../utils/spotifyAuth';
import { getUserProfile, searchTracks } from "../utils/spotify";

export default function Home() {
  const [form, setForm] = useState({
    mood: '',
    genre: '',
    artist: '',
    count: 10,
  });

  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Token exchange
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !accessToken) {
      exchangeToken(code)
        .then((data) => {
          setAccessToken(data.access_token);
          console.log('✅ Access Token:', data.access_token);

          // Clean URL and clear verifier
          localStorage.removeItem('spotify_code_verifier');
          window.history.replaceState({}, document.title, '/');
        })
        .catch((err) => {
          console.error('❌ Token exchange failed:', err);
        });
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (accessToken) {
      getUserProfile(accessToken)
        .then((profile) => {
          console.log("👤 User Profile:", profile);
          setUserProfile(profile);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch profile:", err);
        });
    }
  }, [accessToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      alert("Please log in to Spotify first.");
      return;
    }

    const query = `${form.mood} ${form.genre} ${form.artist}`;
    console.log("🔍 Searching for:", query);

    try {
      const tracks = await searchTracks(accessToken, query, form.count);
      setPlaylistTracks(tracks);
      console.log("🎵 Found Tracks:", tracks);
    } catch (err) {
      console.error("❌ Error searching tracks:", err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Auralyn</h1>
        <p className="subtitle">Mood-based Spotify Playlist Generator</p>

        {userProfile && (
          <div className="profile">
            <p>Welcome, {userProfile.display_name} 👋</p>
            {userProfile.images?.[0]?.url && (
              <img
                src={userProfile.images[0].url}
                alt="Profile"
                style={{ width: "80px", borderRadius: "50%", marginTop: "10px" }}
              />
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input name="mood" placeholder="How are you feeling?" onChange={handleChange} />
          <input name="genre" placeholder="Preferred genre" onChange={handleChange} />
          <input name="artist" placeholder="Favorite artist" onChange={handleChange} />
          <input name="count" type="number" value={form.count} onChange={handleChange} />
          <button type="submit">🎶 Generate Playlist</button>
        </form>

        {playlistTracks.length > 0 && (
          <div className="results">
            <h3>🎧 Recommended Tracks:</h3>
            <ul>
              {playlistTracks.map((track) => (
                <li key={track.id}>
                  <img src={track.album.images[2]?.url} alt="" width="40" />
                  {track.name} – {track.artists.map((a) => a.name).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        <LoginWithSpotify />
      </div>
    </div>
  );
}
