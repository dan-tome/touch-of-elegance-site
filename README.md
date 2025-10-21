# touch-of-elegance-site

A professional website for A Touch of Elegance Dry Cleaners.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/dan-tome/touch-of-elegance-site.git
cd touch-of-elegance-site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The website will open automatically in your default browser at `http://localhost:8080`.

## Project Structure

```
touch-of-elegance-site/
├── public/              # Public web files
│   ├── index.html      # Main HTML file
│   ├── css/            # Stylesheets
│   │   └── styles.css  # Main CSS file
│   └── js/             # JavaScript files
│       └── app.js      # Main JavaScript file
├── package.json        # Node.js project configuration
└── README.md          # This file
```

## Development

- The development server uses `live-server` which automatically reloads the page when files change.
- Edit files in the `public/` directory to make changes to the website.

## Deployment

The `public/` directory contains all the files needed to deploy the website. You can deploy this to any static hosting service such as:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

Simply upload the contents of the `public/` directory to your hosting provider.

## License

ISC