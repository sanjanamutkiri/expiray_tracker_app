import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RestaurantDashboard = () => {
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form data
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    purchaseDate: '',
    expiryDate: '',
    quantity: 1,
    unit: 'kg',
    notes: ''
  });

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3002/api/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error.response?.data?.message || error.message);
    }
  };

  // Add a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3002/api/items', newItem, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh items after adding
      fetchItems();
      // Close modal
      setShowAddModal(false);
      // Reset form
      setNewItem({
        name: '',
        category: '',
        purchaseDate: '',
        expiryDate: '',
        quantity: 1,
        unit: 'kg',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding item:', error.response?.data?.message || error.message);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3002/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error.response?.data?.message || error.message);
    }
  };

  // Calculate how many days until expiry
  const daysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const exp = new Date(expiryDate);
    const diffTime = exp - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Separate items by status
  const today = new Date();
  const totalItems = items.length;
  const expiringSoonItems = items.filter((item) => {
    const dte = daysUntilExpiry(item.expiryDate);
    return dte > 0 && dte <= 7;
  });
  const expiredItems = items.filter((item) => new Date(item.expiryDate) < today);

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Restaurant Inventory Dashboard</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Food Item
        </button>
      </div>

      {/* Subheader / Intro */}
      <p className="text-gray-600 mb-8">
        Manage your kitchen inventory and track expiry dates.
      </p>

      {/* Main content with a right sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column (main) */}
        <div className="flex-1">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Items */}
            <div className="bg-white rounded shadow p-4">
              <p className="text-gray-500">Total Items</p>
              <h2 className="text-2xl font-bold">{totalItems}</h2>
            </div>
            {/* Expiring Soon */}
            <div className="bg-white rounded shadow p-4">
              <p className="text-gray-500">Expiring Soon</p>
              <h2 className="text-2xl font-bold">{expiringSoonItems.length}</h2>
            </div>
            {/* Expired */}
            <div className="bg-white rounded shadow p-4">
              <p className="text-gray-500">Expired</p>
              <h2 className="text-2xl font-bold">{expiredItems.length}</h2>
            </div>
          </div>

          {/* Expiring Soon List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Expiring Soon</h2>
            <div className="bg-white rounded shadow p-4">
              {expiringSoonItems.length === 0 ? (
                <p className="text-gray-500">No items expiring soon.</p>
              ) : (
                expiringSoonItems.map((item) => {
                  const dte = daysUntilExpiry(item.expiryDate);
                  return (
                    <div
                      key={item._id}
                      className="border-b py-2 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {dte === 1 ? 'Tomorrow' : `${dte} days left`}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">{item.category}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* All items with tabs (All, Expiring Soon, Expired) - for now we just show All */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">All Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item) => {
                const expired = new Date(item.expiryDate) < today;
                const dte = daysUntilExpiry(item.expiryDate);
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded shadow p-4 flex flex-col"
                  >
                    <div className="mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="mb-2">
                      {expired ? (
                        <p className="text-red-500">Expired</p>
                      ) : (
                        <p className="text-gray-500">
                          {dte === 1
                            ? 'Expires Tomorrow'
                            : `Expires in ${dte} days`}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between mt-auto pt-2 border-t">
                      <button
                        onClick={() => alert('Edit feature not implemented yet')}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Inventory Report</li>
              <li>• Voice Scan</li>
              <li>• Scan Barcode</li>
              <li>• Get Meal Suggestions</li>
              <li>• Expired Food Advice</li>
            </ul>
          </div>

          {/* FIFO Reminder */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">FIFO Reminder</h3>
            <p className="text-sm text-gray-600">
              Remember to follow the First-In, First-Out (FIFO) method when
              using stock. Use oldest stock first to minimize waste.
            </p>
          </div>

          {/* Storage Tips */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Storage Tips</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Soak pulses or beans in water for longer shelf life.</li>
              <li>Store spices in airtight containers.</li>
              <li>Keep fresh herbs in a sealed container.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Food Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={newItem.purchaseDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, purchaseDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={newItem.expiryDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, expiryDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    required
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={newItem.notes}
                  onChange={(e) =>
                    setNewItem({ ...newItem, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
