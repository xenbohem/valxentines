// /api/subscribe.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Get the email from the form submission
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Make a request to Plunk API to add the email to contacts
  try {
    const response = await fetch("https://api.useplunk.com/v1/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_SECRET_API_KEY",  // Replace with your Plunk Secret API key
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      res.status(200).json({ message: "Thanks for joining! Please check your inbox to confirm." });
    } else {
      res.status(500).json({ error: "There was an error subscribing you. Please try again." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};
