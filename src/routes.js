import { Router } from 'express';
import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ScaleController from './app/controllers/ScaleController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/register', UserController.store);
routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.put('/profile', UserController.update);
routes.get('/profile', UserController.getUser);

routes.get('/scales', ScaleController.getScaleAll);
routes.post('/scales', ScaleController.store);

export default routes;