import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SupportGroups = () => {
  const [joinedGroups, setJoinedGroups] = useState(new Set(['anxiety-support']));

  const supportGroups = [
    {
      id: 'anxiety-support',
      name: 'Anxiety Support Circle',
      description: 'A safe space to share experiences and coping strategies for anxiety management',
      members: 456,
      activeToday: 23,
      category: 'Mental Health',
      icon: 'Shield',
      bgGradient: 'bg-gradient-to-br from-blue-100 to-indigo-200',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      recentActivity: 'Sarah shared a breathing technique 2 hours ago',
      isPrivate: false,
      tags: ['Anxiety', 'Coping', 'Support', 'Mindfulness']
    },
    {
      id: 'depression-warriors',
      name: 'Depression Warriors',
      description: 'Community for those fighting depression, sharing hope and healing together',
      members: 234,
      activeToday: 18,
      category: 'Mental Health',
      icon: 'Sun',
      bgGradient: 'bg-gradient-to-br from-yellow-100 to-orange-200',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      recentActivity: 'Marcus posted daily affirmations 1 hour ago',
      isPrivate: true,
      tags: ['Depression', 'Hope', 'Recovery', 'Community']
    },
    {
      id: 'mindful-parents',
      name: 'Mindful Parents',
      description: 'Supporting parents in raising children with mindfulness and emotional intelligence',
      members: 189,
      activeToday: 12,
      category: 'Parenting',
      icon: 'Heart',
      bgGradient: 'bg-gradient-to-br from-pink-100 to-rose-200',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-200',
      recentActivity: 'Emma shared parenting tips 3 hours ago',
      isPrivate: false,
      tags: ['Parenting', 'Mindfulness', 'Children', 'Family']
    },
    {
      id: 'student-wellness',
      name: 'Student Wellness',
      description: 'Mental health support specifically designed for students facing academic pressure',
      members: 567,
      activeToday: 34,
      category: 'Education',
      icon: 'BookOpen',
      bgGradient: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      recentActivity: 'Alex posted study stress management tips 30 minutes ago',
      isPrivate: false,
      tags: ['Students', 'Academic Stress', 'Study Tips', 'Wellness']
    },
    {
      id: 'workplace-wellness',
      name: 'Workplace Wellness',
      description: 'Navigating mental health in professional environments and work-life balance',
      members: 342,
      activeToday: 19,
      category: 'Professional',
      icon: 'Briefcase',
      bgGradient: 'bg-gradient-to-br from-purple-100 to-violet-200',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      recentActivity: 'Lisa shared burnout prevention strategies 4 hours ago',
      isPrivate: false,
      tags: ['Work Stress', 'Burnout', 'Professional', 'Balance']
    },
    {
      id: 'creative-healing',
      name: 'Creative Healing',
      description: 'Using art, music, and creativity as tools for mental health and self-expression',
      members: 178,
      activeToday: 15,
      category: 'Creative',
      icon: 'Palette',
      bgGradient: 'bg-gradient-to-br from-teal-100 to-cyan-200',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      recentActivity: 'Jordan shared art therapy exercises 2 hours ago',
      isPrivate: false,
      tags: ['Art Therapy', 'Music', 'Creativity', 'Expression']
    }
  ];

  const handleGroupJoin = (groupId) => {
    const newJoinedGroups = new Set(joinedGroups);
    if (newJoinedGroups?.has(groupId)) {
      newJoinedGroups?.delete(groupId);
    } else {
      newJoinedGroups?.add(groupId);
    }
    setJoinedGroups(newJoinedGroups);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Support Groups
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          Find your community and connect with others on similar journeys
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportGroups?.map((group, index) => (
          <motion.div
            key={group?.id}
            className={`${group?.bgGradient} rounded-2xl p-6 shadow-neumorphic border ${group?.borderColor} backdrop-blur-sm relative overflow-hidden`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
            
            <div className="relative z-10">
              {/* Group Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon 
                      name={group?.icon} 
                      size={24} 
                      className={group?.iconColor}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-foreground">
                        {group?.name}
                      </h3>
                      {group?.isPrivate && (
                        <Icon name="Lock" size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground bg-white/40 rounded-full px-2 py-1">
                      {group?.category}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleGroupJoin(group?.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    joinedGroups?.has(group?.id)
                      ? 'bg-white/60 text-muted-foreground'
                      : 'bg-white/80 hover:bg-white text-foreground shadow-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {joinedGroups?.has(group?.id) ? 'Joined' : 'Join'}
                </motion.button>
              </div>

              {/* Group Description */}
              <p className="text-sm font-body text-muted-foreground mb-4 leading-relaxed">
                {group?.description}
              </p>

              {/* Group Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Icon name="Users" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {group?.members} members
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Icon name="Activity" size={16} className="text-green-500" />
                  <span className="text-sm font-medium text-foreground">
                    {group?.activeToday} active today
                  </span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/40 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Icon name="MessageCircle" size={14} className="text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {group?.recentActivity}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {group?.tags?.slice(0, 3)?.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs bg-white/40 text-muted-foreground px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {group?.tags?.length > 3 && (
                  <span className="text-xs bg-white/40 text-muted-foreground px-2 py-1 rounded-full">
                    +{group?.tags?.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Create New Group Button */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent/90 text-white font-medium transition-all duration-300 shadow-neumorphic-md">
          <Icon name="Plus" size={16} />
          Create Support Group
        </button>
      </motion.div>
    </div>
  );
};

export default SupportGroups;