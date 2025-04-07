import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import HomeDashboard from './pages/HomeDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import InventoryReport from "./pages/InventoryReport";
import Inventory from "./pages/Inventory";
import VoiceScan from "./pages/VoiceScan";
import BarcodeScan from "./pages/BarcodeScan";
import GroceryList from "./pages/GroceryList";
import MealSuggestion from "./pages/MealSuggestion";
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/home" element={<HomeDashboard />} />
          <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />        
          <Route path="/home" element={<Login />} />
          <Route path="/restaurant" element={<Login />} />
          <Route path="/inventory-report" element={<InventoryReport />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/voice-scan" element={<VoiceScan />} />
        <Route path="/barcode-scan" element={<BarcodeScan />} />
        <Route path="/grocery-list" element={<GroceryList />} />
        <Route path="/meal-suggestion" element={<MealSuggestion />} />
        <Route path="/profile" element={<Profile />} />
        
        
        
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
