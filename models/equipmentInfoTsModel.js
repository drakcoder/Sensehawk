const mongoose = require("mongoose");
const { equipmentInfoSchema }=require('./equipmentInfoModel');

equipmentInfoTsSchema=new mongoose.Schema({
    "timestamp":Date,
    "equipment_data_at_ts":[equipmentInfoSchema]
})
00
equipmentInfoTsModel=mongoose.model('equipmentInfoModel',equipmentInfoTsSchema);

module.exports={
    "equipmentInfoTsSchema":equipmentInfoTsSchema,
    "equipmentInfoTsModel":equipmentInfoTsModel
};
