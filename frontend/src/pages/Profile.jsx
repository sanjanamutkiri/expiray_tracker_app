import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: '',
          role: response.data.role // Role added here
        });
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data?.message || err.message);
        setMsg('Failed to load profile. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
    else {
      setMsg('Not authorized. Please login.');
      setLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/users/profile', {
        name: formData.name,
        email: formData.email,
        password: formData.password
        // Do not send role — it's read-only
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMsg(response.data.message || 'Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err.response?.data?.message || err.message);
      setMsg('Failed to update profile.');
    }
  };

  if (loading) return <div className="p-6 dark:text-white">Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">👤 Your Profile</h2>

      {msg && <div className="mb-4 text-blue-600 dark:text-blue-400 font-medium">{msg}</div>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Password (optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            readOnly
            className="w-full border px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
