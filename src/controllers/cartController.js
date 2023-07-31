const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');
const Service = require('../models/serviceModel');

exports.addToCart = async (req, res) => {
  try {
    const { customerId, itemId, quantity } = req.body;

    // Validate customerId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Validate itemId
    const item = await getItemDetails(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Validate quantity (assuming quantity should be a positive integer)
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }

    // Assuming we have a function to validate if the item exists and fetch its details
    const itemDetails = await getItemDetails(itemId);

    if (!itemDetails) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Assuming we have a function to calculate the total price of the item based on quantity
    const totalPrice = calculateTotalPrice(itemDetails.price, quantity);

    // Check if the cart already exists for the customer, if not, create a new cart
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({ customerId, items: [] });
    }
    
    // Find the cart associated with the customer and then find the index of the item with the given itemId
    Cart.findOne({ customerId })
    .then(cart => {
        if (cart) {
        let existingItemIndex = -1;
        cart.products.forEach((product, index) => {
            if (product._id.toString() === itemId) {
            existingItemIndex = index;
            }
        });

        if (existingItemIndex === -1) {
            cart.services.forEach((service, index) => {
            if (service._id.toString() === itemId) {
                existingItemIndex = index;
            }
            });
        }

        console.log("Existing item index:", existingItemIndex);
        } else {
        console.log("Cart not found for the customer.");
        }
    })
    .catch(err => {
        console.error('Error finding the cart:', err);
    });


    cart.total = calculateCartTotal(cart.items);

    // Save the updated cart to the database
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error adding item to cart' });
    console.log(err)
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { customerId, itemId } = req.params;

    // Validate customerId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if the cart exists for the customer
    let cart = await Cart.findOne({ customerId });

    if (!cart || !cart.items) {
        console.log('Cart or items array not found');
        return res.status(404).json({ error: 'Cart not found' });
      }
      
    // Check if the item is present in the cart
    const existingItemIndex = cart.items.findIndex((item) => item.itemId === itemId);

    if (existingItemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in the cart' });
    }

    // Remove the item from the cart
    cart.items.splice(existingItemIndex, 1);

    // Recalculate the cart total
    cart.total = calculateCartTotal(cart.items);

    // Save the updated cart to the database
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error removing item from cart' });
  }
};

exports.clearCart = async (req, res) => {
    try {
      const { customerId } = req.params;
  
      // Validate customerId
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      // Find and delete the cart for the customer
      const deletedCart = await Cart.findOneAndDelete({ customerId });
  
      if (!deletedCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Error clearing the cart' });
      console.log(err);
    }
};


// Helper function to get item details (assuming it fetches from the product or service model)
const getItemDetails = async (itemId) => {
    try {
      const product = await Product.findById(itemId);
      if (product) {
        return product;
      }
  
      const service = await Service.findById(itemId);
      if (service) {
        return service;
      }
  
      return null; // Item not found
    } catch (err) {
      throw new Error('Error fetching item details');
      console.log(err);
    }
};

// Helper function to calculate the total price of an item based on quantity
const calculateTotalPrice = (price, quantity) => {
  return price * quantity;
};

// Helper function to calculate the total price of the cart
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};