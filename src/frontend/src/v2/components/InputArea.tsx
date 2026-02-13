import React, { useState, useRef, useEffect } from 'react';
import '../styles/variables.css';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLanguage } from '../../hooks/useLanguage';
// @ts-ignore
import sendIcon from '../icons/send.svg?url';
// @ts-ignore
import voiceIcon from '../icons/voice.svg?url';

import { getAccents, getTones, type ToneOption, type AccentOption } from '../config/syrianDialects';
export type { ToneOption, AccentOption };

interface InputAreaProps {
  onSend: (message: string, toneInstruction?: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend }) => {
  const isMobile = useIsMobile();
  const { t, lang } = useLanguage();
  const [text, setText] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showVoiceComingSoon, setShowVoiceComingSoon] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneOption>('standard');
  const [selectedAccent, setSelectedAccent] = useState<AccentOption>('none');
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const [isAccentDropdownOpen, setIsAccentDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Bottom sheet state
  const [showSettingsHint, setShowSettingsHint] = useState(false);

  useEffect(() => {
    const hasSeenHint = localStorage.getItem('hasSeenChatSettingsHint');
    if (!hasSeenHint && isMobile) {
      setShowSettingsHint(true);
    }
  }, [isMobile]);

  const dismissSettingsHint = () => {
    setShowSettingsHint(false);
    localStorage.setItem('hasSeenChatSettingsHint', 'true');
  };

  const toneDropdownRef = useRef<HTMLDivElement>(null);
  const accentDropdownRef = useRef<HTMLDivElement>(null);
  const settingsSheetRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const TONES = getTones(t, lang);
  const ACCENTS = getAccents(t, lang);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toneDropdownRef.current && !toneDropdownRef.current.contains(event.target as Node)) {
        setIsToneDropdownOpen(false);
      }
      if (accentDropdownRef.current && !accentDropdownRef.current.contains(event.target as Node)) {
        setIsAccentDropdownOpen(false);
      }
      // Note: Settings sheet is modal with overlay, so outside click logic is handled by overlay
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim()) {
      const toneConfig = TONES.find(t => t.id === selectedTone);
      const accentConfig = ACCENTS.find(a => a.id === selectedAccent);
      
      const parts = [];
      const currentLang = lang === 'ar' ? 'Arabic' : 'English';
      
      parts.push(`Language: ${currentLang}`);
      parts.push(`Tone: ${toneConfig?.id || 'educational'}`);
      if (currentLang === 'Arabic') {
        parts.push(`Accent: ${selectedAccent}`);
      } else {
        parts.push(`Accent: None`);
      }
      
      // We append the prompt injection content but the instruction prop also carries the specific text
      // Actually, we'll combine everything into the instruction string passed to onSend.
      
      let fullInstruction = "";
      
      // Tone Instruction
      if (toneConfig && toneConfig.id !== 'standard') {
        fullInstruction += `Tone Rule: ${toneConfig.instruction}\n`;
      }
      
      // Accent Instruction
      if (accentConfig && accentConfig.id !== 'none') {
        fullInstruction += `Accent Rule: ${accentConfig.instruction}\n`;
        if (currentLang === 'Arabic') {
           fullInstruction += `Accent Constraints: Accent affects vocabulary and rhythm only. Never reduce clarity. Do NOT explain the accent. Tone has priority over humor/seriousness.`;
        }
        fullInstruction += `Accent Rule: ${accentConfig.instruction}\n`;
        fullInstruction += `Accent Constraints: Accent affects vocabulary and rhythm only. Never reduce clarity. Do NOT explain the accent. Tone has priority over humor/seriousness.`;
      }

      onSend(text, fullInstruction);
      setText('');
    }
  };

  const handleAttachmentClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleVoiceClick = () => {
    setShowVoiceComingSoon(true);
    setTimeout(() => setShowVoiceComingSoon(false), 3000);
  };

  const AttachmentButton = (
    <div style={{ position: 'relative' }}>
      {showComingSoon && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          [lang === 'ar' ? 'right' : 'left']: '0',
          marginBottom: '12px',
          backgroundColor: 'var(--v2-green-900)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 200,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'fadeInUp 0.2s ease-out'
        }}>
          {t('v2_comingSoon')}
          <div style={{
            position: 'absolute',
            top: '100%',
            [lang === 'ar' ? 'right' : 'left']: '14px',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--v2-green-900)'
          }}></div>
        </div>
      )}
      <button onClick={handleAttachmentClick} style={{
          backgroundColor: 'transparent',
          border: '1px solid #529982',
          cursor: 'pointer',
          color: 'var(--v2-text-muted)',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }} title="مرفق">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
        </svg>
      </button>
    </div>
  );

  const VoiceButton = (
    <div style={{ position: 'relative' }}>
      {showVoiceComingSoon && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          [lang === 'ar' ? 'right' : 'left']: '0',
          marginBottom: '12px',
          backgroundColor: 'var(--v2-green-900)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 200,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'fadeInUp 0.2s ease-out'
        }}>
          {t('v2_comingSoon')}
          <div style={{
            position: 'absolute',
            top: '100%',
            [lang === 'ar' ? 'right' : 'left']: '14px',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--v2-green-900)'
          }}></div>
        </div>
      )}
      <button onClick={handleVoiceClick} style={{
          backgroundColor: 'transparent',
          border: '1px solid #529982',
          cursor: 'pointer',
          color: 'var(--v2-text-muted)',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }} title="تسجيل صوتي">
        <img src={voiceIcon} alt="Voice" style={{ width: '20px', height: '20px' }} />
      </button>
    </div>
  );

  const SettingsSheet = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 1000,
      display: isSettingsOpen ? 'flex' : 'none',
      justifyContent: 'flex-end',
      flexDirection: 'column',
      backdropFilter: 'blur(4px)'
    }} onClick={() => setIsSettingsOpen(false)}>
      <div 
        ref={settingsSheetRef}
        onClick={(e) => e.stopPropagation()} 
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px 40px',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <button
          onClick={() => setIsSettingsOpen(false)}
          aria-label={lang === 'ar' ? "إغلاق الإعدادات" : "Close settings"}
          style={{
            position: 'absolute',
            top: '20px',
            [lang === 'ar' ? 'left' : 'right']: '20px',
            background: 'transparent',
            border: 'none',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            width: '44px',
            height: '44px',
            zIndex: 10
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={{ 
          width: '40px', 
          height: '4px', 
          backgroundColor: '#E0E0E0', 
          borderRadius: '2px', 
          alignSelf: 'center',
          marginBottom: '-8px'
        }} />

        <h3 style={{ margin: 0, textAlign: 'center', fontSize: '18px', fontWeight: 600 }}>
          {lang === 'ar' ? 'إعدادات المحادثة' : 'Conversation Settings'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
              {lang === 'ar' ? 'أسلوب الرد' : 'Tone'}
            </label>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {lang === 'ar' ? 'اختياري' : 'Optional'}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TONES.filter(t => t.id !== 'standard').map(tone => {
              const isSelected = selectedTone === tone.id;
              return (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(isSelected ? 'standard' : tone.id)}
                  style={{
                    flex: '1 1 calc(50% - 8px)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid var(--v2-green-500)' : '1px solid #eee',
                    backgroundColor: isSelected ? 'var(--v2-green-50)' : 'transparent',
                    color: isSelected ? 'var(--v2-green-900)' : '#555',
                    fontSize: '14px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {tone.label}
                  {isSelected && <span style={{ fontSize: '16px' }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
              {lang === 'ar' ? 'اللهجة السورية' : 'Syrian Accent'}
            </label>
            <span style={{ fontSize: '12px', color: '#888' }}>
               {lang === 'ar' ? 'اختياري' : 'Optional'}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ACCENTS.filter(a => a.id !== 'none').map(accent => {
              const isSelected = selectedAccent === accent.id;
              return (
                <button
                  key={accent.id}
                  onClick={() => setSelectedAccent(isSelected ? 'none' : accent.id)}
                  style={{
                    flex: '1 0 auto',
                    padding: '10px 16px',
                    borderRadius: '20px',
                    border: isSelected ? '1px solid var(--v2-green-500)' : '1px solid #eee',
                    backgroundColor: isSelected ? 'var(--v2-green-50)' : 'transparent',
                    color: isSelected ? 'var(--v2-green-900)' : '#555',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer'
                  }}
                >
                  {accent.label}
                  {isSelected && <span style={{ marginLeft: '4px' }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && SettingsSheet}
      <div style={{
        position: 'fixed',
      bottom: isMobile ? '12px' : '24px',
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '0 12px' : '0 20px',
      pointerEvents: 'none', // Allow clicking through outside the input
      zIndex: 100
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#FFFFFF',
        pointerEvents: 'auto',
        borderRadius: '28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid rgba(0,0,0,0.06)',
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        transition: 'all 0.2s ease',
      }}>
        {/* Attachments & Voice Area */}
        {isMobile ? (
          // === MOBILE LAYOUT ===
          <>
            {/* Settings Trigger */}
            <div style={{ position: 'relative' }}>
              {isMobile && showSettingsHint && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  [lang === 'ar' ? 'right' : 'left']: '0',
                  marginBottom: '16px',
                  width: '240px',
                  backgroundColor: '#F0F9F5', // Light green bg
                  border: '1px solid #D1E7DD',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: lang === 'ar' ? 'right' : 'left',
                  animation: 'fadeInUp 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px' }}>🗣️</span>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#104936' }}>
                      {lang === 'ar' ? 'اختر لهجتك المفضلة' : 'Choose your preferred dialect'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#444', lineHeight: '1.4' }}>
                    {lang === 'ar' 
                      ? 'يمكنك تخصيص الأسلوب واللهجة السورية من الإعدادات.' 
                      : 'You can customize the response tone and Syrian dialect from Chat Settings.'}
                  </p>
                  {/* Arrow Tip */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    [lang === 'ar' ? 'right' : 'left']: '14px',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #D1E7DD'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    [lang === 'ar' ? 'right' : 'left']: '14px',
                    marginTop: '-1px', 
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #F0F9F5'
                  }}></div>
                </div>
              )}
              <button
                onClick={() => { setIsSettingsOpen(true); dismissSettingsHint(); }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: (selectedTone !== 'standard' || selectedAccent !== 'none') ? 'var(--v2-green-700)' : 'var(--v2-text-muted)',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={lang === 'ar' ? "الإعدادات" : "Settings"}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                {/* Indicator dot if filters are active */}
                {(selectedTone !== 'standard' || selectedAccent !== 'none') && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'var(--v2-green-500)',
                    borderRadius: '50%',
                    border: '1px solid white'
                  }} />
                )}
              </button>
            </div>

            {/* Text Input (Wide) */}
            <textarea 
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => dismissSettingsHint()}
              onClick={() => dismissSettingsHint()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={t('v2_inputPlaceholder')}
              rows={1}
              style={{
                flex: 1, 
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: 'var(--v2-text-primary)',
                backgroundColor: '#4c4c4c1a',
                borderRadius: '12px',
                padding: '10px 12px',
                minWidth: 0,
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: lang === 'ar' ? 'right' : 'left',
                resize: 'none',
                overflow: 'hidden',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                maxHeight: '120px'
              }}
            />

            {/* Attach Button (Inline) */}
            <div style={{ position: 'relative' }}>
              {showComingSoon && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '12px',
                  backgroundColor: 'var(--v2-green-900)',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  zIndex: 200,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  animation: 'fadeInUp 0.2s ease-out'
                }}>
                  {t('v2_comingSoon')}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid var(--v2-green-900)'
                  }}></div>
                </div>
              )}
              <button 
                onClick={handleAttachmentClick}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--v2-text-muted)', 
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
              }} title="مرفق">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
            </div>

            {/* Contextual Action Button (Voice or Send) */}
            {text.trim().length === 0 ? (
              <div style={{ position: 'relative' }}>
                {showVoiceComingSoon && (
                   <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: lang === 'ar' ? '0' : 'auto', 
                      right: lang === 'ar' ? 'auto' : '0',
                      marginBottom: '12px',
                      backgroundColor: 'var(--v2-green-900)',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      zIndex: 200,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      animation: 'fadeInUp 0.2s ease-out'
                    }}>
                      {t('v2_comingSoon')}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: lang === 'ar' ? '12px' : 'auto',
                        right: lang === 'ar' ? 'auto' : '12px',
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '5px solid var(--v2-green-900)'
                      }}></div>
                    </div>
                )}
                <button onClick={handleVoiceClick} style={{
                    backgroundColor: 'transparent',
                    border: 'none', 
                    cursor: 'pointer',
                    color: 'var(--v2-text-muted)',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} title="تسجيل صوتي">
                  <img src={voiceIcon} alt="Voice" style={{ width: '22px', height: '22px' }} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleSubmit()}
                style={{
                  backgroundColor: 'var(--v2-green-700)',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  animation: 'scaleIn 0.2s ease-out'
                }}>
                <img src={sendIcon} alt="Send" style={{ width: '18px', height: '18px', filter: 'invert(1)' }} />
              </button>
            )}
          </>
        ) : (
          // === DESKTOP LAYOUT (Unchanged) ===
          <>
            {AttachmentButton}
            {VoiceButton}
            
            <textarea 
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={t('v2_inputPlaceholder')}
              rows={1}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: 'var(--v2-text-primary)',
                backgroundColor: '#4c4c4c1a',
                borderRadius: '12px',
                padding: '10px 12px',
                minWidth: 0,
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: lang === 'ar' ? 'right' : 'left',
                resize: 'none',
                overflow: 'hidden',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                maxHeight: '120px'
              }}
            />

            {/* Tone Selector */}
            <div ref={toneDropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                style={{
                  appearance: 'none',
                  backgroundColor: selectedTone === 'standard' ? 'var(--v2-beige-100)' : 'var(--v2-beige-200)',
                  border: selectedTone === 'standard' ? '1px solid transparent' : '1px solid var(--v2-gold-500)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: selectedTone === 'standard' ? 'var(--v2-text-muted)' : 'var(--v2-text-primary)',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: selectedTone === 'standard' ? 400 : 600,
                  height: '32px',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.2s, border-color 0.2s, color 0.2s'
                }}
                title={lang === 'ar' ? "نبرة الصوت" : "Tone"}
                aria-label={lang === 'ar' ? "قائمة الأسلوب" : "Style Selector"}
                aria-haspopup="true"
                aria-expanded={isToneDropdownOpen}
              >
                {selectedTone === 'standard' 
                  ? (lang === 'ar' ? 'الأسلوب' : 'Style') 
                  : TONES.find(t => t.id === selectedTone)?.label
                }
                
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                     style={{ transform: isToneDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {isToneDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  marginBottom: '8px',
                  left: lang === 'ar' ? '0' : 'auto',
                  right: lang === 'ar' ? 'auto' : '0',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '160px',
                  zIndex: 200,
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  <div style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--v2-text-muted)', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'اختر نبرة الرد' : 'Select Tone'}
                  </div>
                    {/* Default Option */}
                    <button
                        onClick={() => {
                          setSelectedTone('standard');
                          setIsToneDropdownOpen(false);
                        }}
                        style={{
                          appearance: 'none',
                          background: selectedTone === 'standard' ? 'var(--v2-beige-200)' : 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'var(--v2-text-primary)',
                          marginBottom: '2px',
                          width: '100%'
                        }}
                        role="option"
                        aria-selected={selectedTone === 'standard'}
                      >
                        <span>{lang === 'ar' ? 'افتراضي' : 'Default'}</span>
                        {selectedTone === 'standard' && <span style={{ fontWeight: 'bold', color: 'var(--v2-green-700)' }}>✓</span>}
                    </button>

                    {TONES.filter(t => t.id !== 'standard').map(tone => {
                      const isSelected = selectedTone === tone.id;
                      return (
                      <button
                        key={tone.id}
                        onClick={() => {
                          setSelectedTone(tone.id);
                          setIsToneDropdownOpen(false);
                        }}
                        style={{
                          appearance: 'none',
                          background: isSelected ? 'var(--v2-beige-200)' : 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'var(--v2-text-primary)',
                          marginBottom: '2px',
                          width: '100%'
                        }}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>{tone.label}</span>
                        {isSelected && <span style={{ fontWeight: 'bold', color: 'var(--v2-green-700)' }}>✓</span>}
                      </button>
                    )})}
                </div>
              )}
            </div>

            {/* Accent Selector (Restored) */}
            <div ref={accentDropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: lang === 'ar' ? '0' : '8px', marginRight: lang === 'ar' ? '8px' : '0' }}>
              <button
                onClick={() => setIsAccentDropdownOpen(!isAccentDropdownOpen)}
                style={{
                  appearance: 'none',
                  backgroundColor: selectedAccent === 'none' ? 'var(--v2-beige-100)' : 'var(--v2-beige-200)',
                  border: selectedAccent === 'none' ? '1px solid transparent' : '1px solid var(--v2-gold-500)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: selectedAccent === 'none' ? 'var(--v2-text-muted)' : 'var(--v2-text-primary)',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: selectedAccent === 'none' ? 400 : 600,
                  height: '32px',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.2s, border-color 0.2s, color 0.2s'
                }}
                title={lang === 'ar' ? "اللهجة" : "Accent"}
                aria-label={lang === 'ar' ? "قائمة اللهجات" : "Accent Selector"}
                aria-haspopup="true"
                aria-expanded={isAccentDropdownOpen}
              >
                {selectedAccent === 'none' 
                  ? (lang === 'ar' ? 'اللهجات' : 'Dialects') 
                  : ACCENTS.find(a => a.id === selectedAccent)?.label
                }
                
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                     style={{ transform: isAccentDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {isAccentDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  marginBottom: '8px',
                  left: lang === 'ar' ? '0' : 'auto',
                  right: lang === 'ar' ? 'auto' : '0',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '160px',
                  zIndex: 200,
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  <div style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--v2-text-muted)', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'اختر لهجة سورية' : 'Select Dialect'}
                  </div>
                    {/* Default Option */}
                    <button
                        onClick={() => {
                          setSelectedAccent('none');
                          setIsAccentDropdownOpen(false);
                        }}
                        style={{
                          appearance: 'none',
                          background: selectedAccent === 'none' ? 'var(--v2-beige-200)' : 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'var(--v2-text-primary)',
                          marginBottom: '2px',
                          width: '100%'
                        }}
                        role="option"
                        aria-selected={selectedAccent === 'none'}
                      >
                        <span>{lang === 'ar' ? 'افتراضي' : 'Default'}</span>
                        {selectedAccent === 'none' && <span style={{ fontWeight: 'bold', color: 'var(--v2-green-700)' }}>✓</span>}
                    </button>

                    {ACCENTS.filter(a => a.id !== 'none').map(accent => {
                      const isSelected = selectedAccent === accent.id;
                      return (
                      <button
                        key={accent.id}
                        onClick={() => {
                          setSelectedAccent(accent.id);
                          setIsAccentDropdownOpen(false);
                        }}
                        style={{
                          appearance: 'none',
                          background: isSelected ? 'var(--v2-beige-200)' : 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'var(--v2-text-primary)',
                          marginBottom: '2px',
                          width: '100%'
                        }}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>{accent.label}</span>
                        {isSelected && <span style={{ fontWeight: 'bold', color: 'var(--v2-green-700)' }}>✓</span>}
                      </button>
                    )})}
                </div>
              )}
            </div>
            
            {/* Send Button */}
            <button 
              onClick={() => handleSubmit()}
              style={{
                backgroundColor: 'var(--v2-green-700)',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}>
              <img src={sendIcon} alt="Send" style={{ width: '18px', height: '18px', filter: 'invert(1)' }} />
            </button>
          </>
        )}






        

      </div>
      
      <div style={{
        marginTop: '6px',
        color: '#666',
        fontSize: isMobile ? '10px' : '11px',
        textAlign: 'center',
        opacity: 0.7,
        maxWidth: '600px',
        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
      }}>
        {t('betaWarning')}
      </div>
    </div>
    </>
  );
};

export default InputArea;
