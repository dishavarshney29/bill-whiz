const Product = require('../models/productModel');
const Service = require('../models/serviceModel');

exports.getAllProductsAndServices = async (req, res) => {
  try {
    const products = await Product.find();
    const services = await Service.find();
    res.status(200).json({ products, services });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products and services' });
  }
};