const CryptoJS = require('crypto-js'); 
const db = require('./database.cjs');

encrypt = (text) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

decrypt = (data) => {
    return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

checkUser = async (username, password) => {
    password = encrypt(password);
    let result = await (await db).collection("accounts").findOne({username: username, password: password});
    if (result) {
        return {
            username: result.username,
            display_name: result.display_name,
            admin: result.admin ? true : false
        }
    } else {
        return null;
    }
}

checkUserToken = async (token) => {
    try {
        token = JSON.parse(decrypt(token));
        let username = decrypt(token[0]);
        let password = decrypt(decrypt(token[1]));
        return await checkUser(username, password);
    } catch (e) {
        return null;
    }
}

checkUserMiddleware = async (req, res, next) => {
    if (req.body.username && typeof req.body.username == "string" && req.body.password && typeof req.body.password == "string") {
        let ud = await checkUser(req.body.username, req.body.password);
        if (ud) {
            req.user = ud;
            let userToken = encrypt(JSON.stringify([encrypt(req.body.username), encrypt(encrypt(req.body.password))]))
            res.cookie('flf_userToken', userToken, { httpOnly: true });
            next();
        } else {
            res.status(401).send("Invalid credentials");
        }
    } else if (req.cookies && req.cookies.flf_userToken) {
        let ud = await checkUserToken(req.cookies.flf_userToken);
        if (ud) {
            req.user = ud;
            next();
        } else {
            res.status(401).send("Invalid credentials");
        }
    } else {
        res.status(401).send("Invalid credentials");
    }
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    checkUserToken: checkUserToken,
    checkUserMiddleware
}