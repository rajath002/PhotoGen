import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/mockData';
import { Camera, PlusSquare, User, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/themeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    await auth.signOut();
    navigate('/auth');
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">PhotoGen</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </button>
            <Link
              to="/create"
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Create Post"
            >
              <PlusSquare className="h-6 w-6" />
            </Link>
            <Link
              to="/profile/me"
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Profile"
            >
              <User className="h-6 w-6" />
            </Link>
            <button
              onClick={handleSignOut}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Sign Out"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}