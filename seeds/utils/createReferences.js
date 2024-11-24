require('dotenv').config();
const mongoose = require('mongoose');
const User  = require('../../models/user');
const Product = require('../../models/product');
const Region = require('../../models/region');
const Order = require('../../models/order');

const batchSize = 100;

const createReferences = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get total number of orders
    const totalOrders = await Order.countDocuments();
    console.log(`Total orders to process: ${totalOrders}`);

    // Process orders in batches
    for (let skip = 0; skip < totalOrders; skip += batchSize) {
      const orders = await Order.find().skip(skip).limit(batchSize);

      const updateOperations = orders.map(async (order) => {
        // Find references for this order
        const [user, productRefs, regionRefs] = await Promise.all([
          User.findOne({ username: order.customer_id }),
          Product.find({
            product_id: {
              $in: order.order_items.map((item) => item.product_id),
            },
          }),
          Region.find({
            region_id: {
              $in: order.order_items.map((item) => item.region_id),
            },
          }),
        ]);

        // Create maps for quick lookup
        const productMap = new Map(productRefs.map((p) => [p.product_id, p._id]));
        const regionMap = new Map(regionRefs.map((r) => [r.region_id, r._id]));

        // Update order items with references
        const updatedOrderItems = order.order_items.map((item) => ({
          ...item.toObject(),
          product: productMap.get(item.product_id),
          region: regionMap.get(item.region_id),
        }));

        // Update the order
        return Order.updateOne(
          { _id: order._id },
          {
            $set: {
              customer: user?._id,
              order_items: updatedOrderItems,
            },
          }
        );
      });

      // Run the batches
      await Promise.all(updateOperations);
      console.log(`Processed ${Math.min(skip + batchSize, totalOrders)} of ${totalOrders} orders`);
    }

    console.log('Successfully created all references');
  } catch (error) {
    console.error('Error creating references:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  createReferences()
    .then(() => {
      console.log('Reference creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Reference creation failed:', error);
      process.exit(1);
    });
}

module.exports = createReferences;