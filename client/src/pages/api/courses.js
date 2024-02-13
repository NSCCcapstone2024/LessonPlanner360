import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    const { query: { course_code } } = request;

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        if (request.method === 'GET') {
            // If a course_code query parameter is provided, check for its uniqueness
            if (course_code) {
                const [rows] = await connection.execute('SELECT id FROM tblCourses WHERE course_code = ?', [course_code]);
                return response.json({ isUnique: rows.length === 0 });
            }

            // Otherwise, fetch all courses
            const [rows] = await connection.execute('SELECT id, course_code, course_name FROM tblCourses');
            return response.status(200).json(rows);
        } else if (request.method === 'POST') {
            const { course_code, course_name } = request.body;

            // Ensure course_code is unique before adding a new course
            const [existingCourses] = await connection.execute('SELECT id FROM tblCourses WHERE course_code = ?', [course_code]);
            if (existingCourses.length > 0) {
                return response.status(400).json({ message: 'Course code must be unique.' });
            }

            // Insert the new course into the database
            await connection.execute('INSERT INTO tblCourses (course_code, course_name) VALUES (?, ?)', [course_code, course_name]);
            return response.status(201).json({ message: 'Course added successfully' });
        } else if (request.method === 'PUT') {
            const courseId = request.query.id;

            // Archive the course
            await connection.execute('UPDATE tblCourses SET isArchived = true WHERE id = ?', [courseId]);
            return response.status(200).json({ message: 'Course archived successfully.' });
        } else {
            response.setHeader('Allow', ['GET', 'POST']);
            return response.status(405).end(`Method ${request.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Error processing request' });
    } finally {
        if (connection) await connection.end();
    }
}
