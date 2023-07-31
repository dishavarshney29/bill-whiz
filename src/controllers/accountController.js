const Customer = require('../models/customerModel');

exports.createAccount = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const newCustomer = new Customer({ name, email, address });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(500).json({ error: 'Error creating an account' });
    console.log(err);
  }
};
