const express = require('express');
const mongoose = require('mongoose');

// Use the built-in JSON parsing middleware
const app = express();
app.use(express.json()); 

// Connect to MongoDB
mongoose
  .connect('mongodb://0.0.0.0:27017/billwhiz', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Create an account
const accountRoutes = require('./routes/accountRoutes');
app.use('/api/account', accountRoutes);

// Fetch all products and services information with their prices
const productRoutes = require('./routes/productRoutes');
app.use('/api/productsAndServices', productRoutes);

// Add a product or service to the cart
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart/add', cartRoutes);
// Remove a product or service from the cart or clear the cart
app.use('/api/cart', cartRoutes);

// View total bill / confirm the order (assuming this endpoint processes the order and clears the cart)
const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/api/invoices', invoiceRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to BillWhiz!');
});