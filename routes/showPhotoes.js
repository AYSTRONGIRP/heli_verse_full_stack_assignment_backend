const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const router = express.Router();
const assetPath = path.join(__dirname, '../assets');

router.get('/', (req, res) => {
    console.log(req.query)
  const id = req.query.id; // Assuming you're using query parameter id
    console.log(id)
  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }
  
  const userAssetPath = path.join(assetPath, id);
  fs.readdir(userAssetPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const imageFiles = files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));

      const imageUrls = imageFiles.map(file => `/assets/${id}/${file}`);
      res.json({ images: imageUrls });
    }
  });
});

module.exports = router