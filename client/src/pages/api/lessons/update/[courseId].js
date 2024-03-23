import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    // make sure the request is a PUT
    if (request.method !== 'PUT') {
        return response.status(405).end(`Method Not Allowed`);
    }

    // get the lessonId from the query string
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

        // update the lesson in the database
        const [result] = await connection.execute(
            `UPDATE tblLessons SET unit_number = ?, week = ?, class_ID = ?, learning_outcomes = ?, enabling_outcomes = ?, material = ?, assessment = ?, notes = ?
            WHERE course_id = ? AND id = ?`,
            [unit_number, week, class_ID, learning_outcomes, enabling_outcomes, materialPath, assessment, notes, courseId, class_ID] // assuming class_ID is the lesson ID
        );

        await connection.end();

        if (result.affectedRows > 0) {
            response.status(200).json({ message: 'Lesson updated successfully' });
        } else {
            response.status(404).json({ message: 'Lesson not found or no changes made' });
        }
    } catch (error) {
        console.error('Database connection or query error:', error);
        response.status(500).json({ message: 'Error updating lesson' });
    }
}
