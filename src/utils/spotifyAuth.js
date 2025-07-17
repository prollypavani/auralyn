export async function exchangeToken(code) {
  const codeVerifier = sessionStorage.getItem("spotify_code_verifier");

  const body = {
    code,
    code_verifier: codeVerifier,
    redirect_uri: "https://auralyn-theta.vercel.app/", // make sure it matches Spotify
  };

  try {
    const res = await fetch("/api/exchangeToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Token exchange failed:", data);
      throw new Error(data.error_description || "Token exchange failed");
    }

    console.log("✅ Spotify Access Token:", data.access_token);
    sessionStorage.setItem("spotify_access_token", data.access_token);
    return data;
  } catch (err) {
    console.error("❌ Error exchanging token:", err);
    throw err;
  }
}
