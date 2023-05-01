const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'badarch.ogino@gmail.com',
    pass: 'afvdcajhpbmowhrc'
  }
});

module.exports = transporter;