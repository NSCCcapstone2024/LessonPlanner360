import mysql from 'mysql2/promise';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token, newPassword } = req.body;
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Verify token and expiration
        let [user] = await connection.execute('SELECT * FROM tblLogin WHERE resetToken = ? AND resetTokenExpiration > NOW()', [token]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'Token is invalid or has expired.' });
        }

        // Generate new hash and salt for the new password
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHmac('sha256', salt).update(newPassword).digest('hex');

        // Update the user's password and salt in the database, clear the resetToken and resetTokenExpiration
        await connection.execute('UPDATE tblLogin SET password = ?, salt = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE email = ?', [hash, salt, user[0].email]);

        return res.status(200).json({ message: 'Password successfully reset.' });
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }
}
