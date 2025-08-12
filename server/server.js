const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'https://web-tech-detector.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options('/detect', cors(corsOptions)); // handle preflight OPTIONS

app.use(express.json());

// Function to detect techs from HTML
function detectTech(html) {
  const techs = [];

  // CMS
  if (/wp-content|wp-includes/i.test(html)) techs.push("WordPress");
  if (/Drupal/i.test(html)) techs.push("Drupal");
  if (/Joomla/i.test(html)) techs.push("Joomla");
  if (/Shopify/i.test(html)) techs.push("Shopify");
  if (/Magento/i.test(html)) techs.push("Magento");
  if (/Ghost/i.test(html)) techs.push("Ghost");

  // JavaScript Frameworks & Libraries
  if (/jquery(\.min)?\.js/i.test(html)) techs.push("jQuery");
  if (/react|data-reactroot/i.test(html)) techs.push("React");
  if (/next\/?(\.js)?/i.test(html)) techs.push("Next.js");
  if (/vue(\.min)?\.js/i.test(html)) techs.push("Vue.js");
  if (/nuxt/i.test(html)) techs.push("Nuxt.js");
  if (/angular(\.js)?/i.test(html)) techs.push("Angular");
  if (/svelte(\.min)?\.js/i.test(html)) techs.push("Svelte");
  if (/ember(\.min)?\.js/i.test(html)) techs.push("Ember.js");
  if (/alpine(\.min)?\.js/i.test(html)) techs.push("Alpine.js");

  // CSS Frameworks
  if (/bootstrap/i.test(html)) techs.push("Bootstrap");
  if (/tailwind/i.test(html)) techs.push("Tailwind CSS");
  if (/foundation(\.min)?\.css/i.test(html)) techs.push("Foundation");
  if (/bulma/i.test(html)) techs.push("Bulma");

  // Analytics & Tracking
  if (/google-analytics|gtag\.js|analytics\.js/i.test(html)) techs.push("Google Analytics");
  if (/matomo/i.test(html)) techs.push("Matomo");
  if (/hotjar/i.test(html)) techs.push("Hotjar");
  if (/mixpanel/i.test(html)) techs.push("Mixpanel");
  if (/segment/i.test(html)) techs.push("Segment");

  // E-commerce
  if (/woocommerce/i.test(html)) techs.push("WooCommerce");
  if (/bigcommerce/i.test(html)) techs.push("BigCommerce");
  if (/prestashop/i.test(html)) techs.push("PrestaShop");
  if (/opencart/i.test(html)) techs.push("OpenCart");

  // Other tools & platforms
  if (/cloudflare/i.test(html)) techs.push("Cloudflare");
  if (/firebase/i.test(html)) techs.push("Firebase");
  if (/aws/i.test(html)) techs.push("AWS");
  if (/heroku/i.test(html)) techs.push("Heroku");
  if (/netlify/i.test(html)) techs.push("Netlify");
  if (/vercel/i.test(html)) techs.push("Vercel");

  // Fonts & Icons
  if (/fontawesome/i.test(html)) techs.push("Font Awesome");
  if (/material-icons/i.test(html)) techs.push("Material Icons");

  return [...new Set(techs)];
}

app.post('/detect', async (req, res) => {
  const { url } = req.body;

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "Please provide a valid URL starting with http:// or https://" });
  }

  try {
    console.log(`Fetching URL: ${url}`);

    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Fetch failed with status: ${response.status}`);
      throw new Error(`Failed to fetch (status ${response.status})`);
    }

    const html = await response.text();
    const techs = detectTech(html);

    res.json({ techs });
  } catch (err) {
    console.error("Error in /detect route:", err);
    res.status(500).json({ error: "Could not fetch or analyze URL" });
  }
});

// Optional: simple GET route for health check
app.get('/', (req, res) => {
  res.send('Website Tech Detector API running');
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
