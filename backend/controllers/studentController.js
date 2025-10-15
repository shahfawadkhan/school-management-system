import Student from '../models/studentModel.js';
import User from '../models/userModel.js';
import Class from '../models/classModel.js';
import Fee from "../models/feeSchema.js";


export const createStudent = async (req, res) => {
    try {
        const { user, rollNumber, fatherName , class: classId , dob , address , gender} = req.body;

        const existingStudent = await Student.findOne({ user });
        if (existingStudent) {
            return res.status(400).json({ message: "Student profile already exists for this user" });
        }

        const existingRollNumber = await Student.findOne({ rollNumber });
        if (existingRollNumber) {
            return res.status(400).json({ message: "Roll number already exists" });
        }

        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }
        if (userExists.role !== 'student') {
            return res.status(400).json({ message: "Teacher can't create student profile" });
        }

        const student = new Student(req.body);
        await student.save();

        await Class.findByIdAndUpdate(
            classId,
            { $addToSet: { students: student._id } }
        );

        await student.populate([
            { path: "user", select: "name email" },
            { path: "class", select: "name" }
        ]);

        res.status(201).json(student);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const getAllStudents = async (req , res)=>{
    try {
        const students = await Student.find()
        .populate('user', 'name email')
        .populate('class', 'name');
         res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getStudentById = async(req , res)=>{
    try {
        const student = await Student.findById(req.params.id)
        .populate('user', 'name email')
        .populate('class', 'name')
        if(!student){
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const updateStudent = async (req, res) => {
  try {
    const oldStudent = await Student.findById(req.params.id).populate("user");

    if (!oldStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updateData = {
      fatherName: req.body.fatherName,
      rollNumber: req.body.rollNumber,
      dob: req.body.dob,
      address: req.body.address,
      gender: req.body.gender,
    };

    if (req.body.classId) {
      updateData.class = req.body.classId; 
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("user", "name email")
      .populate("class", "name");

    if (req.body.name || req.body.email) {
      await User.findByIdAndUpdate(
        oldStudent.user._id,
        {
          ...(req.body.name && { name: req.body.name }),
          ...(req.body.email && { email: req.body.email }),
        },
        { new: true }
      );
    }

    if (
      req.body.classId &&
      oldStudent.class.toString() !== req.body.classId
    ) {
      await Class.findByIdAndUpdate(oldStudent.class, {
        $pull: { students: oldStudent._id },
      });

      await Class.findByIdAndUpdate(req.body.classId, {
        $addToSet: { students: oldStudent._id },
      });
    }

    const finalStudent = await Student.findById(req.params.id)
      .populate("user", "name email")
      .populate("class", "name");

    res.status(200).json(finalStudent);
    console.log(
      "Old class ID:",
      oldStudent.class,
      "New class ID:",
      req.body.classId
    );
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Class.updateMany(
      { students: student._id },
      { $pull: { students: student._id } }
    );

    await Fee.deleteMany({ student: student._id });

    res.status(200).json({ message: "Student and related fee records deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getStudentsByClassId = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await Class.findById(classId)
  .populate({
    path: "teachers",       
    populate: {
      path: "user",         
      select: "name"        
    }
  });


    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const students = await Student.find({ class: classId })
      .populate("user", "name email")
      .populate("class", "name");

    res.status(200).json({
      class: {
        _id: classData._id,
        name: classData.name,
        teachers: classData.teachers,
      },
      students,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
