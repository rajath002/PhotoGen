import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Auth from './components/Auth';
import CreatePost from './components/CreatePost';
import { ThemeProvider } from './lib/themeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile/:username" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App