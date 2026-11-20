import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface MobilePhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  width?: number;
}

export default function MobilePhoneMockup({
  children,
  className = '',
  height = 760,
  width = 375,
}: MobilePhoneMockupProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [isRealMobile, setIsRealMobile] = useState(false);

  // Detect if user's actual screen is mobile sized
  useEffect(() => {
    const checkScreen = () => {
      setIsRealMobile(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Setup iframe styles and portal mount node
  useEffect(() => {
    if (isRealMobile) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const initIframe = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Ensure viewport meta
      if (!doc.head.querySelector('meta[name="viewport"]')) {
        const meta = doc.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
        doc.head.appendChild(meta);
      }

      // Sync all stylesheets from host document into iframe
      const syncStyles = () => {
        // Remove previously synced styles
        doc.head.querySelectorAll('[data-synced-style]').forEach(el => el.remove());

        const hostElements = document.querySelectorAll('style, link[rel="stylesheet"]');
        hostElements.forEach((el) => {
          const clone = el.cloneNode(true) as HTMLElement;
          clone.setAttribute('data-synced-style', 'true');
          doc.head.appendChild(clone);
        });

        // Add preview visibility guarantee override style
        const overrideStyle = doc.createElement('style');
        overrideStyle.setAttribute('data-synced-style', 'true');
        overrideStyle.textContent = `
          .mobile-preview-body [class*="reveal"],
          .mobile-preview-body .ib-reveal,
          .mobile-preview-body .br-reveal,
          .mobile-preview-body .cp-reveal {
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          }
        `;
        doc.head.appendChild(overrideStyle);
      };

      syncStyles();

      // Setup body styling
      doc.body.style.margin = '0';
      doc.body.style.padding = '0';
      doc.body.style.overflowX = 'hidden';
      doc.body.style.backgroundColor = '#ffffff';
      doc.body.className = 'mobile-preview-body';

      // Observe dynamically added styles in parent document (e.g. Vite HMR or lazy fonts)
      const observer = new MutationObserver(() => {
        syncStyles();
      });
      observer.observe(document.head, { childList: true, subtree: true });

      setMountNode(doc.body);

      return () => observer.disconnect();
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      initIframe();
    } else {
      iframe.addEventListener('load', initIframe);
      return () => iframe.removeEventListener('load', initIframe);
    }
  }, [isRealMobile]);

  // If already on an actual mobile device, render directly full width
  if (isRealMobile) {
    return (
      <div className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto rounded-[42px] border-[11px] border-gray-900 shadow-2xl bg-white flex flex-col overflow-hidden transform-gpu select-none ${className}`}
      style={{
        width: `${width}px`,
        height: typeof height === 'number' ? `${height}px` : height,
        maxWidth: '100%',
      }}
    >
      {/* iPhone Dynamic Island / Speaker Notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-gray-900 rounded-full z-50 pointer-events-none flex items-center justify-end pr-2">
        <span className="w-2 h-2 rounded-full bg-gray-800 border border-gray-700 inline-block" />
      </div>

      {/* Embedded 375px Iframe Viewport */}
      <iframe
        ref={iframeRef}
        title="Mobile Preview Frame"
        className="w-full flex-1 border-none"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />

      {/* Render children inside iframe via React Portal */}
      {mountNode && createPortal(children, mountNode)}
    </div>
  );
}

