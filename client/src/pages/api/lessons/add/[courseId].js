import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).end(`Method Not Allowed`);
    }
    // Extract the courseId from the query string and the fields from the request body
    const { courseId } = request.query;
    const { unit_number, week, class_ID, learning_outcomes, enabling_outcomes, material, assessment, notes, status } = request.body;

    // establish a connection to the database
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Insert the new lesson into the database
        const [result] = await connection.execute(
            `INSERT INTO tblLessons (course_id, unit_number, week, class_ID, learning_outcomes, enabling_outcomes, material, assessment, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [courseId, unit_number, week, class_ID, learning_outcomes, enabling_outcomes, material, assessment, notes, status || 'neither']
        );

        await connection.end();

        if (result.affectedRows > 0) {
            response.status(201).json({ message: 'Lesson added successfully' });
        } else {
            response.status(400).json({ message: 'Failed to add lesson' });
        }
    } catch (error) {
        console.error('Database connection or query error:', error);
        response.status(500).json({ message: 'Error adding lesson' });
    }
}
