const express=require('express');
const { stringData_5minPush }=require('../controllers/stringDataPush.controller');
const authentication = require('../middlewares/authentication');

const router=express.Router();

router.post('/',authentication,stringData_5minPush);

module.exports=router;