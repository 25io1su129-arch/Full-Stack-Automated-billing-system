const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Demo product data
const products = [
  { id: 1, name: 'Rice', price: 60, category: 'Grocery' },
  { id: 2, name: 'Milk', price: 30, category: 'Dairy' },
  { id: 3, name: 'Bread', price: 40, category: 'Bakery' },
  { id: 4, name: 'Apple', price: 120, category: 'Fruits' },
  { id: 5, name: 'Biscuits', price: 20, category: 'Snacks' },
  { id: 6, name: 'Juice', price: 50, category: 'Drinks' },
];

// Home route
app.get('/', (req, res) => {
  res.send('Smart Billing Cart Backend is running!');
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get a single product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});