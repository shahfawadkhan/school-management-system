import Attendance from "../models/attendanceSchema.js";
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import Class from "../models/classModel.js";

export const markAttendance = async (req , res)=>{
    try {
        const { studentId, classId, teacherId, date, status } = req.body;
        const studentExists = await Student.findById(studentId);
        if(!studentExists){
            return res.status(404).json({message : "Student not found"});
        }
        const classExists = await Class.findById(classId);
        if(!classExists){
            return res.status(404).json({message : "Class not found"});
        }
        const teacherExists = await Teacher.findById(teacherId);
        if(!teacherExists){
            return res.status(404).json({message : "Teacher not found"});
        }
        const existingRecord = await Attendance.findOne({student : studentId ,class : classId , date : new Date(date)});
        if(existingRecord){
            return res.status(400).json({message : "Attendance already marked for this student on this date"});
        }
        const attendance = await Attendance.create({
            student : studentId,
            class : classId,
            teacher : teacherId,
            date : new Date(date),
            status
        })
        await attendance.populate({path : 'student' , select : 'name rollNumber'})
        await attendance.populate({path : 'class' , select : 'name'})
        await attendance.populate({path : 'teacher' , select : 'name'});
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getAttendanceRecords = async (req, res) => {
  try {
    const { studentId, month, year } = req.params;

    const studentExists = await Student.findById(studentId)
    
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);

    const endDate = new Date(year, month, 0, 23, 59, 59, 999); 

    const records = await Attendance.find({
      student: studentId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate({ path: "class", select: "name" })
      .populate({ path: "teacher" , populate : {path : "user" , select : "name"}})
      .populate({path : "student" , populate : {path : "user" , select : "name"}})

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const attendanceRecord = await Attendance.findById(attendanceId);
        if(!attendanceRecord){
            return res.status(404).json({message : "Attendance record not found"});
        }
        await Attendance.findByIdAndDelete(attendanceId);
        res.status(200).json({message : "Attendance record deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getAttendanceRecordsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query; 

    let filter = { class: classId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const records = await Attendance.find(filter)
      .populate("student", "rollNumber")
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name",
        },
      });

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "Attendance not found for this class/date" });
    }

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAttendanceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    const attendanceRecords = await Attendance.find({ student: studentExists._id })
    .populate("class" , "name")
    .populate({
      path : "teacher",
      populate : {
        path : "user" , select : "name"
      }
    })

    return res.status(200).json({
      student: {
        id: studentExists._id,
        name: studentExists.name,
        email: studentExists.email,
      },
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAttendenceByTeacherAndClass = async (req, res) => {
  try {
    const { teacherId, classId } = req.params;

    const attendance = await Attendance.find({
      teacher: teacherId,
      class: classId,
    })
      .populate({
        path: "student",
        select: "rollNumber user", 
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate("class", "name");

    if (!attendance.length) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    return res.status(200).json({
      message: "Attendance fetched successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
