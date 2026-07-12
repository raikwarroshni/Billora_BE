const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const protect = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const salesInvoiceRoutes = require('./routes/salesInvoiceRoutes');
const businessRoutes = require('./routes/businessRoutes');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/vendors', protect, vendorRoutes);
app.use('/api/customers', protect, customerRoutes);
app.use('/api/products', protect, productRoutes);
app.use('/api/purchase-orders', protect, purchaseOrderRoutes);
app.use('/api/sales-invoices', protect, salesInvoiceRoutes);
app.use('/api/business', protect, businessRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
