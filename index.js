const express = require('express');
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

const app = express();
app.use(express.json());
app.use(express.static('public'));


const PORT = process.env.PORT || 3000;

// Device and network profiles
const profiles = {
  mobile: {
    viewport: { width: 375, height: 667, isMobile: true },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    network: 'Slow 3G',
  },
  desktop: {
    viewport: { width: 1366, height: 768 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    network: 'Fast 3G',
  }
};

const networks = {
  'Slow 3G': {
    offline: false,
    downloadThroughput: 500 * 1024 / 8,
    uploadThroughput: 500 * 1024 / 8,
    latency: 400,
  },
  'Fast 3G': {
    offline: false,
    downloadThroughput: 1.5 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
    latency: 150,
  }
};

// Main test route
app.post('/test', async (req, res) => {
  const { url, device = 'mobile' } = req.body;

  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const profile = profiles[device];

    await page.setUserAgent(profile.userAgent);
    await page.setViewport(profile.viewport);
    await page.emulateNetworkConditions(networks[profile.network]);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 1. Friction: Check clickable size
    const clickableAnalysis = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('a, button'));
      return elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: el.innerText.slice(0, 50),
          width: rect.width,
          height: rect.height,
          clickable: rect.width >= 44 && rect.height >= 44 // WCAG minimum
        };
      });
    });

    // 2. Accessibility audit
    await page.addScriptTag({ content: axeCore.source });
    const a11yReport = await page.evaluate(async () => await axe.run());

    await browser.close();

    return res.json({
      status: 'success',
      clickableAnalysis,
      a11yIssues: a11yReport.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length
      }))
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Test failed. ' + err.message });
  }
});

// Welcome route
app.get('/', (req, res) => {
  res.send('👋 Real-Time UX Tester API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
