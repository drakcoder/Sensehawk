const mongoose=require("mongoose");
const POAData = require("../models/POAData");
const { POADataModel,POADataSchema }=require("../models/POAData");

TotalDataFetch=async (req,res,next)=>{
    let to_date=new Date(req.query.to_date),from_date=new Date(req.query.from_date),project_id=parseInt(req.query.project_id);
    var sumOfActualEnergy,projectPR
    let pipeline1=[
        {
            $match:{
                "project_id":project_id,
                "timestamp":{$gte:from_date,$lte:to_date}
            }
        },
        {
            $group:{
                _id:{
                    year:{$year:"$timestamp"},
                    month:{$month:"$timestamp"}
                },
                total_energy:{$sum:"$energy"}
            }
        },
        {
            $addFields:{
                timestamp:{
                    $dateFromParts:{
                        'year': '$_id.year', 'month': '$_id.month','day':0
                    }
                }
            }
        },
        {
            $sort:{"timestamp":1}
        },
        {
            $project:{
                "total_energy":1,
                "timestamp":1,
                "_id":0
            }
        }
    ]
    let pipeline2=[
        {
            $match:{
                "project_id":project_id,
                "timestamp":{$gte:from_date,$lte:to_date}
            }
        },
        {
            $group:{
                _id:{
                    year:{$year:"$timestamp"},
                    month:{$month:"$timestamp"}
                },
                performance_ratio:{$avg:"$performance_ratio"}
            }
        },
        {
            $addFields:{
                timestamp:{
                    $dateFromParts:{
                        'year': '$_id.year', 'month': '$_id.month'
                    }
                },
                project_id:project_id
            }
        },
        {
            $sort:{"timestamp":1}
        },
        {
            $project:{
                "performance_ratio":1,
                "timestamp":1,
                "_id":0,
                "project_id":1
            }
        }
    ]
    await POADataModel.aggregate(pipeline1,(err,docs)=>{
        if(err){
            res.send({"ERR":err});
        }
        sumOfActualEnergy=docs;
    })
    await POADataModel.aggregate(pipeline2,(err,docs)=>{
        if(err){
            res.send({"ERR":err});
        }
        projectPR=docs;
    })
    let data={"sumOfActualEnergy":sumOfActualEnergy,"projectPR":projectPR,"projectedEnergyValuesForEachProject":[]};
    res.send(data);
}

module.exports=TotalDataFetch