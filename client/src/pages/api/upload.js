import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { file, filename } = req.body;
        const buffer = Buffer.from(file, 'base64');

        // Construct the path to the target directory
        const assetsDir = path.join('public', 'assets');

        // Ensure the directory exists
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        try {
            // Construct the full path for the file to be saved
            const filePath = path.join(assetsDir, filename);

            // Write the file
            fs.writeFileSync(filePath, buffer);

            // Return the relative path of the uploaded file
            const relativePath = path.join('/assets', filename);
            res.status(200).json({ message: 'File uploaded successfully', filePath: relativePath });
        } catch (error) {
            console.error('Error writing file:', error);
            res.status(500).json({ message: 'Failed to upload file', error: error.message });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method Not Allowed`);
    }
}
