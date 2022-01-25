const mongoose = require("mongoose");

equipmentInfoSchema=new mongoose.Schema({
    "equipment_id":Number,
    "equipment_name":String,
    "dc_current":Number,
    "performance_ratio":Number
})

// equipmentInfoModel=mongoose.model('equipmentInfoTsModel',equipmentInfoSchema);

module.exports={
    "equipmentInfoSchema":equipmentInfoSchema,
    // "equipmentInfoModel":equipmentInfoModel
};