import express from 'express';
import authenticate_token from '../middlewares/authenticateToken.js';
import surveyController from '../controller/surveyController.js';

const router = express.Router();

router.get('/', authenticate_token, surveyController.getSurveys);
router.get('/:id', authenticate_token, surveyController.getSurveysID);
router.post('/', authenticate_token, surveyController.addSurvey);
router.delete('/', authenticate_token, surveyController.deleteSurvey);
router.get('/pagination/:limit/:offset', authenticate_token, surveyController.getSurveyPagination);
router.get('/pagination/:limit/:offset/:userId', authenticate_token, surveyController.getSurveyPaginationUser);

export default router;