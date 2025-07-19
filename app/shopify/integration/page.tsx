"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Copy, Code, Settings, ShoppingBag, Zap } from "lucide-react"

export default function ShopifyIntegrationPage() {
  const [shopifyDomain, setShopifyDomain] = useState("your-store.myshopify.com")
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [position, setPosition] = useState("bottom-right")
  const [assistantName, setAssistantName] = useState("AI Shopping Assistant")
  const [copied, setCopied] = useState(false)

  const generateShopifyEmbedCode = () => {
    // Ensure this baseUrl matches your deployed Vercel app's URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-voice-agent.vercel.app"

    return `<!-- AI Voice Agent for Shopify -->
<script>
window.shopifyVoiceAgent = {
  apiUrl: '${baseUrl}',
  config: {
    name: '${assistantName}',
    primaryColor: '${primaryColor}',
    position: '${position}',
    shopifyDomain: '${shopifyDomain}'
  }
};
</script>
<script src="${baseUrl}/api/widget/embed?platform=shopify&domain=${encodeURIComponent(shopifyDomain)}&color=${encodeURIComponent(primaryColor)}&position=${encodeURIComponent(position)}&name=${encodeURIComponent(assistantName)}" async></script>`
  }

  const generateLiquidContext = () => {
    return `<!-- Enhanced Shopify Context (Add to product pages) -->
<script>
window.shopifyContext = {
  product: {
    {% if product %}
    id: {{ product.id }},
    title: "{{ product.title | escape }}",
    price: {{ product.price | money_without_currency }},
    compare_price: {{ product.compare_at_price | money_without_currency }},
    vendor: "{{ product.vendor | escape }}",
    type: "{{ product.type | escape }}",
    tags: [{% for tag in product.tags %}"{{ tag | escape }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
    available: {{ product.available }},
    variants: [
      {% for variant in product.variants %}
      {
        id: {{ variant.id }},
        title: "{{ variant.title | escape }}",
        price: {{ variant.price | money_without_currency }},
        available: {{ variant.available }},
        inventory_quantity: {{ variant.inventory_quantity }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ],
    images: [
      {% for image in product.images %}
      "{{ image | img_url: 'master' }}"{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
    {% endif %}
  },
  collection: {
    {% if collection %}
    title: "{{ collection.title | escape }}",
    handle: "{{ collection.handle }}",
    description: "{{ collection.description | escape }}"
    {% endif %}
  },
  cart: {
    item_count: {{ cart.item_count }},
    total_price: {{ cart.total_price | money_without_currency }},
    items: [
      {% for item in cart.items %}
      {
        product_title: "{{ item.product.title | escape }}",
        variant_title: "{{ item.variant.title | escape }}",
        quantity: {{ item.quantity }},
        price: {{ item.price | money_without_currency }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  },
  customer: {
    {% if customer %}
    first_name: "{{ customer.first_name | escape }}",
    email: "{{ customer.email | escape }}",
    tags: [{% for tag in customer.tags %}"{{ tag | escape }}"{% unless forloop.last %},{% endunless %}{% endfor %}]
    {% else %}
    logged_in: false
    {% endif %}
  },
  page_type: "{{ request.page_type }}",
  template: "{{ template }}"
};
</script>`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // This variable is for display purposes only, the actual embed code is generated dynamically
  const shopifyCodeExample = `<!-- AI Voice Agent for Shopify -->
<script src="https://your-domain.vercel.app/api/widget/embed?platform=shopify"></script>`

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopify Integration Guide</h1>
          <p className="text-slate-600 text-lg">Add your AI voice agent to any Shopify store in minutes</p>
        </div>

        <div className="grid gap-6">
          {/* Shopify-Specific Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-green-500" />
                Shopify-Specific Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Automatic Product Detection</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Product Pages
                      </Badge>
                      Knows current product details, variants, pricing
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Collection Pages
                      </Badge>
                      Understands category and available products
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Cart Integration
                      </Badge>
                      Sees cart items, quantities, total value
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Customer Data
                      </Badge>
                      Personalizes based on customer info
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Smart Assistance</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Product recommendations based on current page</li>
                    <li>• Size and variant guidance</li>
                    <li>• Inventory availability checks</li>
                    <li>• Shipping and return policy info</li>
                    <li>• Upselling and cross-selling suggestions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                Configure for Your Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Shopify Store Domain</label>
                    <Input
                      value={shopifyDomain}
                      onChange={(e) => setShopifyDomain(e.target.value)}
                      placeholder="your-store.myshopify.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Assistant Name</label>
                    <Input
                      value={assistantName}
                      onChange={(e) => setAssistantName(e.target.value)}
                      placeholder="AI Shopping Assistant"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Brand Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Preview</h4>
                  <div className="relative bg-white border-2 border-slate-200 rounded-lg h-48 overflow-hidden">
                    <div
                      className={`absolute w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
                        position.includes("bottom") ? "bottom-2" : "top-2"
                      } ${position.includes("right") ? "right-2" : "left-2"}`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Installation Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                Installation Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Method 1: Theme Editor */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">Method 1: Theme Editor (Recommended)</h4>
                    <Badge variant="default">Easy</Badge>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Add the code directly to your theme files:</p>
                    <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                      <li>Go to Shopify Admin → Online Store → Themes</li>
                      <li>Click "Actions" → "Edit code" on your active theme</li>
                      <li>
                        Open <code className="bg-slate-100 px-1 rounded">layout/theme.liquid</code>
                      </li>
                      <li>
                        Paste the code below before the closing{" "}
                        <code className="bg-slate-100 px-1 rounded">&lt;/body&gt;</code> tag
                      </li>
                      <li>Save the file</li>
                    </ol>

                    <div className="relative">
                      <Textarea
                        value={generateShopifyEmbedCode()}
                        readOnly
                        className="bg-slate-900 text-slate-100 font-mono text-xs min-h-[150px]"
                      />
                      <Button
                        onClick={() => copyToClipboard(generateShopifyEmbedCode())}
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Method 2: Additional Scripts */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">Method 2: Additional Scripts</h4>
                    <Badge variant="outline">Simple</Badge>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Use Shopify's Additional Scripts feature:</p>
                    <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                      <li>Go to Shopify Admin → Settings → Checkout</li>
                      <li>Scroll to "Additional Scripts"</li>
                      <li>Paste the embed code in the text area</li>
                      <li>Save settings</li>
                    </ol>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-800 text-sm">
                        <strong>Note:</strong> This method only shows the widget on checkout pages. Use Method 1 for
                        site-wide coverage.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shopify Code Example (for reference, not to be copied directly) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Shopify Code Example (Do NOT copy this directly)</h2>
                  <div className="bg-gray-900 text-white p-4 rounded-lg">
                    <code className="text-sm whitespace-pre">{shopifyCodeExample}</code>
                  </div>
                  <p className="mt-4 text-sm text-red-500">
                    **IMPORTANT:** Do NOT copy the code from this box. Use the "Copy" button above in Method 1 to get
                    your personalized embed code.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Enhanced Shopify Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  For maximum intelligence, add this Liquid code to specific template files to provide rich context:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Add to Product Pages</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      File: <code className="bg-slate-100 px-1 rounded">templates/product.liquid</code>
                    </p>
                    <div className="relative">
                      <Textarea
                        value={generateLiquidContext()}
                        readOnly
                        className="bg-slate-900 text-slate-100 font-mono text-xs min-h-[300px]"
                      />
                      <Button
                        onClick={() => copyToClipboard(generateLiquidContext())}
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">What this enables:</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• AI knows exact product details, pricing, and availability</li>
                      <li>• Understands customer's cart contents and history</li>
                      <li>• Provides personalized recommendations</li>
                      <li>• Offers size/variant guidance</li>
                      <li>• Handles inventory-specific questions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Test Your Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">After installing the widget on your Shopify store:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Product Pages</h4>
                    <p className="text-blue-800 text-sm">
                      Ask: "Tell me about this product" or "What sizes are available?"
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Collection Pages</h4>
                    <p className="text-green-800 text-sm">Ask: "What's the best product here?" or "Show me deals"</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Cart/Checkout</h4>
                    <p className="text-purple-800 text-sm">Ask: "What's in my cart?" or "Do you have any discounts?"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
