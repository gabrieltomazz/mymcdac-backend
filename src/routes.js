import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ScaleController from './app/controllers/ScaleController';
import ProjectController from './app/controllers/ProjectController';

import authMiddleware from './app/middlewares/auth';
import CriteriaController from './app/controllers/CriteriaController';
import ScaleResultController from './app/controllers/ScaleResultController';
import OptionsAnswerController from './app/controllers/OptionsAnswerController';

const routes = new Router();

routes.post('/register', UserController.store);
routes.post('/login', SessionController.store);
routes.get('/login-google', SessionController.googleAuth);
routes.get('/callback-google/', SessionController.callbackGoogle);
routes.get('/login-facebook', SessionController.facebookAuth);
routes.get('/callback-facebook', SessionController.callbackFacebook);

routes.use(authMiddleware);

routes.put('/profile', UserController.update);
routes.get('/profile', UserController.getUser);

routes.get('/scales', ScaleController.getScaleAll);
routes.get('/scales/user', ScaleController.getScaleByUserId);
routes.post('/scales', ScaleController.store);
routes.put('/scales/:id', ScaleController.update);
routes.delete('/scales/:id', ScaleController.delete);

routes.post('/projects', ProjectController.store);
routes.put('/projects', ProjectController.update);
routes.get('/projects/user', ProjectController.getProjectByUserId);
routes.get('/projects/:id', ProjectController.getProjectById);
routes.delete('/projects/:id', ProjectController.delete);

routes.post('/projects/:id/criteria', CriteriaController.store);
routes.get('/projects/:id/criteria', CriteriaController.getCriteriaByProjectId);
routes.get('/projects/:id/criteria/leafs', CriteriaController.getCriteriaLefs);
routes.get('/projects/:id/criteria/contribution-rates', CriteriaController.getCriteriaContributionRates);
routes.put('/projects/:id/criteria/:criterion_id', CriteriaController.update);
routes.patch('/projects/:id/criteria', CriteriaController.updateCriteria);
routes.delete('/projects/:id/criteria/:criterion_id', CriteriaController.delete);

routes.get('/projects/:id/criteria/modes', ScaleResultController.getMedianScale);
routes.patch('/projects/:id/criteria/modes', ScaleResultController.update);
routes.get('/projects/:id/criteria/final-result', ScaleResultController.getFinalResult);

routes.delete('/option-anwser/:id', OptionsAnswerController.delete);

export default routes;
