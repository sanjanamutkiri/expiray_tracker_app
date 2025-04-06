const Item = require('../models/Item');

// @desc    Get all items for a user
// @route   GET /api/items
// @access  Private
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a new item
// @route   POST /api/items
// @access  Private
exports.addItem = async (req, res) => {
  try {
    const { name, category, purchaseDate, expiryDate, quantity, unit, notes } = req.body;

    const newItem = new Item({
      user: req.user._id,
      name,
      category,
      purchaseDate: purchaseDate || Date.now(),
      expiryDate,
      quantity,
      unit,
      notes
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the item belongs to the user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the item belongs to the user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get items expiring soon
// @route   GET /api/items/expiring
// @access  Private
exports.getExpiringItems = async (req, res) => {
  try {
    // Get items expiring in the next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const expiringItems = await Item.find({
      user: req.user._id,
      expiryDate: { $lte: sevenDaysFromNow, $gte: new Date() },
      isConsumed: false,
      isWasted: false
    }).sort({ expiryDate: 1 });
    
    res.json(expiringItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};