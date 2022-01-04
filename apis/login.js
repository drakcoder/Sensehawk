const express=require("express");
const { append } = require("express/lib/response");

loginApiRoute=express.Router();

loginApiRoute.get('/',async (req,res)=>{
    const reqBody={
        "email":"sensehawk@strategix4.com",
        "password":"1234567"
    }
    await axios.post("https://sensehawk-api.strategix4.com/api/users/token",reqBody)
    .then((res)=>{
        console.log(res.data.data);
        append.locals.token=res.data.data.token;
        res.send("check console for output");
    })
    .catch((err)=>{
        console.log(err);
    })
})

module.exports=loginApiRoute;