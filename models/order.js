const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: String,
    },
    region_id: {
        type: String,
    },
    sales: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    proft: {
        type: Number,
    },
    postal_code: {
        type: String,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region'
    }
});

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        unique: true,
    },
    order_date: {
        type: Date,
    },
    ship_date: {
        type: Date,
    },
    ship_mode: {
        type: String,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customer_id: {
        type: String,
    },
    order_items: [orderItemSchema],
    total: {
        type: Number,
    }
});

module.exports = mongoose.model('Order', orderSchema);