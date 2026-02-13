import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import '../styles/variables.css';
import { useIsMobile } from '../hooks/useIsMobile';

const RagAnimation: React.FC = () => {
    const { t, dir } = useLanguage();
    const isMobile = useIsMobile();
    const [activeStep, setActiveStep] = useState(0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        if (prefersReducedMotion) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 3000); // 3 seconds per step
        return () => clearInterval(interval);
    }, [prefersReducedMotion]);

    const steps = [
        {
            id: 0,
            title: t('v2_rag_step1'),
            desc: t('v2_rag_desc1'),
            icon: (active: boolean) => (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--v2-green-900)" : "var(--v2-text-muted)"} strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            )
        },
        {
            id: 1,
            title: t('v2_rag_step2'),
            desc: t('v2_rag_desc2'),
            icon: (active: boolean) => (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--v2-green-900)" : "var(--v2-text-muted)"} strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
            )
        },
        {
            id: 2,
            title: t('v2_rag_step3'),
            desc: t('v2_rag_desc3'),
            icon: (active: boolean) => (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--v2-green-900)" : "var(--v2-text-muted)"} strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
            )
        },
        {
            id: 3,
            title: t('v2_rag_step4'),
            desc: t('v2_rag_desc4'),
            icon: (active: boolean) => (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--v2-green-900)" : "var(--v2-text-muted)"} strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            )
        }
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '32px',
            marginBottom: '40px',
            position: 'relative',
        }}>
            {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                    <div 
                        key={step.id} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            backgroundColor: isActive ? 'var(--v2-green-50)' : 'white',
                            border: isActive ? '1px solid var(--v2-green-500)' : '1px solid transparent',
                            borderRadius: '16px',
                            padding: '16px',
                            transition: 'all 0.4s ease',
                            transform: isActive ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: isActive ? '0 4px 20px rgba(32, 86, 68, 0.15)' : 'none',
                            opacity: isActive ? 1 : 0.7
                        }}
                    >
                        <div style={{
                            minWidth: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: isActive ? 'var(--v2-gold-300)' : 'var(--v2-beige-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.4s ease'
                        }}>
                           {step.icon(isActive)}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <h4 style={{
                                margin: '0 0 4px 0',
                                color: isActive ? 'var(--v2-green-900)' : 'var(--v2-text-primary)',
                                fontSize: isMobile ? '16px' : '18px',
                                transition: 'color 0.4s ease'
                            }}>
                                {step.title}
                            </h4>
                            <p style={{
                                margin: 0,
                                color: 'var(--v2-text-muted)',
                                fontSize: isMobile ? '13px' : '14px',
                                lineHeight: '1.5'
                            }}>
                                {step.desc}
                            </p>
                        </div>

                        {/* Connection Line (except for last item) */}
                        {index < steps.length - 1 && (
                            <div style={{
                                position: 'absolute',
                                [dir === 'rtl' ? 'right' : 'left']: '44px', // Center of icon
                                top: `${(index * (isMobile ? 88 : 88)) + 72}px`, // Approximate position
                                width: '2px',
                                height: '20px', // Short line between cards
                                backgroundColor: '#E0E0E0', 
                                zIndex: 0,
                                display: 'none' // Hidden for now as card spacing layout makes lines tricky without absolute hell
                            }}></div>
                        )}
                        
                        {isActive && (
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--v2-gold-500)',
                                boxShadow: '0 0 0 4px rgba(214, 178, 110, 0.2)'
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default RagAnimation;
