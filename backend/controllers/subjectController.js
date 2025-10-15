import Subject from '../models/subjectSchema.js';
import Teacher from '../models/teacherModel.js';
import User from '../models/userModel.js';
import Class from '../models/classModel.js';

export const createSubject = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Name is required" });
    }

    name = name.trim().toUpperCase();

    const existing = await Subject.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({ name });

    res.status(201).json(subject);
  } catch (error) {
    console.error("Error in createSubject:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};




export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
    .populate("classes" , "name")
    .populate({
      path : "teachers" ,
      populate : {
        path  : "user" , select : "name"
      }
    })
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }           
    await Subject.findByIdAndDelete(id);

    await Teacher.updateMany(
      { subjects: subject._id },
      { $pull: { subjects: subject._id } }
    );

    await Class.updateMany(
      { subjects: subject._id },
      { $pull: { subjects: subject._id } }
    );
    res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}
