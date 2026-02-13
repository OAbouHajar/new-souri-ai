/**
 * Mobile utilities for better keyboard handling and device detection
 */

import { useState, useEffect } from 'react';

export interface ViewportInfo {
  width: number;
  height: number;
  isKeyboardVisible: boolean;
  keyboardHeight: number;
  safeAreaInsets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface MobileDetection {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  supportsVisualViewport: boolean;
}

/**
 * Detect mobile device and browser capabilities
 */
export function detectMobile(): MobileDetection {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
                   !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const isSafari = /safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent);
  const isChrome = /chrome|chromium|crios/i.test(userAgent);
  const supportsVisualViewport = typeof window !== 'undefined' && !!window.visualViewport;

  return {
    isMobile,
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    supportsVisualViewport,
  };
}

/**
 * Get safe area insets for modern mobile devices
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0', 10),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0', 10),
  };
}

/**
 * Enhanced keyboard detection with multiple strategies
 */
export class MobileKeyboardDetector {
  private initialViewportHeight: number;
  private stableViewportHeight: number;
  private keyboardDetectionTimeout: NodeJS.Timeout | null = null;
  private callbacks: Set<(isVisible: boolean, height: number) => void> = new Set();
  private mobileInfo: MobileDetection;
  private isKeyboardVisible = false;
  private keyboardHeight = 0;

  constructor() {
    this.mobileInfo = detectMobile();
    this.initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    this.stableViewportHeight = this.initialViewportHeight;
    
    if (this.mobileInfo.isMobile) {
      this.setupListeners();
    }
  }

  private setupListeners() {
    // Visual Viewport API (most reliable when available)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleViewportChange);
    }

    // Fallback for older browsers
    window.addEventListener('resize', this.handleWindowResize);
    
    // Focus/blur detection for inputs
    document.addEventListener('focusin', this.handleFocusIn, true);
    document.addEventListener('focusout', this.handleFocusOut, true);

    // Orientation change detection
    window.addEventListener('orientationchange', this.handleOrientationChange);
  }

  private handleViewportChange = () => {
    if (this.keyboardDetectionTimeout) {
      clearTimeout(this.keyboardDetectionTimeout);
    }

    this.keyboardDetectionTimeout = setTimeout(() => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = this.stableViewportHeight - currentHeight;
      
      // Adjust threshold based on device type
      const threshold = this.mobileInfo.isIOS ? 120 : 100;
      const wasKeyboardVisible = this.isKeyboardVisible;
      this.isKeyboardVisible = heightDifference > threshold;
      this.keyboardHeight = Math.max(0, heightDifference);

      // Update CSS custom properties
      this.updateCSSProperties();

      // Only notify if state changed
      if (wasKeyboardVisible !== this.isKeyboardVisible) {
        this.notifyCallbacks();
        this.updateBodyClasses();
      }
    }, 50);
  };

  private handleWindowResize = () => {
    // Fallback for browsers without Visual Viewport API
    if (!window.visualViewport) {
      this.handleViewportChange();
    }
  };

  private handleFocusIn = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (this.isInputElement(target)) {
      document.body.classList.add('input-focused');
      
      // Force detection after a delay (iOS Safari needs this)
      setTimeout(() => {
        this.handleViewportChange();
        
        // Additional check for iOS Safari
        if (this.mobileInfo.isIOS && this.mobileInfo.isSafari) {
          setTimeout(() => {
            const currentHeight = window.visualViewport?.height || window.innerHeight;
            if (currentHeight < this.stableViewportHeight * 0.85) {
              this.isKeyboardVisible = true;
              this.keyboardHeight = this.stableViewportHeight - currentHeight;
              this.notifyCallbacks();
              this.updateBodyClasses();
            }
          }, 500);
        }
      }, 100);
    }
  };

  private handleFocusOut = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (this.isInputElement(target)) {
      document.body.classList.remove('input-focused');
      
      // Delay detection to allow for input switching
      setTimeout(() => {
        if (!document.querySelector('input:focus, textarea:focus, [contenteditable]:focus')) {
          this.handleViewportChange();
        }
      }, 100);
    }
  };

  private handleOrientationChange = () => {
    // Reset stable height on orientation change
    setTimeout(() => {
      this.stableViewportHeight = window.visualViewport?.height || window.innerHeight;
      this.initialViewportHeight = this.stableViewportHeight;
      this.handleViewportChange();
    }, 500);
  };

  private isInputElement(element: HTMLElement): boolean {
    return element.tagName === 'INPUT' || 
           element.tagName === 'TEXTAREA' || 
           element.contentEditable === 'true';
  }

  private updateCSSProperties() {
    const currentHeight = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty('--viewport-height', `${currentHeight}px`);
    document.documentElement.style.setProperty('--keyboard-height', `${this.keyboardHeight}px`);
  }

  private updateBodyClasses() {
    if (this.isKeyboardVisible) {
      document.body.classList.add('keyboard-visible', 'mobile-keyboard-active');
    } else {
      document.body.classList.remove('keyboard-visible', 'mobile-keyboard-active');
    }
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.isKeyboardVisible, this.keyboardHeight);
      } catch (error) {
        console.error('Error in keyboard detector callback:', error);
      }
    });
  }

  /**
   * Subscribe to keyboard visibility changes
   */
  public onKeyboardToggle(callback: (isVisible: boolean, height: number) => void) {
    this.callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get current keyboard state
   */
  public getKeyboardState() {
    return {
      isVisible: this.isKeyboardVisible,
      height: this.keyboardHeight,
    };
  }

  /**
   * Force a keyboard detection check
   */
  public forceCheck() {
    this.handleViewportChange();
  }

  /**
   * Clean up listeners
   */
  public destroy() {
    if (this.keyboardDetectionTimeout) {
      clearTimeout(this.keyboardDetectionTimeout);
    }

    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.handleViewportChange);
    }

    window.removeEventListener('resize', this.handleWindowResize);
    document.removeEventListener('focusin', this.handleFocusIn, true);
    document.removeEventListener('focusout', this.handleFocusOut, true);
    window.removeEventListener('orientationchange', this.handleOrientationChange);

    document.body.classList.remove('keyboard-visible', 'mobile-keyboard-active', 'input-focused');
    document.documentElement.style.removeProperty('--viewport-height');
    document.documentElement.style.removeProperty('--keyboard-height');

    this.callbacks.clear();
  }
}

