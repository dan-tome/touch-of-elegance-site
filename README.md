# A Touch of Elegance - Dry Cleaning Website

A simple, professional static website for A Touch of Elegance dry cleaning services.

## Features

- Clean, professional design
- Fully responsive (mobile-friendly)
- Easy to customize
- Fast loading
- No dependencies required

## Deployment Options

This website can be easily hosted on various platforms:

### GitHub Pages (Free)

1. Go to your repository Settings
2. Navigate to "Pages" section
3. Under "Source", select your branch (e.g., `main`)
4. Click Save
5. Your site will be available at `https://yourusername.github.io/touch-of-elegance-site/`

### Netlify (Free)

1. Sign up at [netlify.com](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
5. Click "Deploy site"

### Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

### Traditional Web Hosting

Simply upload the files (`index.html` and `styles.css`) to your web server's public directory (often `public_html` or `www`).

## Local Testing

To view the website locally:

1. Clone this repository
2. Open `index.html` in your web browser
3. Or use a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (requires npx)
   npx http-server
   ```
4. Visit `http://localhost:8000` in your browser

## Customization

To customize the website for your business:

1. Edit `index.html` to update:
   - Business name and tagline
   - Services offered
   - Contact information (address, phone, email, hours)
   - About us section

2. Edit `styles.css` to change:
   - Colors (search for color codes like `#2c3e50`)
   - Fonts
   - Layout and spacing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is available for use by A Touch of Elegance.