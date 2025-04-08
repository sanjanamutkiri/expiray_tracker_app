import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './pages/Footer';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// 📄 Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HomeDashboard from './pages/HomeDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import InventoryReport from './pages/InventoryReport';
import Inventory from './pages/Inventory';
import VoiceScan from './pages/VoiceScan';
import BarcodeScan from './pages/BarcodeScan';
import GroceryList from './pages/GroceryList';
import MealSuggestion from './pages/MealSuggestion';
import Profile from './pages/Profile';

// 📌 Static Info Pages
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ✅ Toast messages styled for dark mode compatibility */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#1f2937', // Tailwind's gray-800
              color: '#f3f4f6',      // Tailwind's gray-100
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e', // Tailwind's green-500
                secondary: '#f3f4f6',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // Tailwind's red-500
                secondary: '#f3f4f6',
              },
            },
          }}
        />

        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* 🔐 Authentication */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* 🏠 Dashboards */}
              <Route path="/dashboard/home" element={<HomeDashboard />} />
              <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
              <Route path="/home" element={<Login />} />
              <Route path="/restaurant" element={<Login />} />

              {/* 📦 Tools & Inventory */}
              <Route path="/inventory-report" element={<InventoryReport />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/voice-scan" element={<VoiceScan />} />
              <Route path="/barcode-scan" element={<BarcodeScan />} />
              <Route path="/grocery-list" element={<GroceryList />} />
              <Route path="/meal-suggestion" element={<MealSuggestion />} />

              {/* 👤 User Profile */}
              <Route path="/profile" element={<Profile />} />

              {/* 📘 Static Info */}
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
