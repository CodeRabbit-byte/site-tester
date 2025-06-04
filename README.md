Real-Time UX Tester
==================

Description:
------------
This is a Node.js-based web service designed to evaluate the user experience (UX) of any website in real time. 
It simulates users browsing under different device and network conditions (e.g., mobile on slow 3G, desktop on fast 3G), 
and provides detailed reports identifying user friction points such as small clickable areas and accessibility issues.

Key Features:
-------------
- Simulates different devices and network speeds using Puppeteer
- Detects UX friction points like too-small buttons or broken navigation
- Performs accessibility audits using axe-core, highlighting issues with color contrast, ARIA roles, and more
- Provides a simple HTTP API to run tests programmatically
- Includes a minimal web UI for ease of use
- Designed to run seamlessly on Node.js environments such as GitHub Codespaces and Replit (with some configuration)

Installation:
-------------
1. Clone the repository
2. Run `npm install` to install dependencies
3. Start the server with `node index.js`
4. Open `http://localhost:3000` in your browser to access the UI or use the API endpoint `/test`

Usage:
------
- Submit a POST request to `/test` with JSON payload:
  {
    "url": "https://example.com",
    "device": "mobile" // or "desktop"
  }
- View detailed JSON reports including clickable size analysis and accessibility violations

Requirements:
-------------
- Node.js v16 or higher
- Internet access to load tested websites
- For Puppeteer on Replit: consider using Playwright or external browser services due to Chromium dependency issues

Notes:
------
- The project uses Puppeteer with `--no-sandbox` flags for compatibility in containerized environments
- For full compatibility on Replit, using Playwright is recommended
- Designed primarily for developers and UX testers looking to automate basic UX and accessibility checks

License:
--------
MIT License

---

For questions or contributions, please open an issue or pull request on GitHub.
