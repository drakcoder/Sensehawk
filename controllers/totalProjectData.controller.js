const {projectData_5minTimeModel,projectData_5minTimeSchema}=require('../models/projectData_5minTime.model')
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
                    "metadata.project_id": project_id,
                    "metadata.timestamp": { $gte: from_date, $lte: to_date }
                }
            },
            {
                $facet:{
                    "sumOfActualEnergy":[
                        {
                            $group: {
                                _id: {
                                    year: { $year: "$metadata.timestamp" },
                                    month: { $month: "$metadata.timestamp" }
                                },
                                total_energy: { $sum: "$metadata.parameters.energy" }
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
                                    year: { $year: "$metadata.timestamp" },
                                    month: { $month: "$metadata.timestamp" }
                                },
                                performance_ratio: { $avg: "$metadata.parameters.performance_ratio" }
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
        let data=await projectData_5minTimeModel.aggregate(pipeline)
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