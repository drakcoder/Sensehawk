const express=require('express');
const stringDataPush=require('../controllers/stringDataPush.controller');
const authentication = require('../middlewares/authentication');

const router=express.Router();

router.post('/',authentication,stringDataPush);

module.exports=router;