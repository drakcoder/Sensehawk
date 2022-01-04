const mongoose=require("mongoose");
const express=require("express");
const axios=require("axios");
const { combinedModel }=require("../models/combinedModel");
require("dotenv").config();

const dataPushApiRoute=express.Router();

dataPush=async (req,res,next)=>{
    //creating request body for stategix4 api
    const headers={
        "x-access-token":process.env.TOKEN
    }
    const reqBody={ 
        "stream_name": "stringdata_5min",
        "from_date": req.body.from_date, 
        "to_date": req.body.to_date, 
        "sort_order": "desc", 
        "select_columns": [ "dc_current", "timestamp", "performance_ratio", "equipment_name" ,"equipment_id"], 
        "filter_time": "15:30", 
        "filter_criteria": { "project_id": req.body.project_id} 
    }
    //sending the request for data
    await axios.post("https://sensehawk-api.strategix4.com/api/streams/getstream",reqBody,{headers:headers})
    .then(async (data)=>{
        let reqData=data.data.data;
        let dataToBePushed=[];
        for(let i of reqData){
            let event=new Date(i.timestamp);
            let d=event.toISOString();
            //using the mongoose combined model for creation of schema
            let obj=new combinedModel({
                "timestamp":d,
                "project_id":reqBody.filter_criteria.project_id,
                "equipment_id":i.equipment_id,
                "equipment_name":i.equipment_name,
                "dc_current":i.dc_current,
                "performance_ratio":i.performance_ratio
            })
            dataToBePushed.push(obj);
        }
        db=req.app.locals.DatabaseObject;
        //inserting the data
        await db.insertMany(dataToBePushed,{ordered:false})
        .then((client)=>{
            console.log(client);
        })
        .catch(async (err)=>{
            //bulk updating the data for updating any stagnant values
            //creating the bulk-write query
            let bulkWriteQuery=[];
            for(let dup of err.writeErrors){
                dup=dup.err.op;
                let sq={
                    timestamp:dup.timestamp,
                    project_id:dup.project_id,
                    equipment_id:dup.equipment_id
                }
                let update={
                    $set:{
                        dc_current:dup.dc_current,
                        performance_ratio:dup.performance_ratio
                    }
                }
                let updateQuery={
                    "updateOne":{
                        "filter":sq,
                        "update":update
                    }
                };
                bulkWriteQuery.push(updateQuery);
            }
            //calling the bulk write function
            await db.bulkWrite(bulkWriteQuery)
            .then(msg=>{
                console.log(`${dataToBePushed.length-err.writeErrors.length} new documents inserted and ${msg.nModified}/${err.writeErrors.length} documents updated. The total number of documents received are ${dataToBePushed.length}`);
            })
            .catch(err=>{
                console.log(err);
                res.send("[E] error at updating the values of the documents")
            })
        })
        res.send("check console for data")
    })
    .catch((err)=>{
        console.log(err);
        res.send("[E] error occured while sending request to strategix4 api");
    })
}

dataPushApiRoute.post('/',dataPush)

module.exports=dataPushApiRoute;