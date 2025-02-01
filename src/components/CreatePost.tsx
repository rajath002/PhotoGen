import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/mockData';
import { Upload } from 'lucide-react';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) return;

    setLoading(true);

    try {
      const { user } = auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await db.createPost({
        user_id: user.id,
        image_url: imageUrl,
        caption,
      });

      navigate('/');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors">
      <div className="p-8">
        <div className="flex items-center justify-center mb-6">
          <Upload className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Create New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400"
              placeholder="Enter image URL..."
            />
          </div>

          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Caption
            </label>
            <textarea
              id="caption"
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400"
              placeholder="Write a caption..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !imageUrl}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}