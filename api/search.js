export default async function handler(req, res) {
  const name = req.query.username;

  if (!name) return res.status(400).json({ error: 'Username required' });

  const url = `https://api.dashboard.union.build/rest/v1/user_levels?select=*&display_name=ilike.*${encodeURIComponent(name)}*&order=total_xp.desc,user_id.asc`;

  try {
    const response = await fetch(url); // ✅ No headers needed
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      res.status(200).json(data[0]); // return first matching result
    } else {
      res.status(404).json({ error: 'No match found' });
    }
  } catch (err) {
    console.error('API fetch failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
