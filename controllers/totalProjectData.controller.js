const POAData = require("../models/POAData");
const { POADataModel, POADataSchema } = require("../models/POAData");
const _ = require("lodash");

const TotalDataFetch = async (req, res, next) => {
    try {
        let to_date, from_date = new Date(_.get(req, "query.from_date")), project_id = parseInt(_.get(req, "query.project_id"));
        if (_.get(req, "query.to_date") == undefined) {
            to_date = new Date();
        }
        else {
            to_date = new Date(_.get(req, "query.to_date"));
        }
        let pipeline=[
            {
                $match: {
                    "project_id": project_id,
                    "timestamp": { $gte: from_date, $lte: to_date }
                }
            },
            {
                $facet:{
                    "sumOfActualEnergy":[
                        {
                            $group: {
                                _id: {
                                    year: { $year: "$timestamp" },
                                    month: { $month: "$timestamp" }
                                },
                                total_energy: { $sum: "$parameters.energy" }
                            }
                        },
                        {
                            $addFields: {
                                timestamp: {
                                    $dateFromParts: {
                                        'year': '$_id.year', 'month': '$_id.month', 'day': 0
                                    }
                                }
                            }
                        },
                        {
                            $sort: { "timestamp": 1 }
                        },
                        {
                            $project: {
                                "total_energy": 1,
                                "timestamp": 1,
                                "_id": 0
                            }
                        }
                    ],
                    "projectPR":[
                        {
                            $group: {
                                _id: {
                                    year: { $year: "$timestamp" },
                                    month: { $month: "$timestamp" }
                                },
                                performance_ratio: { $avg: "$parameters.performance_ratio" }
                            }
                        },
                        {
                            $addFields: {
                                timestamp: {
                                    $dateFromParts: {
                                        'year': '$_id.year', 'month': '$_id.month'
                                    }
                                },
                                project_id: project_id
                            }
                        },
                        {
                            $sort: { "timestamp": 1 }
                        },
                        {
                            $project: {
                                "performance_ratio": 1,
                                "timestamp": 1,
                                "_id": 0,
                                "project_id": 1
                            }
                        }
                    ]
                }
            }
        ]
        let data=await POADataModel.aggregate(pipeline)
        res.send(data[0]);
    }
    catch (e) {
        console.log(e);
        res.send({ "ERR": e });
    }
}

module.exports = {
    TotalDataFetch
}