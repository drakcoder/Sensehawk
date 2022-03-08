const express = require('express');
const { TotalDataFetch } = require('../controllers/totalProjectData.controller');
const authentication = require('../middlewares/authentication');

const router = express.Router();

router.get('/GetEnergiesForEachMonth', authentication, TotalDataFetch);

module.exports = router;