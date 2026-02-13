import React, { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import '../styles/variables.css';
// @ts-ignore
import downloadIcon from '../icons/download.svg?url';

const InstallPwaButton: React.FC = () => {
  const { isInstallable, promptInstall, isIOS } = useInstallPrompt();
  const [showIosHint, setShowIosHint] = useState(false);

  if (!isInstallable) {
    return null;
  }

  const handleClick = () => {
    if (isIOS) {
        setShowIosHint(!showIosHint);
        setTimeout(() => setShowIosHint(false), 5000); // Hide after 5s
    } else {
        promptInstall();
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {showIosHint && (
        <div style={{
            position: 'absolute',
            top: '45px',
            left: '-50px',
            width: '200px',
            backgroundColor: 'var(--v2-green-900)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 200,
            textAlign: 'center',
            border: '1px solid var(--v2-gold-500)'
        }}>
            اضغط مشاركة <img src="https://simpleicons.org/icons/apple.svg" width="10" style={{filter:'invert(1)', display:'inline'}} /> ثم أضف إلى الشاشة الرئيسية
            <div style={{ 
                position: 'absolute', 
                top: '-6px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: 0, 
                height: 0, 
                borderLeft: '6px solid transparent', 
                borderRight: '6px solid transparent', 
                borderBottom: '6px solid var(--v2-gold-500)' 
            }}></div>
        </div>
      )}
      
      <button
        onClick={handleClick}
        title="إضافة التطبيق إلى الشاشة الرئيسية"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          color: 'white',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
      >
        <img src={downloadIcon} alt="Install" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
      </button>
    </div>
  );
};

export default InstallPwaButton;
