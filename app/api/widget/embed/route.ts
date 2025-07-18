import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const websiteId = searchParams.get("id")
  const primaryColor = searchParams.get("color") || "#3b82f6"
  const position = searchParams.get("position") || "bottom-right"
  const name = searchParams.get("name") || "AI Shopping Assistant"

  // Get the API URL from environment or use the request origin as fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`

  // Generate the embed script
  const embedScript = `
(function() {
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'ai-voice-widget';
  document.body.appendChild(widgetContainer);

  // Widget configuration
  const config = {
    websiteId: '${websiteId}',
    name: '${name}',
    primaryColor: '${primaryColor}',
    position: '${position}',
    apiUrl: '${apiUrl}'
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

  // Context detection functions...
  function getPageContext() {
    return {
      currentPage: window.location.pathname,
      title: document.title,
      products: extractProducts(),
      categories: extractCategories(),
      cartItems: extractCartItems()
    };
  }

  function extractProducts() {
    const products = [];
    const productElements = document.querySelectorAll('[data-product], .product, .item, [class*="product"]');
    
    productElements.forEach(el => {
      const name = el.querySelector('[class*="name"], [class*="title"], h1, h2, h3')?.textContent?.trim();
      const price = el.querySelector('[class*="price"], [data-price]')?.textContent?.trim();
      const category = el.querySelector('[class*="category"], [data-category]')?.textContent?.trim();
      
      if (name) {
        products.push({ name, price, category });
      }
    });
    
    return products.slice(0, 10);
  }

  function extractCategories() {
    const categories = [];
    const categoryElements = document.querySelectorAll('[class*="category"], [class*="nav"], nav a');
    
    categoryElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length < 50) {
        categories.push(text);
      }
    });
    
    return [...new Set(categories)].slice(0, 5);
  }

  function extractCartItems() {
    const cartElements = document.querySelectorAll('[class*="cart"] [class*="item"], [data-cart-item]');
    return Array.from(cartElements).length;
  }

  // Communication with widget
  window.addEventListener('message', function(event) {
    if (event.data.type === 'REQUEST_CONTEXT') {
      iframe.contentWindow.postMessage({
        type: 'CONTEXT_UPDATE',
        context: getPageContext()
      }, '*');
    }
  });

  // Update context on page changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      iframe.contentWindow.postMessage({
        type: 'CONTEXT_UPDATE',
        context: getPageContext()
      }, '*');
    }
  }).observe(document, { subtree: true, childList: true });
})();
`

  return new Response(embedScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
