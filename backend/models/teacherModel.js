import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    classes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class' 
    }],
    subjects: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject' 
    }],
    dob : {type : Date , required : true},
    fatherName : {type : String  , required : true},
    address : {type : String  , required : true},
    mobileNo : {type : String  , required : true},
    gender : {type : String , enum : ["male" , "female" , "other"] , required : true}
}, { 
    timestamps: true 
});

export default mongoose.model('Teacher', teacherSchema);
