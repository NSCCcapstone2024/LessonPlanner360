import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    const {
        query: { courseId },
        method,
    } = request;

    //create connection
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // check if the request is "DELETE", if so delete the corresponding lesson
        if (method === 'DELETE') {
            const [result] = await connection.execute('DELETE FROM tblLessons WHERE id = ?', [courseId]);
            if (result.affectedRows === 0) {
                return response.status(404).json({ message: 'Lesson not found' });
            }
            return response.status(200).json({ message: 'Lesson deleted successfully' });
        } else {
            response.setHeader('Allow', ['DELETE']);
            return response.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ message: 'Error deleting lesson' });
    } finally {
        if (connection) await connection.end();
    }
}
