import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    if (request.method !== 'PUT') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }
    // get the id from the query
    const { id } = request.query;

    //establish a connection
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // update the course in the database to set it back to 0 when restored
        let [result] = await connection.execute(
            'UPDATE tblCourses SET archived = 0 WHERE id = ?',
            [id]
        );
        // close connection
        await connection.end();

        if (result.affectedRows > 0) {
            response.status(200).json({ message: 'Course restored successfully' });
        } else {
            response.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error restoring course' });
    }
}
