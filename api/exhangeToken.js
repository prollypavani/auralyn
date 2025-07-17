// /api/exchangeToken.js

export async function exchangeToken(code) {
  const codeVerifier = sessionStorage.getItem("spotify_code_verifier");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier,
  });

  console.log("📌 Exchanging token with:");
  console.log("🔸 redirect_uri:", import.meta.env.VITE_SPOTIFY_REDIRECT_URI);
  console.log("🔸 client_id:", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
  console.log("🔸 code_verifier:", codeVerifier);
  console.log("🔸 code:", code);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Token exchange failed:", data);
      throw new Error(data.error_description || "Token exchange failed");
    }

    console.log("✅ Access token received:", data.access_token);
    sessionStorage.setItem("spotify_access_token", data.access_token);
    return data;
  } catch (error) {
    console.error("❌ Error exchanging token:", error);
    throw error;
  }
}
