import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        // Handle any non-GET requests
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let connection;
    try {
        // Establish connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Fetch all archived courses including archived_year
        const [archivedCourses] = await connection.execute('SELECT *, YEAR(archived_year) AS archived_year FROM tblCourses WHERE archived = 1 ORDER BY year DESC');

        // Send the archived courses as response
        return res.status(200).json(archivedCourses);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error fetching archived courses' });
    } finally {
        if (connection) await connection.end();
    }
}
