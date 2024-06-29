import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getUser,
} from '../controller/userController.js';
import {
  signUp,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
} from '../controller/authController.js';
import { protect } from '../utils/protect.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);

router.get('/me', protect, getMe);

router.get('/allUser', protect, getAllUsers);
router.get('/:id', protect, getUser);

router.patch('/updateMe', protect, updateDetails);
router.patch('/updatePassword', protect, updatePassword);

router.delete('/deleteMe', protect, deleteUser)

export default router;
