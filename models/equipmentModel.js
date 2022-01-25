const mongoose = require("mongoose");
const { equipmentInfoTsSchema }=require("./equipmentInfoTsModel");

equipmentSchema=new mongoose.Schema(
    {
        "project_id":Number,
        "equipment_name":[equipmentInfoTsSchema],
    }
);

// equipmentModel=mongoose.model("equipmentModel",equipmentSchema);

module.exports={
    'equipmentSchema':equipmentSchema,
    // 'equipmentModel':equipmentModel
};