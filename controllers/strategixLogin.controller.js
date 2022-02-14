const express=require('express');
const axios=require('axios');

loginFunction=async (req,res)=>{
    const reqBody={
        "email":req.body.email,
        "password":req.body.password
    }
    await axios.post("https://sensehawk-api.strategix4.com/api/users/token",reqBody)
    .then((msg)=>{
        req.app.locals.x_access_token=msg.data.data.token;
        if(msg.data.data.token!=undefined){
            res.send({"loggedIn":true});
        }else{
            res.send({"loggedIn":false,"ERR":msg.data.data.stack})
        }
    })
    .catch((err)=>{
        res.send({"loggedIn":false,"ERR":err});
    })
    // res.send("not sent")
}

module.exports=loginFunction;