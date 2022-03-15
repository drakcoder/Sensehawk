const mongoose = require("mongoose");

const stringData_5minSchema=mongoose.Schema({
    "timestamp":{
        type:Date,
        required:true
    },
    "project_id":{
        type:Number,
        required:true
    },
    "equipment_id":{
        type:String,
        required:true
    },
    "equipment_name":{
        type:String,
        required:true
    },
    "parameters":{
        "dc_current":{
            type:Number
        },
        "dc_voltage":{
            type:Number
        },
        "equipment_status":{
            type:Number
        },
        "performance_ratio":{
            type:Number
        },
        "energy":{
            type:Number
        },
        "expected_energy":{
            type:Number
        }
        }
},{
    strict:false,
    collection:"StringData"
});

let stringData_5minModel=mongoose.model("test",stringData_5minSchema);

module.exports={
    stringData_5minSchema,
    stringData_5minModel
}
