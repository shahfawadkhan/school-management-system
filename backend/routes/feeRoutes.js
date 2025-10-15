import express from 'express';
import { createFee, deleteFee, editFee, getClassFeeRecords, getStudentFeeRecords } from '../controllers/feeController.js';
import { authMiddleware, isAdminOrTeacher } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createFee', authMiddleware , isAdminOrTeacher , createFee);
router.get('/studentFeeRecords/:studentId/:year', authMiddleware , getStudentFeeRecords);
router.get('/getClassFeeRecords/:classId', authMiddleware , getClassFeeRecords);
router.put('/updateFee/:id', authMiddleware , isAdminOrTeacher , editFee); 
router.delete('/deleteFee/:id', authMiddleware , isAdminOrTeacher , deleteFee);

export default router;