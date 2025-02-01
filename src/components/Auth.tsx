import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/mockData';
import { Camera } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await auth.signUp(email, password, username);
      } else {
        await auth.signIn(email, password);
      }
      navigate('/');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors">
        <div className="text-center">
          <Camera className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400"
                placeholder="Email address"
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400"
                  placeholder="Username"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 disabled:opacity-50"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}