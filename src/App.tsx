import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Intercept network/unhandled promise errors from external scripts gracefully
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      } catch (_) {}
    };

    const handleGlobalError = (event: ErrorEvent) => {
      try {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      } catch (_) {}
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.addEventListener('error', handleGlobalError, true);

    // Clean up any previous script or container contents to ensure fresh agent load
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://agent.d-id.com/v2/index.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    const container = document.getElementById('did-container');
    if (container) {
      container.innerHTML = '';
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.setAttribute('data-mode', 'full');
    script.setAttribute('data-client-key', 'ck_OO4TWPiyzqbHV6mijfzTs');
    script.setAttribute('data-agent-id', 'v2_agt_PIurXsZC');
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-target-id', 'did-container');
    script.onerror = () => {
      console.warn('[Notice] D-ID script initialization pending network connection.');
    };
    document.head.appendChild(script);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      window.removeEventListener('error', handleGlobalError, true);
    };
  }, []);

  return (
    <div id="kiosk">
      <div id="did-container"></div>
    </div>
  );
}

