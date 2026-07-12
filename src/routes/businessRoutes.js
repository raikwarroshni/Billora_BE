const express = require('express');
const { getBusiness, upsertBusiness } = require('../controllers/businessController');

const router = express.Router();

router.route('/').get(getBusiness).put(upsertBusiness);

module.exports = router;
