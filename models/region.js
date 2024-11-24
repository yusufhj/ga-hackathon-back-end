const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    region_id: { type: String, unique: true },
    country_code: String,
    country: String,
    region: String,
    sub_region: String,
    salesperson: String,
  });
  
module.exports = mongoose.model('Region', regionSchema);
