import { Router } from 'express';
import multer from 'multer';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import multerConfig from './config/multer';

// controllers

import UserController from './app/controllers/UserController';
import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import CategoryController from './app/controllers/CategoryController';
import BannerController from './app/controllers/BannerController';
import ProductController from './app/controllers/ProductController';
import OrderController from './app/controllers/OrderController';
import UserOrderController from './app/controllers/UserOrderController';
import OfferController from './app/controllers/OfferController';

// validators

import validateCategoryStore from './app/validators/CategoryStore';
import validateOfferStore from './app/validators/OfferStore';
import validateOfferUpdate from './app/validators/OfferUpdate';
import validateOrderStore from './app/validators/OrderStore';
import validateOrderUpdate from './app/validators/OrderUpdate';
import validateProductStore from './app/validators/ProductStore';
import validateProductUpdate from './app/validators/ProductUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';

// middlewares

import authMiddleware from './app/middlewares/auth';

// configs

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

// routes

routes.post('/users', validateUserStore, UserController.store);
routes.post(
  '/sessions',
  bruteForce.prevent,
  validateSessionStore,
  SessionController.store,
);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', validateUserUpdate, UserController.update);

routes.post('/admins', AdminController.store);
routes.get('/admins', AdminController.index);
routes.delete('/admins/:id', AdminController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/banners', BannerController.store);
routes.get('/banners', BannerController.index);
routes.delete('/banners/:id', BannerController.delete);

routes.post('/categories', validateCategoryStore, CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.delete('/categories/:id', CategoryController.delete);
routes.put('/categories/:id', CategoryController.update);

routes.post('/products', validateProductStore, ProductController.store);
routes.get('/products', ProductController.index);
routes.delete('/products/:id', ProductController.delete);
routes.put('/products/:id', validateProductUpdate, ProductController.update);

routes.post('/orders', validateOrderStore, OrderController.store);
routes.get('/orders', OrderController.index);
routes.get('/orders/:id', UserOrderController.index);
routes.put('/orders/:id', validateOrderUpdate, OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/offers', validateOfferStore, OfferController.store);
routes.get('/offers', OfferController.index);
routes.put('/offers/:id', validateOfferUpdate, OfferController.update);
routes.delete('/offers/:id', OfferController.delete);

export default routes;
