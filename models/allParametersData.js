const mongoose = require("mongoose");

const allParametersDataSchema=mongoose.Schema({
    "timestamp":Date,
    "project_id":Number,
    "equipment_id":String,
    "equipment_name":String,
    "parameters":{
        "dc_current":Number,
        "dc_voltage":Number,
        "equipment_status":Number,
        "performance_ratio":Number,
        "energy":Number,
        "expected_energy":Number
        }
},{
    strict:false
});

// allParametersDataModel=mongoose.model("allParametersDataModel",allParametersDataSchema);

module.exports={
    "allParametersDataSchema":allParametersDataSchema,
    // "allParametersDataModel":allParametersDataModel
}
