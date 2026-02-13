import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useIsMobile } from '../hooks/useIsMobile';

// Icons
const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const ExternalLinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
)

// Data Constants
const TELEGRAM_SOURCES = [
  {
    "ministry_ar": "وزارة الدفاع السورية",
    "ministry_en": "Syrian Ministry of Defense",
    "telegram_username": "Sy_Defense",
    "telegram_url": "https://t.me/Sy_Defense",
    "category": "Defense",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة الخارجية والمغتربين",
    "ministry_en": "Ministry of Foreign Affairs and Expatriates",
    "telegram_username": "syrianmofaex1",
    "telegram_url": "https://t.me/syrianmofaex1",
    "category": "Foreign Affairs",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة الداخلية السورية",
    "ministry_en": "Syrian Ministry of Interior",
    "telegram_username": "syrianmoi",
    "telegram_url": "https://t.me/syrianmoi",
    "category": "Interior",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة التعليم العالي والبحث العلمي السورية",
    "ministry_en": "Ministry of Higher Education and Scientific Research",
    "telegram_username": "SyMOHEASR",
    "telegram_url": "https://t.me/SyMOHEASR",
    "category": "Higher Education",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة التربية والتعليم السورية",
    "ministry_en": "Ministry of Education",
    "telegram_username": "moedsy",
    "telegram_url": "https://t.me/moedsy",
    "category": "Education",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة الاقتصاد والصناعة السورية",
    "ministry_en": "Ministry of Economy and Industry",
    "telegram_username": "SyMOEAI",
    "telegram_url": "https://t.me/SyMOEAI",
    "category": "Economy",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة الاتصالات وتقانة المعلومات السورية",
    "ministry_en": "Ministry of Communications and Information Technology",
    "telegram_username": "SyMOCAIT",
    "telegram_url": "https://t.me/SyMOCAIT",
    "category": "Technology",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة النقل السورية",
    "ministry_en": "Ministry of Transport",
    "telegram_username": "ministry_of_transport_sy",
    "telegram_url": "https://t.me/ministry_of_transport_sy",
    "category": "Transport",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة الإعلام السورية",
    "ministry_en": "Ministry of Information",
    "telegram_username": "SyMOIGov",
    "telegram_url": "https://t.me/SyMOIGov",
    "category": "Media",
    "source": "telegram"
  },
  {
    "ministry_ar": "وزارة الأشغال العامة والإسكان السورية",
    "ministry_en": "Ministry of Public Works and Housing",
    "telegram_username": "MOPWAH",
    "telegram_url": "https://t.me/MOPWAH",
    "category": "Housing",
    "source": "telegram"
  },
  {
    "ministry_ar": "رئاسة مجلس الوزراء السوري",
    "ministry_en": "Syrian Prime Ministry",
    "telegram_username": "SyrianPrimeMinistry",
    "telegram_url": "https://t.me/SyrianPrimeMinistry",
    "category": "Government",
    "source": "telegram"
  },
  {
    "ministry_ar": "الأمانة العامة لرئاسة الجمهورية – شؤون مجلس الوزراء",
    "ministry_en": "General Secretariat of the Presidency – Council of Ministers Affairs",
    "telegram_username": "SyGSOTPOTSARCA",
    "telegram_url": "https://t.me/SyGSOTPOTSARCA",
    "category": "Government",
    "source": "telegram"
  }
];

const OFFICIAL_WEBSITE_SOURCES = [
  {
    "Topic": "Central Bank of Syria",
    "Topic_ar": "مصرف سورية المركزي",
    "URL": "https://www.cb.gov.sy/index.php?lang=1&act=628"
  },
  {
    "Topic": "Ministry of Foreign Affairs",
    "Topic_ar": "وزارة الخارجية والمغتربين",
    "URL": "https://mofaex.gov.sy/"
  },
  {
    "Topic": "Ministry of Electricity",
    "Topic_ar": "وزارة الكهرباء",
    "URL": "http://www.moe.gov.sy/"
  },
  {
    "Topic": "Ministry of Education",
    "Topic_ar": "وزارة التربية",
    "URL": "http://www.moed.gov.sy/"
  },
  {
    "Topic": "Syrian Arab News Agency (SANA)",
    "Topic_ar": "الوكالة العربية السورية للأنباء (سانا)",
    "URL": "https://sana.sy/en/"
  },
  {
    "Topic": "Syrian Ministry of Health",
    "Topic_ar": "وزارة الصحة",
    "URL": "http://www.moh.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Tourism",
    "Topic_ar": "وزارة السياحة",
    "URL": "http://www.syriatourism.org/"
  },
  {
    "Topic": "Syrian Ministry of Culture",
    "Topic_ar": "وزارة الثقافة",
    "URL": "http://www.moc.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Interior",
    "Topic_ar": "وزارة الداخلية",
    "URL": "http://www.moi.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Information",
    "Topic_ar": "وزارة الإعلام",
    "URL": "http://www.moi.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Justice",
    "Topic_ar": "وزارة العدل",
    "URL": "http://www.moj.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Higher Education",
    "Topic_ar": "وزارة التعليم العالي والبحث العلمي",
    "URL": "http://www.mohe.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Agriculture and Agrarian Reform",
    "Topic_ar": "وزارة الزراعة والإصلاح الزراعي",
    "URL": "http://www.moa.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Social Affairs and Labor",
    "Topic_ar": "وزارة الشؤون الاجتماعية والعمل",
    "URL": "http://www.mosal.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Transport",
    "Topic_ar": "وزارة النقل",
    "URL": "http://www.mot.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Local Administration and Environment",
    "Topic_ar": "وزارة الإدارة المحلية والبيئة",
    "URL": "http://www.mola.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Economy and Foreign Trade",
    "Topic_ar": "وزارة الاقتصاد والتجارة الخارجية",
    "URL": "http://www.economy.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Communications and Technology",
    "Topic_ar": "وزارة الاتصالات والتقانة",
    "URL": "http://www.moct.gov.sy/"
  },
  {
    "Topic": "Syrian Ministry of Housing and Construction",
    "Topic_ar": "وزارة الأشغال العامة والإسكان",
    "URL": "http://www.mhc.gov.sy/"
  }
];

