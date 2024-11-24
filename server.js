require('dotenv').config();
require('./config/database');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const verifyToken = require('./middleware/verify-token');

// Controllers
const testJwtCtrl = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const productsRouter = require('./controllers/products');
const ordersRouter = require('./controllers/orders');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Public Routes
app.use('/test-jwt', testJwtCtrl);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// Private Routes
app.use(verifyToken);
app.use('/profiles', profilesRouter);
app.use('/orders', ordersRouter);

app.listen(3000, () => {
  console.log('The express app is ready!');
});