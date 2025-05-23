import express from 'express';
import authenticate_token from '../middlewares/authenticateToken.js';
import userController from '../controller/userController.js';
import authenticate_role from '../middlewares/authenticateRole.js'
const router = express.Router();

router.get('/', authenticate_token, authenticate_role, userController.getUsers)
router.get('/pagination/:limit/:offset', authenticate_token, authenticate_role, userController.getUsersPagination)
router.get('/:id', authenticate_token, userController.getUser);
router.patch('/update-profile/:id', authenticate_token, userController.updateProfile);
router.patch('/:id/role', authenticate_token, authenticate_role, userController.updateUserRole);
router.delete('/:id', authenticate_token, authenticate_role, userController.deleteUser);
router.post('/', authenticate_token, authenticate_role, userController.createUser);

export default router;