export async function exchangeToken(code) {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "http://127.0.0.1:5173",
    client_id: "90b33372512643d1b5f8ae1eb840721d",
    code_verifier: codeVerifier,
  });

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("spotify_access_token", data.access_token);
      console.log("✅ Spotify Access Token:", data.access_token);
      // Optional: clean URL
      window.history.replaceState({}, document.title, "/");
    } else {
      console.error("❌ Token exchange failed:", data);
    }
  } catch (err) {
    console.error("❌ Error exchanging token:", err);
  }
}
