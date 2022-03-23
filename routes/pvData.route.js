const express = require('express');
const { pvData_5minPush } = require('../controllers/pvdata_5minpush.controller');
const { pvDataFetch } = require('../controllers/pvdata_5minfetch.controller')
const authentication = require('../middlewares/authentication')

const router = express.Router();

router.post('/pushData', authentication, pvData_5minPush);
router.post('/fetchProjectData', authentication, pvDataFetch);

module.exports = router;