import mysql from 'mysql2/promise';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    const { email } = req.body;

    try {
        console.log("Connecting to database...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log("Database connection successful");

        console.log(`Checking if user exists for email: ${email}`);
        const [users] = await connection.execute('SELECT * FROM tblLogin WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log("User not found");
            return res.status(404).json({ error: "User with this email doesn't exist." });
        }
        console.log("User found, generating reset token...");

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = new Date(Date.now() + 3600000);

        console.log("Updating user with reset token and expiration");
        await connection.execute('UPDATE tblLogin SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?', [resetToken, resetTokenExpiration, email]);

        console.log("Setting up email transporter...");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: true, // Force TLS
        });


        console.log("Sending password reset email...");
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            html: `Please click this link to reset your password: <a href="${process.env.NEXT_PUBLIC_APP_URL}/resetPassword?token=${resetToken}">Reset Password</a>`
        });

        console.log("Password reset email sent successfully");
        return res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error('Error in forgotPassword API:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
}
