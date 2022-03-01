const mongoose=require("mongoose");
const POAData = require("../models/POAData");
const { POADataModel,POADataSchema }=require("../models/POAData");

POADataFetch=async(req,res,next)=>{
    let query={
        project_id:req.body.project_id,
        "timestamp":{
            $gte:new Date(req.body.from_date),
            $lte:new Date(req.body.to_date)
        }
    }
    let reqFields={"_id":0};
    for(i of req.body.columns){
        reqFields[i]=1
    }
    POADataModel.find(query,reqFields,(err,docs)=>{
        if(err){
            console.log(err);
            res.send("err");
        }
        res.send(docs);
    })
}

module.exports=POADataFetch