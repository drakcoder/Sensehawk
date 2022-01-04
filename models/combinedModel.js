const mongoose=require("mongoose");

const combinedSchema=new mongoose.Schema({
    "timestamp":Date,
    "project_id":Number,
    "equipment_id":Number,
    "equipment_name":String,
    "dc_current":Number,
    "performance_ratio":Number
});

combinedModel=mongoose.model("combinedModel",combinedSchema);

module.exports={
    "combinedSchema":combinedSchema,
    "combinedModel":combinedModel
}