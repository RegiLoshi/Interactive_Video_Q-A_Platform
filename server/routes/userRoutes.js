import express from 'express';
import authenticate_token from '../middlewares/authenticateToken.js';
import userController from '../controller/userController.js';

const router = express.Router();

router.get('/:id', authenticate_token, userController.getUser);
router.patch('/update-profile/:id', authenticate_token, userController.updateProfile);

export default router;