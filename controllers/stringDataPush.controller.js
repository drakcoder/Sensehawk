const axios = require("axios");
const {stringData_5minModel,stringData_5minSchema}=require('../models/stringData_5min.model')
const _ = require('lodash');

const stringData_5minPush = async (req, res, next) => {
    try {
        const headers = {
            "x-access-token": req.app.locals.x_access_token
        }
        const reqBody = {
            "stream_name": "stringdata_5min",
            "from_date": req.body.from_date,
            "to_date": req.body.to_date,
            "select_columns": ["*"],
            "filter_criteria": { "project_id": req.body.project_id }
        }
        const data = await axios.post("https://sensehawk-api.strategix4.com/api/streams/getstream", reqBody, { headers: headers })
        const Response = _.get(data, "data.data");
        console.log(Response.length)
        let dataToBePushed=[];
        for(i of Response){
            let obj={parameters:{}};
            for(p in i){
                if(p=="project_id"||p=="equipment_id"||p=="timestamp"||p=="equipment_name"){
                    obj[p]=i[p];
                }
                else{
                    obj.parameters[p]=i[p];
                }
            }
            dataToBePushed.push(obj);
        }
        try {
            await stringData_5minModel.insertMany(dataToBePushed, { "strict": false })
            res.send({ "sent": true });
        }
        catch (err) {
            let bulkWriteQuery = []
            for (let dup of err.writeErrors) {
                dup = dup.err.op;
                let sq = {
                    timestamp: dup.timestamp,
                    project_id: dup.project_id,
                    swiftPV_project_id: dup.swiftPV_project_id
                }
                setQuery = {}
                for (i of Object.keys(dup)) {
                    if (i != "timestamp" && i != "equipment_id" && i != "project_id" && i != "_id" && i != "__v"&&i!="timestamp") {
                        setQuery[i] = dup[i]
                    }
                }
                let update = {
                    $set: dup.parameters
                }
                let updateQuery = {
                    "updateOne": {
                        "filter": sq,
                        "update": update
                    }
                };
                bulkWriteQuery.push(updateQuery);
            }
            await stringData_5minModel.bulkWrite(bulkWriteQuery)
            res.send({ "sent": true });
        }
    }
    catch (e) {
        console.log("[ERR]" + e);
        res.send({ "sent": false, "err": e });
    }
}

module.exports = {
    stringData_5minPush
}
