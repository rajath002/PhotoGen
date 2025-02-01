import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { auth, db } from '../lib/mockData';

interface Post {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  likes: number;
  comments: number;
  user_has_liked: boolean;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const posts = await db.getPosts();
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(postId: string) {
    const { user } = auth.getUser();
    if (!user) return;

    try {
      await db.toggleLike(postId, user.id);
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow transition-colors">
          <div className="p-4 flex items-center space-x-3">
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.username}
              className="h-10 w-10 rounded-full"
            />
            <Link
              to={`/profile/${post.profiles.username}`}
              className="font-semibold hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
            >
              {post.profiles.username}
            </Link>
          </div>

          <img
            src={post.image_url}
            alt="Post"
            className="w-full aspect-square object-cover"
          />

          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1 ${
                  post.user_has_liked ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Heart
                  className={`h-6 w-6 ${
                    post.user_has_liked ? 'fill-current' : ''
                  }`}
                />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                <MessageCircle className="h-6 w-6" />
                <span>{post.comments}</span>
              </button>
            </div>

            <p className="dark:text-white">
              <Link
                to={`/profile/${post.profiles.username}`}
                className="font-semibold mr-2 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {post.profiles.username}
              </Link>
              {post.caption}
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}