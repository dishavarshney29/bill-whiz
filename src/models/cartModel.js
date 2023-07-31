const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemType: {
    type: String,
    enum: ['product', 'service'],
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;
