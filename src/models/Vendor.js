const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    hasGst: { type: Boolean, default: true },
    gst: { type: String, trim: true, default: '' },
    address: { type: String, trim: true },
    paymentTerms: {
      type: String,
      enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'COD'],
      default: 'Net 30',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
