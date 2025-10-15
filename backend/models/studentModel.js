import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId , ref : 'User', required: true },
    rollNumber : {type : String , required : true, unique: true},
    class : {type : mongoose.Schema.Types.ObjectId , ref : "Class" , required : true},
    dob : {type : Date , required : true},
    address : {type : String , required : true},
    fatherName : {type : String , required : true},
    gender : {type : String , enum : ['male' , 'female' , 'other'] , required : true},
    feesPaid : [{type : mongoose.Schema.Types.ObjectId , ref : 'Fee'}]
},{ timestamps: true });

export default mongoose.model('Student', studentSchema);
