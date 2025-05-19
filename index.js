const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();

app.post("/api/send-email", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // use true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Contact Form" <odyss.travels@odyss.ng>',
      to: "feedback@odyss.ng", // your destination email
      subject: "New Feedback Message",
      text: `From: ${email}\n\n${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
