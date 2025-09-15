import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // ✅ Always set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
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
  }

  // ❌ Other methods
  return res.status(405).json({ message: "Method Not Allowed" });
}
