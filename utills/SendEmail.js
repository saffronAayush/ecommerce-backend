import nodemailer from "nodemailer";

const SendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        port: 465,
        host: "smtp.gmail.com",
        secure: true,
        logger: true,
        debug: true,
        secureConnection: false,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
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
