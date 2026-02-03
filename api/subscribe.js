export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const plunkRes = await fetch("https://api.useplunk.com/v1/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PLUNK_SECRET_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await plunkRes.json();

    if (!plunkRes.ok) {
      return res.status(plunkRes.status).json(data);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
