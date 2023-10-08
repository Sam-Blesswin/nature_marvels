const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  //define email options
  const mailOptions = {
    from: 'Sam Blesswin <samblesswinedu@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
