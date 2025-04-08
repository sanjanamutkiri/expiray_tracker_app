import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm py-4 border-b dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center text-primary font-bold text-2xl dark:text-white">
          <span className="text-primary-dark">🥗</span> FoodWise
        </Link>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl px-2 py-1 rounded transition-colors dark:text-yellow-300 text-gray-700"
            title="Toggle Theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="px-4 py-2 rounded hover:underline text-gray-700 dark:text-white">Profile</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
