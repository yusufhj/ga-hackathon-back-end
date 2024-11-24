// utils/csvUtils.js
const fs = require('fs').promises;
const csv = require('csv-parse');
const path = require('path');

const parseCSV = async (filePath) => {
  const fileContent = await fs.readFile(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    csv.parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: true,
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

const transformData = {
  customers: (data) =>
    data.map((row) => ({
      customer_id: row.customer_id,
      customer_name: row.customer_name,
      segment: row.segment,
    })),

  products: (data) =>
    data.map((row) => ({
      product_id: row.product_id,
      category: row.category,
      sub_category: row.sub_category,
      product_name: row.product_name,
      product_cost_to_consumer: parseFloat(row.product_cost_to_consumer),
    })),

  regions: (data) =>
    data.map((row) => ({
      region_id: row.region_id,
      country_code: row.country_code,
      country: row.country,
      region: row.region,
      sub_region: row.sub_region,
      salesperson: row.salesperson,
    })),

  orders: (data) =>
    data.map((row) => ({
      order_id: row.order_id,
      product_id: row.product_id,
      order_date: new Date(row.order_date),
      ship_date: new Date(row.ship_date),
      ship_mode: row.ship_mode,
      customer_id: row.customer_id,
      sales: parseFloat(row.sales),
      quantity: parseInt(row.quantity),
      discount: parseFloat(row.discount),
      profit: parseFloat(row.profit),
      postal_code: row.postal_code,
      region_id: row.region_id,
    })),

  returns: (data) =>
    data.map((row) => ({
      order_id: row.order_id,
      product_id: row.product_id,
      return_date: new Date(row.return_date),
      return_quantity: parseInt(row.return_quantity),
      reason_returned: row.reason_returned,
    })),
};

const loadCSVData = async (dataType, filePath) => {
  const rawData = await parseCSV(filePath);
  return transformData[dataType](rawData);
};

module.exports = {
  loadCSVData,
};