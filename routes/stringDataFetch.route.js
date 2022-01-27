const express=require('express');
const DataFetch=require('../controllers/stringDataFetch.controller');
const authentication = require('../middlewares/authentication');

const router=express.Router();

router.post('/',authentication,DataFetch);

module.exports=router
