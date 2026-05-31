'use strict';

const http  = require('http');
const https = require('https');
const url   = require('url');

const PORT   = process.env.PORT   || 8080;
const AUTHOR = process.env.AUTHOR || 'Jakub Małek';

console.log(`[START] ${new Date().toISOString()} | Autor: ${AUTHOR} | Port: TCP/${PORT}`);

const CITIES = [
  { label: 'Polska – Lublin',         query: 'Lublin'    },
  { label: 'Polska – Warszawa',        query: 'Warsaw'    },
  { label: 'Polska – Wrocław',         query: 'Wroclaw'   },
];

const WW_CODES = {
  113: 'Słonecznie',      116: 'Częściowe zachmurzenie',
  119: 'Pochmurno',       122: 'Bardzo pochmurno',
  143: 'Mgła',            176: 'Przelotny deszcz',
  200: 'Burza',           263: 'Mżawka',
  293: 'Lekki deszcz',    296: 'Deszcz',
  299: 'Deszcz',          302: 'Deszcz',
  305: 'Intensywny deszcz', 308: 'Ulewa',
  323: 'Słaby śnieg',     326: 'Śnieg',
  329: 'Śnieg',           332: 'Śnieg',
  335: 'Intensywny śnieg', 338: 'Śnieżyca',
  353: 'Przelotny deszcz', 356: 'Przelotna ulewa',
  386: 'Burza z deszczem', 389: 'Burza z ulewą',
};

function fetchWeather(cityQuery) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://wttr.in/${encodeURIComponent(cityQuery)}?format=j1`;
    https.get(apiUrl, { headers: { 'User-Agent': 'weather-app/1.0' } }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('Błąd parsowania')); }
      });
    }).on('error', reject);
  });
}

function buildPage(cityIdx, data, error) {
  const options = CITIES.map((c, i) =>
    `<option value="${i}"${i === cityIdx ? ' selected' : ''}>${c.label}</option>`
  ).join('\n');

  let result = '';
  if (error) {
    result = `<p>Błąd: ${error}</p>`;
  } else if (data) {
    const cur  = data.current_condition[0];
    const code = parseInt(cur.weatherCode, 10);
    const desc = WW_CODES[code] || 'Nieznane';
    result = `
<hr>
<p><b>Miasto:</b> ${CITIES[cityIdx].label}</p>
<p><b>Temperatura:</b> ${cur.temp_C}°C</p>
<p><b>Odczuwalna:</b> ${cur.FeelsLikeC}°C</p>
<p><b>Warunki:</b> ${desc}</p>
<p><b>Wilgotność:</b> ${cur.humidity}%</p>
<p><b>Wiatr:</b> ${cur.windspeedKmph} km/h</p>`;
  }

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Pogoda</title>
</head>
<body>
<h2>Aplikacja pogodowa</h2>
<form method="GET" action="/weather">
  <label for="city">Wybierz miasto:</label><br>
  <select name="city" id="city">
${options}
  </select><br><br>
  <input type="submit" value="Sprawdź pogodę">
</form>
${result}
<hr>
<small>${AUTHOR} | port ${PORT}</small>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  let cityIdx = 0;
  let data    = null;
  let error   = null;

  if (pathname === '/weather') {
    cityIdx = parseInt(parsed.query.city, 10);
    if (isNaN(cityIdx) || cityIdx < 0 || cityIdx >= CITIES.length) cityIdx = 0;
    try {
      data = await fetchWeather(CITIES[cityIdx].query);
      console.log(`[REQ] ${CITIES[cityIdx].label}`);
    } catch (e) {
      error = e.message;
      console.error(`[ERR] ${e.message}`);
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(buildPage(pathname === '/weather' ? cityIdx : null, data, error));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[INFO] Serwer działa: http://0.0.0.0:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
