import express from 'express';
import authenticate_token from '../middlewares/authenticateToken.js';
import answerController from '../controller/answerController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticate_token, upload.single('video'), answerController.addAnswer);
router.get('/survey/:id/responses', authenticate_token, answerController.getAnswers);
router.get('/survey/:surveyId/responses/:userId', authenticate_token, answerController.getVideoAnswer);

export default router;