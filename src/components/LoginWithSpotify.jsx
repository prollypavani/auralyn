import { generateCodeChallenge, generateCodeVerifier } from '../utils/pkce';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export default function LoginWithSpotify() {
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code_verifier for token exchange
    localStorage.setItem('spotify_code_verifier', codeVerifier);

    // ✅ Construct correct Spotify auth URL with PKCE
    const authUrl =
  `https://accounts.spotify.com/authorize?` +
  `client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&` +
  `response_type=code&` +
  `redirect_uri=${import.meta.env.VITE_SPOTIFY_REDIRECT_URI}&` +
  `scope=playlist-modify-public%20user-read-private%20user-read-email&` +
  `code_challenge_method=S256&` +
  `code_challenge=${codeChallenge}`;


    // Redirect user to Spotify login
    window.location.href = authUrl;
  };

  return (
    <button className="spotify-btn" onClick={handleLogin}>
      <img
        className="spotify-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
        alt="Spotify logo"
      />
      Login with Spotify
    </button>
  );
}
