import { useState, useEffect } from 'react';
import './Home.css';
import LoginWithSpotify from '../components/LoginWithSpotify';
import { exchangeToken } from '../utils/spotifyAuth'; // ✅ fixed path

export default function Home() {
  const [form, setForm] = useState({
    mood: '',
    genre: '',
    artist: '',
    count: 10,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeToken(code);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Auralyn</h1>
        <p className="subtitle">Mood-based Spotify Playlist Generator</p>

        <form onSubmit={handleSubmit}>
          <input name="mood" placeholder="How are you feeling?" onChange={handleChange} />
          <input name="genre" placeholder="Preferred genre" onChange={handleChange} />
          <input name="artist" placeholder="Favorite artist" onChange={handleChange} />
          <input name="count" type="number" value={form.count} onChange={handleChange} />
          <button type="submit">🎶 Generate Playlist</button>
        </form>

        <LoginWithSpotify />
      </div>
    </div>
  );
}
