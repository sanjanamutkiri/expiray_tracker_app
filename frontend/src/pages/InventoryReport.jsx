import React, { useEffect, useState } from "react";
import axios from 'axios';

export default function InventoryReport() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate how many days left until expiry
  const daysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const exp = new Date(expiryDate);
    const diffTime = exp - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status based on expiry date
  const getItemStatus = (expiryDate) => {
    const days = daysUntilExpiry(expiryDate);
    if (days < 0) return "Expired";
    if (days <= 3) return "Expiring Soon";
    return "Good";
  };

  // Format data for the report
  const formatInventoryData = (items) => {
    return items.map(item => ({
      name: item.name,
      category: item.category,
      quantity: `${item.quantity} ${item.unit}`,
      expiry: new Date(item.expiryDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      status: getItemStatus(item.expiryDate),
      price: item.price || 'N/A' // Add price if available
    }));
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3002/api/items', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setInventoryData(formatInventoryData(res.data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error.response?.data?.message || error.message);
        setError('Failed to load inventory data');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent" role="status"></div>
          <p className="mt-2">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate insights
  const expiringItems = inventoryData.filter(item => item.status === "Expiring Soon");
  const expiredItems = inventoryData.filter(item => item.status === "Expired");
  
  // Get the lowest quantity item that's not expired
  const sortedByQuantity = [...inventoryData]
    .filter(item => item.status !== "Expired")
    .sort((a, b) => {
      const qtyA = parseFloat(a.quantity.split(' ')[0]);
      const qtyB = parseFloat(b.quantity.split(' ')[0]);
      return qtyA - qtyB;
    });
  
  const lowestStockItem = sortedByQuantity.length > 0 ? sortedByQuantity[0] : null;

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Report</h1>
        <button
          onClick={printReport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Inventory Summary</h2>
        {inventoryData.length === 0 ? (
          <p className="text-gray-500">No inventory items found.</p>
        ) : (
          <table className="w-full text-left border-t border-b">
            <thead className="border-b">
              <tr>
                <th className="py-2">Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2">{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <span className={`px-2 py-1 text-sm rounded ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-4 text-sm text-gray-500">Total Items: {inventoryData.length}</p>
        <p className="text-xs text-gray-400">Report generated by FoodWise</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Inventory Insights</h2>
        <div className="space-y-3">
          {lowestStockItem && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm font-medium text-yellow-800">
                Low Stock Alert: <br />
                {lowestStockItem.name} ({lowestStockItem.quantity}) is running low
                {lowestStockItem.status === "Expiring Soon" ? " and expires soon" : ""}.
              </p>
            </div>
          )}
          
          {expiringItems.length > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <p className="text-sm font-medium text-orange-800">
                Expiring Soon: <br />
                {expiringItems.length} item(s) will expire soon. Priority use recommended.
              </p>
            </div>
          )}

          {expiredItems.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm font-medium text-red-800">
                Expired Items: <br />
                {expiredItems.length} item(s) have expired and should be removed.
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm font-medium text-blue-800">
              Category Distribution: <br />
              {(() => {
                const categories = {};
                inventoryData.forEach(item => {
                  categories[item.category] = (categories[item.category] || 0) + 1;
                });
                
                const topCategory = Object.entries(categories)
                  .sort((a, b) => b[1] - a[1])[0];
                
                return topCategory 
                  ? `${topCategory[0]} items make up the largest portion of your inventory (${topCategory[1]} items).`
                  : 'No category data available.';
              })()}
            </p>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-sm font-medium text-green-800">
              Cost Saving: <br />
              Consider bulk purchasing of frequently used items to reduce costs by up to 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}