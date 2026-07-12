const mongoose = require('mongoose');

const salesInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: String, required: true, trim: true },
    customerAddress: { type: String, trim: true, default: '' },
    customerGst: { type: String, trim: true, default: '' },
    hsnCode: { type: String, trim: true, default: '9018' },
    item: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    gst: { type: Number, default: 18 },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SalesInvoice', salesInvoiceSchema);
