import React from 'react';
import '../styles/variables.css';
import { useLanguage } from '../../hooks/useLanguage';

const AnnouncementBanner: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div style={{
      backgroundColor: 'var(--v2-gold-300)',
      color: 'var(--v2-green-900)', // Using the dark green as "dark/muted" text, fits the palette
      padding: '8px 24px',
      fontSize: '14px',
      fontWeight: 'bold',
      textAlign: 'center',
      borderBottom: '1px solid var(--v2-gold-500)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'var(--v2-green-900)',
        opacity: 0.6
      }} aria-hidden="true" />
      <span>{t('v2_announcement')}</span>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'var(--v2-green-900)',
        opacity: 0.6
      }} aria-hidden="true" />
    </div>
  );
};

export default AnnouncementBanner;
