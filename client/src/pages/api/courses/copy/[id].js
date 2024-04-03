import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    console.log('API Endpoint Reached');

    if (request.method !== 'POST') {
        console.log('Method Not Allowed');
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = request.query;
    console.log('Received id:', id);

    if (!id) {
        console.log('ID parameter is missing');
        return response.status(400).json({ message: 'ID parameter is missing' });
    }

    let connection;
    try {
        console.log('Establishing database connection...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Database connection established successfully!');

        // Retrieve the original course and its associated lessons from the database
        const [courseRows] = await connection.execute('SELECT * FROM tblCourses WHERE id = ?', [id]);
        const [lessonRows] = await connection.execute('SELECT * FROM tblLessons WHERE course_id = ?', [id]);

        if (courseRows.length === 0) {
            console.log('Course not found');
            return response.status(404).json({ message: 'Course not found' });
        }

        const originalCourse = courseRows[0];
        const originalLessons = lessonRows;

        console.log('Original Course:', originalCourse);
        console.log('Original Lessons:', originalLessons);

        // Copy the course
        const copiedCourse = { ...originalCourse };
        delete copiedCourse.id;
        copiedCourse.archived = false;

        const [insertResult] = await connection.execute(
            'INSERT INTO tblCourses (course_code, course_name, year, archived) VALUES (?, ?, ?, ?)',
            [copiedCourse.course_code, copiedCourse.course_name, copiedCourse.year, copiedCourse.archived]
        );

        console.log('Course copied successfully!');
        const newCourseId = insertResult.insertId;

        // Copy lessons associated with the original course to the new course
        for (const lesson of originalLessons) {
            delete lesson.id; // Remove the original lesson ID to ensure a new ID is assigned upon insertion
            lesson.course_id = newCourseId; // Update the course_id to the ID of the copied course

            await connection.execute(
                'INSERT INTO tblLessons (course_id, unit_number, week, class_ID, learning_outcomes, enabling_outcomes, material, assessment, notes, completion, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    lesson.course_id,
                    lesson.unit_number,
                    lesson.week,
                    lesson.class_ID,
                    lesson.learning_outcomes,
                    lesson.enabling_outcomes,
                    lesson.material,
                    lesson.assessment,
                    lesson.notes,
                    lesson.completion,
                    lesson.status
                ]
            );
        }

        // Retrieve lessons associated with the copied course
        const [copiedLessonRows] = await connection.execute('SELECT * FROM tblLessons WHERE course_id = ?', [newCourseId]);

        response.status(200).json({ message: 'Course copied successfully', newCourseId, lessons: copiedLessonRows });
    } catch (error) {
        console.error('Error copying course:', error);
        response.status(500).json({ message: 'Error copying course', error: error.message });
    } finally {
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
