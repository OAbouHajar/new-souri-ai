import React from 'react';
import '../styles/variables.css';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLanguage } from '../../hooks/useLanguage';
import RagAnimation from '../components/RagAnimation';
import { DataCoverageSection } from '../components/DataCoverageSection';
import { SourcesCoverageSection } from '../components/SourcesCoverageSection';

// @ts-ignore
import developerPhoto from '../img/osama.jpeg';

export type InfoPageType = 'privacy' | 'contribute' | 'submit' | 'developer' | 'about';

interface InfoPageProps {
  type: InfoPageType;
  onBack: () => void;
  onNavigate: (type: InfoPageType) => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({ title, children, delay = 0 }) => {
  const isMobile = useIsMobile();
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      marginBottom: '24px',
      border: '1px solid rgba(0,0,0,0.05)',
      animation: `fadeInUp 0.6s ease-out ${delay}s backwards`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    }}
    >
      <h3 style={{
        color: 'var(--v2-green-900)',
        marginTop: 0,
        marginBottom: '16px',
        fontSize: isMobile ? '18px' : '22px',
        borderBottom: '2px solid var(--v2-gold-500)',
        display: 'inline-block',
        paddingBottom: '8px'
      }}>
        {title}
      </h3>
      <div style={{ color: 'var(--v2-text-primary)', lineHeight: '1.7', fontSize: isMobile ? '14px' : '16px' }}>
        {children}
      </div>
    </div>
  );
};

