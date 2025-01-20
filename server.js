import express from 'express';
import { readdir } from 'fs/promises';
import path from 'path';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/api/images', async (req, res) => {
    const width = req.query.width;
    const height = req.query.height;

    if (!width || !height) {
        return res.status(400).json({ error: 'Width and height are required' });
    }

    const folderPath = path.resolve(`static/images/HHX/gt/${width}x${height}`);

    try {
        const files = await readdir(folderPath);
        const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

        if (imageFiles.length === 0) {
            return res.status(404).json({ error: 'No images found' });
        }

        const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        const imageUrl = `/images/HHX/gt/${width}x${height}/${randomFile}`;

        console.log('Random image:', imageUrl);
        res.status(200).json({ url: imageUrl });
    } catch (error) {
        console.error('Error reading directory:', error);
        res.status(500).json({ error: 'Error reading directory' });
    }
});

app.use('/images', express.static(path.resolve('static/images')));


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
