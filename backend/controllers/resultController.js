
import Result from '../models/resultSchema.js';
import Subject from '../models/subjectSchema.js';
import Exam from '../models/examModel.js';
import Student from '../models/studentModel.js'
import Class from '../models/classModel.js'

export const createResult = async (req, res) => {
  try {
    const { student, exam, subjects, class: classId } = req.body; 

    const examExists = await Exam.findById(exam);
    if (!examExists) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    for (let subj of subjects) {
      const subjectExists = await Subject.findById(subj.subject);
      if (!subjectExists) {
        return res.status(404).json({ message: `Subject not found: ${subj.subject}` });
      }
    }

    const newResult = await Result.create({
      student,
      exam,
      class: classId, 
      subjects
    });

    const populatedResult = await newResult.populate([
      { 
        path: "student", 
        select: "rollNumber user", 
        populate: { path: "user", select: "name" } 
      },
      { 
        path: "exam", 
        select: "name date"
      },
      { 
        path: "class", 
        select: "name"
      },
      { path: "subjects.subject", select: "name" }
    ]);

    res.status(201).json(populatedResult);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Result already exists for this student and exam" });
    }
    res.status(500).json({ message: error.message });
  }
};


export const getResultsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const results = await Result.find({ student: studentId })
      .populate({
        path: 'student',
        select: 'rollNumber name'
      })
      .populate({
        path: 'exam',
        select: 'name date'
      })
      .populate({
        path: 'class',  
        select: 'name'
      })
      .populate({
        path: 'subjects.subject',
        select: 'name'
      });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllResults = async (req , res)=>{
    try {
        const results = await Result.find()
        .populate('student', 'name rollNumber')
        .populate({path: 'exam', select: 'name date', populate: { path: 'class', select: 'name' }})
        .populate('subject', 'name');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects } = req.body; 

    const result = await Result.findById(id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (subjects && Array.isArray(subjects)) {
      for (const sub of subjects) {
        const subjectIndex = result.subjects.findIndex(
          (s) => s.subject.toString() === sub.subjectId
        );

        if (subjectIndex === -1) {
          return res
            .status(404)
            .json({ message: `Subject not found in this result: ${sub.subjectId}` });
        }

        if (sub.marksObtained !== undefined) {
          result.subjects[subjectIndex].marksObtained = sub.marksObtained;
        }
        if (sub.totalMarks !== undefined) {
          result.subjects[subjectIndex].totalMarks = sub.totalMarks;
        }
      }
    }

    await result.save();

    const populatedResult = await result.populate([
      { path: "student", select: "rollNumber user", populate: { path: "user", select: "name" } },
      { path: "exam", select: "name date" },
      { path: "class", select: "name" },
      { path: "subjects.subject", select: "name" },
    ]);

    res.status(200).json(populatedResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteResult = async(req , res)=>{
    try {
        const {id} = req.params;
        const result = await Result.findById(id);
        if(!result){
            return res.status(404).json({message : "Result not found"})
        }
        const deletedResult = await Result.findByIdAndDelete(id);
        res.status(200).json({message : "Result deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getResultsByExam = async (req, res) => {
  try {
    const { examId } = req.params;
    
    const results = await Result.find({ exam: examId })
      .populate({
        path: "student",
        select: "rollNumber user",
        populate: { path: "user", select: "name" }
      })
      .populate("exam", "name date")
      .populate("class", "name")
      .populate("subjects.subject", "name");
    
    if (!results.length) {
      return res.status(404).json({ message: "No results found for this exam" });
    }
    
    return res.status(200).json({
      message: "Results fetched successfully",
      data: results
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getResultByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const results = await Result.find({ class: classId })
      .populate("exam", "name date")
      .populate("class", "name")
      .populate("subjects.subject", "name")
      .populate("student", "rollNumber") 
      .populate({
        path: "student",                 
        populate: {
          path: "user",
          select: "name"
        }
      });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No Results Found for this Class" });
    }

    return res.status(200).json(results);

  } catch (error) {
    console.error("Error in getResultByClass:", error); 
    return res.status(500).json({ message: error.message });
  }
};


