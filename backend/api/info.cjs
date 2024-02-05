const express = require('express');
const auth = require('../modules/authentication.cjs');
const fa = require('../modules/fileAccess.cjs');
const router = express.Router();

get = (req, res, addr) => {
    try {
        res.json(JSON.parse(fa.read(addr)));
    } catch (e) {
        res.status(500).send("Internal error");
    }
}

getSpecific = (req, res, addr, search) => {
    try {
        let file = JSON.parse(fa.read(addr));
        res.send(file[search])
    } catch (e) {
        res.status(500).send("Internal error");
    }
}

router.use(auth.checkUserMiddleware)

router.get('/textures', (req, res) => get(req, res, "./data/textures.json"))
router.get('/textures/:name', (req, res) => getSpecific(req, res, "./data/textures.json", req.params.name))
router.get('/assets', (req, res) => get(req, res, "./data/assets.json"))
router.get('/assets/:name', (req, res) => getSpecific(req, res, "./data/assets.json", req.params.name))
router.get('/tools', (req, res) => get(req, res, "./data/tools.json"))
router.get('/tools/:name', (req, res) => getSpecific(req, res, "./data/tools.json", req.params.name))

module.exports = router;