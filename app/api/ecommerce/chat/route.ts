import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

// Enhanced Shopify-specific system prompt
const SHOPIFY_SYSTEM_PROMPT = `You are an AI shopping assistant for a Shopify store. Your role is to help customers with:

1. PRODUCT ASSISTANCE:
   - Answer questions about current product on page
   - Explain product features, benefits, and specifications
   - Help with size guides and variant selection
   - Compare products and suggest alternatives
   - Check inventory availability

2. SHOPIFY-SPECIFIC HELP:
   - Guide through Shopify checkout process
   - Explain shipping options and policies
   - Help with account creation and login
   - Assist with discount codes and promotions
   - Handle return and exchange inquiries

3. SHOPPING GUIDANCE:
   - Provide personalized recommendations
   - Help find products based on needs
   - Suggest complementary items (upselling/cross-selling)
   - Create urgency for limited stock items
   - Guide toward purchase decisions

4. CUSTOMER SERVICE:
   - Answer store policy questions
   - Help with order tracking
   - Resolve basic customer issues
   - Provide contact information for complex issues

CONVERSATION STYLE:
- Be friendly, helpful, and conversational
- Keep responses concise for voice interaction (1-3 sentences)
- Ask clarifying questions when needed
- Always try to guide toward a purchase
- Use customer's name if available
- Create a sense of urgency when appropriate

LIMITATIONS:
- Cannot process actual payments or orders
- Cannot access real customer order history
- Refer complex technical issues to human support
- Cannot modify store settings or inventory`

interface ShopifyContext {
  platform?: string
  shopifyData?: any
  products?: any[]
  collections?: string[]
  cart?: any
  currentPage?: string
  customer?: any
}

export async function POST(request: NextRequest) {
  try {
    const { message, context, websiteConfig } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build context-aware prompt
    let systemPrompt = `You are a helpful AI voice assistant. Keep your responses conversational, concise, and natural for voice interaction. Aim for responses that are 1-3 sentences long unless more detail is specifically requested. Be friendly, engaging, and helpful.`

    if (context && context.platform === "shopify") {
      systemPrompt = SHOPIFY_SYSTEM_PROMPT // Use specific Shopify prompt
      systemPrompt += `\n\nSHOPIFY STORE CONTEXT:
      - Store: ${websiteConfig?.name || "Shopify Store"}
      - Current Page: ${context.currentPage || "Unknown"}
      - Page Type: ${getShopifyPageType(context.currentPage)}`

      // Add product context
      if (context.shopifyData?.product) {
        const product = context.shopifyData.product
        systemPrompt += `\n\nCURRENT PRODUCT:
        - Name: ${product.title}
        - Price: $${product.price}
        - Vendor: ${product.vendor}
        - Type: ${product.type}
        - Available: ${product.available ? "Yes" : "No"}
        - Tags: ${product.tags?.join(", ") || "None"}`

        if (product.variants && product.variants.length > 0) {
          systemPrompt += `\n- Variants: ${product.variants.map((v: any) => `${v.title} ($${v.price})`).join(", ")}`
        }
      }

      // Add collection context
      if (context.shopifyData?.collection?.title) {
        systemPrompt += `\n\nCURRENT COLLECTION: ${context.shopifyData.collection.title}`
      }

      // Add cart context
      if (context.shopifyData?.cart) {
        const cart = context.shopifyData.cart
        systemPrompt += `\n\nCUSTOMER CART:
        - Items: ${cart.item_count || 0}
        - Total: $${cart.total_price || 0}`

        if (cart.items && cart.items.length > 0) {
          systemPrompt += `\n- Products: ${cart.items.map((item: any) => `${item.product_title} (${item.quantity}x)`).join(", ")}`
        }
      }

      // Add customer context
      if (context.shopifyData?.customer) {
        const customer = context.shopifyData.customer
        if (customer.first_name) {
          systemPrompt += `\n\nCUSTOMER: ${customer.first_name}`
        }
      }
    } else if (context) {
      // Generic website context
      systemPrompt += `\n\nWEBSITE CONTEXT:
      - Current Page: ${context.currentPage || "Unknown"}
      - Page Title: ${context.title || "Unknown"}
      - URL: ${context.url || "Unknown"}`
      // Add other generic context if available (e.g., context.products, context.categories)
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: message,
    })

    // Analyze intent for Shopify-specific actions
    const intent = analyzeShopifyIntent(message, text, context) // This function can be made generic later
    const suggestions = generateShopifySuggestions(intent, context) // This function can be made generic later

    return NextResponse.json({
      response: text,
      intent,
      suggestions,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function getShopifyPageType(path: string): string {
  if (!path) return "unknown"
  if (path.includes("/products/")) return "product"
  if (path.includes("/collections/")) return "collection"
  if (path.includes("/cart")) return "cart"
  if (path.includes("/checkout")) return "checkout"
  if (path === "/" || path === "") return "home"
  return "page"
}

function analyzeShopifyIntent(message: string, response: string, context: any) {
  const lowerMessage = message.toLowerCase()

  // Shopify-specific intents
  if (lowerMessage.includes("add to cart") || lowerMessage.includes("buy now")) {
    return "add_to_cart"
  }
  if (lowerMessage.includes("checkout") || lowerMessage.includes("purchase")) {
    return "checkout"
  }
  if (lowerMessage.includes("shipping") || lowerMessage.includes("delivery")) {
    return "shipping_info"
  }
  if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
    return "return_policy"
  }
  if (lowerMessage.includes("size") || lowerMessage.includes("fit")) {
    return "size_guide"
  }
  if (lowerMessage.includes("discount") || lowerMessage.includes("coupon") || lowerMessage.includes("promo")) {
    return "discount_inquiry"
  }
  if (lowerMessage.includes("track") || lowerMessage.includes("order status")) {
    return "order_tracking"
  }
  if (lowerMessage.includes("compare") || lowerMessage.includes("vs")) {
    return "product_comparison"
  }
  if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest")) {
    return "product_recommendation"
  }

  return "general_inquiry"
}

function generateShopifySuggestions(intent: string, context: any) {
  const suggestions = []

  switch (intent) {
    case "add_to_cart":
      suggestions.push("Add to Cart", "View Cart", "Continue Shopping")
      break
    case "checkout":
      suggestions.push("Go to Checkout", "View Cart", "Apply Discount")
      break
    case "shipping_info":
      suggestions.push("Shipping Options", "Delivery Time", "Shipping Cost")
      break
    case "return_policy":
      suggestions.push("Return Policy", "Start Return", "Exchange Item")
      break
    case "size_guide":
      suggestions.push("Size Chart", "Size Guide", "Fit Recommendations")
      break
    case "discount_inquiry":
      suggestions.push("Current Deals", "Discount Codes", "Sale Items")
      break
    case "order_tracking":
      suggestions.push("Track Order", "Order Status", "Contact Support")
      break
    case "product_comparison":
      suggestions.push("Compare Products", "View Alternatives", "See Reviews")
      break
    case "product_recommendation":
      suggestions.push("Show Recommendations", "Browse Similar", "View Collection")
      break
    default:
      suggestions.push("Browse Products", "View Cart", "Contact Support")
  }

  return suggestions
}
