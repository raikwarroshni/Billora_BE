const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, unique: true },
    category: { type: String, trim: true },
    purchasePrice: { type: Number, required: true },
    gst: { type: Number, default: 18 },
    quantity: { type: Number, default: 0 },
    minStock: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
