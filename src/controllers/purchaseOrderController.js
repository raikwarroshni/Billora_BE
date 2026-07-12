const PurchaseOrder = require('../models/PurchaseOrder');
const asyncHandler = require('../middleware/asyncHandler');
const crudFactory = require('./crudFactory');

const base = crudFactory(PurchaseOrder);

const create = asyncHandler(async (req, res) => {
  const count = await PurchaseOrder.countDocuments();
  const poNumber = `PO-${String(count + 1).padStart(3, '0')}`;
  const order = await PurchaseOrder.create({ ...req.body, poNumber });
  res.status(201).json(order);
});

module.exports = { ...base, create };
