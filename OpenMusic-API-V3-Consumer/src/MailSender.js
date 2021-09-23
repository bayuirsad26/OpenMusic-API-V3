const nodemailer = require('nodemailer');

/**
 * To be responsible of mail sender.
 */
class MailSender {
  /**
   * Construct to create transporter.
   */
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  /**
   * Send email.
   * @param {*} targetEmail Param represent of target email.
   * @param {*} content Param represent of content.
   * @return {*} Return is transporter sending to email.
   */
  sendEmail(targetEmail, content) {
    const message = {
      from: 'Notes Apps',
      to: targetEmail,
      subject: 'Ekspor Catatan',
      text: 'Terlampir hasil dari ekspor catatan',
      attachments: [
        {
          filename: 'notes.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
