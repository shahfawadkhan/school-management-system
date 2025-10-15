
import Exam from '../models/examModel.js';
import Class from '../models/classModel.js';
import { populate } from 'dotenv';

export const createExam = async (req, res) => {
  try {
    const { name, classes: classId, subjects, date } = req.body;

    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    const newExam = new Exam({ name, classes: classId, subjects, date });
    await newExam.save();

    const populatedExam = await newExam.populate([
      { path: "classes", select: "name" },
      { path: "subjects", select: "name" },
    ]);

    res.status(201).json(populatedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExam = async(req , res)=>{
    try {
        const {id} = req.params;
        const { name, classes: classId, subjects, date } = req.body;
        const exam = await Exam.findById(id);
        if(!exam){
            return res.status(404).json({message : "Exam not found"})
        }
        if(classId){
            const classExists = await Class.findById(classId);
            if(!classExists){
                return res.status(404).json({message : "Class not found"})
            }
            exam.classes = classId;
        }
        if(name) exam.name = name;
        if(subjects) exam.subjects = subjects;
        if(date) exam.date = date;
        await exam.save();
        const populatedExam = await exam.populate([
            {path : "classes" , select : "name"},
            {path : "subjects" , select : "name"},
        ])
        res.status(200).json(populatedExam)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

export const deleteExam = async(req , res)=>{
    try {
        const {id} = req.params;
        const exam = await Exam.findById(id);
        if(!exam){
            return res.status(404).json({message : "Exam not found"})
        }
        const deletedExam = await Exam.findByIdAndDelete(id);
        res.status(200).json({message : "Exam deleted successfully"})
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

export const getExamsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const exams = await Exam.find({ class: classId }).populate([
      { path: "class", select: "name" },
      { path: "subject", select: "name" },
    ]);

    if (exams.length === 0) {
      return res.status(404).json({ message: "No exams found for this class" });
    }

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
    .populate("subjects", "name") 
    .populate({
      path : "classes" , 
      populate : {
        path : "students",
        populate : {
          path : "user" , 
          select : "name"
        }
      }
    })     

    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "Exam Not Found" });
    }

    return res.status(200).json(exams);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
