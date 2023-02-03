const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

router.post('/send', async (req, res) => {
  var body = req.body
  var to = body.to.join(',')
  var message = body.message
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '1017935195@qq.com', // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"peiili" 1017935195@qq.com', // sender address
    to: to, // list of receivers
    subject: message.subject, // Subject line
    text: message.text, // plain text body
    html: message.html, // html body
    attachments:message.attachments
  });

  console.log("Message sent: %s", info.messageId);
  res.status(200).send({
    success:true,
    message:"Message sent: %s"+ info.messageId
  })
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
})

module.exports = router; 