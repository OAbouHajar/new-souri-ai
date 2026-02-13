import React, { useEffect, useRef } from 'react';
import MessageBubble from '../components/MessageBubble';
import '../styles/variables.css';
import { useLanguage } from '../../hooks/useLanguage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  messages: Message[];
  onClearChat?: () => void;
  isResponding?: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages, onClearChat, isResponding }) => {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{
      padding: '24px',
      paddingBottom: '160px', // Increased space for fixed input area + disclaimer
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%'
    }}>
      {messages.map((msg, index) => (
        <MessageBubble 
          key={index} 
          role={msg.role} 
          content={msg.content} 
          isStreaming={isResponding && index === messages.length - 1 && msg.role === 'assistant'}
        />
      ))}
      
      {/* Typing Indicator Bubble */}
      {isResponding && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <MessageBubble 
           role="assistant" 
           content="" 
           isTyping={true} 
        />
      )}

      {onClearChat && messages.length > 0 && !isResponding && (
        <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.8 }}>
             <button 
                onClick={onClearChat}
                style={{
                    background: 'none',
                    border: '1px solid var(--v2-text-muted)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: 'var(--v2-text-muted)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ef5350'; 
                    e.currentTarget.style.color = '#ef5350';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 83, 80, 0.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--v2-text-muted)'; 
                    e.currentTarget.style.color = 'var(--v2-text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
             >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                {t('v2_clearChat')}
             </button>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;
