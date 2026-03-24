import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route to proxy Google Apps Script
  app.get("/api/survey-data", async (req, res) => {
    const API_URL = 'https://script.google.com/macros/s/AKfycbzz7O1shFzKHoWIQebIdp5sTdqNAzAkZzVO41tpGhMknNiKaKmNxZ2sD4JYe7Fs47FI/exec';

    try {
      console.log('Fetching from Google Apps Script API...');
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        redirect: 'follow'
      });

      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        console.log('Successfully fetched JSON from API');
        return res.json(data);
      } catch (e) {
        console.warn('API returned non-JSON response (likely HTML error/login page).');
        console.warn('Response starts with:', text.substring(0, 100));
        
        // Fallback to CSV if API fails
        console.log('Attempting fallback to CSV export...');
        const csvResponse = await fetch(FALLBACK_CSV_URL);
        if (csvResponse.ok) {
          const csvText = await csvResponse.text();
          console.log('Successfully fetched CSV fallback');
          return res.json({ csvData: csvText });
        }
        
        throw new Error('API returned HTML and CSV fallback failed.');
      }
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch data from Google Apps Script',
        details: error instanceof Error ? error.message : String(error),
        suggestion: 'Check if the Google Apps Script is deployed as a Web App with "Anyone" (including anonymous) access.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
