// routes/items.js
const express = require('express');
const router = express.Router();
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getExpiringItems
} = require('../controllers/itemController');
const auth = require('../middleware/auth');

router.get('/', auth, getItems);
router.post('/', auth, addItem);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);
router.get('/expiring', auth, getExpiringItems);

module.exports = router;
