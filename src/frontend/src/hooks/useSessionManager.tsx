import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface SessionManagerState {
  activeSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface SessionManagerActions {
  switchToSession: (sessionId: string) => Promise<void>;
  createNewSession: () => Promise<string | null>;
  updateSessionName: (sessionId: string, newName: string) => Promise<boolean>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  clearActiveSession: () => void;
}

export interface UseSessionManagerReturn extends SessionManagerState, SessionManagerActions {}

export const useSessionManager = (): UseSessionManagerReturn => {
  const { loadSessions } = useAuth();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchToSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Switch to the selected session
      setActiveSessionId(sessionId);
      
      // Clear any existing cookies to start fresh
      document.cookie = 'thread_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = 'agent_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      
      console.log(`Switched to session: ${sessionId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch session';
      setError(errorMessage);
      console.error('Error switching session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewSession = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/chat/sessions/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const newSessionId = data.session.session_id;
        
        // Switch to the new session
        setActiveSessionId(newSessionId);
        
        // Clear any existing cookies
        document.cookie = 'thread_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'agent_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        
        // Reload sessions to get the updated list
        await loadSessions();
        
        console.log(`Created new session: ${newSessionId}`);
        return newSessionId;
      } else {
        throw new Error('Failed to create new session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create new session';
      setError(errorMessage);
      console.error('Error creating new session:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadSessions]);

  const updateSessionName = useCallback(async (sessionId: string, newName: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/chat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ session_name: newName }),
      });

      if (response.ok) {
        // Reload sessions to get the updated list
        await loadSessions();
        console.log(`Updated session ${sessionId} name to: ${newName}`);
        return true;
      } else {
        throw new Error('Failed to update session name');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update session name';
      setError(errorMessage);
      console.error('Error updating session name:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadSessions]);

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // If we're deleting the active session, clear the active session
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          // Clear cookies as well
          document.cookie = 'thread_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          document.cookie = 'agent_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
        
        // Reload sessions to get the updated list
        await loadSessions();
        console.log(`Deleted session: ${sessionId}`);
        return true;
      } else {
        throw new Error('Failed to delete session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete session';
      setError(errorMessage);
      console.error('Error deleting session:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, loadSessions]);

  const clearActiveSession = useCallback(() => {
    setActiveSessionId(null);
    setError(null);
    // Clear cookies
    document.cookie = 'thread_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'agent_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }, []);

  return {
    activeSessionId,
    isLoading,
    error,
    switchToSession,
    createNewSession,
    updateSessionName,
    deleteSession,
    clearActiveSession,
  };
};
