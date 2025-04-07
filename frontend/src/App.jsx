import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import HomeDashboard from './pages/HomeDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';


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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
