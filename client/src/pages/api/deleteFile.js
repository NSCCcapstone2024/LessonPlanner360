import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    if (request.method === 'DELETE') {
        // get the path and lesson id from the query paremeter
        const { filePath, lessonId } = request.query;

        // validate filePath
        if (!filePath) {
            return response.status(400).json({ message: 'File path is required' });
        }

        // construct the full file path
        const fileFullPath = path.join(process.cwd(), 'public', filePath);

        if (!fs.existsSync(fileFullPath)) {
            return response.status(404).json({ message: 'File not found' });
        }

        try {
            //Delete the file from the file system
            fs.unlinkSync(fileFullPath);

            // get a db connection
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            // Update the lesson in the database to remove the material path
            const [result] = await connection.execute(
                `UPDATE tblLessons SET material = NULL WHERE id = ?`,
                [lessonId]
            );

            await connection.end();

            if (result.affectedRows > 0) {
                response.status(200).json({ message: 'File and database record updated successfully' });
            } else {
                response.status(404).json({ message: 'Lesson not found in the database' });
            }
        } catch (error) {
            console.error('Error:', error);
            response.status(500).json({ message: 'Failed to delete file and update database', error: error.message });
        }
    } else {
        response.setHeader('Allow', ['DELETE']);
        response.status(405).end(`Method Not Allowed`);
    }
}
