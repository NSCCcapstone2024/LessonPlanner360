import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    const { query: { courseId } } = request;
    //create connection
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        if (request.method === 'GET') {
            // get the lessons by the courseID and organize by unit
            const [lessons] = await connection.execute(
                `SELECT * FROM tblLessons 
                 WHERE course_id = ? 
                 ORDER BY unit_number ASC`,
                [courseId]
            );

            return response.status(200).json(lessons);
        } else {
            response.setHeader('Allow', ['GET']);
            return response.status(405).end(`Method ${request.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return response.status(500).json({ message: 'Error processing request' });
    } finally {
        if (connection) await connection.end();
    }
}
