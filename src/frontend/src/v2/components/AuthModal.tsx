import React, { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// Simplified Hook usage or direct props if simpler, but usage of existing context is good.
// We assume Language context might not be fully V2 ready, so we use English/Arabic defaults here.
// But we'll try to use t() if available from context.

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPassword: '' });

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 61, 46, 0.6)', // --v2-green-900 with opacity
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    fontFamily: 'var(--v2-font-family)',
  };
  
  const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--v2-beige-100)',
    padding: isMobile ? '1.5rem' : '2rem',
    borderRadius: '16px',
    width: isMobile ? '95%' : '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--v2-gold-500)',
    position: 'relative',
    direction: 'rtl', // Ensure RTL for Arabic layout
  };
  
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid var(--v2-beige-300)',
    backgroundColor: 'var(--v2-beige-200)', // Lighter beige for inputs
    color: 'var(--v2-text-primary)',
    fontSize: '1rem',
    outline: 'none',
    textAlign: 'right', // Arabic Input
  };
  
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--v2-green-700)',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  };
  
  const linkButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    color: 'var(--v2-green-900)',
    fontSize: '0.9rem',
    marginTop: '1rem',
    display: 'block',
    width: '100%',
    textAlign: 'center',
    fontWeight: 600
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.detail?.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.detail?.message || 'فشل إنشاء الحساب');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div 
        style={modalStyle} 
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()} 
      >
        <button 
            onClick={onClose}
            style={{
                position: 'absolute',
                left: '16px',
                top: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--v2-text-muted)',
                lineHeight: 1
            }}
        >
            &times;
        </button>

        <h2 style={{ color: 'var(--v2-green-900)', marginTop: 0, textAlign: 'center', marginBottom: '1.5rem' }}>
          {view === 'login' ? 'مرحباً بك مجدداً' : 'إنشاء حساب جديد'}
        </h2>
        
        {error && <div style={{ 
            color: '#b91c1c', 
            backgroundColor: '#fef2f2', 
            padding: '10px', 
            borderRadius: '6px',
            marginBottom: '16px', 
            textAlign: 'center',
            border: '1px solid #f87171' 
        }}>{error}</div>}

        <form onSubmit={view === 'login' ? handleLogin : handleSignup}>
          {view === 'signup' && (
            <input
              name="name"
              type="text"
              placeholder="الاسم الكامل"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
            dir="ltr" // Email is usually LTR even in Arabic Interface
            style={{ ...inputStyle, textAlign: 'left' }}
          />
          <input
            name="password"
            type="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            required
            dir="ltr"
            style={{ ...inputStyle, textAlign: 'left' }}
          />
          {view === 'signup' && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              dir="ltr"
              style={{ ...inputStyle, textAlign: 'left' }}
            />
          )}
          
          <button 
            type="submit" 
            style={buttonStyle} 
            disabled={loading}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--v2-green-900)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--v2-green-700)'}
          >
            {loading ? 'جاري المعالجة...' : (view === 'login' ? 'تـسـجـيـل الـدخـول' : 'إنـشـاء حـسـاب')}
          </button>
        </form>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--v2-gold-500)', paddingTop: '16px' }}>
            <button 
            style={linkButtonStyle} 
            onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); }}
            >
            {view === 'login' ? "ليس لديك حساب؟ أنشئ حساباً الآن" : "لديك حساب بالفعل؟ سجل الدخول"}
            </button>
        </div>
        
      </div>
    </div>
  );
};

export default AuthModal;
