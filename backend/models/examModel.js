import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    name : {type : String , required : true},
    classes : [{type : mongoose.Schema.Types.ObjectId , ref : 'Class', required : true}],
    subjects : [{type : mongoose.Schema.Types.ObjectId , ref : 'Subject', required : true}],
    date : {type : Date , required : true},
}, {timestamps: true});

export default mongoose.model('Exam', examSchema);