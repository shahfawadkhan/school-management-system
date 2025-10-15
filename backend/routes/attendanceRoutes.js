import express from 'express';
import { deleteAttendance, getAttendanceByStudentId, getAttendanceRecords, getAttendanceRecordsByClass, getAttendenceByTeacherAndClass, markAttendance } from '../controllers/attendanceController.js';
import {authMiddleware , isAdminOrTeacher} from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/markAttendance' ,authMiddleware ,isAdminOrTeacher , markAttendance)
router.get('/getAttendanceRecords/:studentId/:year/:month', authMiddleware, getAttendanceRecords);
router.get('/getAttendenceByTeacherAndClass/:teacherId/:classId', authMiddleware,isAdminOrTeacher , getAttendenceByTeacherAndClass);
router.get('/getAttendanceByStudentId/:studentId', authMiddleware, getAttendanceByStudentId);
router.get('/getAttendanceRecordsByClass/:classId' , authMiddleware , getAttendanceRecordsByClass)
router.delete('/deleteAttendance/:id' ,authMiddleware , isAdminOrTeacher , deleteAttendance)

export default router;