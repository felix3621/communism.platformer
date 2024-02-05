const express = require('express');
const auth = require('../modules/authentication.cjs');
const db = require('../modules/database.cjs');
const logger = require('../modules/logger.cjs');
const router = express.Router();

router.post('/setDisplayName', auth.checkUserMiddleware, async (req, res) => {
    if (req.body.display_name && typeof req.body.display_name == "string") {
        await (await db).collection("accounts").updateOne({username: req.user.username},{$set: {display_name: req.body.display_name}});
        res.send(req.body.display_name)

        logger.info(
            req.user.username + " Changed username, old: " + req.user.display_name + ", new: " + req.body.display_name,
            req.originalUrl
        )
    } else {
        res.status(500).send("Invalid Input")
    }
})

router.post('/setPassword', auth.checkUserMiddleware, async (req, res) => {
    if (req.body.password && typeof req.body.password == "string" && req.body.newPassword && typeof req.body.newPassword == "string") {
        let result = await (await db).collection("accounts").findOne({username: req.user.username})

        if (result.password == auth.encrypt(req.body.password)) {
            await (await db).collection("accounts").updateOne({username: req.user.username},{$set: {password: auth.encrypt(req.body.newPassword)}});

            let userToken = auth.encrypt(JSON.stringify([auth.encrypt(req.user.username), auth.encrypt(auth.encrypt(req.body.newPassword))]))
            res.cookie('flf_userToken', userToken, { httpOnly: true });
            res.send("Password Changed Successfully")
            logger.info(
                req.user.username + " Changed password, old: " + result.password + ", new: " + auth.encrypt(req.body.newPassword),
                req.originalUrl
            )
        } else {
            res.status(401).send("Invalid password")
        }
    } else {
        res.status(500).send("Invalid Input")
    }
})

router.post('/login', auth.checkUserMiddleware, (req, res) => {
    if (req.user) {
        res.json(req.user)
    }
})

router.post('/signup', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let display_name = req.body.display_name;

    if (username && typeof username == "string" && password && typeof password == "string" && display_name && typeof display_name == "string") {
        password = auth.encrypt(password)
        let check = await (await db).collection("accounts").findOne({username: username})
        if (!check) {
            let user = {
                username: username,
                password: password,
                display_name: display_name
            }

            logger.info(
                "Account created: " + JSON.stringify(user, 0, 2),
                req.originalUrl
            )

            let result = await (await db).collection("accounts").insertOne(user)

            delete result.password;
            delete result._id;

            let userToken = auth.encrypt(JSON.stringify([auth.encrypt(username), auth.encrypt(password)]))
            res.cookie('flf_userToken', userToken, { httpOnly: true });
            res.json(result)
        } else {
            res.status(403).send("Username already exists")
        }
    } else {
        res.status(500).send("Invalid input")
    }
})

router.post('/logout', auth.checkUserMiddleware, (req, res) => {
    res.clearCookie('flf_userToken');
    res.send('Logout successful');
})

module.exports = router;