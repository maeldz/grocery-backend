import { Router } from 'express';
import multer from 'multer';
import redis from 'redis';
import ExpressBruteFlexible from 'rate-limiter-flexible/lib/ExpressBruteFlexible';

import Cache from './lib/Cache';

import multerConfig from './config/multer';

// controllers

import UserController from './app/controllers/UserController';
import AddressController from './app/controllers/AddressController';
import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import AdminSessionController from './app/controllers/AdminSessionController';
import FileController from './app/controllers/FileController';
import CategoryController from './app/controllers/CategoryController';
import BannerController from './app/controllers/BannerController';
import ProductController from './app/controllers/ProductController';
import OrderController from './app/controllers/OrderController';
import UserOrderController from './app/controllers/UserOrderController';
import OfferController from './app/controllers/OfferController';
import SettingController from './app/controllers/SettingController';

// validators

import validateCategoryStore from './app/validators/CategoryStore';
import validateOfferStore from './app/validators/OfferStore';
import validateOfferUpdate from './app/validators/OfferUpdate';
import validateOrderStore from './app/validators/OrderStore';
import validateOrderUpdate from './app/validators/OrderUpdate';
import validateProductStore from './app/validators/ProductStore';
import validateProductUpdate from './app/validators/ProductUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateAddressStore from './app/validators/AddressStore';
import validateAddressUpdate from './app/validators/AddressUpdate';
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';

// middlewares

import authMiddleware from './app/middlewares/auth';

// configs

const routes = new Router();
const upload = multer(multerConfig);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new ExpressBruteFlexible(
  ExpressBruteFlexible.LIMITER_TYPES.REDIS,
  {
    freeRetries: 100,
    storeClient: redisClient,
  },
);

// routes

routes.post('/users', validateUserStore, UserController.store);

routes.post(
  '/sessions',
  bruteForce.prevent,
  validateSessionStore,
  SessionController.store,
);

routes.post(
  '/admin/sessions',
  bruteForce.prevent,
  validateSessionStore,
  AdminSessionController.store,
);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', validateUserUpdate, UserController.update);

routes.post('/address', validateAddressStore, AddressController.store);
routes.get('/address', AddressController.index);
routes.put('/address', validateAddressUpdate, AddressController.update);

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
routes.get('/products/:id', ProductController.index);
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

routes.post('/settings', SettingController.store);
routes.get('/settings', SettingController.index);
routes.put('/settings', SettingController.update);

routes.get('/invalidate/all', async (req, res) => {
  await Cache.invalidateAll();
  return res.json('Cache limpo!');
});

export default routes;
