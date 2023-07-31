const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/cart/add', cartController.addToCart);
router.delete('/cart/:customerId/:itemId', cartController.removeFromCart);
router.delete('/cart/:customerId', cartController.clearCart);

module.exports = router;
