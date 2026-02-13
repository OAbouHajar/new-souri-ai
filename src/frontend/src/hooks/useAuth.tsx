import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  auth_provider?: 'microsoft' | 'custom';
  email_verified?: boolean;
  created_at?: string;
  last_login?: string;
}

export interface ChatSession {
  session_id: string;
  session_name: string;
  created_at: string;
  last_message_at: string;
  agent_id: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessions: ChatSession[];
  sessionsLoading: boolean;
  login: () => void;
  logout: () => void;
  loadSessions: () => Promise<void>;
  customLogin: (user: User) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const isAuthenticated = user !== null;
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // For development, check localStorage first for mock user
      if (isDevelopment) {
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          const userData = JSON.parse(mockUser);
          setUser(userData);
          setIsLoading(false);
          return;
        }
      }

      // First, try to check for custom auth user
      try {
        const userResponse = await fetch('/auth/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.authenticated && userData.user) {
            console.log('Custom auth user found:', userData.user);
            setUser({
              id: userData.user.id,
              name: userData.user.name,
              email: userData.user.email,
              address: userData.user.address,
              auth_provider: userData.user.auth_provider || 'custom',
              email_verified: userData.user.email_verified,
              created_at: userData.user.created_at,
              last_login: userData.user.last_login
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Custom auth check failed, trying Microsoft auth');
      }

      // Add a small delay if we're on the auth redirect page to allow cookies to be set
      if (window.location.pathname === '/.auth/login/done') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const response = await fetch('/.auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('Auth response status:', response.status);
      
      if (response.ok) {
        const authData = await response.json();
        console.log('Auth data received:', authData);
        
        // Azure App Service returns user info in this format
        if (authData && authData.length > 0 && authData[0].user_claims) {
          const claims = authData[0].user_claims;
          console.log('User claims:', claims);
          
          const nameClaimType = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
          const emailClaimType = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
          const idClaimType = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
          
          const name = claims.find((claim: any) => claim.typ === nameClaimType)?.val || 'User';
          const email = claims.find((claim: any) => claim.typ === emailClaimType)?.val || '';
          const id = claims.find((claim: any) => claim.typ === idClaimType)?.val || '';

          console.log('Extracted user info:', { id, name, email });

          setUser({
            id,
            name,
            email,
            auth_provider: 'microsoft'
          });
        } else {
          console.log('No user claims found in auth data');
        }
      } else {
        console.log('Auth check failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (isDevelopment) {
      try {
        // Mock login for development using the backend endpoint
        const mockUser: User = {
          id: 'dev-user-123',
          name: 'Development User',
          email: 'dev@example.com',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };

        const response = await fetch('/.auth/login/mock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockUser),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('mockUser', JSON.stringify(data.user));
          setUser(data.user);
        } else {
          console.error('Mock login failed');
          // Fallback to localStorage-only approach
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Error during mock login:', error);
        // Fallback to localStorage-only approach
        const mockUser: User = {
          id: 'dev-user-123',
          name: 'Development User',
          email: 'dev@example.com',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
      }
    } else {
      // Redirect to Azure AD login
      window.location.href = '/.auth/login/aad';
    }
  };

  const loadSessions = async () => {
    if (!isAuthenticated) return;
    
    setSessionsLoading(true);
    try {
      const response = await fetch('/chat/sessions', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else {
        console.error('Failed to load sessions');
        setSessions([]);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // First clear local state
      setUser(null);
      setSessions([]);
      
      if (isDevelopment) {
        // For development, use mock logout endpoint
        try {
          await fetch('/.auth/logout/mock', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Error during mock logout:', error);
        }
        // Clear localStorage regardless
        localStorage.removeItem('mockUser');
      } else {
        // Use custom logout endpoint that handles both auth types
        try {
          const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.redirect) {
              window.location.href = result.redirect;
              return;
            }
          }
        } catch (error) {
          console.error('Error during custom logout:', error);
        }
        
        // Removed Azure fallback logout redirect to keep user on custom flow
        // Optionally force a hard refresh to clear any residual cached auth state:
        // window.location.reload();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const customLogin = (user: User) => {
    setUser(user);
    console.log('Custom user logged in:', user);
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  // Load sessions when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    sessions,
    sessionsLoading,
    login,
    logout,
    loadSessions,
    customLogin,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
