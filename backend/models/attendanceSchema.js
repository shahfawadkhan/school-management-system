import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    student : {type : mongoose.Schema.Types.ObjectId , ref : 'Student', required: true },
    class : {type : mongoose.Schema.Types.ObjectId , ref : 'Class', required : true},
    teacher : {type : mongoose.Schema.Types.ObjectId , ref : 'Teacher', required : true},
    date : {type : Date , required : true},
    status : {type : String , enum : ['present' , 'absent' , 'leave'] , required : true},
},{
    timestamps: true
})

export default mongoose.model('Attendance', attendanceSchema);