import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    // make sure the request is a POST
    if (request.method !== 'POST') {
        return response.status(405).end(`Method Not Allowed`);
    }
    // get the courseId from the query string
    const { courseId } = request.query;
    // get the form data from the request body
    const { unit_number, week, class_ID, learning_outcomes, enabling_outcomes, assessment, notes, materialPath } = request.body;

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // insert the lesson into the database
        const [result] = await connection.execute(
            `INSERT INTO tblLessons (course_id, unit_number, week, class_ID, learning_outcomes, enabling_outcomes, material, assessment, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [courseId, unit_number, week, class_ID, learning_outcomes, enabling_outcomes, materialPath, assessment, notes]
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
