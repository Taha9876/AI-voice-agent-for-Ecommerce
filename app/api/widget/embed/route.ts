import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const websiteId = searchParams.get("id") || "default"
  const primaryColor = searchParams.get("color") || "#3b82f6"
  const position = searchParams.get("position") || "bottom-right"
  const name = searchParams.get("name") || "AI Assistant"

  // Get the API URL from environment or use the request origin as fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`

  // Generate the embed script
  const embedScript = `
(function() {
  console.log('AI Voice Widget Loading...');
  
  // Create simple widget button
  const widget = document.createElement('div');
  widget.innerHTML = '<div id="ai-voice-widget" style="position:fixed;${position.includes("bottom") ? "bottom:20px;" : "top:20px;"}${position.includes("right") ? "right:20px;" : "left:20px;"}width:60px;height:60px;background:${primaryColor};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:24px;">💬</div>';
  document.body.appendChild(widget);
  
  // Add click handler
  document.getElementById('ai-voice-widget').onclick = function() {
    alert('${name} activated! This is a demo widget. Full functionality available at ${apiUrl}');
  };

  // Context detection
  function getPageContext() {
    return {
      currentPage: window.location.pathname,
      title: document.title,
      url: window.location.href
    };
  }

  console.log('Widget loaded with context:', getPageContext());
})();
`

  return new Response(embedScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
