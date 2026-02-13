import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/variables.css';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLanguage } from '../../hooks/useLanguage';
// @ts-ignore
import souriLogo from '../icons/souri2.svg?url';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  isTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, isStreaming, isTyping }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  // 1. Language Detection Helper
  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
  const isContentArabic = isArabic(content);

  const handleCopy = async () => {
    const textToCopy = `${content}\n\n${t('v2_source')}: souriai.com`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };
  
  // 2. Fixed Radius based on Position (Role), not Language
  // User (Right side): TopLeft, TopRight, BottomRight (Sharp), BottomLeft
  // AI (Left side): TopLeft, TopRight, BottomRight, BottomLeft (Sharp)
  const getBorderRadius = () => {
    if (isUser) {
        // User always on Right -> sharp bottom-right
        return '20px 20px 4px 20px';
    } else {
        // AI always on Left -> sharp bottom-left
        return '20px 20px 20px 4px';
    }
  };

  return (
    <div style={{
      display: 'flex',
      // Force LTR container so layout is consistent: AI(Left) ... User(Right)
      direction: 'ltr',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: isMobile ? '16px' : '24px',
    }}>
      {!isUser && (
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'var(--v2-green-900)',
          borderRadius: '50%',
          flexShrink: 0,
          marginRight: isMobile ? '8px' : '12px', // Always marginRight for AI on Left
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden'
        }}>
           <img src={souriLogo} alt="Souri AI" style={{ width: '20px', height: '20px' }} />
        </div>
      )}

      <div style={{
        backgroundColor: isUser ? 'var(--v2-user-bubble)' : 'var(--v2-green-100)',
        color: 'var(--v2-text-primary)',
        padding: isMobile ? '12px 16px' : '16px 20px',
        borderRadius: getBorderRadius(),
        maxWidth: isMobile ? '88%' : '80%',
        boxShadow: isUser ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
        lineHeight: '1.6',
        fontSize: isMobile ? '15px' : '16px',
        position: 'relative',
        // Content Direction based on text
        direction: isContentArabic ? 'rtl' : 'ltr',
        textAlign: isContentArabic ? 'right' : 'left'
      }}>
        {isTyping ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 4px', direction: 'ltr' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--v2-green-900)', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out both', animationDelay: '0s' }}></div>
            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--v2-green-900)', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--v2-green-900)', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
          </div>
        ) : isUser ? (
           <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
        ) : (
           /* Using simple rendering for markdown content */
           <div className="markdown-content">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {content}
             </ReactMarkdown>
             
             {/* Copy Button */}
             {!isStreaming && (
             <div style={{ 
               display: 'flex', 
               justifyContent: 'flex-end', 
               marginTop: '8px', 
               paddingTop: '8px',
               borderTop: '1px solid rgba(0,0,0,0.05)'
             }}>
                <button 
                  onClick={handleCopy}
                  title={t('v2_copy')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--v2-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    padding: '4px',
                    opacity: 0.7,
                    transition: 'opacity 0.2s',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                >
                  {copied ? (
                     <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        {t('v2_copied')}
                     </>
                  ) : (
                     <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        {t('v2_copy')}
                     </>
                  )}
                </button>
             </div>
             )}
           </div>
        )}
      </div>

       {isUser && (
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#ddd',
          borderRadius: '50%',
          flexShrink: 0,
          marginLeft: isMobile ? '8px' : '12px', // Always marginLeft for User on Right
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
             <circle cx="12" cy="7" r="4"></circle>
           </svg>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
