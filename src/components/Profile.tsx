import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../lib/mockData';
import { Grid } from 'lucide-react';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  posts: {
    id: string;
    image_url: string;
    likes: number;
    comments: number;
  }[];
}

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    try {
      if (!username) return;
      
      if (username === 'me') {
        const { user } = auth.getUser();
        if (!user) return;
        const data = await db.getProfile(user.username);
        setProfile(data);
      } else {
        const data = await db.getProfile(username);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors">
        <div className="flex items-center space-x-6">
          <img
            src={profile.avatar_url}
            alt={profile.username}
            className="h-24 w-24 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
            {profile.full_name && (
              <p className="text-gray-600 dark:text-gray-300">{profile.full_name}</p>
            )}
            {profile.bio && <p className="mt-2 text-gray-700 dark:text-gray-200">{profile.bio}</p>}
            <div className="mt-4 flex space-x-4">
              <div>
                <span className="font-bold text-gray-900 dark:text-white">{profile.posts.length}</span>{' '}
                <span className="text-gray-600 dark:text-gray-300">posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors">
        <div className="flex items-center space-x-2 mb-6">
          <Grid className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Posts</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {profile.posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square relative group cursor-pointer"
            >
              <img
                src={post.image_url}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-4 text-white rounded-lg">
                <div className="flex items-center">
                  <span className="font-semibold">{post.likes}</span>
                  <span className="ml-1">likes</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">{post.comments}</span>
                  <span className="ml-1">comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}