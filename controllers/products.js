const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const Product = require('../models/product');
const Review = require('../models/review');


// GET /products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}).limit(20);
        if (!products) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.status(201).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /products/:pid
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /products
router.post('/', verifyToken, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        sub_category: req.body.sub_category,
        stock_quantity: req.body.stock_quantity,
        image: req.body.image
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /products/:pid
router.put('/:pid', verifyToken, async (req, res) => {
    try {
        const product = await Product.findOne({ pid: req.params.pid });
        if (product == null) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.name = req.body.name;
        product.price = req.body.price;
        product.category = req.body.category;
        product.sub_category = req.body.sub_category;
        product.stock_quantity = req.body.stock_quantity;
        product.image = req.body.image;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /products/:pid
router.delete('/:pid', verifyToken, async (req, res) => {
    try {
        const product = await Product.findOne({ pid: req.params.pid });
        if (product == null) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.remove();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /products/:pid/reviews
router.get('/:pid/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.pid });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /products/:pid/reviews
router.post('/:pid/reviews', verifyToken, async (req, res) => {
    const review = new Review({
        product: req.params.pid,
        user: req.body.user,
        rating: req.body.rating,
        review: req.body.review
    });
    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /products/:pid/reviews/:rid
router.put('/:pid/reviews/:rid', verifyToken, async (req, res) => {
    try {
        const review = await Review.findOne({ _id: req.params.rid });
        if (review == null) {
            return res.status(404).json({ message: 'Review not found' });
        }
        review.rating = req.body.rating;
        review.review = req.body.review;
        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /products/:pid/reviews/:rid
router.delete('/:pid/reviews/:rid', verifyToken, async (req, res) => {
    try {
        const review = await Review.findOne({ _id: req.params.rid });
        if (review == null) {
            return res.status(404).json({ message: 'Review not found' });
        }
        await review.remove();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;