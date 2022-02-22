const mongoose=require("mongoose");
const axios=require("axios");
const { allParametersDataSchema }=require("../models/allParametersData");
require("dotenv").config();

let allParametersDataModel=mongoose.model("test",allParametersDataSchema);

db_insert=(dataToBePushed,db,exec_db)=>{
    // console.time("dataPush");
    return new Promise((resolve,reject)=>{db.insertMany(dataToBePushed,{ordered:false,strict:false})
        .then(async (client)=>{
            console.log(`${dataToBePushed.length} documents have been added`);
            await exec_db.updateOne({
                "from_date":dataToBePushed[0].timestamp,
                "to_date":dataToBePushed[dataToBePushed.length-1].timestamp
            },
            {$set:{"status":"completed"}})
            resolve({
                "dataSent":true,
            })
        })
        .catch(async (err)=>{
            //bulk updating the data for updating any stagnant values
            //creating the bulk-write query
            let bulkWriteQuery=[];
            if(err.writeErrors==undefined){
                console.log("no data in that timestamp");
                await exec_db.updateOne({
                    "from_date":dataToBePushed[0].timestamp,
                    "to_date":dataToBePushed[dataToBePushed.length-1].timestamp
                },
                {$set:{"status":"completed"}})
                resolve({
                    "dataSent":true
                });
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
            //calling the bulk write function
            await db.bulkWrite(bulkWriteQuery)
            .then(async msg=>{
                console.log(`${dataToBePushed.length-err.writeErrors.length} new documents inserted and ${msg.nModified}/${err.writeErrors.length} documents updated. The total number of documents received are ${dataToBePushed.length}`);
                await exec_db.updateOne({
                    "from_date":new Date(dataToBePushed[0].timestamp).toISOString(),
                    "to_date":new Date(dataToBePushed[dataToBePushed.length-1].timestamp).toISOString()
                },
                {$set:{"status":"completed"}})
            })
            .catch(err=>{
                reject({
                    "dataSent":false,
                    "ERR":err
                })
            })
        })
        // console.timeEnd("dataPush")
        resolve({
            "dataSent":true
        })
    }
    )
}


dataPush=async (req,res,next)=>{
    //creating request body for stategix4 api
    const headers={
        "x-access-token":req.app.locals.x_access_token
    }
    const reqBody={ 
        "stream_name": "stringdata_5min",
        "from_date": req.body.from_date, 
        "to_date": req.body.to_date, 
        "sort_order": "asc", 
        "select_columns": ["*"], 
        "filter_criteria": { "project_id": req.body.project_id} 
    }
    if(reqBody.filter_criteria.project_id==undefined){
        res.send({
            "sent":false,
            "err":"project id is required"
        })
        return;
    }
    console.time("apiCall");
    //sending the request for data
    await axios.post("https://sensehawk-api.strategix4.com/api/streams/getstream",reqBody,{headers:headers})
    .then(async (data)=>{
        console.timeEnd("apiCall");
        let reqData=data.data.data,dataToBePushed=[],splitSize=1000;
        if(reqData.length==0){
            res.send({"sent":true});
            console.log("no data in that period");
            return;
        }
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
        console.log(dataToBePushed.length);
        let start=0,end=splitSize;
        let DataBase=req.app.locals.DatabaseObject;
        let db=DataBase.collection("test");
        let exec_data=[],exec_db=DataBase.collection("execution_data");
        while(end<dataToBePushed.length+splitSize){
            let fdate=new Date(dataToBePushed[start].timestamp).toISOString(),todate;
            if(end>dataToBePushed.length){
                todate=new Date(dataToBePushed[dataToBePushed.length-1].timestamp).toISOString();
            }
            else{
                todate=new Date(dataToBePushed[end-1].timestamp).toISOString();
            }
            exec_data.push({
                "to_date":todate,
                "from_date":fdate,
                "project_id":reqBody.filter_criteria.project_id,
                "status":"pending"
            })
            start+=splitSize
            end+=splitSize
        }
        exec_db.insertMany(exec_data);
        start=0,end=splitSize;
        while(end<dataToBePushed.length+splitSize){
            let data=dataToBePushed.slice(start,end)
            await db_insert(data,db,exec_db)
                .catch(err=>{
                    console.log(err);
                })
            start+=splitSize
            end+=splitSize
        }
        res.send({"sent":true});
    })
    .catch((err)=>{
        console.log(err);
        res.send({"sent":false,"ERR":err});
    })
}

module.exports=dataPush