import express from 'express';
import { createClass, deleteClass, getAllClasses, getClassById, getClassByStudentOrTeacherId, updateClass } from '../controllers/classController.js';
import { authMiddleware, isAdminOrTeacher } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createClass' ,authMiddleware , isAdminOrTeacher , createClass)
router.get('/getAllClasses' , authMiddleware , getAllClasses)
router.get('/getClassById/:id' , authMiddleware , getClassById)
router.get('/getClassByStudentOrTeacherId/:userId/:role' , authMiddleware , getClassByStudentOrTeacherId)
router.put('/updateClass/:id' , authMiddleware , isAdminOrTeacher , updateClass)
router.delete('/deleteClass/:id' , authMiddleware , isAdminOrTeacher , deleteClass)

export default router;