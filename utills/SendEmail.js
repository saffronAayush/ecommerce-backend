import nodemailer from "nodemailer";

const SendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
         host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    service: process.env.SMTP_SERVICE || 'gmail',
    secure: true, // true for port 465
        auth: {
            user: "soniaayush5562@gmail.com",
            pass: "bfpv wsym kfam cxxe",
        },
        tls:{
            rejectUnAuthorized:true
        }
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: subject,
       html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .email-container {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #e0e0e0;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .email-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .email-header h1 {
                        font-size: 24px;
                        color: #007bff;
                    }
                    .email-body {
                        margin-bottom: 20px;
                    }
                    .email-footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 14px;
                        color: #888;
                    }
                    .reset-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    .reset-button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="email-body">
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your Ecommerce account. Click the button below to reset your password:</p>
                        <p style="text-align: center;">
                            <a href="${message}" class="reset-button">Reset Password</a>
                        </p>
                        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                        <p>Thank you,<br/>The Ecommerce Team</p>
                    </div>
                    <div class="email-footer">
                        <p>&copy; 2024 Ecommerce. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export default SendEmail;
