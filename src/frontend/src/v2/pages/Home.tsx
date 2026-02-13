import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/variables.css';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLanguage } from '../../hooks/useLanguage';
// @ts-ignore
import souriLogo from '../icons/souri2.svg?url';

interface HomeProps {
  onSuggestionClick: (text: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSuggestionClick }) => {
  const isMobile = useIsMobile();
  const { t, lang } = useLanguage();
  
  const suggestions = [
    t('v2_suggestion1'),
    t('v2_suggestion2'),
    t('v2_suggestion3')
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)', // Full height minus header
      padding: isMobile ? '16px' : '24px',
      paddingBottom: isMobile ? '140px' : '160px' // Ensure space for fixed input area + disclaimer
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        padding: isMobile ? '24px 16px' : '32px 24px',
        maxWidth: '640px',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
        // removed gap to use explicit margins
      }}>
        <div style={{
          fontSize: isMobile ? '25px' : '30px',
          fontWeight: 600,
          color: 'var(--v2-green-900)',
          marginBottom: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Souri AI | سوري AI
        </div>

        <div style={{
            width: isMobile ? '120px' : '166px',
            height: isMobile ? '84px' : '116px',
            backgroundColor: 'var(--v2-green-900)', 
            maskImage: `url(${souriLogo})`,
            WebkitMaskImage: `url(${souriLogo})`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            marginBottom: '8px'
        }} />


        <div style={{
          fontSize: '16px',
          color: 'var(--v2-text-muted)',
          maxWidth: '500px',
          margin: 0,
          marginBottom: '16px',
          lineHeight: 1.5
        }}>
          <ReactMarkdown components={{
             p: ({node, ...props}) => <p style={{margin: 0}} {...props} />
          }}>
            {t('v2_homeSubtitle')}
          </ReactMarkdown>
        </div>

        <div style={{
          position: 'relative',
          border: '2px solid var(--v2-green-900)',
          borderRadius: '30px',
          padding: '24px 16px',
          marginTop: '24px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <span style={{
            position: 'absolute',
            top: '-14px',
            [lang === 'ar' ? 'right' : 'left']: '32px',
            backgroundColor: '#FFFFFF',
            padding: '0 12px',
            color: 'var(--v2-green-900)',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 600
          }}>
             {lang === 'ar' ? 'أسئلة مقترحة' : 'Suggested Questions'}
          </span>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
          {suggestions.map((text) => (
            <button
              key={text}
              onClick={() => onSuggestionClick(text)}
              style={{
                backgroundColor: 'var(--v2-beige-200)',
                color: 'var(--v2-text-primary)',
                padding: '10px 20px',
                borderRadius: '99px',
                fontSize: '14px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--v2-beige-300)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--v2-beige-200)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.6}}>
                 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {text}
            </button>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
