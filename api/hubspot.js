export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-hs-token')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const token = req.headers['x-hs-token']
  if (!token) return res.status(401).json({ error: 'Missing x-hs-token header' })

  const path = req.query.path
  if (!path) return res.status(400).json({ error: 'Missing path query parameter' })

  const fetchOptions = {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  if (req.method === 'POST') {
    fetchOptions.body = JSON.stringify(req.body)
  }

  try {
    const response = await fetch(`https://api.hubapi.com${path}`, fetchOptions)
    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
