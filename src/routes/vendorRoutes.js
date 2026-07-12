const express = require('express');
const controller = require('../controllers/vendorController');

const router = express.Router();

router.route('/').get(controller.getAll).post(controller.create);
router.route('/:id').get(controller.getOne).put(controller.update).delete(controller.remove);

module.exports = router;
