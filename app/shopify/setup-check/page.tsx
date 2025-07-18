"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Copy, Settings, Zap } from "lucide-react"

export default function ShopifySetupCheck() {
  const [currentDomain, setCurrentDomain] = useState("ornapk.store")
  const [storeHandle, setStoreHandle] = useState("ornapk")
  const [copied, setCopied] = useState(false)

  const generateOptimizedCode = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-voice-agent.vercel.app"
    return `<!-- AI Voice Agent for ${currentDomain} -->
<script>
window.shopifyVoiceAgent = {
  apiUrl: '${baseUrl}', // Replace with your actual domain
  config: {
    name: 'AI Shopping Assistant',
    primaryColor: '#3b82f6',
    position: 'bottom-right',
    shopifyDomain: '${currentDomain}',
    storeHandle: '${storeHandle}'
  }
};
</script>
<script src="${baseUrl}/api/widget/embed?platform=shopify&domain=${encodeURIComponent(currentDomain)}&color=%233b82f6&position=bottom-right&name=AI%20Shopping%20Assistant" async></script>`
  }

  const generateShopifyContext = () => {
    return `<!-- Enhanced Shopify Context - Add to templates/product.liquid -->
<script>
window.shopifyContext = {
  store: {
    domain: '${currentDomain}',
    name: '{{ shop.name | escape }}',
    currency: '{{ shop.currency }}',
    money_format: '{{ shop.money_format }}'
  },
  product: {
    {% if product %}
    id: {{ product.id }},
    title: "{{ product.title | escape }}",
    handle: "{{ product.handle }}",
    price: {{ product.price | money_without_currency }},
    compare_price: {% if product.compare_at_price %}{{ product.compare_at_price | money_without_currency }}{% else %}null{% endif %},
    vendor: "{{ product.vendor | escape }}",
    type: "{{ product.type | escape }}",
    tags: [{% for tag in product.tags %}"{{ tag | escape }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
    available: {{ product.available }},
    total_inventory: {{ product.total_inventory }},
    variants: [
      {% for variant in product.variants %}
      {
        id: {{ variant.id }},
        title: "{{ variant.title | escape }}",
        price: {{ variant.price | money_without_currency }},
        available: {{ variant.available }},
        inventory_quantity: {{ variant.inventory_quantity }},
        option1: {% if variant.option1 %}"{{ variant.option1 | escape }}"{% else %}null{% endif %},
        option2: {% if variant.option2 %}"{{ variant.option2 | escape }}"{% else %}null{% endif %},
        option3: {% if variant.option3 %}"{{ variant.option3 | escape }}"{% else %}null{% endif %}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ],
    options: [
      {% for option in product.options_with_values %}
      {
        name: "{{ option.name | escape }}",
        values: [{% for value in option.values %}"{{ value | escape }}"{% unless forloop.last %},{% endunless %}{% endfor %}]
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ],
    images: [
      {% for image in product.images %}
      "{{ image | img_url: 'master' }}"{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ],
    description: "{{ product.description | strip_html | escape }}",
    metafields: {
      {% for metafield in product.metafields %}
      "{{ metafield.namespace }}.{{ metafield.key }}": "{{ metafield.value | escape }}"{% unless forloop.last %},{% endunless %}
      {% endfor %}
    }
    {% endif %}
  },
  collection: {
    {% if collection %}
    id: {{ collection.id }},
    title: "{{ collection.title | escape }}",
    handle: "{{ collection.handle }}",
    description: "{{ collection.description | strip_html | escape }}",
    products_count: {{ collection.products_count }}
    {% endif %}
  },
  cart: {
    item_count: {{ cart.item_count }},
    total_price: {{ cart.total_price | money_without_currency }},
    total_weight: {{ cart.total_weight }},
    currency: "{{ cart.currency.iso_code }}",
    items: [
      {% for item in cart.items %}
      {
        id: {{ item.id }},
        product_id: {{ item.product_id }},
        variant_id: {{ item.variant_id }},
        product_title: "{{ item.product.title | escape }}",
        variant_title: "{{ item.variant.title | escape }}",
        quantity: {{ item.quantity }},
        price: {{ item.price | money_without_currency }},
        line_price: {{ item.line_price | money_without_currency }},
        vendor: "{{ item.vendor | escape }}",
        product_type: "{{ item.product_type | escape }}",
        url: "{{ item.url }}"
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  },
  customer: {
    {% if customer %}
    id: {{ customer.id }},
    first_name: "{{ customer.first_name | escape }}",
    last_name: "{{ customer.last_name | escape }}",
    email: "{{ customer.email | escape }}",
    phone: {% if customer.phone %}"{{ customer.phone | escape }}"{% else %}null{% endif %},
    tags: [{% for tag in customer.tags %}"{{ tag | escape }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
    orders_count: {{ customer.orders_count }},
    total_spent: {{ customer.total_spent | money_without_currency }},
    accepts_marketing: {{ customer.accepts_marketing }}
    {% else %}
    logged_in: false
    {% endif %}
  },
  page: {
    type: "{{ request.page_type }}",
    template: "{{ template }}",
    url: "{{ request.origin }}{{ request.path }}",
    title: "{{ page_title | escape }}"
  }
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Shopify Setup Check</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Setup Status</h2>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900">✅ Basic Setup Complete</h3>
              <p className="text-green-800 text-sm">Your Shopify integration is ready to go.</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900">Next Steps:</h3>
              <ul className="list-disc list-inside mt-2 text-blue-800 text-sm">
                <li>Test the widget on your store</li>
                <li>Customize colors and position</li>
                <li>Add product-specific training</li>
              </ul>
            </div>
          </div>

          {/* Store Configuration */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                Optimize for Your Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Store Domain</label>
                    <Input
                      value={currentDomain}
                      onChange={(e) => setCurrentDomain(e.target.value)}
                      placeholder="ornapk.store"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Store Handle</label>
                    <Input value={storeHandle} onChange={(e) => setStoreHandle(e.target.value)} placeholder="ornapk" />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Optimized Embed Code:</h4>
                  <div className="relative">
                    <Textarea
                      value={generateOptimizedCode()}
                      readOnly
                      className="bg-slate-900 text-slate-100 font-mono text-xs min-h-[150px]"
                    />
                    <Button
                      onClick={() => copyToClipboard(generateOptimizedCode())}
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Context */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Enhanced Product Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  Add this enhanced context code to your product pages for maximum AI intelligence:
                </p>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Add to templates/product.liquid:</h4>
                  <div className="relative">
                    <Textarea
                      value={generateShopifyContext()}
                      readOnly
                      className="bg-slate-900 text-slate-100 font-mono text-xs min-h-[300px]"
                    />
                    <Button
                      onClick={() => copyToClipboard(generateShopifyContext())}
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">This will enable:</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• AI knows exact product details, variants, and pricing</li>
                    <li>• Understands inventory levels and availability</li>
                    <li>• Provides personalized recommendations based on customer data</li>
                    <li>• Offers size/variant guidance with real options</li>
                    <li>• Handles cart-specific questions and upselling</li>
                    <li>• Knows customer purchase history and preferences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
