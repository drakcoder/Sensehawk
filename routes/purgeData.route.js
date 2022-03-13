const express=require('express');

const { purge_data } = require("../controllers/purge_data.controller");
const authentication= require('../middlewares/authentication');

const router=express.Router();

router.post('/purge',authentication,purge_data);

module.exports=router

