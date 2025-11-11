// server.js
import express from 'express';
import mongoose from 'mongoose';
const app = express();

// Middleware to parse JSON
app.use(express.json());


// MongoDB connection string
const uri = "mongodb+srv://smartshopuser:SmartShop123%21@smartshopcluster.xatpw3n.mongodb.net/smartshopDB?appName=SmartShopCluster";



// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

  // Import and use routes
import userRoutes from './routes/users.js';
app.use('/users', userRoutes);

import productRoutes from './routes/products.js';
app.use('/products', productRoutes);

import categoryRoutes from './routes/categories.js';
app.use('/categories', categoryRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('SmartShop API is running 🚀');
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
// testing git 
// third commit