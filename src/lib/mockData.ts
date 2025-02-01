import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  full_name?: string;
  bio?: string;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

// Mock data store
let users: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'john_doe',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe',
    full_name: 'John Doe',
    bio: 'Photography enthusiast',
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'jane_smith',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith',
    full_name: 'Jane Smith',
    bio: 'Travel lover',
  },
];

let posts: Post[] = [
  {
    id: '1',
    user_id: '1',
    image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    caption: 'Beautiful sunset!',
    created_at: '2024-02-20T12:00:00Z',
  },
  {
    id: '2',
    user_id: '2',
    image_url: 'https://images.unsplash.com/photo-1738250733850-1507b75f5e2d?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'City vibes',
    created_at: '2024-02-21T14:30:00Z',
  },
];

let likes: Like[] = [
  { id: '1', post_id: '1', user_id: '2' },
  { id: '2', post_id: '2', user_id: '1' },
];

let comments: Comment[] = [
  {
    id: '1',
    post_id: '1',
    user_id: '2',
    content: 'Amazing shot!',
    created_at: '2024-02-20T12:30:00Z',
  },
];

// Mock auth state
let currentUser: User | null = null;

// Mock auth functions
export const auth = {
  signUp: async (email: string, password: string, username: string) => {
    const existingUser = users.find(
      (u) => u.email === email || u.username === username
    );
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      email,
      username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    users = [...users, newUser];
    currentUser = newUser;
    return { user: newUser };
  },

  signIn: async (email: string, password: string) => {
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    currentUser = user;
    return { user };
  },

  signOut: async () => {
    currentUser = null;
  },

  getUser: () => {
    return { user: currentUser };
  },
};

// Mock database functions
export const db = {
  // Posts
  getPosts: async () => {
    return posts.map((post) => {
      const user = users.find((u) => u.id === post.user_id)!;
      const postLikes = likes.filter((l) => l.post_id === post.id);
      const postComments = comments.filter((c) => c.post_id === post.id);
      const userHasLiked = currentUser
        ? postLikes.some((l) => l.user_id === currentUser?.id)
        : false;

      return {
        ...post,
        profiles: {
          username: user.username,
          avatar_url: user.avatar_url,
        },
        likes: postLikes.length,
        comments: postComments.length,
        user_has_liked: userHasLiked,
      };
    });
  },

  createPost: async (data: Omit<Post, 'id' | 'created_at'>) => {
    const newPost: Post = {
      ...data,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };
    posts = [...posts, newPost];
    return newPost;
  },

  // Likes
  toggleLike: async (postId: string, userId: string) => {
    const existingLike = likes.find(
      (l) => l.post_id === postId && l.user_id === userId
    );

    if (existingLike) {
      likes = likes.filter((l) => l.id !== existingLike.id);
    } else {
      const newLike: Like = {
        id: uuidv4(),
        post_id: postId,
        user_id: userId,
      };
      likes = [...likes, newLike];
    }
  },

  // Profiles
  getProfile: async (username: string) => {
    const user = users.find((u) => u.username === username);
    if (!user) return null;

    const userPosts = posts
      .filter((p) => p.user_id === user.id)
      .map((post) => {
        const postLikes = likes.filter((l) => l.post_id === post.id);
        const postComments = comments.filter((c) => c.post_id === post.id);

        return {
          ...post,
          likes: postLikes.length,
          comments: postComments.length,
        };
      });

    return {
      ...user,
      posts: userPosts,
    };
  },
};