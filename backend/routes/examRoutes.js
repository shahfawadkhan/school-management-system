import express from 'express';
import { createExam, deleteExam, getAllExams, getExamsByClass, updateExam } from '../controllers/examController.js';
import { authMiddleware , isAdminOrTeacher } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/createExam', authMiddleware , isAdminOrTeacher , createExam);
router.put('/updateExam/:id', updateExam);
router.delete('/deleteExam/:id', deleteExam);
router.get('/getExams/:classId' , getExamsByClass);
router.get('/getAllExams' , getAllExams);


export default router;