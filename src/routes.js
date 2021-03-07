import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ScaleController from './app/controllers/ScaleController';
import ProjectController from './app/controllers/ProjectController';

import authMiddleware from './app/middlewares/auth';
import CriteriaController from './app/controllers/CriteriaController';

const routes = new Router();

routes.post('/register', UserController.store);
routes.post('/login', SessionController.store);

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
routes.put('/projects/:id/criteria/:criterion_id', CriteriaController.update);
routes.delete('/projects/:id/criteria/:criterion_id', CriteriaController.delete);

export default routes;
