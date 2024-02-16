import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export default NextAuth({
    // get credentials for database connection from environment variables
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const connection = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                });

                // find the username in the database
                const query = 'SELECT * FROM tblLogin WHERE username = ? AND email = ?';
                const [rows] = await connection.execute(query, [credentials.username, credentials.email]);

                // if username does not exist, return null
                if (rows.length == 0) {
                    connection.end();
                    return null;
                }

                // Get the stored password and salt
                const { password: storedPassword, salt } = rows[0];

                // Use crypto to hash the provided password with the stored salt
                const hash = crypto.createHmac('sha256', salt)
                    .update(credentials.password)
                    .digest('hex');

                // if the password doesn't match the stored password, return null
                if (hash !== storedPassword) {
                    connection.end();
                    return null;
                }

                connection.end();

                // Return a user object if authentication succeeds
                return { id: rows[0].id, name: credentials.username };
            }
        })
    ],
    // make sure the login session expires after 20 minutes
    session: {
        strategy: "jwt",
        maxAge: 20 * 60,
    },
    jwt: {
        maxAge: 20 * 60,
    },

});