const DeveloperCard: React.FC = () => {
    const isMobile = useIsMobile();
    const { t } = useLanguage();
    
    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: isMobile ? '32px 24px' : '40px',
            maxWidth: '100%', // Changed to 100% to fill container, max-width controlled by parent/page
            margin: '0 auto', // Removed top margin, controlled by parent
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Subtle shadow
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.05)',
            animation: 'fadeInUp 0.6s ease-out 0.2s backwards' // Animation duration per spec
        }}>
            {/* Avatar */}
            <div style={{
                width: isMobile ? '96px' : '112px',
                height: isMobile ? '96px' : '112px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 16px auto',
                // Removed border or made it very subtle
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
                <img 
                    src={developerPhoto} 
                    alt="Osama Abou Hajar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            
            {/* Name */}
            <h3 style={{
                margin: '0 0 8px 0', // Reduced margin
                color: 'var(--v2-green-900)',
                fontSize: isMobile ? '20px' : '22px',
                fontWeight: 700
            }}>
                Osama Abou Hajar
            </h3>

            {/* Role */}
             <div style={{
                color: 'var(--v2-text-muted)',
                fontSize: '14px',
                opacity: 0.8,
                marginBottom: '24px',
                fontWeight: 500
            }}>
                {t('v2_dev_role')}
            </div>

            {/* Bio - Short readable blocks */}
            <div style={{
                color: 'var(--v2-text-primary)',
                lineHeight: '1.6',
                fontSize: isMobile ? '14px' : '15px',
                marginBottom: '24px',
                maxWidth: '95%',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <p style={{ marginBottom: '12px' }}>{t('v2_cont_bio_p1')}</p>
                <p style={{ marginBottom: '12px' }}>{t('v2_cont_bio_p2')}</p>
                <p style={{ marginBottom: 0 }}>{t('v2_cont_bio_p3')}</p>
            </div>

            {/* Social Icons - Monochrome */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                marginTop: '24px',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '24px'
            }}>
                <a 
                    href="https://www.linkedin.com/in/osamaabouhajar/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                        color: 'var(--v2-text-muted)',
                        transition: 'color 0.2s, transform 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                     }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--v2-green-900)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--v2-text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    title="LinkedIn"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                </a>
                
                <a 
                    href="https://www.facebook.com/oabouhajar/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                        color: 'var(--v2-text-muted)',
                        transition: 'color 0.2s, transform 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                     }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--v2-green-900)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--v2-text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    title="Facebook"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </a>

                <a 
                    href="https://github.com/oabouhajar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                        color: 'var(--v2-text-muted)',
                        transition: 'color 0.2s, transform 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                     }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--v2-green-900)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--v2-text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    title="GitHub"
                >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                     </svg>
                </a>
            </div>
        </div>
    );
};

const InfoPage: React.FC<InfoPageProps> = ({ type, onBack }) => {
  const isMobile = useIsMobile();
  const { t, lang, dir } = useLanguage();
  const isPrivacy = type === 'privacy';
  const isContribute = type === 'contribute';
  const isDeveloper = type === 'developer';
  const isAbout = type === 'about';

  let title = '';
  if (isPrivacy) title = t('v2_privacy_h1');
  else if (isContribute) title = t('v2_howToContribute');
  else if (isDeveloper) title = t('v2_developer_menu');
  else if (isAbout) title = t('v2_howItWorks_title');

  return (
    <div style={{
      minHeight: '100%',
      padding: isMobile ? '20px' : '40px',
      maxWidth: '1000px',
      margin: '0 auto',
      direction: dir,
      textAlign: dir === 'rtl' ? 'right' : 'left'
    }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
        <button 
          onClick={onBack}
          aria-label={t('v2_back')}
          style={{
            background: 'white',
            border: '2px solid var(--v2-green-900)',
            borderRadius: '32px',
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: 'var(--v2-green-900)',
            transition: 'all 0.2s ease',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            e.currentTarget.style.backgroundColor = 'var(--v2-green-900)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = 'var(--v2-green-900)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ transform: lang === 'en' ? 'none' : 'rotate(180deg)' }}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('v2_back')}
        </button>
        <h1 style={{ margin: 0, color: 'var(--v2-green-900)', fontSize: isMobile ? '24px' : '32px' }}>
          {title}
        </h1>
      </div>

      {isAbout && (
        <>
            {/* Section A: RAG Animation */}
            <RagAnimation />
            
            {/* NEW: Knowledge Base / Data Coverage Section */}
            <DataCoverageSection />
            <SourcesCoverageSection />

            {/* Section B Header */}
             <div style={{ marginTop: '56px', marginBottom: '24px', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
                 <h2 style={{ 
                     color: 'var(--v2-green-900)', 
                     margin: '0 0 8px 0', 
                     fontSize: isMobile ? '24px' : '28px' 
                 }}>
                     {t('v2_dev_section_title')}
                 </h2>
                 <p style={{ 
                     margin: 0, 
                     color: 'var(--v2-text-muted)', 
                     fontSize: '15px',
                     opacity: 0.9
                 }}>
                     {t('v2_dev_section_subtitle')}
                 </p>
             </div>

            {/* Section B: Developer Card (Redesigned) */}
            <DeveloperCard />
        </>
      )}

      {isPrivacy && (
        <>
          <InfoCard title={t('v2_priv_c1_t')} delay={0.1}>
            {t('v2_priv_c1_d')}
          </InfoCard>

          <InfoCard title={t('v2_priv_c2_t')} delay={0.2}>
            {t('v2_priv_c2_d')}
          </InfoCard>

          <InfoCard title={t('v2_priv_c3_t')} delay={0.3}>
            {t('v2_priv_c3_d')}
            <ul style={{ [dir === 'rtl' ? 'paddingRight' : 'paddingLeft']: '20px', marginTop: '12px' }}>
              <li>{t('v2_priv_c3_li1')}</li>
              <li>{t('v2_priv_c3_li2')}</li>
            </ul>
          </InfoCard>

           <InfoCard title={t('v2_priv_c4_t')} delay={0.4}>
             {t('v2_priv_c4_d')}
           </InfoCard>
           
           <InfoCard title={t('v2_priv_c5_t')} delay={0.5}>
             <span dangerouslySetInnerHTML={{ 
               __html: t('v2_priv_c5_d').replace('**', '<strong style="color: #d32f2f">').replace('**', '</strong>') 
             }} />
           </InfoCard>
        </>
      )}

      {isContribute && (
        <>
          <div style={{ 
            backgroundColor: 'var(--v2-green-900)', 
            color: 'white', 
            borderRadius: '16px', 
            padding: '32px', 
            textAlign: 'center',
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s ease-out backwards'
          }}>
            <h2 style={{ margin: '0 0 16px 0' }}>{t('v2_contribute_h1')}</h2>
            <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              {t('v2_contribute_p1')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
            <InfoCard title={t('v2_cont_c1_t')} delay={0.2}>
              <ul style={{ [dir === 'rtl' ? 'paddingRight' : 'paddingLeft']: '20px', margin: 0 }}>
                <li>{t('v2_cont_c1_li1')}</li>
                <li>{t('v2_cont_c1_li2')}</li>
                <li>{t('v2_cont_c1_li3')}</li>
                <li>{t('v2_cont_c1_li4')}</li>
              </ul>
            </InfoCard>

            <InfoCard title={t('v2_cont_c2_t')} delay={0.3}>
              <ul style={{ [dir === 'rtl' ? 'paddingRight' : 'paddingLeft']: '20px', margin: 0 }}>
                <li style={{color: '#d32f2f', fontWeight: 'bold'}}>{t('v2_cont_c2_li1')}</li>
                <li>{t('v2_cont_c2_li2')}</li>
                <li>{t('v2_cont_c2_li3')}</li>
                <li>{t('v2_cont_c2_li4')}</li>
              </ul>
            </InfoCard>
          </div>

        </>
      )}

      {isDeveloper && (
        <InfoCard title={t('v2_cont_c3_t')} delay={0.1}>
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--v2-text-muted)' }}>
                 Moved to "About Souri AI"
            </div>
        </InfoCard>
      )}
    </div>
  );
};

export default InfoPage;
