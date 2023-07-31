const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory data for products and services (You'd typically use a database for this)
let products = [
  { id: 1, name: 'Product A', price: 1200 },
  { id: 2, name: 'Product B', price: 5500 },
  { id: 3, name: 'Product C', price: 300 },
];

let services = [
  { id: 1, name: 'Service X', price: 2000 },
  { id: 2, name: 'Service Y', price: 8500 },
  { id: 3, name: 'Service Z', price: 500 },
];

// Cart for each user (Again, in a real app, this should be stored in the database against the user)
let userCarts = {};

// Create an account
app.post('/api/accounts', (req, res) => {
  const { username, email } = req.body;
  // Assuming no duplicate accounts for simplicity
  const accountId = Date.now().toString(); // Unique ID based on timestamp
  userCarts[accountId] = [];
  res.status(201).json({ id: accountId, username, email });
});

// Fetch all products and services information with their prices
app.get('/api/products', (req, res) => {
  res.json({ products });
});

app.get('/api/services', (req, res) => {
  res.json({ services });
});

// Add a product or service to the cart
app.post('/api/carts/:accountId/items', (req, res) => {
  const { accountId } = req.params;
  const { type, itemId } = req.body;

  let item;
  if (type === 'product') {
    item = products.find((product) => product.id === itemId);
  } else if (type === 'service') {
    item = services.find((service) => service.id === itemId);
  } else {
    return res.status(400).json({ error: 'Invalid item type' });
  }

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  userCarts[accountId].push(item);
  res.sendStatus(204);
});

// Remove a product or service from the cart
app.delete('/api/carts/:accountId/items/:itemId', (req, res) => {
  const { accountId, itemId } = req.params;
  const cart = userCarts[accountId];
  const itemIndex = cart.findIndex((item) => item.id === parseInt(itemId));

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in the cart' });
  }

  cart.splice(itemIndex, 1);
  res.sendStatus(204);
});

// Clear the cart
app.delete('/api/carts/:accountId', (req, res) => {
  const { accountId } = req.params;
  userCarts[accountId] = [];
  res.sendStatus(204);
});

// View total bill
app.get('/api/carts/:accountId/total', (req, res) => {
  const { accountId } = req.params;
  const cart = userCarts[accountId] || [];

  let total = 0;
  let tax = 0;

  cart.forEach((item) => {
    if (item.price > 1000 && item.price <= 5000) {
      tax += item.price * 0.12;
    } else if (item.price > 5000) {
      tax += item.price * 0.18;
    } else {
      tax += 200;
    }

    total += item.price;
  });

  res.json({ total, tax });
});

// Confirm the order (assuming this endpoint processes the order and clears the cart)
app.post('/api/carts/:accountId/confirm', (req, res) => {
  const { accountId } = req.params;
  // Process the order here...
  // Clear the cart after order confirmation
  userCarts[accountId] = [];
  res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

