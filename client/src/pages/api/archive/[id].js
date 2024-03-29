// api/archive/[id].js
import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    // Extract the id from the query string
    const {
        query: { id },
        method,
    } = request;

    let connection;
    try {
        // Create a new connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        if (method === 'PUT') {
            // Update the course status to 'archived' in the database
            const [result] = await connection.execute('UPDATE tblCourses SET archived = ? WHERE id = ?', [1, id]);
            if (result.affectedRows === 0) {
                return response.status(404).json({ message: 'Course not found' });
            }

            // Fetch the archived course data from the database
            const [archivedCourse] = await connection.execute('SELECT * FROM tblCourses WHERE id = ?', [id]);

            return response.status(200).json({ message: 'Course archived successfully', archivedCourse });
        }
        else {
            response.setHeader('Allow', ['PUT']);
            return response.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ message: 'Error archiving course' });
    } finally {
        if (connection) await connection.end();
    }
}
