const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
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

  return [...new Set(techs)]; // Remove duplicates
}

app.post('/detect', async (req, res) => {
  const { url } = req.body;

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "Please provide a valid URL starting with http:// or https://" });
  }

  try {
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch (status ${response.status})`);
    }

    const html = await response.text();
    const techs = detectTech(html);

    res.json({ techs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch or analyze URL" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
