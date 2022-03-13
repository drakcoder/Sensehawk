const mongoose = require("mongoose");

const POADataSchema = mongoose.Schema({
    "timestamp": Date,
    "project_id": Number,
    "swiftPV_project_id": Number,
    parameters:{
        "power": Number,
        "energy": Number,
        "pv_index": Number,
        "expected_power": Number,
        "revenue_rate": Number,
        "expected_energy": Number,
        "poa_irradiance": Number,
        "performance_ratio": Number
    }
}, {
    strict: false,
    collection: "ProjectData"
})

const POADataModel = mongoose.model('ProjectData', POADataSchema);

module.exports = {
    "POADataSchema": POADataSchema,
    "POADataModel": POADataModel
}