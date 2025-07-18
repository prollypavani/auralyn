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
    language: '',
    count: 10,
    playlistName: '',
  });

  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // 🎫 Handle Spotify token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !accessToken) {
      exchangeToken(code)
        .then((data) => {
          setAccessToken(data.access_token);
          console.log('✅ Access Token:', data.access_token);

          localStorage.removeItem('spotify_code_verifier');
          window.history.replaceState({}, document.title, '/');
        })
        .catch((err) => {
          console.error('❌ Token exchange failed:', err);
        });
    }
  }, []);

  // 👤 Get user profile
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

    const query = `${form.mood} ${form.genre} ${form.artist} ${form.language}`;
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

        <form onSubmit={handleSubmit} className="playlist-form">
          <input
            name="mood"
            placeholder="Mood (e.g. chill, happy)"
            value={form.mood}
            onChange={handleChange}
            required
          />
          <input
            name="genre"
            placeholder="Genre (e.g. pop, rock)"
            value={form.genre}
            onChange={handleChange}
          />
          <input
            name="language"
            placeholder="Language (optional)"
            value={form.language}
            onChange={handleChange}
          />
          <input
            name="artist"
            placeholder="Favorite Artist"
            value={form.artist}
            onChange={handleChange}
          />
          <input
            name="count"
            type="number"
            min="1"
            max="100"
            value={form.count}
            onChange={handleChange}
          />
          <input
            name="playlistName"
            placeholder="Playlist Name"
            value={form.playlistName}
            onChange={handleChange}
            required
          />
          <button type="submit">🎶 Generate Playlist</button>
        </form>

        {playlistTracks.length > 0 && (
          <div className="results">
            <h3>🎧 Preview: {form.playlistName || "Your Playlist"}</h3>
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
