const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const Product = require('../models/product');
const Order = require('../models/order');

// GET /orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /orders/:oid
router.get('/:oid', async (req, res) => {
    try {
        const order = await Order.findOne({ oid: req.params.oid });
        if (order == null) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /orders creating new order and adding items to it
router.post('/', verifyToken, async (req, res) => {
    const order = new Order({
        customer: req.body.customer,
        order_date: req.body.order_date,
        items: req.body.items,
        total: req.body.total
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /orders/:oid adding a new item to the order 
router.put('/:oid', verifyToken, async (req, res) => {
    try {
        const order = await Order.findById( req.params.oid );
        if (order == null) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.customer = req.body.customer;
        order.order_date = req.body.order_date;
        order.items = req.body.items;
        order.total = req.body.total;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /orders/:oid
router.delete('/:oid', verifyToken, async (req, res) => {
    try {
        const order = await Order.findById( req.params.oid );
        if (order == null) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.remove();
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;