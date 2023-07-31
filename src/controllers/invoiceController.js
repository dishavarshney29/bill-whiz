const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Service = require('../models/serviceModel');
const Invoice = require('../models/invoiceModel');
const Customer = require('../models/customerModel');

// Helper function to calculate tax for an item
const calculateItemTax = (item) => {
  let taxPercentage = 0;
  let taxAmount = 0;

  if (item.itemId.startsWith('P')) {
    // Product tax calculation
    const product = Product.findById(item.itemId);
    if (product) {
      if (product.price > 1000 && product.price <= 5000) {
        taxPercentage = 0.12;
      } else if (product.price > 5000) {
        taxPercentage = 0.18;
      } else {
        taxAmount = 200;
      }
    }
  } else if (item.itemId.startsWith('S')) {
    // Service tax calculation
    const service = Service.findById(item.itemId);
    if (service) {
      if (service.price > 1000 && service.price <= 8000) {
        taxPercentage = 0.10;
      } else if (service.price > 8000) {
        taxPercentage = 0.15;
      } else {
        taxAmount = 100;
      }
    }
  }

  const itemTotal = item.price * item.quantity;
  const itemTax = taxAmount || itemTotal * taxPercentage;
  const itemTotalWithTax = itemTotal + itemTax;

  return {
    ...item.toObject(),
    taxPercentage: taxPercentage * 100,
    taxAmount,
    totalWithTax: itemTotalWithTax,
  };
};

exports.viewTotalBill = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate customerId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Find the cart for the customer
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Check if the cart is empty
    if (cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items before viewing the total bill.' });
    }

    // Calculate tax for each item in the cart
    const itemsWithTax = cart.items.map(calculateItemTax);

    const totalBill = itemsWithTax.reduce((total, item) => total + item.totalWithTax, 0);

    res.status(200).json({ items: itemsWithTax, totalBill });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching total bill' });
    console.log(err);
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate customerId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Find the cart for the customer
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Check if the cart is empty
    if (cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items before confirming the order.' });
    }

    // Calculate tax for each item in the cart
    const itemsWithTax = cart.items.map(calculateItemTax);

    const totalBill = itemsWithTax.reduce((total, item) => total + item.totalWithTax, 0);

    // Create an invoice
    const invoice = new Invoice({
      customerId,
      items: itemsWithTax,
      totalBill,
      createdAt: new Date(),
    });

    // Save the invoice to the database
    await invoice.save();

    // Clear the cart after confirming the order
    await cart.delete();

    res.status(200).json({ message: 'Order confirmed successfully', invoice });
  } catch (err) {
    res.status(500).json({ error: 'Error confirming the order' });
  }
};
