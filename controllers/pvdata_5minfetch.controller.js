const mongoose = require("mongoose");
const {pvData_5minModel,pvData_5minSchema}=require('../models/pvData_5min.model')
const _ = require("lodash");

const pvDataFetch = async (req, res, next) => {
    try {
        let query = {
            "metadata.project_id": req.body.project_id,
            "metadata.timestamp": {
                $gte: new Date(_.get(req, "body.from_date")),
                $lte: new Date(_.get(req, "body.to_date"))
            }
        }
        let reqFields = { "_id": 0 ,metadata:{timestamp:1,parameters:{}}};

        for (i of _.get(req, "body.columns")) {
            reqFields.metadata.parameters[i] = 1
        }
        const docs = await pvData_5minModel.find(query, reqFields);
        res.send(docs);
    }
    catch (e) {
        console.log(e);
        res.send({ "ERR": e });
    }
}

module.exports = {
    pvDataFetch
}