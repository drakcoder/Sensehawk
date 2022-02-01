const express=require('express');
const strategixLogin=require('../controllers/strategixLogin.controller');
const authentication=require('../middlewares/authentication')

const router=express.Router();

router.post('/',strategixLogin)

module.exports=router;