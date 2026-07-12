const Customer = require('../models/Customer');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Customer);
