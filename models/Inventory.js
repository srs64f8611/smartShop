// models/Inventory.js
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true // one inventory record per product
  },
  quantityInStock: {
    type: Number,
    required: true,
    default: 0
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  supplier: {
    type: String
  }
});

export default mongoose.model('Inventory', inventorySchema);
