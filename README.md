# Dropify Technologies - Revolutionary Web3 Onboarding Platform

A revolutionary Web2→Web3 onboarding platform built with Next.js 15, TypeScript, and deployed on Supra L1 blockchain. Dropify Technologies showcases patent-pending technology for seamless wallet generation and automated token distribution.

## 🌈 Design Features

- **Stunning Gradients**: Beautiful cyan-blue to purple gradient themes throughout
- **Modern UI**: Glass-morphism effects with backdrop blur and translucency
- **Responsive Design**: Fully responsive design that looks amazing on all devices
- **Interactive Elements**: Hover effects, scale transformations, and smooth transitions
- **Dark Mode**: Automatic dark mode support with gradient adaptations

## 🚀 Features

- **Gradient Design**: Beautiful cyan-blue to purple gradients with glass-morphism effects
- **TypeScript**: Full type safety for better development experience
- **API Routes**: RESTful API endpoints for contact forms and environment checking
- **Environment Variables**: Comprehensive environment configuration for various services
- **Performance Optimized**: Built with Next.js 15 and Turbopack for fast development
- **Dark Mode**: Automatic dark mode support with gradient themes
- **Mobile Responsive**: Fully responsive design for all screen sizes
- **Interactive UI**: Hover effects, animations, and smooth transitions

## 📦 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Geist Sans & Geist Mono
- **Build Tool**: Turbopack
- **Package Manager**: npm

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the `.env.local` file and update the values as needed:
   ```bash
   cp .env.local .env.local.example
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

The application supports the following environment variables:

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_HOST` - Database host
- `DATABASE_PORT` - Database port
- `DATABASE_NAME` - Database name
- `DATABASE_USER` - Database username
- `DATABASE_PASSWORD` - Database password

### Authentication
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL for authentication

### API Keys
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `STRIPE_PUBLIC_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `OPENAI_API_KEY` - OpenAI API key
- `WEATHER_API_KEY` - Weather API key

### Email Configuration
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `EMAIL_FROM` - Default sender email (noreply@dropify.com)

### Social Media
- `FACEBOOK_APP_ID` - Facebook app ID
- `TWITTER_API_KEY` - Twitter API key
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

### App Configuration
- `APP_NAME` - Application name (Dropify)
- `APP_URL` - Application URL
- `NODE_ENV` - Environment (development/production)

## 📱 Pages and Features

### Homepage (`/`)
- Hero section with call-to-action buttons
- Features showcase with icons
- Environment status display
- Contact form with API integration
- Responsive navigation with mobile menu

### API Endpoints

#### Contact Form (`/api/contact`)
- **Method**: POST
- **Body**: `{ name: string, email: string, message: string }`
- **Response**: Success/error message

#### Environment Check (`/api/env-check`)
- **Method**: GET
- **Response**: Environment configuration status
- **Security**: Only shows configuration status, not actual values

## 🎨 Components

### EnvironmentStatus
Real-time display of environment configuration status:
- Shows which services are configured
- Visual indicators (✅/⚠️) for each service
- Secure display (doesn't expose actual values)
- Auto-refresh capability

## 📝 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server

## 🔒 Security Features

- Environment variables are properly secured
- API endpoints include input validation
- No sensitive data exposed in client-side code
- Type-safe API routes

## 📖 Development Guidelines

### Code Structure
```
app/
├── api/              # API routes
│   ├── contact/      # Contact form endpoint
│   └── env-check/    # Environment status endpoint
├── components/       # Reusable components
│   └── EnvironmentStatus.tsx
├── globals.css       # Global styles
├── layout.tsx        # Root layout
└── page.tsx          # Homepage

```

### Best Practices
- Use TypeScript for all components
- Implement proper error handling
- Follow responsive design principles
- Use semantic HTML elements
- Implement proper form validation

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
This application can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation
2. Open an issue on GitHub
3. Use the contact form on the website

---

**Built with ❤️ using Next.js 15 and beautiful gradients**
