const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./modules/users/users.routes');
const authRoutes = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/products.routes');
const orderRoutes = require('./modules/orders/orders.routes');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({message: 'Welcome to CodePilot API'}));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;
