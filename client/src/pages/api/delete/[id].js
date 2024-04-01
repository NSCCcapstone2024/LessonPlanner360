import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    // Extract the id from the query string
    const {
        query: { id },
        method,
    } = request;

    console.log('Received request with method:', method);
    console.log('ID extracted from query string:', id);

    let connection;
    try {
        // Create a new connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('Database connection established successfully');

        if (method === 'DELETE') {
            // Perform the deletion
            console.log('Deleting course with ID:', id);
            const [result] = await connection.execute('DELETE FROM tblCourses WHERE id = ?', [id]);
            console.log('Delete query executed, result:', result);
            if (result.affectedRows === 0) {
                console.log('Course not found');
                return response.status(404).json({ message: 'Course not found' });
            }
            console.log('Course deleted successfully');
            return response.status(200).json({ message: 'Course deleted successfully' });
        } else {
            console.log('Method not allowed:', method);
            response.setHeader('Allow', ['DELETE']);
            return response.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ message: 'Error deleting course' });
    } finally {
        if (connection) {
            console.log('Closing database connection');
            await connection.end();
        }
    }
}
