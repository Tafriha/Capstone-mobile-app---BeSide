const nodemailer= require ("nodemailer");
class EmailService {
  constructor() {
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT, 10);
    const user = process.env.EMAIL_USERNAME;
    const pass = process.env.EMAIL_PASSWORD;
    const from = process.env.EMAIL_FROM;

    if (!host || !port || !user || !pass) {
        throw new Error("Email configuration is missing. Please check your environment variables.");
    }

    const secure = port === 465; // true for 465, false for other ports
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },

      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },

    });

  }

  async sendEmail({email, subject, text, html}){
    try {
        const mailOptions = {
            from: '"Beside", barshamahbuba@gmail.com',
            to: email,
            subject: subject,
            text: text,
            html: html,
        };
        const info = await this.transporter.sendMail(mailOptions);
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }

  }

  async sendPasswordResetEmail(email,resetToken,username){
    const resetUrl = `${process.env.FRONTEND_URL}resetPassword/${resetToken}`;
    const html= `<p>Hello ${username},</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
    const text = `Hello ${username},\n\nClick the following link to reset your password: ${resetUrl}`;
    console.log (`
        email host: ${process.env.EMAIL_HOST}
        email port: ${process.env.EMAIL_PORT}
        email username: ${process.env.EMAIL_USERNAME}
        email password: ${process.env.EMAIL_PASSWORD}
        email from: ${process.env.EMAIL_FROM}
        email to: ${email}
        email subject: Password Reset
        email html: ${html}
        email text: ${text}
        `);

    return this.sendEmail({
      email,
      subject: "Password Reset",
      text,
      html,
    });
  }

  async sendVerificationEmail(email, verificationToken, username) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const html = `<p>Hello ${username},</p><p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`;
    const text = `Hello ${username},\n\nClick the following link to verify your email address: ${verificationUrl}`;

    return this.sendEmail({
      email,
      subject: "Email Verification",
      text,
      html,
    });
  }
}
module.exports = new EmailService();