export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  const apiKey = process.env.PRIMAT_API_KEY;

  if (!apiKey) {
    console.error('PRIMAT_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://api.primat.nu/api/v3/products?q=${encodeURIComponent(q)}&apikey=${apiKey}`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Primat API error:', response.status, response.statusText);
      return res.status(response.status).json({ error: `Primat API error: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
