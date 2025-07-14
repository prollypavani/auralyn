import { generateCodeChallenge, generateCodeVerifier } from '../utils/auth';

const clientId = "90b33372512643d1b5f8ae1eb840721d";
const redirectUri = "http://127.0.0.1:5173";
const scopes = [
  "playlist-modify-public",
  "user-read-private",
  "user-read-email"
];

export default function LoginWithSpotify() {
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("spotify_code_verifier", codeVerifier);

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes.join(
      "%20"
    )}&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

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
