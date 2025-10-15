import express from 'express';
import { createResult, deleteResult, getAllResults, getResultByClass, getResultsByExam, getResultsByStudent, updateResult } from '../controllers/resultController.js';
import {isAdminOrTeacher , authMiddleware} from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/createResult' ,authMiddleware , isAdminOrTeacher ,  createResult)
router.get('/getResultsByStudent/:studentId' , getResultsByStudent)
router.get('/getResultsByExam/:examId', authMiddleware, isAdminOrTeacher, getResultsByExam);router.get('/getAllResults' , getAllResults)
router.get('/getResultByClass/:classId' ,authMiddleware , isAdminOrTeacher , getResultByClass)
router.put('/updateResult/:id' , updateResult)
router.delete('/deleteResult/:id' , deleteResult)

export default router;