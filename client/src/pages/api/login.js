import mysql from 'mysql2/promise';
import crypto from 'crypto';

export default async function handler(request, response) {
    if (request.method == 'POST') {
        try {

            // get the username and password from the submitted form and sanitize by trimming whitespaces
            let { username, password } = request.body;
            username = username.trim();
            password = password.trim();

            // validate the username and password
            if (!username || !password) {
                return response.status(400).json({ message: 'Username and password are required' });
            }
            if (username.length > 45 || password.length > 200) {
                return response.status(400).json({ message: 'Username or password too long' });
            }

            // Connect to the database, get the credentials from the evnironment variables
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            // get the password and salt from the database for the provided username
            // use parameterized query
            let query = 'SELECT password, salt FROM tblLogin WHERE username = ?';
            let [rows] = await connection.execute(query, [username]);

            // if the username exists, check the password
            if (rows.length > 0) {
                let { password: storedPassword, salt } = rows[0];

                // hash the provided password with the stored salt
                let hash = crypto.createHmac('sha256', salt)
                    .update(password)
                    .digest('hex');

                // Compare the hashed password with the stored password
                if (hash == storedPassword) {
                    response.status(200).json({ message: 'Login successful' });
                } else {
                    response.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                response.status(401).json({ message: 'Invalid credentials' });
            }

            // Close the connection
            await connection.end();

        } catch (e) {
            console.error(e);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        response.status(405).end();
    }
}
