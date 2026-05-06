const express = require('express');
const { globalSearch } = require('../controllers/search');

const router = express.Router();

router.get('/', globalSearch);

module.exports = router;
