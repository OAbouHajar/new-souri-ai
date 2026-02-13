import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import AnnouncementBanner from '../components/AnnouncementBanner';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import InfoPage, { InfoPageType } from '../pages/InfoPage';
import SplashScreen from '../components/SplashScreen';
import InputArea from '../components/InputArea';
import '../styles/variables.css';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from '../components/AuthModal';
import { trackPageView } from '../../utils/telemetry';

import { useLanguage } from '../../hooks/useLanguage';
// @ts-ignore
import headerPattern from '../icons/header-pattern.svg?url';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Layout: React.FC = () => {
  const { t, lang } = useLanguage();
  const { user, customLogin, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<'chat' | InfoPageType>('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fetchAbortRef = useRef<AbortController | null>(null);
  
  // Simple session ID management for now
  const [sessionId] = useState<string | null>(null);

  const isHome = messages.length === 0;

  useEffect(() => {
    let pageName: string = currentView;
    if (currentView === 'chat') {
      pageName = isHome ? 'Home' : 'Chat';
    }
    // Capitalize first letter
    pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    trackPageView(pageName);
  }, [currentView, isHome]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewChat = async () => {
    // Abort any ongoing request
    if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
        fetchAbortRef.current = null;
    }
    
    setIsResponding(false);
    setMessages([]);
    setCurrentView('chat');

    // Call backend to reset thread
    try {
        await fetch("/chat/thread/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        console.error("Failed to reset chat thread", e);
    }
  };

  const handleSend = async (text: string, toneInstruction?: string) => {
    if (!text.trim() || isResponding) return;

    // Add user message to UI (without instruction)
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsResponding(true);
    
    // If there is a tone instruction, append it to the message sent to backend only
    // Use a separator to make it clear for the model if needed, or just append.
    // However, backend typically handles 'message' as the user prompt.
    // If we want it strictly hidden, we send it here.
    const messageToSend = toneInstruction 
        ? `${text}\n\n[Instruction: ${toneInstruction}]` 
        : text;

    try {
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      if (!response.body) {
         throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      
      // Placeholder for assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        buffer += textChunk;
        
        // Process lines
        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
           const chunk = buffer.slice(0, boundary).trim();
           buffer = buffer.slice(boundary + 1);
           
           if (chunk.startsWith("data: ")) {
              try {
                const jsonStr = chunk.slice(6);
                const data = JSON.parse(jsonStr);

                if (data.type === "stream_end") {
                   setIsResponding(false);
                   break; 
                } else if (data.type === "completed_message") {
                   // accumulatedContent = data.content; 
                   // The completed_message might have slight differences or be cleaner, but using accumulated is smoother for streaming. 
                   // Let's trust streaming updates for now or ensure we render final markdown.
                   setIsResponding(false); 
                } else if (data.content) {
                   // Append chunk
                   accumulatedContent += data.content;
                   setMessages(prev => {
                      const newMsgs = [...prev];
                      const lastMsg = newMsgs[newMsgs.length - 1];
                      if (lastMsg.role === 'assistant') {
                          lastMsg.content = accumulatedContent;
                      }
                      return newMsgs;
                   });
                }
              } catch (e) {
                console.error("Error parsing SSE JSON", e);
              }
           }

           boundary = buffer.indexOf("\n");
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
          console.log('Request aborted');
      } else {
        console.error("Chat error:", error);
        setMessages(prev => [...prev, { role: 'assistant', content: "عذراً، حدث خطأ أثناء الاتصال بالخادم." }]);
      }
    } finally {
      setIsResponding(false);
      fetchAbortRef.current = null;
    }
  };

  return (
    <div data-v2-root style={{ paddingTop: '75px', position: 'relative' }}>
      {/* Texture Overlay (Bottom) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '400px',
        backgroundImage: `url(${headerPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px',
        opacity: 0.4, // 3% opacity
        maskImage: 'linear-gradient(to top, black, transparent)',
        WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {showSplash && <SplashScreen />}
      
      {/* Menu Overlay */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-start', // RTL: flex-start on left? Actually we want it on the side where the button is.
          direction: 'rtl'
        }} onClick={() => setIsMenuOpen(false)}>
            <div style={{
                position: 'absolute', // To allow animation slide
                [lang === 'ar' ? 'right' : 'left']: 0, 
                top: 0,
                bottom: 0,
                width: '80%',
                maxWidth: '300px',
                backgroundColor: 'white',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: lang === 'ar' ? 'slideInRight 0.3s ease-out' : 'slideInLeft 0.3s ease-out',
                direction: lang === 'ar' ? 'rtl' : 'ltr'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0, color: 'var(--v2-green-900)' }}>{t('v2_menu')}</h2>
                    <button onClick={() => setIsMenuOpen(false)} style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--v2-green-900)', 
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <button onClick={() => { setCurrentView('chat'); setIsMenuOpen(false); }} style={{ 
                    padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: currentView === 'chat' ? 'var(--v2-green-50)' : 'transparent', borderRadius: '8px', color: 'var(--v2-green-900)', fontWeight: 'bold' 
                }}>{t('v2_home')}</button>
                
                {/* 
                <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} style={{ 
                    padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: 'transparent', borderRadius: '8px', color: 'var(--v2-green-900)' 
                }}>تسجيل الدخول</button>
                */}

                <div style={{ height: '1px', backgroundColor: '#eee', margin: '8px 0' }}></div>
                
                <button onClick={() => { setCurrentView('about'); setIsMenuOpen(false); }} style={{ 
                    padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: currentView === 'about' ? 'var(--v2-green-50)' : 'transparent', borderRadius: '8px', color: 'var(--v2-text-primary)' 
                }}>{t('v2_howItWorks_menu')}</button>
                
                <button onClick={() => { setCurrentView('privacy'); setIsMenuOpen(false); }} style={{ 
                    padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: currentView === 'privacy' ? 'var(--v2-green-50)' : 'transparent', borderRadius: '8px', color: 'var(--v2-text-primary)' 
                }}>{t('v2_privacyPolicy')}</button>
                
                <button onClick={() => { setCurrentView('contribute'); setIsMenuOpen(false); }} style={{ 
                    padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: currentView === 'contribute' ? 'var(--v2-green-50)' : 'transparent', borderRadius: '8px', color: 'var(--v2-text-primary)' 
                }}>{t('v2_howToContribute')}</button>
            </div>
        </div>
      )}

      <Header 
        onNewChat={handleNewChat} 
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={logout}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <AnnouncementBanner />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={customLogin}
      />
      
      <main style={{ 
        paddingBottom: currentView === 'chat' ? '120px' : '0',
        position: 'relative',
        zIndex: 1 
      }}>
        {currentView === 'chat' ? (
           messages.length === 0 ? (
             <Home onSuggestionClick={handleSend} />
           ) : (
             <Chat messages={messages} onClearChat={handleNewChat} isResponding={isResponding} />
           )
        ) : (
           <InfoPage 
             type={currentView} 
             onBack={() => setCurrentView('chat')} 
             onNavigate={(type) => setCurrentView(type)}
           />
        )}
      </main>
      
      {currentView === 'chat' && <InputArea onSend={handleSend} />}
    </div>
  );
};

export default Layout;
