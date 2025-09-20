import { useState, useEffect, useCallback, useRef } from 'react';

export const useTapPreviewNavigation = () => {
  const [previewActive, setPreviewActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const tileRef = useRef<HTMLAnchorElement | null>(null);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      const mobileViewport = window.innerWidth <= 768; // Mobile viewport size
      const touchCapable = (
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.userAgent.includes('Mobile') ||
        navigator.userAgent.includes('Android') ||
        navigator.userAgent.includes('iPhone') ||
        /iPad|iPod|iPhone/.test(navigator.userAgent)
      );
      
      // If we're in a mobile viewport, assume touch device for better UX
      return touchCapable || mobileViewport;
    };
    
    const isTouch = checkTouchDevice();
    console.log('Touch device detection:', isTouch, {
      maxTouchPoints: navigator.maxTouchPoints,
      pointerCoarse: window.matchMedia('(pointer: coarse)').matches,
      ontouchstart: 'ontouchstart' in window,
      userAgent: navigator.userAgent.includes('Mobile'),
      mobileViewport: window.innerWidth <= 768,
      windowWidth: window.innerWidth
    });
    setIsTouchDevice(isTouch);
  }, []);

  // Auto-dismiss preview after timeout
  useEffect(() => {
    if (previewActive) {
      const timer = setTimeout(() => {
        setPreviewActive(false);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [previewActive]);

  // Handle click events
  const handleTileClick = useCallback((e: React.MouseEvent, href: string) => {
    console.log('Tile click handler:', {
      isTouchDevice,
      previewActive,
      href,
      eventType: e.type
    });
    
    if (isTouchDevice) {
      if (!previewActive) {
        // First tap: activate preview
        console.log('First tap - preventing default and activating preview');
        e.preventDefault();
        e.stopPropagation();
        setPreviewActive(true);
      } else {
        // Second tap: allow default Link navigation by not preventing default
        console.log('Second tap - allowing navigation');
      }
    } else {
      console.log('Non-touch device - allowing normal navigation');
    }
    // On non-touch devices, always navigate immediately (default behavior)
  }, [isTouchDevice, previewActive]);

  // Reset preview state
  const resetPreview = useCallback(() => {
    setPreviewActive(false);
  }, []);

  // Handle outside clicks to dismiss preview
  useEffect(() => {
    if (previewActive) {
      const handleOutsideClick = (event: MouseEvent) => {
        // Only dismiss if the click is outside the tile
        if (tileRef.current && !tileRef.current.contains(event.target as Node)) {
          console.log('Outside click detected - dismissing preview');
          setPreviewActive(false);
        }
      };

      const handleScroll = () => {
        console.log('Scroll detected - dismissing preview');
        setPreviewActive(false);
      };

      // Use a small delay to avoid immediate dismissal
      const timer = setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('scroll', handleScroll);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, [previewActive]);

  return {
    previewActive,
    isTouchDevice,
    handleTileClick,
    resetPreview,
    tileRef
  };
};