import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    console.log('API Endpoint Reached'); // Log when the API endpoint is reached

    if (request.method !== 'POST') {
        console.log('Method Not Allowed'); // Log when the request method is not allowed
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    // get the id from the query
    const { id } = request.query;

    let connection;
    try {
        // establish a connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // retrieve the course from the database
        const [rows] = await connection.execute('SELECT * FROM tblCourses WHERE id = ?', [id]);

        // check if the course exists
        if (rows.length === 0) {
            return response.status(404).json({ message: 'Course not found' });
        }

        // get the course details
        const course = rows[0];

        // copy the course with a new ID
        const copiedCourse = { ...course };
        delete copiedCourse.id; // Remove the original ID to ensure a new ID is assigned upon insertion

        // insert the copied course into the database
        const [result] = await connection.execute('INSERT INTO tblCourses SET ?', copiedCourse);

        // send a success response if copying the course is successful
        response.status(200).json({ message: 'Course copied successfully', newCourseId: result.insertId });
    } catch (error) {
        console.error('Error copying course:', error);
        response.status(500).json({ message: 'Error copying course' });
    } finally {
        // close connection
        if (connection) {
            try {
                await connection.end();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
}
