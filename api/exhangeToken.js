// /api/tokenExchange.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, code_verifier, redirect_uri } = req.body;

  const params = new URLSearchParams();
  params.append("client_id", process.env.SPOTIFY_CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("code_verifier", code_verifier);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Spotify API error:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
