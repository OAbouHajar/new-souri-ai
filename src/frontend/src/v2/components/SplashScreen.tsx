import React from 'react';
import '../styles/variables.css';
// @ts-ignore
import souriLogo from '../icons/souri2.svg?url';
// @ts-ignore
import headerPattern from '../icons/header-pattern.svg?url';
import { useIsMobile } from '../hooks/useIsMobile';

const SplashScreen: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--v2-green-900)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: 'white',
        direction: 'rtl'
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
          backgroundSize: '100px',
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           animation: 'fadeIn 0.8s ease-out',
           position: 'relative',
           zIndex: 1
        }}>
          {/* Logo */}
          <div style={{
              width: isMobile ? '120px' : '160px',
              height: isMobile ? '86px' : '114px', // Aspect ratio approx
              backgroundColor: 'var(--v2-gold-500)', 
              maskImage: `url(${souriLogo})`,
              WebkitMaskImage: `url(${souriLogo})`,
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              marginBottom: '24px'
          }} />

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: 800,
            margin: '0 0 16px 0',
            color: 'white',
            direction: 'ltr'
          }}>
            Souri AI | سوري AI
          </h1>

          {/* Description */}
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            opacity: 0.9,
            margin: '0 0 32px 0',
            fontWeight: 500
          }}>
            وكيل ذكاء اصطناعي سوري
          </p>

          {/* Loading Bar */}
          <div style={{
            width: isMobile ? '200px' : '240px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--v2-gold-500)',
              borderRadius: '2px',
              animation: 'progress 1.8s ease-in-out forwards',
              width: '0%'
            }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
