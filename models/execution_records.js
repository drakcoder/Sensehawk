const mongoose=require('mongoose');

const executionRecordSchema= new mongoose.Schema({
    to_date:Date,
    from_date:Date,
    project_id:Number,
    status:String,
    stream_name:String
},{
    strict:false,
    collation:"executionRecords"
});

const executionRecordsModel=mongoose.model('executionRecords',executionRecordSchema);

module.exports={
    executionRecordSchema,
    executionRecordsModel
}