'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, AgentRole, Agent } from '@/types/virtual-office';

interface ChatPanelProps {
  messages: ChatMessage[];
  agents: Record<AgentRole, Agent>;
  currentUser: AgentRole | null;
  onSendMessage: (agentId: AgentRole, message: string, type?: ChatMessage['type']) => void;
  onClose: () => void;
}

const QUICK_MESSAGES = [
  '👋 Hello!',
  '🙌 High five!',
  '💪 Great work!',
  '🤝 Need help?',
  '🚀 Ship it!',
  '✅ LGTM!',
];

export default function ChatPanel({ messages, agents, currentUser, onSendMessage, onClose }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && currentUser) {
      onSendMessage(currentUser, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleQuickMessage = (msg: string) => {
    if (currentUser) {
      onSendMessage(currentUser, msg);
    }
  };

  const getMessageStyle = (type: ChatMessage['type']) => {
    switch (type) {
      case 'system': return 'bg-blue-900/50 border-blue-500 text-blue-200';
      case 'action': return 'bg-green-900/50 border-green-500 text-green-200';
      default: return 'bg-gray-800 border-gray-600';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 md:w-96">
      <div className="nes-container is-dark with-title">
        <p className="title">💬 Team Chat</p>
        
        <div className="flex flex-col h-96">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation! 👋
              </div>
            ) : (
              messages.map((msg) => {
                const agent = agents[msg.agentId];
                const isMe = currentUser === msg.agentId;
                
                return (
                  <div 
                    key={msg.id}
                    className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img 
                      src={agent.avatar} 
                      alt={agent.name}
                      className="w-8 h-8 rounded-full border-2 flex-shrink-0"
                      style={{ 
                        borderColor: agent.color,
                        imageRendering: 'pixelated',
                      }}
                    />
                    <div 
                      className={`max-w-[70%] p-2 rounded border text-sm ${getMessageStyle(msg.type)}`}
                    >
                      <div 
                        className="text-xs font-bold mb-1"
                        style={{ color: agent.color }}
                      >
                        {agent.name}
                      </div>
                      <div>{msg.message}</div>
                      <div className="text-[10px] opacity-50 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Messages */}
          <div className="flex flex-wrap gap-1 mb-3">
            {QUICK_MESSAGES.map((msg) => (
              <button
                key={msg}
                onClick={() => handleQuickMessage(msg)}
                className="nes-btn text-[10px] py-1 px-2"
                disabled={!currentUser}
              >
                {msg}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2"
          >
            <div className="nes-field flex-1"
            >
              <input
                type="text"
                className="nes-input"
                placeholder={currentUser ? "Type a message..." : "Select your agent..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={!currentUser}
              />
            </div>
            <button 
              onClick={handleSend}
              className="nes-btn is-primary"
              disabled={!newMessage.trim() || !currentUser}
            >
              Send
            </button>
          </div>

          {/* Current User Selector */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>Chatting as:</span>
            <div className="flex gap-1">
              {(Object.keys(agents) as AgentRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {}}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs
                    ${currentUser === role ? 'border-white' : 'border-transparent opacity-50'}`}
                  style={{ backgroundColor: agents[role].color }}
                  title={agents[role].name}
                >
                  {agents[role].name[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
