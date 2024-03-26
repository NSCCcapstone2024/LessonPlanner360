import mysql from 'mysql2/promise';
// Handle the course copy request
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Extract the course ID from the request parameters
        const { id } = request.query;
        console.log('Copying course with ID:', id);

        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Retrieve the course details from the database
        const [rows] = await connection.execute('SELECT * FROM tblCourses WHERE id = ?', [id]);
        const course = rows[0];

        if (!course) {
            return response.status(404).json({ message: 'Course not found' });
        }

        // Copy the course with a new ID
        const copiedCourse = { ...course };
        delete copiedCourse.id; // Remove the original ID to ensure a new ID is assigned upon insertion

        // Insert the copied course into the database
        const [{ insertId }] = await connection.execute('INSERT INTO tblCourses SET ?', copiedCourse);
        console.log('New course ID:', insertId);

        // Close the database connection
        await connection.end();

        // Send a success response if copying the course is successful
        response.status(200).json({ message: 'Course copied successfully', newCourseId: insertId });
    } catch (error) {
        console.error('Error copying course:', error);
        // Send an error response if copying the course fails
        response.status(500).json({ message: 'Error copying course' });
    }
}
