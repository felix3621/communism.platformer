const express = require('express');
const auth = require('../modules/authentication.cjs');
const fa = require('../modules/fileAccess.cjs');
const logger = require('../modules/logger.cjs');
const router = express.Router();

get = (req, res, addr) => {
    try {
        res.json(JSON.parse(fa.read(addr)));
    } catch (e) {
        res.status(500).send("Internal error");
        logger.error(e.stack, req.originalUrl)
    }
}

getSpecific = (req, res, addr, search) => {
    try {
        let file = JSON.parse(fa.read(addr));
        res.send(file[search])
    } catch (e) {
        res.status(500).send("Internal error");
        logger.error(e.stack, req.originalUrl)
    }
}

router.use(auth.checkUserMiddleware)

router.get('/textures', (req, res) => get(req, res, "./data/textures.json"))
router.get('/textures/:name', (req, res) => getSpecific(req, res, "./data/textures.json", req.params.name))
router.get('/assets', (req, res) => get(req, res, "./data/assets.json"))
router.get('/assets/:name', (req, res) => getSpecific(req, res, "./data/assets.json", req.params.name))
router.get('/items', (req, res) => get(req, res, "./data/items.json"))
router.get('/items/:name', (req, res) => getSpecific(req, res, "./data/items.json", req.params.name))
router.get('/class', (req, res) => get(req, res, "./data/class.json"))
router.get('/class/:name', (req, res) => getSpecific(req, res, "./data/class.json", req.params.name))
router.get('/enemy', (req, res) => get(req, res, "./data/enemy.json"))
router.get('/enemy/:name', (req, res) => getSpecific(req, res, "./data/enemy.json", req.params.name))
router.get('/map', (req, res) => get(req, res, "./data/map.json"))
router.get('/map/:name', (req, res) => getSpecific(req, res, "./data/map.json", req.params.name))

router.post('/', (req, res) => {
    if (req.user.admin) {
        try {
            if (req.body.assets) {
                let data = JSON.parse(fa.read("./data/assets.json"))
                let keys = Object.keys(data)
                let newKey = Number(keys[keys.length - 1])+1

                for (let key in req.body.assets) {
                    if (key.startsWith("new")) {
                        delete req.body.assets[key].State
                        data[newKey] = req.body.assets[key]
                        newKey++
                    } else if (req.body.assets[key].State == "change") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete req.body.assets[key].State
                            data[key] = req.body.assets[key]
                        }
                    } else if (req.body.assets[key].State == "remove") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete data[key]
                        }
                    }
                }
                fa.write("./data/assets.json", JSON.stringify(data, null, 4))
            }
            if (req.body.items) {
                let data = JSON.parse(fa.read("./data/items.json"))
                let keys = Object.keys(data)
                let newKey = Number(keys[keys.length - 1])+1

                for (let key in req.body.items) {
                    if (key.startsWith("new")) {
                        delete req.body.items[key].State
                        data[newKey] = req.body.items[key]
                        newKey++
                    } else if (req.body.items[key].State == "change") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete req.body.items[key].State
                            data[key] = req.body.items[key]
                        }
                    } else if (req.body.items[key].State == "remove") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete data[key]
                        }
                    }
                }
                fa.write("./data/items.json", JSON.stringify(data, null, 4))
            }
            if (req.body.class) {
                let data = JSON.parse(fa.read("./data/class.json"))
                let keys = Object.keys(data)
                let newKey = Number(keys[keys.length - 1])+1

                for (let key in req.body.class) {
                    if (key.startsWith("new")) {
                        delete req.body.class[key].State
                        data[newKey] = req.body.assets[key]
                        newKey++
                    } else if (req.body.class[key].State == "change") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete req.body.class[key].State
                            data[key] = req.body.class[key]
                        }
                    } else if (req.body.class[key].State == "remove") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete data[key]
                        }
                    }
                }
                fa.write("./data/class.json", JSON.stringify(data, null, 4))
            }
            if (req.body.enemy) {
                let data = JSON.parse(fa.read("./data/enemy.json"))
                let keys = Object.keys(data)
                let newKey = Number(keys[keys.length - 1])+1

                for (let key in req.body.enemy) {
                    if (key.startsWith("new")) {
                        delete req.body.enemy[key].State
                        data[newKey] = req.body.enemy[key]
                        newKey++
                    } else if (req.body.enemy[key].State == "change") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete req.body.enemy[key].State
                            data[key] = req.body.enemy[key]
                        }
                    } else if (req.body.enemy[key].State == "remove") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete data[key]
                        }
                    }
                }
                fa.write("./data/enemy.json", JSON.stringify(data, null, 4))
            }
            if (req.body.map) {
                let data = JSON.parse(fa.read("./data/map.json"))
                let keys = Object.keys(data)
                let newKey = Number(keys[keys.length - 1])+1

                for (let key in req.body.map) {
                    if (key.startsWith("new")) {
                        delete req.body.map[key].State
                        data[newKey] = req.body.map[key]
                        newKey++
                    } else if (req.body.map[key].State == "change") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete req.body.map[key].State
                            data[key] = req.body.map[key]
                        }
                    } else if (req.body.map[key].State == "remove") {
                        if (data[key] == null) {
                            res.status(404).send("Key not found")
                            throw new error()
                        } else {
                            delete data[key]
                        }
                    }
                }
                fa.write("./data/map.json", JSON.stringify(data, null, 4))
            }
            res.send("Successfully updated data")
        } catch(e) {
            logger.error(e, req.baseUrl)
        }
    } else {
        res.status(401).send("invalid permissions")
    }
})

module.exports = router;