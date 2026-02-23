# 🫖 EarlBlue Tea

A modern, fully responsive tea e-commerce landing page built with **React + Vite + TypeScript + Tailwind CSS**.

Originally designed in Canva, converted into a reusable, production-ready React component.

---

## ✨ Features

- 🛍️ **Product Catalogue** — 8 premium tea flavours with quick-view modal
- 🛒 **Shopping Cart** — Add, remove, and update quantities in real time
- 📱 **Fully Responsive** — Mobile, tablet, and desktop layouts
- 🎨 **Animated UI** — Floating elements, steam effects, slide-in transitions, pulse glow
- 📧 **Newsletter Signup** — Email subscription form
- 🌙 **Sticky Navbar** — With scroll shadow and mobile hamburger menu
- ⚙️ **Configurable** — Brand name, colors, fonts, and hero content via props

---

## 🖥️ Tech Stack

| Tech | Version |
|---|---|
| React | ^19 |
| TypeScript | Latest |
| Vite | ^7 |
| Tailwind CSS | ^3 |
| Google Fonts | Playfair Display + DM Sans |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v22+
- npm v11+

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/earlbluetea.git

# Navigate into the project
cd earlbluetea

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
earlbluetea/
├── public/
├── src/
│   ├── NewHomePage.tsx     # Main EarlBlue Tea component
│   ├── App.tsx             # Root app
│   └── index.css           # Tailwind directives
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## ⚙️ Configuration

The component accepts an optional `config` prop to customize the look and feel:

```tsx
<EarlBlueTea
  config={{
    brand_name: "My Tea Shop",
    hero_title: "Your Perfect Cup Awaits",
    hero_subtitle: "Fresh teas delivered to your door.",
    cta_button_text: "Browse Teas",
    primary_color: "#1e40af",
    accent_color: "#3b82f6",
    background_color: "#f0f9ff",
    card_color: "#ffffff",
    text_color: "#334155",
    font_family: "Playfair Display",
    font_size: 16
  }}
/>
```

---

## 🍵 Tea Collection

| Name | Origin | Caffeine | Price |
|---|---|---|---|
| Earl Grey Classic | Sri Lanka | Medium | $18 |
| Jade Dragon | China | Low | $22 |
| Golden Sunrise | India | High | $16 |
| Midnight Chai | India | Medium | $19 |
| Jasmine Dreams | China | Low | $24 |
| Arctic Mint | Morocco | None | $14 |
| Berry Blush | Kenya | None | $17 |
| Smoky Lapsang | China | Medium | $21 |

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 🙌 Credits

- Designed by **Aditya Jogalekar**
- Fonts by **Google Fonts**

---

## 📄 License

MIT — free to use and modify.
