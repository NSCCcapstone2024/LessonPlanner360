import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    console.log('API Endpoint Reached'); // Log when the API endpoint is reached

    if (request.method !== 'POST') {
        console.log('Method Not Allowed'); // Log when the request method is not allowed
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    // get the id from the query
    const { id } = request.query;
    console.log('Received id:', id); // Log the received id parameter

    // Check if the id parameter is present in the request body or URL
    if (!id) {
        console.log('ID parameter is missing'); // Log if the id parameter is missing
        return response.status(400).json({ message: 'ID parameter is missing' });
    }

    let connection;
    try {
        // establish a connection
        console.log('Establishing database connection...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Database connection established successfully!');

        // retrieve the course from the database
        const sql = 'SELECT * FROM tblCourses WHERE id = ?';
        console.log('Executing SQL query:', sql, 'with id:', id);
        const [rows] = await connection.execute(sql, [id]); // <-- Ensure that the id is passed as an array
        console.log('SQL query executed successfully!');


        // check if the course exists
        if (rows.length === 0) {
            console.log('Course not found'); // Log if the course is not found
            return response.status(404).json({ message: 'Course not found' });
        }

        // get the course details
        const course = rows[0];
        console.log('Found course:', course); // Log the found course details

        // copy the course with a new ID
        const copiedCourse = { ...course };
        delete copiedCourse.id; // Remove the original ID to ensure a new ID is assigned upon insertion

        // insert the copied course into the database
        const insertSql = 'INSERT INTO tblCourses (course_code, course_name, year, archived) VALUES (?, ?, ?, ?)';
        console.log('Executing SQL query:', insertSql, 'with data:', [copiedCourse.course_code, copiedCourse.course_name, copiedCourse.year, copiedCourse.archived]);

        copiedCourse.archived = false;

        const [result] = await connection.execute(insertSql, [copiedCourse.course_code, copiedCourse.course_name, copiedCourse.year, copiedCourse.archived]);
        console.log('Course copied successfully!');

        // send a success response if copying the course is successful
        response.status(200).json({ message: 'Course copied successfully', newCourseId: result.insertId });
    } catch (error) {
        console.error('Error copying course:', error);
        response.status(500).json({ message: 'Error copying course', error: error.message });
    } finally {
        // close connection
        if (connection) {
            try {
                await connection.end();
                console.log('Database connection closed.');
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
}
