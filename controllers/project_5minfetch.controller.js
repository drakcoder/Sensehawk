const mongoose = require("mongoose");
const {projectData_5minModel,projectData_5minSchema}=require('../models/projectData_5min.model')
const _ = require("lodash");

const POADataFetch = async (req, res, next) => {
    try {
        let query = {
            project_id: req.body.project_id,
            "timestamp": {
                $gte: new Date(_.get(req, "body.from_date")),
                $lte: new Date(_.get(req, "body.to_date"))
            }
        }
        let reqFields = { "_id": 0 };

        for (i of _.get(req, "body.columns")) {
            reqFields[i] = 1
        }
        const docs = await projectData_5minModel.find(query, reqFields);
        res.send(docs);
    }
    catch (e) {
        res.send({ "ERR": e });
    }
}

module.exports = {
    POADataFetch
}