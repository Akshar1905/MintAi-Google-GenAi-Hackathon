import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const CommunityHeader = ({ currentUser }) => {
  const [joined, setJoined] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('mintai.community.joined')||'false'); } catch { return false; }
  });
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  const toggleJoin = () => {
    const next = !joined;
    setJoined(next);
    localStorage.setItem('mintai.community.joined', JSON.stringify(next));
  };

  const createPost = () => {
    if (!text.trim()) return;
    const posts = JSON.parse(localStorage.getItem('mintai.community.posts') || '[]');
    posts.unshift({ id: crypto.randomUUID(), author: currentUser?.name || 'You', content: text.trim(), timestamp: new Date().toISOString() });
    localStorage.setItem('mintai.community.posts', JSON.stringify(posts));
    setText('');
    setComposerOpen(false);
    alert('Post created (local)');
  };
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-accent via-secondary to-primary rounded-full flex items-center justify-center shadow-neumorphic-md">
            <Icon name="Users" size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Community Hub
        </h1>
        
        <p className="text-muted-foreground font-body mb-6">
          Connect, support, and grow together on your wellness journey
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-secondary/10 backdrop-blur-sm rounded-full px-4 py-2 border border-accent/20">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">
              {currentUser?.communityLevel || 'Member'}
            </span>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-primary/10 backdrop-blur-sm rounded-full px-4 py-2 border border-secondary/20">
            <Icon name="Heart" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">
              {currentUser?.supportGiven || 0} Support Given
            </span>
          </div>
        </div>

        <motion.button
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full font-medium text-sm shadow-neumorphic-md transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setComposerOpen(true)}
        >
          <Icon name="Plus" size={16} />
          Create Post
        </motion.button>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button onClick={toggleJoin} className={`px-4 py-2 rounded-full text-sm border ${joined ? 'bg-secondary text-secondary-foreground' : 'bg-card text-foreground'}`}>
            {joined ? 'Joined' : 'Join Community'}
          </button>
        </div>

        {composerOpen && (
          <div className="max-w-xl mx-auto mt-6 bg-card border border-border rounded-xl p-4 shadow-neumorphic">
            <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={4} placeholder="Share your experience..." className="w-full text-sm bg-input border border-border rounded-md px-3 py-2 outline-none" />
            <div className="mt-2 flex items-center gap-2 justify-end">
              <button onClick={()=>setComposerOpen(false)} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">Cancel</button>
              <button onClick={createPost} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">Post</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommunityHeader;