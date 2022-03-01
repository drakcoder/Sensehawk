const express=require('express');
const POADataPush=require('../controllers/project_5minpush.controller');
const POADataFetch=require('../controllers/project_5minfetch.controller')
const authentication=require('../middlewares/authentication')

const router=express.Router();

router.post('/pushData',authentication,POADataPush);
router.post('/fetchProjectData',authentication,POADataFetch);

module.exports=router;