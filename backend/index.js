



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/foodwise')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('FoodWise API is running');
});

// Start server
const PORT =3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
