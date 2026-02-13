import React from 'react';
import '../styles/variables.css';
import { useIsMobile } from '../hooks/useIsMobile';
import InstallPwaButton from '../components/InstallPwaButton';
import { useLanguage } from '../../hooks/useLanguage';
// @ts-ignore
import chatIcon from '../icons/chat.svg?url';
// @ts-ignore
import souriLogo from '../icons/souri2.svg?url';
// @ts-ignore
import headerPattern from '../icons/header-pattern.svg?url';
// @ts-ignore
import languageIcon from '../icons/language.svg?url';

interface User {
    name: string;
    email: string;
}

interface HeaderProps {
  onNewChat: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat, onMenuClick }) => {
  const isMobile = useIsMobile();
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <>
    <style>
      {`
        .header-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          font-family: inherit;
        }
        .header-btn:active {
          transform: scale(0.96);
        }
        .header-btn-primary {
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 99px;
          padding: 8px 20px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header-btn-primary:hover {
          background-color: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .header-btn-secondary {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          padding: 0;
        }
        .header-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
        }
        @media (max-width: 768px) {
          .header-btn-primary {
            padding: 8px 16px;
            font-size: 13px;
          }
          .header-btn-secondary {
            width: 36px;
            height: 36px;
          }
        }
      `}
    </style>
    <header style={{
      height: '75px',
      backgroundColor: 'var(--v2-green-900)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      color: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 100,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      overflow: 'hidden'
    }}>
      {/* Pattern Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${headerPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px', // Adjust scale as needed
        opacity: 0.05, // Low opacity as requested
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      {/* Main Content Container */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 32px',
        height: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Brand Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onMenuClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px',
              [lang === 'ar' ? 'marginLeft' : 'marginRight']: isMobile ? '4px' : '8px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={t('v2_menu')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <img src={souriLogo} alt="Souri AI" style={{ width: isMobile ? '40px' : '67px', height: isMobile ? '30px' : '49px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px', lineHeight: '1.1' }}>{t('v2_brand')}</span>
            {!isMobile && <span style={{ fontSize: '11px', opacity: 0.8 }}>{t('v2_brandSubtitle')}</span>}
          </div>
        </div>

        {/* Actions Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
          <button
            onClick={toggleLanguage}
            className="header-btn header-btn-secondary"
            title={lang === 'ar' ? 'Switch to English' : 'تغيير إلى العربية'}
          >
            <img src={languageIcon} alt="Language" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          </button>

          <InstallPwaButton />
          
          <button 
            onClick={onNewChat}
            className="header-btn header-btn-primary"
            style={{ gap: '8px' }}
          >
            <img src={chatIcon} alt="New Chat" style={{ width: '18px', height: '18px', filter: 'invert(1)', opacity: 0.9 }} />
            <span>{isMobile ? '' : t('v2_newChat')}</span>
          </button>

          
          {/* Login Button Hidden for Beta */}
          {/* 
          {user ? (
              <div 
                  onClick={onLogout}
                  title={`تسجيل الخروج (${user?.name})`}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--v2-gold-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
              </div>
          ) : (
              <button 
                  onClick={onLoginClick}
                  style={{
                    backgroundColor: 'var(--v2-gold-500)',
                    color: 'var(--v2-green-900)',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer'
                  }}
              >
                دخول
              </button>
          )}
          */}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
