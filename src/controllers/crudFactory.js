const asyncHandler = require('../middleware/asyncHandler');

/** Builds standard list/get/create/update/delete handlers for a Mongoose model. */
function crudFactory(Model) {
  const getAll = asyncHandler(async (req, res) => {
    const docs = await Model.find().sort({ createdAt: -1 });
    res.json(docs);
  });

  const getOne = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json(doc);
  });

  const create = asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  });

  const update = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json(doc);
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json({ message: `${Model.modelName} deleted`, id: req.params.id });
  });

  return { getAll, getOne, create, update, remove };
}

module.exports = crudFactory;
