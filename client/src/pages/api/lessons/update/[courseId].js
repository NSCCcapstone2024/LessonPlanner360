import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    if (request.method !== 'PUT') {
        return response.status(405).end(`Method Not Allowed`);
    }

    const { lessonId } = request.query; // Ensure you are getting the right identifier for the lesson

    // Use nullish coalescing to ensure no undefined values are sent to MySQL
    const {
        unit_number,
        week,
        class_ID,
        learning_outcomes,
        enabling_outcomes,
        assessment,
        notes,
        materialPath
    } = request.body;

    const values = {
        unit_number,
        week,
        class_ID,
        learning_outcomes: learning_outcomes ?? null,
        enabling_outcomes: enabling_outcomes ?? null,
        material: materialPath ?? null, // Make sure this matches your database column name
        assessment: assessment ?? null,
        notes: notes ?? null
    };

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [result] = await connection.execute(
            `UPDATE tblLessons SET 
                unit_number = ?, 
                week = ?, 
                class_ID = ?, 
                learning_outcomes = ?, 
                enabling_outcomes = ?, 
                material = ?, 
                assessment = ?, 
                notes = ? 
            WHERE id = ?`,
            [
                values.unit_number,
                values.week,
                values.class_ID,
                values.learning_outcomes,
                values.enabling_outcomes,
                values.material,
                values.assessment,
                values.notes,
                lessonId
            ]
        );

        await connection.end();

        if (result.affectedRows > 0) {
            response.status(200).json({ message: 'Lesson updated successfully' });
        } else {
            response.status(404).json({ message: 'No lesson found with the given ID' });
        }
    } catch (error) {
        console.error('Database connection or query error:', error);
        response.status(500).json({ message: 'Error updating lesson', error: error.message });
    }
}
