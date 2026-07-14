const asyncHandler = require("express-async-handler");
const { Resend } = require("resend");
const { welcomeNewsletter } = require("../../utils/emailTemplates/welcomeNewsletter");

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400);
    throw new Error("Adresă de email invalidă.");
  }

  await resend.emails.send({
    from: process.env.NEWSLETTER_FROM,
    to: email,
    subject: "Bine ai venit la alcrro! 🎉",
    html: welcomeNewsletter(email),
  });

  res.status(200).json({ message: "Abonare reușită." });
});

module.exports = { subscribeNewsletter };
