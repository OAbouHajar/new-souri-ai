import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useIsMobile } from '../hooks/useIsMobile';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  label: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000, label }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
      }
    }, {
      threshold: 0.1
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out quart
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      
      const currentCount = Math.floor(easeOut * end);
      setCount(currentCount);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration, hasAnimated]);

  return (
    <div ref={elementRef} style={{ textAlign: 'center', minWidth: '150px' }}>
      <div style={{
          fontSize: '36px',
          fontWeight: '800',
          color: 'var(--v2-green-900)',
          marginBottom: '8px',
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'Segoe UI, Helvetica Neue, sans-serif'
      }}>
        {count.toLocaleString()}
      </div>
      <div style={{
          fontSize: '14px',
          color: 'var(--v2-text-muted)',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
      }}>
        {label}
      </div>
    </div>
  );
};

export const DataCoverageSection: React.FC = () => {
    const { t } = useLanguage();
    const isMobile = useIsMobile();

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: isMobile ? '32px 20px' : '48px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            marginBottom: '40px',
            border: '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 0.6s ease-out 0.15s backwards'
        }}>
           {/* Decorative accent */}
           <div style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               height: '4px',
               background: 'linear-gradient(90deg, var(--v2-green-900) 0%, var(--v2-green-700) 50%, var(--v2-green-900) 100%)',
               opacity: 0.8
           }} />

           <h2 style={{
               color: 'var(--v2-green-900)',
               marginTop: '0',
               marginBottom: '12px',
               fontSize: isMobile ? '22px' : '26px'
           }}>
               {t('v2_kb_title')}
           </h2>
           
           <p style={{
               color: 'var(--v2-text-muted)',
               fontSize: isMobile ? '15px' : '16px',
               maxWidth: '600px',
               margin: '0 auto 40px auto',
               lineHeight: '1.6'
           }}>
               {t('v2_kb_subtitle')}
           </p>

           <div style={{
               display: 'flex',
               flexDirection: isMobile ? 'column' : 'row',
               justifyContent: 'center',
               alignItems: 'center',
               gap: isMobile ? '32px' : '80px',
           }}>
               <AnimatedCounter end={15147} label={t('v2_kb_stat_docs')} />
               
               {/* Divider for desktop */}
               {!isMobile && (
                   <div style={{
                       width: '1px',
                       height: '60px',
                       backgroundColor: 'var(--v2-beige-300)',
                   }} />
               )}

               <AnimatedCounter end={2950} label={t('v2_kb_stat_files')} />
           </div>
           
           <div style={{
               marginTop: '32px',
               paddingTop: '24px',
               borderTop: '1px solid var(--v2-beige-100)',
               fontSize: '14px',
               color: 'var(--v2-green-700)',
               fontStyle: 'italic',
               background: 'var(--v2-beige-100)',
               display: 'inline-block',
               padding: '8px 24px',
               borderRadius: '20px',
               fontWeight: '500'
           }}>
               {t('v2_kb_desc_docs')}
           </div>
        </div>
    );
};
