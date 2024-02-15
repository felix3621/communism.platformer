const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('../modules/authentication.cjs');
const fa = require('../modules/fileAccess.cjs');
const router = express.Router();

const filePath =  '../frontend/static/images/assets/'

const storage = multer.diskStorage({
    destination: filePath,
    filename: function (req, file, cb) {
        fs.access(path.join(filePath, file.originalname), fs.constants.F_OK, (err) => {
            if (err) {
                let data = JSON.parse(fa.read("./data/textures.json"))
                if (data[req.params.addr]) {
                    res.status(500).send("Error");
                    cb(new Error('key already exists'));
                } else {
                    data[req.params.addr] = file.originalname;
                    fa.write("./data/textures.json", JSON.stringify(data, null, 4))
                    logger.info(req.user.username + " added a new image, key: "+req.params.addr+", texture_name: "+file.originalname)
                    cb(null, file.originalname);
                }

            } else {
                cb(new Error('File already exists'));
            }
        });
    }
});

const upload = multer({ storage: storage });

router.use(auth.checkUserMiddleware)

router.post("/:addr", upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
})

module.exports = router