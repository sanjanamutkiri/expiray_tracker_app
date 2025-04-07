import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MealSuggestion() {
  const [inventory, setInventory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const meals = [
    {
      name: "Vegetable Stir Fry",
      ingredients: ["carrot", "capsicum", "onion", "garlic"],
      duration: "15 mins",
    },
    {
      name: "Masala Omelette",
      ingredients: ["egg", "onion", "tomato", "chilli"],
      duration: "10 mins",
    },
    {
      name: "Fruit Salad",
      ingredients: ["apple", "banana", "orange", "grapes"],
      duration: "5 mins",
    },
    {
      name: "Rice and Dal",
      ingredients: ["rice", "dal", "turmeric", "salt"],
      duration: "30 mins",
    },
    {
      name: "Sandwich",
      ingredients: ["bread", "butter", "tomato", "lettuce"],
      duration: "10 mins",
    }
  ];

  const daysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const exp = new Date(expiryDate);
    const diffTime = exp - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3002/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usableItems = res.data.filter(item => daysUntilExpiry(item.expiryDate) >= 0 && item.quantity > 0);
        setInventory(usableItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory for meal suggestions", error.message);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    const availableItems = inventory.map(item => item.name.toLowerCase());
    
    const matchedMeals = meals.filter(meal =>
      meal.ingredients.every(ing => availableItems.includes(ing))
    );

    setSuggestions(matchedMeals);
  }, [inventory]);

  if (loading) {
    return <div className="p-8">Loading meal suggestions...</div>;
  }

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🍽️ Meal Suggestions Based on Inventory</h1>

      {suggestions.length === 0 ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          No complete meal matches found. Try restocking some essential items.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((meal, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h2 className="text-lg font-semibold mb-2">{meal.name}</h2>
              <p className="text-sm text-gray-600">Preparation Time: {meal.duration}</p>
              <div className="mt-2">
                <h3 className="text-sm font-medium mb-1">Required Ingredients:</h3>
                <ul className="text-sm list-disc list-inside text-gray-700">
                  {meal.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        Suggestions are based on currently available and non-expired ingredients.
      </div>
    </div>
  );
}
