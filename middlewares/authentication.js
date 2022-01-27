const express=require("express");

const authentication=(req,res,next)=>{
    return next();
}

module.exports=authentication;