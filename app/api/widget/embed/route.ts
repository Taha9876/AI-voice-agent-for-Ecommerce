import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const primaryColor = searchParams.get("color") || "#3b82f6"
  const position = searchParams.get("position") || "bottom-right"
  const name = searchParams.get("name") || "AI Assistant"
  const platform = searchParams.get("platform") || "generic" // New: identify platform
  const shopifyDomain = searchParams.get("shopifyDomain") || "" // Specific for Shopify

  // Get the API URL from environment or use the request origin as fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`

  // Generate the embed script
  const embedScript = `
(function() {
  console.log('AI Voice Widget Loading...');
  
  const WIDGET_CONTAINER_ID = 'ai-voice-widget-container';
  const TOGGLE_BUTTON_ID = 'ai-voice-widget-toggle-button';
  const IFRAME_ID = 'ai-voice-widget-iframe';

  let widgetContainer = document.getElementById(WIDGET_CONTAINER_ID);
  if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.id = WIDGET_CONTAINER_ID;
    document.body.appendChild(widgetContainer);
  }

  let toggleButton = document.getElementById(TOGGLE_BUTTON_ID);
  if (!toggleButton) {
    toggleButton = document.createElement('button');
    toggleButton.id = TOGGLE_BUTTON_ID;
    toggleButton.innerHTML = '💬'; // Chat bubble icon
    toggleButton.style.cssText = \`
      position: fixed;
      ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
      width: 60px;
      height: 60px;
      background: ${primaryColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: none;
      outline: none;
      transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    \`;
    widgetContainer.appendChild(toggleButton);
  }

  let iframe = document.getElementById(IFRAME_ID);
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = IFRAME_ID;
    
    const config = {
      name: '${name}',
      primaryColor: '${primaryColor}',
      position: '${position}',
      apiUrl: '${apiUrl}',
      platform: '${platform}',
      shopifyDomain: '${shopifyDomain}'
    };

    iframe.src = \`${apiUrl}/widget/iframe?config=\${encodeURIComponent(JSON.stringify(config))}\`;
    iframe.style.cssText = \`
      position: fixed;
      ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
      width: 320px;
      height: 400px;
      border: none;
      z-index: 9998; /* Below button when closed, above when open */
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      opacity: 0;
      visibility: hidden;
      transform: scale(0.8);
      display: none; /* NEW: Ensure it's hidden initially */
      background-color: transparent; /* FIX FOR WHITE BOX */
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
    \`;
    widgetContainer.appendChild(iframe);
  }

  let isWidgetOpen = false;

  const openWidget = () => {
    isWidgetOpen = true;
    iframe.style.display = 'block'; /* NEW: Show iframe */
    iframe.style.opacity = '1';
    iframe.style.visibility = 'visible';
    iframe.style.transform = 'scale(1)';
    toggleButton.style.opacity = '0'; // Hide the button when widget is open
    toggleButton.style.transform = 'scale(0)';
    iframe.style.zIndex = '9999'; // Bring iframe to front
  };

  const closeWidget = () => {
    isWidgetOpen = false;
    iframe.style.opacity = '0';
    iframe.style.visibility = 'hidden';
    iframe.style.transform = 'scale(0.8)';
    toggleButton.style.opacity = '1'; // Show the button when widget is closed
    toggleButton.style.transform = 'scale(1)';
    iframe.style.zIndex = '9998'; // Send iframe back
    setTimeout(() => {
      iframe.style.display = 'none'; /* NEW: Hide iframe after transition */
    }, 300); // Match transition duration
  };

  toggleButton.onclick = function() {
    if (isWidgetOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  };

  // Listen for messages from the iframe to close the widget
  window.addEventListener('message', function(event) {
    if (event.source === iframe.contentWindow) {
      if (event.data.type === 'CLOSE_WIDGET') {
        closeWidget();
      }
      // Forward context requests to the iframe
      if (event.data.type === 'REQUEST_CONTEXT') {
        let currentContext = {
          currentPage: window.location.pathname,
          title: document.title,
          url: window.location.href,
          platform: '${platform}',
          shopifyData: window.shopifyContext || {} // Use global Shopify context if available
        };
        iframe.contentWindow.postMessage({
          type: 'CONTEXT_UPDATE',
          context: currentContext
        }, '*');
      }
    }
  });

  // Observe URL changes to send context updates
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        if (iframe.contentWindow && isWidgetOpen) { // Only update if widget is open
          iframe.contentWindow.postMessage({
            type: 'CONTEXT_UPDATE',
            context: {
              currentPage: window.location.pathname,
              title: document.title,
              url: window.location.href,
              platform: '${platform}',
              shopifyData: window.shopifyContext || {}
            }
          }, '*');
        }
      }, 500); // Small delay to ensure page content is loaded
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial context send (after a short delay to ensure iframe is ready)
  setTimeout(() => {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'CONTEXT_UPDATE',
        context: {
          currentPage: window.location.pathname,
          title: document.title,
          url: window.location.href,
          platform: '${platform}',
          shopifyData: window.shopifyContext || {}
        }
      }, '*');
    }
  }, 1000);
})();
`

  return new Response(embedScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
