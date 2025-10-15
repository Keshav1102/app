{
  "brand": {
    "app_name": "Wellnest Pharmacy",
    "attributes": ["trustworthy", "clinical-clean", "caring", "efficient", "compliant"],
    "tone_of_voice": ["clear", "reassuring", "concise"]
  },
  "design_personality": {
    "style_fusion": "Swiss grid cleanliness + subtle Glassmorphism accents for cards + modern e-commerce heuristics",
    "layout_style": ["Bento Grid for featured categories", "Asymmetrical hero with parallax", "Card Layout for catalog"],
    "why": "Healthcare buyers need calm hierarchy and trust signals; minimal noise, high legibility, and tactile feedback reduce anxiety during prescription and checkout."
  },
  "typography": {
    "pairing": {
      "display": "Space Grotesk",
      "body": "Work Sans"
    },
    "imports": {
      "google_fonts_link": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap",
      "css_snippet": "html, body { font-family: 'Work Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; } .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }"
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight font-display",
      "h2": "text-base md:text-lg font-semibold font-display",
      "h3": "text-lg md:text-xl font-semibold font-display",
      "body": "text-sm md:text-base leading-relaxed",
      "small": "text-xs leading-snug text-muted-foreground"
    },
    "rules": [
      "Avoid center-aligning long copy; left-align for readability.",
      "Line length 60–75ch for reading areas.",
      "Use numeral tabular-nums on prices if available."
    ]
  },
  "color_system": {
    "semantic_tokens_css": "@layer base { :root { --background: 210 20% 99%; --foreground: 210 24% 12%; --card: 0 0% 100%; --card-foreground: 210 24% 12%; --popover: 0 0% 100%; --popover-foreground: 210 24% 12%; --primary: 188 72% 38%; /* ocean teal */ --primary-foreground: 0 0% 100%; --secondary: 200 25% 96%; /* mist blue*/ --secondary-foreground: 210 24% 12%; --accent: 171 47% 87%; /* pale mint */ --accent-foreground: 195 35% 17%; --muted: 210 16% 94%; --muted-foreground: 210 8% 38%; --info: 199 84% 55%; --success: 161 93% 24%; --warning: 32 96% 45%; --destructive: 0 84% 56%; --destructive-foreground: 0 0% 100%; --border: 210 16% 90%; --input: 210 16% 90%; --ring: 188 72% 38%; --radius: 0.6rem; } .dark { --background: 210 24% 8%; --foreground: 210 20% 98%; --card: 210 20% 10%; --card-foreground: 210 20% 98%; --popover: 210 20% 10%; --popover-foreground: 210 20% 98%; --primary: 188 72% 45%; --primary-foreground: 0 0% 100%; --secondary: 210 10% 16%; --secondary-foreground: 210 20% 98%; --accent: 171 47% 20%; --accent-foreground: 171 47% 92%; --muted: 210 10% 16%; --muted-foreground: 210 10% 64%; --info: 199 84% 60%; --success: 161 93% 35%; --warning: 32 96% 50%; --destructive: 0 70% 40%; --destructive-foreground: 0 0% 98%; --border: 210 10% 22%; --input: 210 10% 22%; --ring: 188 72% 45%; } }",
    "hex_preview": {
      "primary": "#1D9A8A",
      "secondary": "#EDF2F5",
      "accent": "#C7F0E3",
      "info": "#3BB2E3",
      "success": "#0E8F61",
      "warning": "#F79E1B",
      "destructive": "#EF4444"
    },
    "gradients": {
      "hero_background": "bg-[radial-gradient(80%_60%_at_50%_0%,_rgba(199,240,227,0.65),_rgba(237,242,245,0.4)_60%,_transparent_100%)]",
      "allowed_usage": ["hero background", "section dividers", "decorative overlays only"],
      "prohibited": ["never on cards or reading areas", "never >20% viewport", "never on small UI <100px", "avoid saturated purple/pink mixes"],
      "enforcement": "If gradient breaks readability or exceeds 20% viewport, fallback to solid --secondary."
    }
  },
  "spacing_and_radius": {
    "spacing": "Use 8pt base with 1.5x–2x comfortable whitespace. Sections: py-12 md:py-16 lg:py-24. Card padding: p-4 md:p-6.",
    "radius_tokens": {"sm": "0.4rem", "md": "0.6rem", "lg": "1rem", "full": "9999px"},
    "shadows": {
      "elevations": {
        "card": "shadow-[0_1px_2px_rgba(9,35,31,0.06),_0_8px_24px_rgba(9,35,31,0.06)]",
        "floating": "shadow-[0_4px_16px_rgba(9,35,31,0.14)]"
      }
    }
  },
  "layout": {
    "container": "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
    "grid_system": [
      "Mobile-first: grid grid-cols-1 gap-4 sm:gap-6",
      "Catalog: md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      "Filters as Drawer on mobile; sticky sidebar on desktop"
    ],
    "header": "sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 border-b",
    "footer": "bg-white dark:bg-neutral-900 border-t"
  },
  "buttons": {
    "style": "Professional / Corporate",
    "tokens": {
      "--btn-radius": "0.6rem",
      "--btn-shadow": "0 6px 14px rgba(29,154,138,0.18)",
      "--btn-motion": "transition-colors duration-200 ease-out"
    },
    "variants": {
      "primary": "bg-primary text-primary-foreground hover:bg-[hsl(188_72%_33%)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(188_72%_38%)]",
      "secondary": "bg-secondary text-foreground hover:bg-[hsl(200_20%_93%)]",
      "ghost": "bg-transparent text-foreground hover:bg-secondary",
      "destructive": "bg-destructive text-destructive-foreground hover:bg-[hsl(0_84%_46%)]"
    },
    "sizes": {"sm": "h-9 px-4 text-sm", "md": "h-11 px-5", "lg": "h-12 px-6 text-base"},
    "micro_interactions": "Use subtle scale-95 active and 150ms color transitions only (no transition: all)."
  },
  "icons": {
    "library": "lucide-react (preferred) or FontAwesome CDN",
    "usage": "Do not use emoji icons."
  },
  "pages": {
    "landing": {
      "hero": {
        "structure": "grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12",
        "elements": [
          "Heading (H1) + subcopy + upload prescription CTA",
          "Trust badges (SSL/Stripe/Pharmacist verified)",
          "Decorative hero image with mild radial gradient + parallax"
        ],
        "testids": ["hero-heading", "upload-prescription-cta", "trust-badges"],
        "classes": "py-16 md:py-24 bg-white relative overflow-hidden"
      },
      "featured_bento": {
        "structure": "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6",
        "cards": ["Rx Medicines", "Wellness", "Devices", "Baby Care"],
        "components": ["./components/ui/card.jsx", "./components/ui/badge.jsx", "./components/ui/button.jsx"],
        "micro": "hover:translate-y-[-2px] transition-transform duration-150"
      }
    },
    "catalog": {
      "layout": "lg:grid lg:grid-cols-[280px_1fr] lg:gap-8",
      "filter_drawer_mobile": "./components/ui/drawer.jsx",
      "sidebar_desktop": "sticky top-24 self-start h-fit",
      "product_card": "Responsive card with image, name, dosage/size, price, stock, add-to-cart",
      "testids": ["filter-open-button", "catalog-grid", "product-card", "add-to-cart-button"]
    },
    "product_detail": {
      "layout": "grid grid-cols-1 lg:grid-cols-2 gap-8",
      "content": ["image gallery carousel", "dosage selector", "quantity stepper", "key info: usage, side-effects, manufacturer", "requires-prescription tag"],
      "components": ["./components/ui/carousel.jsx", "./components/ui/select.jsx", "./components/ui/tabs.jsx", "./components/ui/badge.jsx", "./components/ui/accordion.jsx"]
    },
    "cart": {
      "pattern": "Use ./components/ui/sheet.jsx as right-side cart drawer on desktop and full-screen on mobile.",
      "required": ["editable quantities", "discount code field", "estimated total", "proceed to checkout CTA"],
      "testids": ["open-cart-button", "cart-line-item", "cart-apply-coupon-button", "cart-checkout-button"]
    },
    "checkout": {
      "flow": ["address", "delivery/pickup", "payment", "review"],
      "elements": ["progress steps using ./components/ui/tabs.jsx or breadcrumb.jsx", "order summary sticky aside", "Stripe PaymentElement section"],
      "principles": ["show trust logos", "mobile-optimized forms", "continuous summary"],
      "testids": ["checkout-step-address", "checkout-step-payment", "stripe-pay-button", "place-order-button"]
    },
    "auth_profile": {
      "auth": ["sign in/up with email + otp (./components/ui/input-otp.jsx)", "passwordless optional"],
      "profile": ["addresses", "prescriptions", "orders", "payment methods"],
      "testids": ["login-form", "register-form", "profile-prescriptions-tab"]
    },
    "prescription": {
      "core": "Upload/scan, enter patient details, pharmacist messaging",
      "components": ["./components/ui/dialog.jsx", "./components/ui/form.jsx", "./components/ui/input.jsx", "./components/ui/textarea.jsx", "./components/ui/badge.jsx"],
      "uploader": "Custom FileUploader built with react-dropzone + shadcn Card/Input/Button",
      "testids": ["rx-upload-dropzone", "rx-submit-button", "rx-status-chip"]
    },
    "admin": {
      "notes": "Use table.jsx, tabs.jsx, dialog.jsx for approvals, inventory and roles",
      "testids": ["admin-users-table", "admin-inventory-table", "admin-prescription-queue"]
    }
  },
  "components": [
    {
      "name": "TopNav",
      "paths": ["./components/ui/navigation-menu.jsx", "./components/ui/menubar.jsx", "./components/ui/button.jsx", "./components/ui/popover.jsx"],
      "behavior": "Sticky with search input, cart icon with item count badge, account menu.",
      "testids": ["site-logo", "global-search-input", "nav-cart-button", "nav-account-menu"]
    },
    {
      "name": "SearchBar",
      "paths": ["./components/ui/command.jsx", "./components/ui/input.jsx", "./components/ui/popover.jsx"],
      "behavior": "Command palette on ⌘K, predictive results, keyboard nav.",
      "testids": ["search-trigger-button", "search-command"],
      "classes": "hidden md:flex w-full max-w-lg"
    },
    {
      "name": "FilterPanel",
      "paths": ["./components/ui/accordion.jsx", "./components/ui/checkbox.jsx", "./components/ui/slider.jsx"],
      "behavior": "Mobile drawer + desktop sticky sidebar; update URL query params.",
      "testids": ["filter-price-slider", "filter-brand-checkbox", "filter-apply-button"]
    },
    {
      "name": "ProductCard",
      "paths": ["./components/ui/card.jsx", "./components/ui/badge.jsx", "./components/ui/button.jsx", "./components/ui/skeleton.jsx"],
      "behavior": "Hover raise + subtle shadow; show Rx-required badge when applicable; quick add-to-cart.",
      "testids": ["product-card", "add-to-cart-button", "rx-required-badge"],
      "tailwind": "group relative h-full overflow-hidden rounded-lg border bg-card p-4 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(9,35,31,0.10)]"
    },
    {
      "name": "CartSheet",
      "paths": ["./components/ui/sheet.jsx", "./components/ui/button.jsx", "./components/ui/input.jsx", "./components/ui/scroll-area.jsx"],
      "behavior": "Right sheet; list items; apply coupon; checkout CTA.",
      "testids": ["cart-sheet", "cart-line-item", "cart-checkout-button"]
    },
    {
      "name": "FileUploader",
      "paths": ["./components/ui/card.jsx", "./components/ui/button.jsx", "./components/ui/progress.jsx"],
      "scaffold_js": "import {useCallback, useState} from 'react'; import {useDropzone} from 'react-dropzone'; export function FileUploader({onFiles}){ const [progress,setProgress]=useState(0); const onDrop=useCallback((accepted)=>{ onFiles?.(accepted); setProgress(100);},[onFiles]); const {getRootProps,getInputProps,isDragActive}=useDropzone({onDrop, accept:{'image/*':[], 'application/pdf':[]}}); return (<div data-testid=\"rx-upload-dropzone\" {...getRootProps()} className=\"rounded-lg border border-dashed p-6 text-center bg-secondary hover:bg-[hsl(200_20%_93%)] transition-colors\"><input {...getInputProps()} /> <p className=\"font-medium\">{isDragActive? 'Drop files here' : 'Drag & drop prescription or click to upload'}</p> <p className=\"text-sm text-muted-foreground mt-1\">PNG, JPG, PDF</p> {progress>0 && (<div className=\"mt-4\"><div className=\"h-2 bg-muted rounded-full\"><div className=\"h-2 bg-primary rounded-full\" style={{width: progress+'%'}}/></div></div>)} </div>);}"
    },
    {
      "name": "PrescriptionStatus",
      "paths": ["./components/ui/badge.jsx", "./components/ui/table.jsx"],
      "states": ["received", "under-review", "approved", "rejected"],
      "colors": {"received": "bg-accent text-accent-foreground", "under-review": "bg-secondary text-foreground", "approved": "bg-[hsl(161_93%_24%)] text-white", "rejected": "bg-destructive text-white"},
      "testids": ["rx-status-chip"]
    }
  ],
  "micro_interactions": {
    "principles": ["specific property transitions only (no transition: all)", "motion reduces on prefers-reduced-motion", "parallax only for decorative hero art"],
    "examples": {
      "card_hover": "hover:translate-y-[-2px] transition-transform duration-150 will-change-transform",
      "button_press": "active:scale-[0.98]",
      "section_entrance": "use Framer Motion fade+slide once on viewport"
    }
  },
  "data_testid_rules": {
    "convention": "kebab-case role-based names",
    "requirements": "All interactive and key informational elements must include data-testid.",
    "examples": [
      "data-testid=\"global-search-input\"",
      "data-testid=\"product-card\"",
      "data-testid=\"login-form-submit-button\"",
      "data-testid=\"error-message\""
    ]
  },
  "accessibility": {
    "wcag": "Target AA contrast; min 4.5:1 text vs background",
    "focus": "Visible focus rings using ring-[hsl(188_72%_38%)] ring-offset-2",
    "labels": "Every input has a visible Label and aria-describedby for help text",
    "keyboard": "All flows keyboard navigable; command menu supports arrows/enter",
    "aria": "Use role=status for async, aria-live polite for cart updates"
  },
  "charts_and_data": {
    "admin_dash": "Use Recharts for sales, orders, inventory. Provide empty states and legends.",
    "empty_state": "Card with icon, title, and action button"
  },
  "libraries": {
    "install": [
      "npm i framer-motion",
      "npm i react-dropzone",
      "npm i recharts",
      "npm i @stripe/stripe-js @stripe/react-stripe-js",
      "npm i lottie-react"
    ],
    "usage_snippets": {
      "framer_motion": "import {motion} from 'framer-motion'; <motion.section initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35,ease:'easeOut'}} />",
      "stripe_payment": "import {Elements} from '@stripe/react-stripe-js'; import {loadStripe} from '@stripe/stripe-js'; const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK); export function Checkout(){ return (<Elements stripe={stripePromise}><PaymentForm/></Elements>); }",
      "sonner_toast": "import {toast} from './components/ui/sonner.jsx'; toast.success('Added to cart')"
    }
  },
  "stripe_ui": {
    "payment_section": "Place PaymentElement in a Card with order summary side-by-side (lg) or stacked (sm). Show card logos and SSL note.",
    "testids": ["stripe-payment-element", "stripe-pay-button"],
    "states": ["loading", "error", "processing", "succeeded"]
  },
  "forms": {
    "patterns": [
      "Use ./components/ui/form.jsx with react-hook-form",
      "Inline validation, error text in text-destructive with aria-live=polite",
      "Use calendar.jsx for date pickers (e.g., DOB in KYC)"
    ]
  },
  "image_urls": [
    {
      "category": "hero",
      "description": "Clean pharmacy aisle for trust",
      "url": "https://images.unsplash.com/photo-1698466632366-09fa1d925de6?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "testimonial",
      "description": "Pharmacists portrait behind counter",
      "url": "https://images.pexels.com/photos/8657288/pexels-photo-8657288.jpeg"
    },
    {
      "category": "category-banner",
      "description": "Green pharmacy cross sign as subtle decorative banner (low opacity overlay only)",
      "url": "https://images.unsplash.com/photo-1638366170204-d5b084f93872?crop=entropy&cs=srgb&fm=jpg&q=85"
    }
  ],
  "component_path": [
    "./components/ui/button.jsx",
    "./components/ui/card.jsx",
    "./components/ui/badge.jsx",
    "./components/ui/accordion.jsx",
    "./components/ui/checkbox.jsx",
    "./components/ui/slider.jsx",
    "./components/ui/drawer.jsx",
    "./components/ui/sheet.jsx",
    "./components/ui/dialog.jsx",
    "./components/ui/command.jsx",
    "./components/ui/select.jsx",
    "./components/ui/tabs.jsx",
    "./components/ui/table.jsx",
    "./components/ui/toaster.jsx",
    "./components/ui/sonner.jsx",
    "./components/ui/input.jsx",
    "./components/ui/textarea.jsx",
    "./components/ui/calendar.jsx",
    "./components/ui/carousel.jsx",
    "./components/ui/skeleton.jsx"
  ],
  "templates_and_snippets": {
    "hero_section": "<section className=\"relative py-16 md:py-24 bg-white overflow-hidden\"><div className=\"absolute inset-x-0 -top-20 h-[320px] bg-[radial-gradient(80%_60%_at_50%_0%,_rgba(199,240,227,0.65),_rgba(237,242,245,0.4)_60%,_transparent_100%)] pointer-events-none\" aria-hidden=\"true\"/> <div className=\"mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center\"> <div><h1 data-testid=\"hero-heading\" className=\"font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight\">Your trusted online pharmacy</h1><p className=\"mt-4 text-base text-muted-foreground\">Medicines, wellness, and rapid prescription refills—delivered.</p><div className=\"mt-6 flex gap-3\"><button data-testid=\"upload-prescription-cta\" className=\"inline-flex items-center justify-center h-11 px-5 rounded-md bg-primary text-white hover:bg-[hsl(188_72%_33%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(188_72%_38%)] focus-visible:ring-offset-2\">Upload Prescription</button><button className=\"h-11 px-5 rounded-md border\" data-testid=\"shop-now-button\">Shop now</button></div></div> <div className=\"relative\"><img src=\"https://images.unsplash.com/photo-1698466632366-09fa1d925de6?auto=format&fit=crop&w=1200&q=80\" alt=\"Pharmacy aisle\" className=\"rounded-lg border shadow-[0_8px_24px_rgba(9,35,31,0.08)]\"/></div></div></section>",
    "product_card_jsx": "export function ProductCard({product,onAdd}){return (<div data-testid=\"product-card\" className=\"group relative h-full overflow-hidden rounded-lg border bg-card p-4 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(9,35,31,0.10)]\"><img src={product.image} alt={product.name} className=\"aspect-square w-full object-cover rounded-md\"/><div className=\"mt-3 space-y-1\"><h3 className=\"font-medium line-clamp-2\">{product.name}</h3><p className=\"text-sm text-muted-foreground\">{product.strength || product.size}</p><div className=\"flex items-center justify-between\"><span className=\"font-semibold\">${product.price}</span>{product.rx && <span className=\"ml-2 rounded px-2 py-0.5 text-xs bg-accent\">Rx</span>}</div></div><button data-testid=\"add-to-cart-button\" onClick={()=>onAdd?.(product)} className=\"mt-3 w-full h-10 rounded-md bg-primary text-white hover:bg-[hsl(188_72%_33%)]\">Add to cart</button></div>)}",
    "filter_drawer_trigger": "<button data-testid=\"filter-open-button\" className=\"md:hidden h-10 px-4 rounded-md border\">Filters</button>",
    "cart_sheet_trigger": "<button data-testid=\"open-cart-button\" className=\"relative h-10 px-4 rounded-md border\"><span>Cart</span><span className=\"absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary text-[11px] text-white flex items-center justify-center\">2</span></button>"
  },
  "motion": {
    "parallax_scaffold": "useEffect(()=>{const el=document.querySelector('[data-hero-art]'); if(!el) return; const onMove=(e)=>{const r=el.getBoundingClientRect(); const cx=e.clientX - (r.left + r.width/2); const cy=e.clientY - (r.top + r.height/2); el.style.transform = `translate3d(${cx*0.01}px, ${cy*0.01}px, 0)`;}; window.addEventListener('pointermove', onMove); return ()=>window.removeEventListener('pointermove', onMove);},[]);",
    "enter_variants": {"from": {"opacity": 0, "y": 8}, "to": {"opacity": 1, "y": 0}}
  },
  "search_and_inspiration": {
    "references": [
      {"source": "Dribbble pharmacy UI tag", "url": "https://dribbble.com/tags/pharmacy-ui"},
      {"source": "Healthcare checkout best practices", "url": "https://www.nomensa.com/blog/10-essential-checkout-ux-best-practices/"}
    ],
    "insights": [
      "Blues/greens, large category tiles, stepwise Rx flows",
      "Continuous order summary, transparent fees, mobile-first forms"
    ]
  },
  "instructions_to_main_agent": [
    "1) Update /app/frontend/src/index.css :root tokens with color_system.semantic_tokens_css (replace existing values).",
    "2) Add Google Fonts link in index.html or inject via CSS import, then set base font family to Work Sans; use .font-display for headings.",
    "3) Build TopNav using navigation-menu.jsx + command.jsx for search and sheet.jsx for Cart.",
    "4) Implement Hero, Featured Bento, and Catalog grid using provided snippets and classes.",
    "5) Implement FileUploader (JS scaffold provided) for prescription flow; ensure data-testid attributes are present.",
    "6) Use calendar.jsx for DOB and prescription date; never use native HTML date pickers.",
    "7) Integrate Stripe Elements UI in Checkout per stripe_ui guidance.",
    "8) Apply micro-interactions with Framer Motion and adhere to motion and gradient restrictions.",
    "9) Use sonner.jsx for toasts; every critical action triggers an accessible toast (success/error).",
    "10) Ensure all interactive elements include data-testid attributes per convention.",
    "11) Keep gradients to hero/section background only; content cards remain solid."
  ],
  "general_ui_ux_design_guidelines": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n- NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
