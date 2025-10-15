import express from 'express';
import { createTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from '../controllers/teacherController.js';
import { authMiddleware, isAdminOrTeacher } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/createTeacher' ,authMiddleware, isAdminOrTeacher , createTeacher);
router.get('/getAllTeachers' ,authMiddleware , getAllTeachers);
router.get('/getTeacherById/:id' ,authMiddleware , getTeacherById);
router.put('/updateTeacher/:id' ,authMiddleware ,isAdminOrTeacher , updateTeacher);
router.delete('/deleteTeacher/:id' ,authMiddleware ,isAdminOrTeacher , deleteTeacher);

export default router;