const express = require('express');

const fileUpload = require('express-fileupload');

const router = express.Router();
const path = require('path');
const fs = require('fs');
router.use(fileUpload())

const assetPath = path.join(__dirname, '../assets');

router.post('/', function(req, res){
    const photo = req.files.photo; // Use req.files to access files sent via FormData
    const id = req.body.id;
    let modifiedAssetPath = path.join(assetPath, id);
    fs.mkdirSync(modifiedAssetPath, { recursive: true });
    const timestamp = new Date().getTime(); // Get the timestamp
    const fileName = `${timestamp}_${photo.name}`;

    photo.mv(path.join(modifiedAssetPath, fileName));

    res.status(200).json({photo:photo});
})


module.exports = router