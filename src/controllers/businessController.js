const Business = require('../models/Business');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/business — single-business MVP: returns the first (and only) profile
const getBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findOne();
  res.json(business || null);
});

// PUT /api/business — upserts the single business profile
const upsertBusiness = asyncHandler(async (req, res) => {
  const existing = await Business.findOne();
  const business = existing
    ? await Business.findByIdAndUpdate(existing._id, req.body, { new: true, runValidators: true })
    : await Business.create(req.body);
  res.json(business);
});

module.exports = { getBusiness, upsertBusiness };
