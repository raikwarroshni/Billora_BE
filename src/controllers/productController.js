const Product = require('../models/Product');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Product);
