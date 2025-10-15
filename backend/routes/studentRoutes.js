import express from 'express';
import { createStudent, deleteStudent, getAllStudents, getStudentById, getStudentsByClassId, updateStudent } from '../controllers/studentController.js';
import { authMiddleware, isAdminOrTeacher } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createStudent' ,authMiddleware , isAdminOrTeacher , createStudent );
router.get('/getAllStudents' , authMiddleware , getAllStudents);
router.put('/updateStudent/:id' , authMiddleware , isAdminOrTeacher , updateStudent);
router.get('/getStudentById/:id' , authMiddleware , getStudentById);
router.get('/getStudentsByClassId/:classId' , authMiddleware  , getStudentsByClassId);
router.delete('/deleteStudent/:id' , authMiddleware , isAdminOrTeacher , deleteStudent);

export default router;