const mongoose = require("mongoose");

const projectData_5minSchema = mongoose.Schema({
    "timestamp": {
        type:Date,
        required:true
    },
    "project_id": {
        type:Number,
        required:true
    },
    "swiftPV_project_id": {
        type:Number,
        required:true
    },
    parameters:{
        "power": {
            type:Number
        },
        "energy": {
            type:Number
        },
        "pv_index": {
            type:Number
        },
        "expected_power": {
            type:Number
        },
        "revenue_rate": {
            type:Number
        },
        "expected_energy": {
            type:Number
        },
        "poa_irradiance": {
            type:Number
        },
        "performance_ratio": {
            type:Number
        }
    }
}, {
    strict: false,
    collection: "ProjectData"
})

const projectData_5minModel = mongoose.model('ProjectData', projectData_5minSchema);

module.exports = {
    projectData_5minSchema, 
    projectData_5minModel
}