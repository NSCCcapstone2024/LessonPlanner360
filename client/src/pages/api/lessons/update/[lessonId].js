import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    if (request.method !== 'PUT') {
        return response.status(405).end('Method Not Allowed');
    }

    // Extract the lessonId from the URL parameter
    const { lessonId } = request.query;

    // Extract the data from the request body
    const {
        unit_number,
        week,
        class_ID,
        learning_outcomes,
        enabling_outcomes,
        material,  // Assuming material is the field name for the file path
        assessment,
        notes
    } = request.body;

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Update the existing lesson in the database
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
                unit_number,
                week,
                class_ID,
                learning_outcomes,
                enabling_outcomes,
                material,  // Ensure this matches the column name in your database
                assessment,
                notes,
                lessonId  // This should match the lesson you intend to update
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
