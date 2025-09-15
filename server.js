import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight requests
app.options("*", cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.post("/book-appointment", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const { name, age, number, doctor } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.MEDICAL_TEAM_EMAIL,
    subject: "New Appointment Request",
    text: `A patient has requested an appointment:
    Name: ${name}
    Age: ${age}
    Number: ${number}
    Doctor: ${doctor}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Appointment request sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending appointment" });
  }
});

// also handle preflight
app.options("/book-appointment", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.status(200).end();
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;