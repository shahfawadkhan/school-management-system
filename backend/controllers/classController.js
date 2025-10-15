import Class from '../models/classModel.js'
import Student from '../models/studentModel.js'
import Subject from '../models/subjectSchema.js'
import Teacher from '../models/teacherModel.js'
export const createClass = async (req , res)=>{
    try {
        const {name} = req.body;

        const existingClass = await Class.findOne({name})

        if (existingClass) {
            return res.status(400).json({message : "Class with this name is already existed"})
        }

        const newClass = await Class.create({name});

        res.status(201).json(newClass)
    } catch (error) {
        res.status(500).json({ message: "Error creating class", error: error.message });
    }
}

export const getAllClasses = async (req , res)=>{
try {
    const classes = await Class.find()
        .populate("students", "rollNumber")
        .populate({path : "students",
          populate : {
            path : "user" , select : "name"
          }
        })
        .populate({
            path: "teachers",
            populate: { path: "user", select: "name" } 
        })
        .populate("subjects" , "name")

    res.status(200).json(classes);
} catch (error) {
    return res.status(500).json({ message: error.message });
}
}

export const getClassByStudentOrTeacherId = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let classes = [];

    if (role === "student") {
      classes = await Class.find({ students: userId })
        .populate({
          path: "teachers",
          populate: { path: "user", select: "name email" } 
        })
        .populate({
          path: "students",
          populate: { path: "user", select: "name email" } 
        })
        .populate("subjects");
    } else if (role === "teacher") {
      classes = await Class.find({ teachers: { $in: [userId] } })
        .populate({
          path: "teachers",
          populate: { path: "user", select: "name email" }
        })
        .populate({
          path: "students",
          populate: { path: "user", select: "name email" }
        })
        .populate("subjects");
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    return res.status(200).json({ classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({ message: error.message });
  }
};
export const getClassById = async (req , res)=>{
    try {
        const {id} = req.params;
        const singleClass = await Class.findById(id)
         .populate("teachers" , "name")
         .populate("students" , "rollNumber")

        if (!singleClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(singleClass);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, teachers, subjects, students } = req.body;

    if (students && students.length > 0) {
      await Class.updateMany(
        { students: { $in: students }, _id: { $ne: id } },
        { $pull: { students: { $in: students } } }
      );

      await Student.updateMany(
        { _id: { $in: students } },
        { $set: { class: id } }
      );
    }

    if (subjects && subjects.length > 0) {
      await Subject.updateMany(
        { _id: { $in: subjects } },
        { $addToSet: { classes: id } }
      );

      if (teachers && teachers.length > 0) {
        await Teacher.updateMany(
          { _id: { $in: teachers } },
          { $addToSet: { subjects: { $each: subjects } } }
        );

        await Subject.updateMany(
          { _id: { $in: subjects } },
          { $addToSet: { teachers: { $each: teachers } } }
        );

        await Teacher.updateMany(
          { _id: { $in: teachers } },
          { $addToSet: { classes: id } }
        );
      }
    }

    
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(teachers && { teachers }),
        ...(subjects && { subjects }),
        ...(students && { students }),
      },
      { new: true }
    )
      .populate("teachers")
      .populate("subjects")
      .populate("students");

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    res
      .status(500)
      .json({ message: "Error updating class", error: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting class", error: error.message });
  }
};