const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const pvData_5minSchema = mongoose.Schema({
    metadata:{
        "timestamp": {
            type:Date,
        },
        "project_id": {
            type:Number,
        },
        "swiftPV_project_id": {
            type:Number,
        },
        "equipment_name": {
            type:String,
        },
        "equipment_id":{
            type:String,
        },
        parameters:{
                "power": {
                    type:Number
                },
                "normalized_power": {
                    type:Number
                },
                "energy": {
                    type:Number
                },
                "frequency": {
                    type:Number
                },
                "ac_current": {
                    type:Number
                },
                "dc_current": {
                    type:Number
                },
                "dc_power": {
                    type:Number
                },
                "reactive_power": {
                    type:Number
                },
                "apparent_power": {
                    type:Number
                },
                "ac_switch_status": {
                    type:Number
                },
                "dc_switch_status": {
                    type:Number
                },
                "dc_voltage": {
                    type:Number
                },
                "available_hour": {
                    type:Number
                },
                "period_hour": {
                    type:Number
                },
                "expected_power": {
                    type:Number
                },
                "pv_index": {
                    type:Number
                },
                "equipment_status": {
                    type:Number
                },
                "expected_energy": {
                    type:Number
                },
                "performance_ratio": {
                    type:Number
                },
                "ac_voltage_average": {
                    type:Number
                },
                "ac_voltage_an": {
                    type:Number
                },
                "ac_voltage_bn": {
                    type:Number
                },
                "ac_voltage_cn": {
                    type:Number
                },
                "temperature": {
                    type:Number
                },
                "inverter_efficiency": {
                    type:Number
                },
                "energy_interval": {
                    type:Number
                }
        }
    }
}, {
    strict: false,
    collection: "pvData",
    timeseries: {
        timeField: "metadata.timestamp",
        metaField: "metadata",
        granularity: "minutes"
    }
})

const pvData_5minModel = mongoose.model('pvData', pvData_5minSchema);

module.exports = {
    pvData_5minSchema, 
    pvData_5minModel
}