const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    gstin: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    accountBooksDate: { type: Date, default: Date.now },
    businessType: { type: String, trim: true, default: '' },
    businessCategory: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    logoUrl: { type: String, trim: true, default: '' },
    signatureUrl: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
