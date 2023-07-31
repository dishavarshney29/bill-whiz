const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.get('/invoice/:customerId', invoiceController.viewTotalBill);
router.post('/invoice/:customerId', invoiceController.confirmOrder);

module.exports = router;