/**
 * Utility to scroll element into view considering mobile keyboard
 */
export function scrollIntoViewMobile(
  element: HTMLElement,
  options: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
    offset?: number;
  } = {}
) {
  const { behavior = 'smooth', block = 'end', inline = 'nearest', offset = 20 } = options;
  
  const mobileInfo = detectMobile();
  if (!mobileInfo.isMobile) {
    element.scrollIntoView({ behavior, block, inline });
    return;
  }

  // Enhanced mobile scrolling with keyboard consideration
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const isKeyboardVisible = viewportHeight < window.screen.height * 0.85;
  
  if (isKeyboardVisible) {
    // When keyboard is visible, scroll to ensure element is above keyboard
    const targetY = rect.bottom + offset;
    const maxY = viewportHeight - 60; // Leave some space from keyboard
    
    if (targetY > maxY) {
      const scrollAmount = targetY - maxY;
      window.scrollBy({ top: scrollAmount, behavior });
    }
  } else {
    // Normal scrolling when keyboard is not visible
    element.scrollIntoView({ behavior, block, inline });
  }
}

/**
 * Hook for React components to use mobile keyboard detection
 */
export function useMobileKeyboard() {
  if (typeof window === 'undefined') {
    return { isKeyboardVisible: false, keyboardHeight: 0 };
  }

  const [state, setState] = useState({ isKeyboardVisible: false, keyboardHeight: 0 });
  
  useEffect(() => {
    const detector = new MobileKeyboardDetector();
    
    const unsubscribe = detector.onKeyboardToggle((isVisible, height) => {
      setState({ isKeyboardVisible: isVisible, keyboardHeight: height });
    });

    // Get initial state
    const initialState = detector.getKeyboardState();
    setState({ isKeyboardVisible: initialState.isVisible, keyboardHeight: initialState.height });

    return () => {
      unsubscribe();
      detector.destroy();
    };
  }, []);

  return state;
}

// Import React for the hook (already imported above)