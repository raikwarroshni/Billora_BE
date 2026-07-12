const SalesInvoice = require('../models/SalesInvoice');
const asyncHandler = require('../middleware/asyncHandler');
const crudFactory = require('./crudFactory');

const base = crudFactory(SalesInvoice);

const create = asyncHandler(async (req, res) => {
  const count = await SalesInvoice.countDocuments();
  const invoiceNumber = `INV-${String(count + 1).padStart(3, '0')}`;
  const invoice = await SalesInvoice.create({ ...req.body, invoiceNumber });
  res.status(201).json(invoice);
});

module.exports = { ...base, create };
