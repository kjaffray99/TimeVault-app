# TimeVault - Crypto to Precious Metals & Time Calculator

A modern React application for converting cryptocurrency values into precious metals (gold/silver) and personal time equivalents.

## 🚀 Features

- **Crypto Calculator**: Convert BTC, ETH, and other cryptocurrencies to gold/silver ounces or time value
- **Educational Dashboard**: Interactive quizzes, tips, and tutorials about crypto and precious metals
- **Premium Analytics**: Advanced AI insights and market analysis (wallet-gated)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Full dark/light theme support with system preference detection
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API requests
- **Recharts** - Charts and data visualization
- **Lucide React** - Modern icon library
- **Thirdweb SDK** - Blockchain integration for XRPL

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/timevault.git
   cd timevault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API keys and configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 API Integration

### CoinGecko API
Used for real-time cryptocurrency prices and market data.

### Metals.live API
Provides current precious metals prices (gold/silver).

### Thirdweb SDK
Enables wallet connection and XRPL blockchain features.

## 📱 Component Structure

```
src/
├── components/
│   ├── Calculator/          # Main conversion calculator
│   ├── Dashboard/           # Educational content hub
│   └── Premium/             # Premium features (wallet-gated)
├── contexts/
│   └── ThemeContext.tsx     # Theme management
├── services/
│   ├── api.ts              # API service layer
│   └── education.ts        # Educational content
├── types/
│   └── index.ts            # TypeScript definitions
└── App.tsx                 # Main application component
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#001F3F` - Navy blue for primary elements
- **Accent Gold**: `#D4AF37` - Gold for highlights and CTAs
- **Success Green**: `#10B981` - For positive states
- **Error Red**: `#EF4444` - For error states

### Typography
- **Font Family**: System fonts with fallbacks
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- Uses 8px base unit (0.5rem increments)
- Consistent padding and margins throughout

## 🔐 Premium Features

Premium features are gated behind wallet authentication:

1. **AI Market Insights** - Machine learning analysis of crypto markets
2. **Advanced Charts** - Professional-grade charting tools
3. **Portfolio Analytics** - Risk analysis and optimization
4. **Custom Alerts** - Price and trend notifications
5. **Priority Support** - Dedicated customer support

## 📊 Educational Content

The dashboard includes:

- **Interactive Quizzes** - Test knowledge and earn TVLT tokens
- **Educational Tips** - Bite-sized learning content
- **Video Tutorials** - Step-by-step guides
- **Progress Tracking** - Monitor learning advancement

## 🌍 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build
```bash
npm run build
```
Deploy the `dist` folder to your hosting provider.

## 🔒 Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_METALS_API_URL=https://api.metals.live/v1
VITE_THIRDWEB_CLIENT_ID=your_client_id
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading**: Lazy loading for components and routes
- **Caching**: API responses cached for better UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.timevaultai.com](https://docs.timevaultai.com)
- **Discord**: [Join our community](https://discord.gg/timevault)
- **Email**: support@timevaultai.com

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for cryptocurrency data
- [Metals.live](https://metals.live/) for precious metals prices
- [Thirdweb](https://thirdweb.com/) for blockchain infrastructure
- [Lucide](https://lucide.dev/) for beautiful icons

---

Built with ❤️ by the TimeVault team
