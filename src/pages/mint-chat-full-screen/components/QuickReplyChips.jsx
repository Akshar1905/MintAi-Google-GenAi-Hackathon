import React from 'react';
import Button from '../../../components/ui/Button';


const QuickReplyChips = ({ onQuickReply, disabled = false }) => {
  const quickReplies = [
    {
      id: 1,
      text: "Feeling Anxious",
      icon: "Heart",
      message: "I\'m feeling anxious right now and could use some support."
    },
    {
      id: 2,
      text: "Need Motivation",
      icon: "Zap",
      message: "I need some motivation to get through today."
    },
    {
      id: 3,
      text: "Daily Check-in",
      icon: "Calendar",
      message: "I'd like to do my daily wellness check-in."
    },
    {
      id: 4,
      text: "Breathing Exercise",
      icon: "Wind",
      message: "Can you guide me through a breathing exercise?"
    },
    {
      id: 5,
      text: "Gratitude Practice",
      icon: "Star",
      message: "I want to practice gratitude today."
    },
    {
      id: 6,
      text: "Sleep Help",
      icon: "Moon",
      message: "I\'m having trouble sleeping. Can you help?"
    }
  ];

  const handleChipClick = (reply) => {
    if (!disabled && onQuickReply) {
      onQuickReply(reply?.message);
    }
  };

  return (
    <div className="px-4 py-2 border-t border-border bg-muted/30">
      <div className="flex flex-wrap gap-2 max-w-4xl mx-auto">
        {quickReplies?.map((reply) => (
          <Button
            key={reply?.id}
            variant="outline"
            size="sm"
            onClick={() => handleChipClick(reply)}
            disabled={disabled}
            iconName={reply?.icon}
            iconPosition="left"
            iconSize={14}
            className="text-xs font-caption whitespace-nowrap transition-spring hover:scale-105 active:scale-95"
          >
            {reply?.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplyChips;