const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
    },
    category: {
        type: String
    }, 
    sub_category: {
        type: String
    },
    product_name: {
        type: String,
        required: true
    },
    product_cost_to_consumer: {
        type: Number,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    stock_quantity: {
        type: Number,
    },
    image: {
        type: String,
    }
});

module.exports = mongoose.model('Product', productSchema);