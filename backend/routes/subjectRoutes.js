import express from 'express';
import { createSubject, deleteSubject, getAllSubjects } from '../controllers/subjectController.js';
import { authMiddleware , isAdminOrTeacher } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/createSubject' , authMiddleware , isAdminOrTeacher , createSubject )
router.get('/getAllSubjects' , authMiddleware , getAllSubjects)
router.delete('/deleteSubject/:id' , authMiddleware , isAdminOrTeacher , deleteSubject)
export default router;