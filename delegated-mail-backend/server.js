const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-mail", async (req, res) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res
        .status(400)
        .json({ error: "Missing required fields: to, subject, body" });
    }

    console.log(`Attempting to send email to: ${to}`);

    const response = await axios.post(
      "https://graph.microsoft.com/v1.0/me/sendMail",
      {
        message: {
          subject: subject,
          body: {
            contentType: "Text",
            content: body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: to,
              },
            },
          ],
        },
        saveToSentItems: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully!");
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Graph API Error:", {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
      message: err.message,
    });

    res.status(err?.response?.status || 500).json({
      error: err?.response?.data || err.message,
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
