import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shopifyDomain = searchParams.get("domain")
  const primaryColor = searchParams.get("color") || "#3b82f6"
  const position = searchParams.get("position") || "bottom-right"
  const name = searchParams.get("name") || "AI Shopping Assistant"

  // Get the API URL from environment or use the request origin as fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`

  // Generate the Shopify-specific embed script
  const embedScript = `
(function() {
  console.log('Shopify AI Voice Widget Loading...');
  
  const widgetContainerId = 'ai-voice-widget-container';
  let widgetContainer = document.getElementById(widgetContainerId);

  if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.id = widgetContainerId;
    document.body.appendChild(widgetContainer);
  }

  // Create the main toggle button (chat bubble)
  const toggleButtonId = 'ai-voice-widget-toggle-button';
  let toggleButton = document.getElementById(toggleButtonId);

  if (!toggleButton) {
    toggleButton = document.createElement('button');
    toggleButton.id = toggleButtonId;
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
      transition: transform 0.2s ease-in-out;
    \`;
    widgetContainer.appendChild(toggleButton);
  }

  // Create widget iframe
  const iframeId = 'ai-voice-widget-iframe';
  let iframe = document.getElementById(iframeId);

  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.src = \`${apiUrl}/widget/iframe?config=\${encodeURIComponent(JSON.stringify({
      shopifyDomain: '${shopifyDomain}',
      name: '${name}',
      primaryColor: '${primaryColor}',
      position: '${position}',
      apiUrl: '${apiUrl}',
      platform: 'shopify'
    }))}\`;
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
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
    \`;
    widgetContainer.appendChild(iframe);
  }

  let isWidgetOpen = false;

  const openWidget = () => {
    isWidgetOpen = true;
    iframe.style.opacity = '1';
    iframe.style.visibility = 'visible';
    iframe.style.transform = 'scale(1)';
    toggleButton.style.transform = 'scale(0)'; // Hide the button when widget is open
    iframe.style.zIndex = '9999'; // Bring iframe to front
  };

  const closeWidget = () => {
    isWidgetOpen = false;
    iframe.style.opacity = '0';
    iframe.style.visibility = 'hidden';
    iframe.style.transform = 'scale(0.8)';
    toggleButton.style.transform = 'scale(1)'; // Show the button when widget is closed
    iframe.style.zIndex = '9998'; // Send iframe back
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
    if (event.source === iframe.contentWindow && event.data.type === 'CLOSE_WIDGET') {
      closeWidget();
    }
    // Forward context requests to the iframe
    if (event.source === iframe.contentWindow && event.data.type === 'REQUEST_CONTEXT') {
      iframe.contentWindow.postMessage({
        type: 'CONTEXT_UPDATE',
        context: getShopifyContext()
      }, '*');
    }
  });

  // Shopify-specific context detection
  function getShopifyContext() {
    const context = {
      platform: 'shopify',
      currentPage: window.location.pathname,
      title: document.title,
      shopifyData: window.shopifyContext || {},
      products: extractShopifyProducts(),
      collections: extractShopifyCollections(),
      cart: extractShopifyCart()
    };
    return context;
  }

  function extractShopifyProducts() {
    const products = [];
    if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta) {
      const meta = window.ShopifyAnalytics.meta;
      if (meta.product) {
        products.push({
          id: meta.product.id,
          title: meta.product.title,
          price: meta.product.price,
          vendor: meta.product.vendor,
          type: meta.product.type
        });
      }
    }
    if (products.length === 0) {
      const productElements = document.querySelectorAll('[data-product-id], .product, .product-item');
      productElements.forEach(el => {
        const title = el.querySelector('.product-title, .product__title, h1, h2')?.textContent?.trim();
        const price = el.querySelector('.price, .product-price, [class*="price"]')?.textContent?.trim();
        if (title) {
          products.push({ title, price });
        }
      });
    }
    return products.slice(0, 10);
  }

  function extractShopifyCollections() {
    const collections = [];
    const navElements = document.querySelectorAll('nav a, .nav-item a, .collection-link');
    navElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 50 && !text.toLowerCase().includes('cart') && !text.toLowerCase().includes('account')) {
        collections.push(text);
      }
    });
    return [...new Set(collections)].slice(0, 8);
  }

  function extractShopifyCart() {
    let cartCount = 0;
    const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count], .cart__count, .header__cart-count');
    cartCountElements.forEach(el => {
      const count = parseInt(el.textContent?.trim() || '0');
      if (count > cartCount) cartCount = count;
    });
    if (window.theme && window.theme.cart) {
      cartCount = window.theme.cart.item_count || cartCount;
    }
    return { itemCount: cartCount };
  }

  // Listen for Shopify-specific events
  document.addEventListener('cart:updated', function() {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'CONTEXT_UPDATE',
        context: getShopifyContext()
      }, '*');
    }
  });

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'CONTEXT_UPDATE',
            context: getShopifyContext()
          }, '*');
        }
      }, 500);
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial context send (after a short delay to ensure iframe is ready)
  setTimeout(() => {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'CONTEXT_UPDATE',
        context: getShopifyContext()
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
