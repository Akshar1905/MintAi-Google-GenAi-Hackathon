import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const UpcomingEvents = () => {
  const [rsvpEvents, setRsvpEvents] = useState(new Set(['group-meditation']));

  const events = [
    {
      id: 'group-meditation',
      title: 'Group Meditation Session',
      description: 'Join us for a guided mindfulness meditation session focused on stress relief and inner peace',
      date: '2024-12-18',
      time: '7:00 PM',
      duration: '45 minutes',
      host: {
        name: 'Dr. Sarah Mitchell',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        credentials: 'Mindfulness Coach'
      },
      participants: 67,
      maxParticipants: 100,
      type: 'Virtual',
      category: 'Meditation',
      icon: 'Brain',
      bgGradient: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      difficulty: 'Beginner Friendly',
      tags: ['Meditation', 'Stress Relief', 'Mindfulness']
    },
    {
      id: 'mindful-monday',
      title: 'Mindful Monday Check-in',
      description: 'Weekly community check-in where we share our wellness goals and support each other',
      date: '2024-12-23',
      time: '6:30 PM',
      duration: '60 minutes',
      host: {
        name: 'Community Moderators',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        credentials: 'MintAi Team'
      },
      participants: 124,
      maxParticipants: 200,
      type: 'Virtual',
      category: 'Community',
      icon: 'Users',
      bgGradient: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      difficulty: 'All Levels',
      tags: ['Community', 'Goals', 'Support', 'Weekly']
    },
    {
      id: 'sleep-workshop',
      title: 'Sleep Hygiene Workshop',
      description: 'Learn evidence-based techniques for better sleep quality and establishing healthy bedtime routines',
      date: '2024-12-20',
      time: '8:00 PM',
      duration: '90 minutes',
      host: {
        name: 'Dr. Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        credentials: 'Sleep Specialist'
      },
      participants: 43,
      maxParticipants: 75,
      type: 'Virtual',
      category: 'Workshop',
      icon: 'Moon',
      bgGradient: 'bg-gradient-to-br from-indigo-100 to-slate-200',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      difficulty: 'All Levels',
      tags: ['Sleep', 'Health', 'Routine', 'Workshop']
    },
    {
      id: 'stress-management',
      title: 'Stress Management Masterclass',
      description: 'Comprehensive workshop on identifying stress triggers and developing effective coping strategies',
      date: '2024-12-22',
      time: '2:00 PM',
      duration: '2 hours',
      host: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        credentials: 'Licensed Therapist'
      },
      participants: 89,
      maxParticipants: 150,
      type: 'Virtual',
      category: 'Workshop',
      icon: 'Shield',
      bgGradient: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      difficulty: 'Intermediate',
      tags: ['Stress', 'Coping', 'Management', 'Therapy']
    },
    {
      id: 'live-support',
      title: 'Live Support Session',
      description: 'Open forum for sharing experiences and receiving peer support in a safe, moderated environment',
      date: '2024-12-21',
      time: '7:30 PM',
      duration: '75 minutes',
      host: {
        name: 'Support Team',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
        credentials: 'Peer Counselors'
      },
      participants: 156,
      maxParticipants: 250,
      type: 'Virtual',
      category: 'Support',
      icon: 'Heart',
      bgGradient: 'bg-gradient-to-br from-pink-100 to-rose-200',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-200',
      difficulty: 'All Levels',
      tags: ['Support', 'Community', 'Sharing', 'Peer Help']
    },
    {
      id: 'art-therapy',
      title: 'Creative Art Therapy Session',
      description: 'Express emotions and process feelings through guided art therapy exercises',
      date: '2024-12-25',
      time: '3:00 PM',
      duration: '2 hours',
      host: {
        name: 'Jordan Kim',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face',
        credentials: 'Art Therapist'
      },
      participants: 34,
      maxParticipants: 60,
      type: 'Virtual',
      category: 'Therapy',
      icon: 'Palette',
      bgGradient: 'bg-gradient-to-br from-teal-100 to-cyan-200',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      difficulty: 'All Levels',
      tags: ['Art', 'Therapy', 'Expression', 'Creativity']
    }
  ];

  const handleRSVP = (eventId) => {
    const newRsvpEvents = new Set(rsvpEvents);
    if (newRsvpEvents?.has(eventId)) {
      newRsvpEvents?.delete(eventId);
    } else {
      newRsvpEvents?.add(eventId);
    }
    setRsvpEvents(newRsvpEvents);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getParticipationPercentage = (participants, maxParticipants) => {
    return Math.round((participants / maxParticipants) * 100);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Upcoming Events
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          Join live sessions, workshops, and community gatherings
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events?.map((event, index) => (
          <motion.div
            key={event?.id}
            className={`${event?.bgGradient} rounded-2xl p-6 shadow-neumorphic border ${event?.borderColor} backdrop-blur-sm relative overflow-hidden`}
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
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon 
                      name={event?.icon} 
                      size={24} 
                      className={event?.iconColor}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">
                      {event?.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground bg-white/40 rounded-full px-2 py-1">
                        {event?.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {event?.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleRSVP(event?.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    rsvpEvents?.has(event?.id)
                      ? 'bg-white/60 text-green-600' :'bg-white/80 hover:bg-white text-foreground shadow-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {rsvpEvents?.has(event?.id) ? 'RSVP\'d' : 'RSVP'}
                </motion.button>
              </div>

              {/* Event Description */}
              <p className="text-sm font-body text-muted-foreground mb-4 leading-relaxed">
                {event?.description}
              </p>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(event?.date)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {event?.time} ({event?.duration})
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {event?.difficulty}
                  </span>
                </div>
              </div>

              {/* Host Information */}
              <div className="bg-white/40 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={event?.host?.avatar}
                    alt={event?.host?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {event?.host?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event?.host?.credentials}
                    </p>
                  </div>
                </div>
              </div>

              {/* Participation Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {event?.participants} / {event?.maxParticipants} participants
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {getParticipationPercentage(event?.participants, event?.maxParticipants)}%
                  </span>
                </div>
                <div className="w-full bg-white/40 rounded-full h-2">
                  <div
                    className="bg-accent rounded-full h-2 transition-all duration-300"
                    style={{ 
                      width: `${getParticipationPercentage(event?.participants, event?.maxParticipants)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {event?.tags?.slice(0, 3)?.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs bg-white/40 text-muted-foreground px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {event?.tags?.length > 3 && (
                  <span className="text-xs bg-white/40 text-muted-foreground px-2 py-1 rounded-full">
                    +{event?.tags?.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Create Event Button */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent/90 text-white font-medium transition-all duration-300 shadow-neumorphic-md">
          <Icon name="Plus" size={16} />
          Host an Event
        </button>
      </motion.div>
    </div>
  );
};

export default UpcomingEvents;