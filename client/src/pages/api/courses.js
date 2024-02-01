// import mysql from 'mysql2/promise';


// export default async function handler(request, response) {
//     if (request.method == 'GET') {
//         try {
//             // Connect to the database, get the credentials from the evnironment variables
//             const connection = await mysql.createConnection({
//                 host: process.env.DB_HOST,
//                 user: process.env.DB_USER,
//                 password: process.env.DB_PASSWORD,
//                 database: process.env.DB_NAME
//             });

//             // get the course name and course code from the database
//             let [rows] = await connection.execute('SELECT course_code, course_name FROM tblCourses');
//             await connection.end();

//             response.status(200).json(rows);
//         } catch (error) {
//             console.error(error);
//             response.status(500).json({ message: 'Error fetching courses' });
//         }
//     } else {
//         response.status(405).end();
//     }
// }

import mysql from 'mysql2/promise';

export default async function handler(request, response) {
    if (request.method === 'GET') {
        try {
            // Connect to the database, get the credentials from the evnironment variables
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            // get the course name and course code from the database
            let [rows] = await connection.execute('SELECT course_code, course_name FROM tblCourses');
            await connection.end();

            response.status(200).json(rows);
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Error fetching courses' });
        }
    } else if (request.method === 'POST') {
        try {
            // Connect to the database, get the credentials from the evnironment variables
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            // get the course name and course code from the request body
            const { courseCode, courseName } = request.body;

            // insert the new course into the database
            await connection.execute('INSERT INTO tblCourses (course_code, course_name) VALUES (?, ?)', [courseCode, courseName]);
            await connection.end();

            response.status(201).json({ message: 'Course added successfully' });
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Error adding course' });
        }
    } else {
        response.status(405).end();
    }
}