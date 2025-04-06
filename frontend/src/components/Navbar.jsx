import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center text-primary font-bold text-2xl">
          <span className="text-primary-dark">🥗</span> FoodWise
        </Link>

        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="px-4 py-2 rounded hover:underline text-gray-700">Profile</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
