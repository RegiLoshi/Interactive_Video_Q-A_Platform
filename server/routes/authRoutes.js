import express from 'express';
import authenticate_token from '../middlewares/authenticateToken.js';
import authController from '../controller/authController.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.post('/refresh', authController.refreshToken);
router.post('/requestPassword', authController.requestPassword);
router.post('/resetPassword', authController.resetPassword);

router.post('/logout', authenticate_token, authController.logoutUser);
router.get('/users', authenticate_token, authController.getUsers);

export default router;