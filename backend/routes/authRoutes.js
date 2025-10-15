
import express from 'express';
import { deleteUser, getAllUsers, getProfile, login, register } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers' ,authMiddleware , getAllUsers);
router.get('/profile' ,authMiddleware , getProfile)
router.delete('/deleteUser/:id' , authMiddleware , deleteUser)

export default router;