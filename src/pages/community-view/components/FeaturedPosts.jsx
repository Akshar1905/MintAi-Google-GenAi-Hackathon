import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeaturedPosts = () => {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());

  const posts = [
    {
      id: 'post1',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        level: 'Wellness Warrior',
        verified: true
      },
      content: "Just completed my 30-day meditation streak! 🧘‍♀️ The journey wasn't easy, but each day I felt more centered and peaceful. For anyone starting their mindfulness journey, remember that consistency matters more than perfection. Even 5 minutes counts! #MeditationJourney #Mindfulness",
      timestamp: '2 hours ago',
      category: 'Achievement',
      likes: 47,
      comments: 12,
      supports: 8,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
    },
    {
      id: 'post2',
      author: {
        name: 'Marcus Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        level: 'Community Helper',
        verified: false
      },
      content: "Sharing some tips that helped me overcome anxiety during social situations: 1) Deep breathing before entering 2) Having a trusted friend nearby 3) Preparing conversation topics 4) Giving myself permission to leave if needed. You're not alone in this journey! 💙",
      timestamp: '5 hours ago',
      category: 'Support',
      likes: 89,
      comments: 23,
      supports: 31
    },
    {
      id: 'post3',
      author: {
        name: 'Emma Watson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        level: 'Mindful Parent',
        verified: true
      },
      content: "Today I want to talk about something that's been on my mind - the importance of self-compassion. We're often our harshest critics. What if we spoke to ourselves with the same kindness we show our best friends? It's a practice that has transformed my relationship with myself. 🌱✨",
      timestamp: '1 day ago',
      category: 'Reflection',
      likes: 156,
      comments: 34,
      supports: 67,
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=200&fit=crop'
    }
  ];

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts?.has(postId)) {
      newLikedPosts?.delete(postId);
    } else {
      newLikedPosts?.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleSave = (postId) => {
    const newSavedPosts = new Set(savedPosts);
    if (newSavedPosts?.has(postId)) {
      newSavedPosts?.delete(postId);
    } else {
      newSavedPosts?.add(postId);
    }
    setSavedPosts(newSavedPosts);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Achievement': 'bg-green-100 text-green-700 border-green-200',
      'Support': 'bg-blue-100 text-blue-700 border-blue-200',
      'Reflection': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Featured Community Posts
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          Inspiring stories and support from our wellness community
        </p>
      </div>
      <div className="space-y-6">
        {posts?.map((post, index) => (
          <motion.article
            key={post?.id}
            className="bg-card rounded-2xl p-6 shadow-neumorphic border border-border backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ y: -2 }}
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <img
                  src={post?.author?.avatar}
                  alt={post?.author?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-foreground">
                      {post?.author?.name}
                    </h3>
                    {post?.author?.verified && (
                      <Icon name="CheckCircle" size={16} className="text-accent" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {post?.author?.level} • {post?.timestamp}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post?.category)}`}>
                  {post?.category}
                </span>
                <button
                  onClick={() => handleSave(post?.id)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <Icon 
                    name="Bookmark" 
                    size={16} 
                    className={savedPosts?.has(post?.id) ? 'text-accent' : 'text-muted-foreground'}
                  />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-foreground font-body leading-relaxed">
                {post?.content}
              </p>
              
              {post?.image && (
                <div className="mt-4 rounded-xl overflow-hidden">
                  <img
                    src={post?.image}
                    alt="Post content"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-6">
                <motion.button
                  onClick={() => handleLike(post?.id)}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon 
                    name="Heart" 
                    size={18} 
                    className={likedPosts?.has(post?.id) ? 'text-pink-500 fill-current' : 'text-muted-foreground'}
                  />
                  <span className={likedPosts?.has(post?.id) ? 'text-pink-500' : 'text-muted-foreground'}>
                    {post?.likes + (likedPosts?.has(post?.id) ? 1 : 0)}
                  </span>
                </motion.button>

                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="MessageCircle" size={18} />
                  <span>{post?.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                  <Icon name="Users" size={18} />
                  <span>{post?.supports}</span>
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 hover:bg-accent/20 text-accent font-medium text-sm transition-colors">
                <Icon name="MessageSquare" size={16} />
                Support
              </button>
            </div>
          </motion.article>
        ))}
      </div>
      {/* Load More Button */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card hover:bg-muted border border-border text-foreground font-medium transition-all duration-300 shadow-neumorphic">
          <Icon name="RefreshCw" size={16} />
          Load More Posts
        </button>
      </motion.div>
    </div>
  );
};

export default FeaturedPosts;