export const SourcesCoverageSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const isMobile = useIsMobile();
  const isRtl = lang === 'ar';

  return (
    <div style={{
        marginTop: '24px',
        animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
    }}>
      {/* Title & Desc */}
      <h2 style={{
           color: 'var(--v2-green-900)',
           marginTop: '0',
           marginBottom: '16px',
           fontSize: isMobile ? '22px' : '26px',
           textAlign: 'center'
       }}>
           {t('v2_src_title')}
       </h2>
       
       <p style={{
           color: 'var(--v2-text-muted)',
           fontSize: isMobile ? '15px' : '16px',
           maxWidth: '800px',
           margin: '0 auto 40px auto',
           lineHeight: '1.6',
           textAlign: 'center'
       }}>
           {t('v2_src_desc')}
       </p>

       {/* Grid Layout for Two Columns */}
       <div style={{
           display: 'grid',
           gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
           gap: '32px'
       }}>
           
           {/* Column 1: Websites */}
           <div>
               <div style={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '12px', 
                   marginBottom: '20px',
                   color: 'var(--v2-green-900)',
                   borderBottom: '2px solid var(--v2-gold-500)',
                   paddingBottom: '12px'
               }}>
                   <GlobeIcon />
                   <h3 style={{ margin: 0, fontSize: '18px' }}>{t('v2_src_web_title')}</h3>
               </div>
               
               <div style={{ display: 'grid', gap: '12px' }}>
                   {OFFICIAL_WEBSITE_SOURCES.map((site, idx) => (
                       <a 
                           key={idx}
                           href={site.URL}
                           target="_blank"
                           rel="noopener noreferrer"
                           style={{
                               display: 'flex',
                               justifyContent: 'space-between',
                               alignItems: 'center',
                               padding: '12px 16px',
                               backgroundColor: 'white',
                               borderRadius: '8px',
                               textDecoration: 'none',
                               color: 'var(--v2-text-primary)',
                               border: '1px solid var(--v2-beige-300)',
                               transition: 'all 0.2s ease',
                               boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                           }}
                           onMouseEnter={(e) => {
                               e.currentTarget.style.transform = 'translateY(-2px)';
                               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
                               e.currentTarget.style.borderColor = 'var(--v2-gold-500)';
                           }}
                           onMouseLeave={(e) => {
                               e.currentTarget.style.transform = 'translateY(0)';
                               e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                               e.currentTarget.style.borderColor = 'var(--v2-beige-300)';
                           }}
                       >
                           <span style={{ fontSize: '14px', fontWeight: '500' }}>
                               {isRtl ? site.Topic_ar : site.Topic}
                           </span>
                           <ExternalLinkIcon />
                       </a>
                   ))}
               </div>
           </div>

           {/* Column 2: Telegram */}
           <div>
               <div style={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '12px', 
                   marginBottom: '20px',
                   color: '#229ED9', // Telegram Color
                   borderBottom: '2px solid #229ED9',
                   paddingBottom: '12px'
               }}>
                   <TelegramIcon />
                   <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--v2-green-900)' }}>{t('v2_src_tele_title')}</h3>
               </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                   {TELEGRAM_SOURCES.map((chan, idx) => (
                       <a 
                           key={idx}
                           href={chan.telegram_url}
                           target="_blank"
                           rel="noopener noreferrer"
                           style={{
                               display: 'flex',
                               justifyContent: 'space-between',
                               alignItems: 'center',
                               padding: '12px 16px',
                               backgroundColor: 'white',
                               borderRadius: '8px',
                               textDecoration: 'none',
                               color: 'var(--v2-text-primary)',
                               border: '1px solid var(--v2-beige-300)',
                               transition: 'all 0.2s ease',
                               boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                           }}
                           onMouseEnter={(e) => {
                               e.currentTarget.style.transform = 'translateY(-2px)';
                               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
                               e.currentTarget.style.borderColor = '#229ED9';
                           }}
                           onMouseLeave={(e) => {
                               e.currentTarget.style.transform = 'translateY(0)';
                               e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                               e.currentTarget.style.borderColor = 'var(--v2-beige-300)';
                           }}
                       >
                           <div style={{ display: 'flex', flexDirection: 'column' }}>
                               <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                   {isRtl ? chan.ministry_ar : chan.ministry_en}
                               </span>
                               <span style={{ fontSize: '12px', color: 'var(--v2-text-muted)', marginTop: '2px' }}>
                                   @{chan.telegram_username}
                               </span>
                           </div>
                           <div style={{ color: '#229ED9' }}>
                               <ExternalLinkIcon />
                           </div>
                       </a>
                   ))}
               </div>
           </div>

       </div>
    </div>
  );
};
