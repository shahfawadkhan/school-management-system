import Teacher from '../models/teacherModel.js'
import User from '../models/userModel.js';
import Class from '../models/classModel.js';

export const createTeacher = async (req, res) => {
  try {
    const { user, classes, subjects , address , mobileNo , fatherName , gender , dob } = req.body;

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userExists.role !== "teacher") {
      return res.status(400).json({ message: "User is not assigned the 'teacher' role" });
    }

    const existingTeacher = await Teacher.findOne({ user, classes });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already assigned to this class" });
    }

    const teacher = new Teacher({
      user,
      classes,
      subjects,
      address,
      mobileNo,
      fatherName,
      gender,
      dob,
    });
    await teacher.save();

    await teacher.populate([
      { path: "user", select: "name email" },
      { path: "classes", select: "name" },
    ]);
    
    await Class.updateMany(
      { _id: { $in: classes } },
      { $addToSet: { teachers: teacher._id } }
    );
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getAllTeachers = async (req , res)=>{
    try {
        const teachers = await Teacher.find()
        .populate('user', 'name email')
        .populate('classes', 'name')
        .populate('subjects' , 'name')
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getTeacherById = async(req , res)=>{
    try {
        const {id} = req.params;
        const teacher = await Teacher.findById(id)
        .populate('user', 'name email')
        .populate('classes', 'name')
        .populate('subjects', 'name');

        if(!teacher){
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
}

export const updateTeacher = async (req , res)=>{
    try {
        const {id} = req.params;
        const {classes , subjects , dob , fatherName , mobileNo , address , gender} = req.body;
        const teacher = await Teacher.findById(id);
        if(!teacher){
            return res.status(404).json({ message: "Teacher not found" });
        }

        const updateTeacher = await Teacher.findByIdAndUpdate(id , {
            classes : classes || teacher.classes,
            subjects : subjects || teacher.subjects,
            dob : dob || teacher.dob,
            mobileNo : mobileNo || teacher.mobileNo,
            address : address || teacher.address,
            gender : gender || teacher.gender,
            fatherName : fatherName || teacher.fatherName
        },{new : true}

        )
        .populate('user', 'name email')
        .populate('classes', 'name')
        .populate('subjects', 'name')

        const updateClass = await Class.findByIdAndUpdate(classes , {
            $addToSet : {teachers : updateTeacher._id}
        })
        res.status(200).json(updateTeacher);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const deleteTeacher = async (req , res)=>{
    try {
        const {id} = req.params;
        const teacher = await Teacher.findByIdAndDelete(id);
        if(!teacher){
            return res.status(404).json({ message: "Teacher not found" });
        }
        const classUpdate = await Class.updateMany(
            { teachers: teacher._id },
            { $pull: { teachers: teacher._id } }
        );
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

