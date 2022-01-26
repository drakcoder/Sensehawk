const express=require("express");
const { append } = require("express/lib/response");
const axios=require("axios");

loginApiRoute=express.Router();

loginApiRoute.get('/',async (req,res)=>{
    const reqBody={
        "email":"sensehawk@strategix4.com",
        "password":"1234567"
    }
    await axios.post("https://sensehawk-api.strategix4.com/api/users/token",reqBody)
    .then((msg)=>{
        console.log(msg.data.data);
        req.app.locals.x_access_token=msg.data.data.token
        res.send("check console for output");
    })
    .catch((err)=>{
        console.log(err);
    })
    // res.send("not sent")
})

module.exports=loginApiRoute;