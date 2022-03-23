const mongoose = require("mongoose");

const projectData_5minTimeSchema= mongoose.Schema({
    "metadata":{
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
    }
}, {
    strict: false,
    collection: "ProjectDataTime",
    timeseries: {
        timeField: "metadata.timestamp",
        metaField: "metadata",
        granularity: "minutes"
    }
})

const projectData_5minTimeModel = mongoose.model('ProjectDataTime', projectData_5minTimeSchema);

module.exports = {
    projectData_5minTimeSchema, 
    projectData_5minTimeModel
}