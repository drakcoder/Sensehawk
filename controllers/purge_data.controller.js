const { POADataModel } = require('../models/POAData');
const { allParametersDataModel } = require('../models/allParametersData');
const streams = {
    "stringdata_5min": allParametersDataModel,
    "projectdata_5min": POADataModel
}

const purge_data = async (req, res, next) => {
    const { stream, from_date, to_date, older_than } = req.body;
    if (!stream) {
        return res.status(400).send({ error: "correct stream name is required", delete: false });
    }
    const model = streams[stream];
    if (!older_than && (!from_date || !to_date)) {
        return res.status(400).send({ error: "invalid request body", delete: false });
    }
    try {
        if (older_than) {
            let date = new Date(older_than);
            results = await model.deleteMany({
                project_id:req.body.project_id,
                timestamp: { '$lte': date }
            })
            return res.status(200).json(results)
        } else {
            let from_dateD = new Date(from_date), to_dateD = new Date(to_date);
            results = await model.deleteMany({
                project_id:req.body.project_id,
                timestamp: { $lte: to_dateD, $gte: from_dateD }
            })
            return res.status(200).json(results)
        }
    }
    catch (e) {
        console.log(e)
        return res.status(400).send({ error: e, delete: false })
    }
}

module.exports = {
    purge_data
}