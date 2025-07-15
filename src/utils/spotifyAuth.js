export async function exchangeToken(code) {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
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

    if (!res.ok) {
      console.error("❌ Token exchange failed:", data);
      throw new Error("Token exchange failed");
    }

    localStorage.setItem("spotify_access_token", data.access_token);
    console.log("✅ Spotify Access Token:", data.access_token);
    return data;
  } catch (err) {
    console.error("❌ Error exchanging token:", err);
    throw err;
  }
}
