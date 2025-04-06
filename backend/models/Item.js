const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unit: {
    type: String,
    default: 'item'
  },
  isConsumed: {
    type: Boolean,
    default: false
  },
  isWasted: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Item', ItemSchema);
