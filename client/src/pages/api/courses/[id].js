import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    // Extract the id from the query string
    const {
        query: { id },
        method,
        body,
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
            const { course_code, course_name, year } = body;

            // Perform the update 
            const [result] = await connection.execute(
                'UPDATE tblCourses SET course_code = ?, course_name = ?, year = ? WHERE id = ?',
                [course_code, course_name, year, id]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({ message: 'Course not found' });
            }

            return response.status(200).json({ message: 'Course updated successfully' });
        } else {
            response.setHeader('Allow', ['PUT']);
            return response.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ message: 'Error updating course' });
    } finally {
        if (connection) await connection.end();
    }
}
