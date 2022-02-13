const axios=require("axios");
const express=require("express");
const mongoose=require("mongoose");
const loginApiRoute=require("./routes/strategixLogin.route")
const dataPushApiRoute=require("./routes/stringDataPush.route");
const fetchDataApiRoute=require("./routes/stringDataFetch.route");
require("dotenv").config()

mongoose.connect(process.env.ALT_DB_URL,(err,client)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('connection succesfull');
    db=mongoose.connection;
    app.locals.DatabaseObject=db;
})
const app=express();
app.use(express.json());


app.use('/login',loginApiRoute);
app.use('/pushData',dataPushApiRoute);
app.use('/fetchData',fetchDataApiRoute);

app.listen(8000,()=>{
    console.log("app listening to port 8000");
})