'use client';

import React from 'react';

export type ActivityType = 'commit' | 'build' | 'alert' | 'system';

export interface Activity {
  id: string;
  timestamp: string;
  type: ActivityType;
  message: React.ReactNode;
}

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => {
  const typeConfig = {
    commit: {
      color: 'bg-pixel-blue',
      borderColor: 'border-pixel-blue/30',
    },
    build: {
      color: 'bg-pixel-green',
      borderColor: 'border-pixel-green/30',
    },
    alert: {
      color: 'bg-pixel-red',
      borderColor: 'border-pixel-red/30',
    },
    system: {
      color: 'bg-pixel-gray',
      borderColor: 'border-pixel-gray/30',
    },
  };

  const config = typeConfig[activity.type];

  return (
    <div className={`relative pl-6 ${!isLast ? 'pb-6 border-l-2 ' + config.borderColor : ''}`}>
      <div className={`absolute -left-[5px] top-0 w-2 h-2 ${config.color} border border-black`} />
      <p className="text-[10px] text-pixel-gray pixel-text mb-1">
        {activity.timestamp}
      </p>
      <div className="text-sm text-pixel-light">
        {activity.message}
      </div>
    </div>
  );
};

// Mock activity data
const mockActivities: Activity[] = [
  {
    id: '1',
    timestamp: '14:20:05',
    type: 'commit',
    message: (
      <>
        User <span className="text-pixel-blue">CYBER_PUNK</span> pushed 3 commits to{' '}
        <span className="text-pixel-green">main_engine</span>
      </>
    ),
  },
  {
    id: '2',
    timestamp: '13:45:12',
    type: 'build',
    message: (
      <>
        Automated Build <span className="text-pixel-green">#882</span> completed successfully.
      </>
    ),
  },
  {
    id: '3',
    timestamp: '12:10:33',
    type: 'alert',
    message: (
      <>
        Alert: <span className="text-pixel-red">OXYGEN_LOW</span> - Emergency patch deployed by BOT_01
      </>
    ),
  },
  {
    id: '4',
    timestamp: '10:00:00',
    type: 'system',
    message: 'System Daily Reboot Cycle initiated.',
  },
  {
    id: '5',
    timestamp: '09:15:22',
    type: 'commit',
    message: (
      <>
        User <span className="text-pixel-blue">WUT</span> merged PR #42 to{' '}
        <span className="text-pixel-green">develop</span>
      </>
    ),
  },
  {
    id: '6',
    timestamp: '08:30:00',
    type: 'build',
    message: (
      <>
        Deployment <span className="text-pixel-green">#881</span> to staging environment.
      </>
    ),
  },
];

export const ActivityFeed: React.FC = () => {
  return (
    <section>
      <h2 className="text-sm pixel-text text-pixel-green flex items-center gap-3 mb-4">
        <span className="w-2 h-4 bg-pixel-green" />
        ACTIVITY_LOG
      </h2>
      
      <div className="nes-container is-dark with-title p-4">
        <div className="max-h-[400px] overflow-y-auto pr-2">
          {mockActivities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === mockActivities.length - 1}
            />
          ))}
        </div>
        
        <div className="text-center pt-4 border-t-2 border-black mt-4">
          <button className="text-[8px] pixel-text text-pixel-gray hover:text-pixel-blue transition-colors cursor-pointer uppercase tracking-tighter">
            [ LOAD MORE LOGS ]
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActivityFeed;
