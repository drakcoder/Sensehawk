const mongoose=require("mongoose");
const express=require("express");

fetchDataApiRoute=express.Router();

fetchData=async (req,res)=>{
    db=req.app.locals.DatabaseObject;
    // console.log(req.body)
    let query;
    if(req.body.equipment_id==undefined){
        query={
            "project_id":req.body.project_id,
            "timestamp":{$lte: new Date(req.body.end_date),$gte: new Date(req.body.start_date)}
        }
    }else{
        query={
            "project_id":req.body.project_id,
            "equipment_id":req.body.equipment_id,
            "timestamp":{$lte: new Date(req.body.end_date),$gte: new Date(req.body.start_date)}
        }
    }
    if(req.body.start_date==undefined&&req.body.start_date==undefined){
        let currDate=new Date();
        let prevDate=new Date(currDate);
        prevDate.setDate(prevDate.getDate()-7);
        query.timestamp.$gte=prevDate;
        query.timestamp.$lte=currDate;
    }
    // console.log(query);
    await db.find(query).toArray((err, docs)=>{
        if(err){
            console.log(err);
            res.send("[E]");
        }
        console.log("data sent");
        // console.log(docs[0]);
        res.send(docs)
    })
}

fetchDataApiRoute.post("/",fetchData);

module.exports=fetchDataApiRoute;