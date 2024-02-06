const express = require('express');
const router = express.Router();

router.use('/account', require('./account.cjs'))
router.use('/info', require('./info.cjs'))
router.use('/assets', require('./assets.cjs'))
module.exports = router;