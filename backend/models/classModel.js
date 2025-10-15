import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name : {type : String , required : true, unique: true},
    students : [{type : mongoose.Schema.Types.ObjectId , ref : 'Student'}],
    teachers : [{type : mongoose.Schema.Types.ObjectId , ref : 'Teacher'}],
    subjects : [{type : mongoose.Schema.Types.ObjectId , ref : 'Subject'}],
},{
    timestamps: true
})

export default mongoose.model('Class', classSchema);