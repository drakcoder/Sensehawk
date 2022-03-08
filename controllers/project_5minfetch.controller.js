const mongoose = require("mongoose");
const POAData = require("../models/POAData");
const { POADataModel, POADataSchema } = require("../models/POAData");
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
        const docs = await POADataModel.find(query, reqFields);
        res.send(docs);
    }
    catch (e) {
        res.send({ "ERR": e });
    }
}

module.exports = {
    POADataFetch
}