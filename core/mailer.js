const nodemailer = require("nodemailer");
const generatePasswordResetEmailTemplate = require("./../config/mail.template");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "beyondwordsvr@gmail.com",
    pass: "ysmebhcrrwgutqoy",
  },
});

const sendMail = (senderMail, recieverMail, first_name, id, cb) => {
  const mailOptions = {
    from: senderMail,
    to: recieverMail,
    subject: "Password Retrieval",
    first_name: first_name,
    id: id,
    html: generatePasswordResetEmailTemplate(first_name, id),
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};

module.exports = { sendMail };
