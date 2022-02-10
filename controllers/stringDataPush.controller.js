const mongoose=require("mongoose");
const axios=require("axios");
const { allParametersDataSchema }=require("../models/allParametersData");
require("dotenv").config();

let allParametersDataModel=mongoose.model("test",allParametersDataSchema);

dataPush=async (req,res,next)=>{
    //creating request body for stategix4 api
    const headers={
        "x-access-token":req.app.locals.x_access_token
    }
    const reqBody={ 
        "stream_name": "stringdata_5min",
        "from_date": req.body.from_date, 
        "to_date": req.body.to_date, 
        "sort_order": "desc", 
        "select_columns": ["*"], 
        "filter_criteria": { "project_id": req.body.project_id} 
    }
    console.log(reqBody);
    //sending the request for data
    await axios.post("https://sensehawk-api.strategix4.com/api/streams/getstream",reqBody,{headers:headers})
    .then(async (data)=>{
        console.time("dataPush");
        let reqData=data.data.data;
        let dataToBePushed=[];
        for(let i of reqData){
            let event=new Date(i.timestamp);
            let d=event.toISOString();
            //using the mongoose combined model for creation of schema
            let obj=new allParametersDataModel({
                "timestamp":d,
                "project_id":reqBody.filter_criteria.project_id,
                "equipment_id":i.equipment_id,
                "equipment_name":i.equipment_name,
                "parameters":{
                    "dc_current":i.dc_current,
                    "dc_voltage":i.dc_voltage,
                    "equipment_status":i.equipment_status,
                    "performance_ratio":i.performance_ratio,
                    "energy":i.energy,
                    "expected_energy":i.expected_energy
                }
            },{strict:false})
            dataToBePushed.push(obj);
        }
        db=req.app.locals.DatabaseObject
        //inserting the data
        await db.insertMany(dataToBePushed,{ordered:false,strict:false})
        .then((client)=>{
            console.log(`${dataToBePushed.length} documents have been added`);
        })
        .catch(async (err)=>{
            //bulk updating the data for updating any stagnant values
            //creating the bulk-write query
            let bulkWriteQuery=[];
            if(err.writeErrors==undefined){
                console.log("no data in that timestamp");
                return;
            }
            for(let dup of err.writeErrors){
                dup=dup.err.op;
                let sq={
                    timestamp:dup.timestamp,
                    project_id:dup.project_id,
                    equipment_id:dup.equipment_id
                }
                let update={
                    $set:{
                        parameters:dup.parameters
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
            console.log(bulkWriteQuery);
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
        console.timeEnd("dataPush")
        res.send("check console for data")
    })
    .catch((err)=>{
        console.log(err);
        res.send("[E] error occured while sending request to strategix4 api");
    })
}

module.exports=dataPush