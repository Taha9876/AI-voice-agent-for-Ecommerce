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
  // Shopify-specific widget initialization
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'ai-voice-widget-shopify';
  document.body.appendChild(widgetContainer);

  // Enhanced Shopify configuration
  const config = {
    shopifyDomain: '${shopifyDomain}',
    name: '${name}',
    primaryColor: '${primaryColor}',
    position: '${position}',
    apiUrl: '${apiUrl}',
    platform: 'shopify'
  };

  // Create widget iframe
  const iframe = document.createElement('iframe');
  iframe.src = config.apiUrl + '/widget/iframe?config=' + encodeURIComponent(JSON.stringify(config));
  iframe.style.cssText = \`
    position: fixed;
    ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
    ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
    width: 320px;
    height: 400px;
    border: none;
    z-index: 9999;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  \`;

  widgetContainer.appendChild(iframe);

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
    
    // Try to get from Shopify's global variables
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

    // Fallback to DOM extraction
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
    
    // Try navigation elements
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
    
    // Try to get cart count from various common selectors
    const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count], .cart__count, .header__cart-count');
    cartCountElements.forEach(el => {
      const count = parseInt(el.textContent?.trim() || '0');
      if (count > cartCount) cartCount = count;
    });

    // Try Shopify's cart object if available
    if (window.theme && window.theme.cart) {
      cartCount = window.theme.cart.item_count || cartCount;
    }

    return { itemCount: cartCount };
  }

  // Enhanced communication with widget
  window.addEventListener('message', function(event) {
    if (event.data.type === 'REQUEST_CONTEXT') {
      iframe.contentWindow.postMessage({
        type: 'CONTEXT_UPDATE',
        context: getShopifyContext()
      }, '*');
    }
  });

  // Listen for Shopify-specific events
  document.addEventListener('cart:updated', function() {
    iframe.contentWindow.postMessage({
      type: 'CONTEXT_UPDATE',
      context: getShopifyContext()
    }, '*');
  });

  // Update context on page changes (for SPA-like behavior)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        iframe.contentWindow.postMessage({
          type: 'CONTEXT_UPDATE',
          context: getShopifyContext()
        }, '*');
      }, 500); // Small delay to let Shopify update the page
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial context send
  setTimeout(() => {
    iframe.contentWindow.postMessage({
      type: 'CONTEXT_UPDATE',
      context: getShopifyContext()
    }, '*');
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
