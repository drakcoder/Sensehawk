const mongoose = require("mongoose");

const stringData_5minSchema=mongoose.Schema({
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
    strict:false,
    collection:"StringData"
});

let stringData_5minModel=mongoose.model("test",stringData_5minSchema);

module.exports={
    stringData_5minSchema,
    stringData_5minModel
}
