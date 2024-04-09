import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    if (request.method !== 'PUT') {
        return response.status(405).end('Method Not Allowed');
    }

    // Extract the lessonId from the URL parameter
    const { lessonId } = request.query;
    console.log('Lesson ID:', lessonId); // Add this console.log to check the lessonId

    // Extract the data from the request body
    const {
        unit_number,
        week,
        class_ID,
        learning_outcomes,
        enabling_outcomes,
        material,
        assessment,
        notes,
        status
    } = request.body;
    console.log('Request body:', request.body); // Add this console.log to check the request body

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('Database connection successful'); // Add this console.log to check the database connection

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
                notes = ?, 
                status = ? 
            WHERE id = ?`,
            [
                unit_number,
                week,
                class_ID,
                learning_outcomes,
                enabling_outcomes,
                material,
                assessment,
                notes,
                status || 'neither',
                lessonId
            ]
        );
        console.log('SQL UPDATE query executed'); // Add this console.log to check the execution of SQL query

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
