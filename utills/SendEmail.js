import nodemailer from "nodemailer";

const SendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
         host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    service: process.env.SMTP_SERVICE || 'gmail',
    secure: true, // true for port 465
        auth: {
            user: soniaayush5562@gmail.com,
            pass: bfpv wsym kfam cxxe,
        },
        tls:{
            rejectUnAuthorized:true
        }
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
};

export default SendEmail;
