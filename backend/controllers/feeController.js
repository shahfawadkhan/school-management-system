import Fee from "../models/feeSchema.js";
import Student from "../models/studentModel.js";
import Class from '../models/classModel.js'
export const createFee = async (req, res) => {
  try {
    const { student, amount, dueDate, paymentDate, status } = req.body;

    // 1️⃣ Check if student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Restrict dueDate to today or future
    const now = new Date();
    const parsedDueDate = new Date(dueDate);

    if (parsedDueDate < new Date(now.setHours(0, 0, 0, 0))) {
      return res.status(400).json({ message: "Due date must be today or a future date" });
    }

    // 3️⃣ Restrict one fee per student per month
    const startOfMonth = new Date(parsedDueDate.getFullYear(), parsedDueDate.getMonth(), 1);
    const endOfMonth = new Date(parsedDueDate.getFullYear(), parsedDueDate.getMonth() + 1, 0, 23, 59, 59);

    const existingFee = await Fee.findOne({
      student,
      dueDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    if (existingFee) {
      return res.status(400).json({ message: "Fee for this student already exists in this month" });
    }

    // 4️⃣ Create fee
    const fee = await Fee.create({
      student,
      amount,
      dueDate: parsedDueDate,
      paymentDate: status === "paid" ? paymentDate || new Date() : null,
      status: status || "unpaid",
    });

    await fee.populate({ path: "student", select: "name rollNumber" });

    // 5️⃣ Update student's fee history
    await Student.findByIdAndUpdate(
      student,
      { $push: { feesPaid: fee._id } },
      { new: true }
    );

    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getStudentFeeRecords = async (req, res) => {
  try {
    const { studentId, year } = req.params;

    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const fees = await Fee.find({
      student: studentId,
      $or: [
        {
          dueDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
        {
          paymentDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        }
      ]
    });

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const feeSummary = months.map((month, index) => {
      const monthRecord = fees.find(f => {
        if (f.status === 'paid' && f.paymentDate) {
          return new Date(f.paymentDate).getMonth() === index;
        }
        return new Date(f.dueDate).getMonth() === index;
      });
      
      return {
        month,
        amount: monthRecord ? monthRecord.amount : null,
        status: monthRecord ? monthRecord.status : "not assigned",
        dueDate: monthRecord ? monthRecord.dueDate : null,
        paymentDate: monthRecord ? monthRecord.paymentDate : null,
      };
    });

    res.status(200).json({
      student: studentExists.name,
      year,
      records: feeSummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const editFee = async (req , res)=>{
    try {
        const {id} = req.params;
        const {amount, dueDate, paymentDate, status} = req.body;
        const fee = await Fee.findById(id);
        if(!fee){
            return res.status(404).json({ message: "Fee record not found" });
        }
        const updatedFee = await Fee.findByIdAndUpdate(id , {
            amount : amount || fee.amount,
            dueDate : dueDate || fee.dueDate,
            paymentDate : status === 'paid' ? (paymentDate || new Date()) : null,
            status : status || fee.status
        } , {new : true})
        .populate({ path: "student", select: "name rollNumber" });
        res.status(200).json(updatedFee);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const deleteFee = async (req , res)=>{
    try {
        const {id} = req.params;
        const fee = await Fee.findById(id);
        if(!fee){
            return res.status(404).json({ message: "Fee record not found" });
        }
        await Fee.findByIdAndDelete(id);
        res.status(200).json({message : "Fee record deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getClassFeeRecords = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.find({ class: classId })
      .populate("user", "name email")
      .populate({
        path: "feesPaid",
        model: "Fee",
        populate: { path: "student", select: "rollNumber user" }
      });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found for this class" });
    }

    const classFeeRecords = students.map((stu) => ({
      studentId: stu._id,
      name: stu.user?.name,
      rollNumber: stu.rollNumber,
      classId: stu.class,
      fees: stu.feesPaid.map((fee) => ({
        feeId: fee._id,
        amount: fee.amount,
        dueDate: fee.dueDate,
        paymentDate: fee.paymentDate,
        status: fee.status,
      })),
    }));

    res.status(200).json({
      classId,
      totalStudents: students.length,
      records: classFeeRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
