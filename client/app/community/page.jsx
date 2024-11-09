"use client";

import { useState } from 'react';
import { Plus, Globe, Image, Video, MessageCircle } from 'lucide-react';

function TwitterFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Elon Musk',
      userTag: '@elonmusk',
      time: '8h',
      content: 'YES!',
      image: '/path/to/image.jpg',
      likes: '16K',
      retweets: '76K',
      views: '32M',
    },
    {
      id: 2,
      user: 'non aesthetic things 😳',
      userTag: '@PicturesFolder',
      time: '15h',
      content: "Who's gonna tell him",
      image: '/path/to/another-image.jpg',
      likes: '5K',
      retweets: '10K',
      views: '12M',
    },
  ]);

  const [newPost, setNewPost] = useState({
    content: '',
    image: null,
  });

  const handleContentChange = (e) => {
    setNewPost({ ...newPost, content: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewPost({ ...newPost, image: URL.createObjectURL(e.target.files[0]) });
  };

  const handlePost = () => {
    if (newPost.content || newPost.image) {
      const post = {
        id: posts.length + 1,
        user: 'Current User',
        userTag: '@currentuser',
        time: 'Now',
        content: newPost.content,
        image: newPost.image,
        likes: '0',
        retweets: '0',
        views: '0',
      };
      setPosts([post, ...posts]);
      setNewPost({ content: '', image: null });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Create Post Section */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 space-y-4">
        <h1 className="text-xl font-bold">What is happening?!</h1>
        <textarea
          className="w-full bg-gray-700 p-2 rounded-md text-white focus:outline-none"
          rows="3"
          placeholder="What's on your mind?"
          value={newPost.content}
          onChange={handleContentChange}
        />
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-gray-400 cursor-pointer">
            <Image className="w-5 h-5 mr-1" />
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <button
            onClick={handlePost}
            className="bg-blue-600 px-4 py-2 rounded-full text-white"
          >
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="p-4 space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border border-gray-700 rounded-lg p-4">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img src="/path/to/profile-pic.jpg" alt="User" className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-semibold">{post.user}</p>
                  <p className="text-gray-400 text-sm">{post.userTag} • {post.time}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">...</button>
            </div>

            {/* Post Content */}
            <p className="mb-4">{post.content}</p>
            {post.image && <img src={post.image} alt="Post" className="w-full rounded-lg mb-4" />}

            {/* Post Actions */}
            <div className="flex justify-between text-gray-400">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>{post.retweets}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TwitterFeed;
