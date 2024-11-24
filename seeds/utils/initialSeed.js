// scripts/initialSeed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const { loadCSVData } = require('../utils/csvUtils');
const User  = require('../../models/user');
const Product = require('../../models/product');
const Region = require('../../models/region');
const Order = require('../../models/order');

const createHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const initialSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Region.deleteMany({}), Order.deleteMany({})]);

    console.log('Cleared existing data');

    // Load all CSV data
    const [customersData, productsData, regionsData, ordersData] = await Promise.all([
      loadCSVData('customers', path.join(__dirname, '../data/customers.csv')),
      loadCSVData('products', path.join(__dirname, '../data/products.csv')),
      loadCSVData('regions', path.join(__dirname, '../data/regions.csv')),
      loadCSVData('orders', path.join(__dirname, '../data/orders.csv')),
    ]);

    // Create users from customers with hashed passwords
    const hashedPassword = await createHashedPassword('123');
    const userRecords = customersData.map((customer) => ({
      username: customer.customer_id,
      hashedPassword,
      customer_name: customer.customer_name,
      segment: customer.segment,
    }));

    // Prepare order records
    const orderMap = new Map();
    ordersData.forEach((order) => {
      if (!orderMap.has(order.order_id)) {
        orderMap.set(order.order_id, {
          order_id: order.order_id,
          order_date: order.order_date,
          ship_date: order.ship_date,
          ship_mode: order.ship_mode,
          customer_id: order.customer_id,
          order_items: [],
        });
      }

      orderMap.get(order.order_id).order_items.push({
        product_id: order.product_id,
        region_id: order.region_id,
        sales: order.sales,
        quantity: order.quantity,
        discount: order.discount,
        profit: order.profit,
        postal_code: order.postal_code,
      });
    });

    const orderRecords = Array.from(orderMap.values());

    // Bulk insert all records
    await Promise.all([
      User.insertMany(userRecords),
      Product.insertMany(productsData),
      Region.insertMany(regionsData),
      Order.insertMany(orderRecords),
    ]);

    console.log('Successfully completed initial data load');
  } catch (error) {
    console.error('Error in initial seed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  initialSeed()
    .then(() => {
      console.log('Initial seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Initial seeding failed:', error);
      process.exit(1);
    });
}

module.exports = initialSeed;