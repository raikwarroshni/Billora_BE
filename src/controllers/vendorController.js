const Vendor = require('../models/Vendor');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Vendor);
