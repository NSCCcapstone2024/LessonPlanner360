import { IncomingForm } from 'multiparty';
import fs from 'fs';
import path from 'path';


export default function handler(request, response) {
    // Check if the method is POST
    if (request.method !== 'POST') {
        response.setHeader('Allow', ['POST']);
        return response.status(405).end(`Method Not Allowed`);
    }

    // create an instance of IncomingForm with the upload directory
    const form = new IncomingForm({ uploadDir: './public/uploads' });
    form.parse(request, (error, fields, files) => {
        if (error) {
            console.error('Error parsing the files:', error);
            return response.status(500).json({ error: 'Error parsing the files' });
        }

        // Process each uploaded file
        Object.keys(files).forEach((key) => {
            const file = files[key][0];
            const tempPath = file.path;
            const filename = file.originalFilename;
            const newPath = path.join('./public/uploads', filename);

            // Move the file from the temporary directory to the target directory
            fs.rename(tempPath, newPath, (err) => {
                if (err) {
                    console.error('Error saving the file:', err);
                    return response.status(500).json({ error: 'Error saving the file' });
                }
            });
        });
        response.status(200).json({ message: 'Files uploaded successfully', data: { fields, files: Object.keys(files).map(key => files[key][0].originalFilename) } });
    });
}
