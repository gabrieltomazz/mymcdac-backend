import { Router } from 'express';
import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ScaleController from './app/controllers/ScaleController';
import ProjectController from './app/controllers/ProjectController';

import authMiddleware from './app/middlewares/auth';

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
routes.get('/projects/user', ProjectController.getProjectById);
routes.delete('/projects/:id', ProjectController.delete);

export default routes;