const nodemailer = require("nodemailer");

const sendOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Cartly OTP Verification",
      text: `Your OTP for Cartly signup is ${otp}. It expires in 5 minutes.`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
  }
};

module.exports = sendOtp;
