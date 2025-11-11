// routes/inventories.js
import express from 'express';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

const router = express.Router();

// CREATE or ADD inventory record
router.post('/', async (req, res) => {
  try {
    const { product, quantityInStock, supplier } = req.body;

    const existingInventory = await Inventory.findOne({ product });
    if (existingInventory)
      return res.status(400).json({ message: 'Inventory already exists for this product' });

    const newInventory = new Inventory({ product, quantityInStock, supplier });
    await newInventory.save();

    res.status(201).json(newInventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('product');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE inventory quantity
router.put('/:id', async (req, res) => {
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedInventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE inventory record
router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inventory record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
