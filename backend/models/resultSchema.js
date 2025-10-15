import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }, // <--- new
  subjects: [
    {
      subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
      marksObtained: { type: Number, required: true, min: 0 },
      totalMarks: { type: Number, required: true, min: 1 }
    }
  ]
}, { timestamps: true });
export default mongoose.model('Result', resultSchema);
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

