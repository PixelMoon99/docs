const express = require('express');
const router = express.Router();

// In absence of a real Product/Game model, return static examples
const sampleGames = [
  { _id:'mobile-legends', name:'Mobile Legends', slug:'mobile-legends' },
  { _id:'pubg', name:'PUBG Mobile', slug:'pubg' },
  { _id:'free-fire', name:'Free Fire', slug:'free-fire' },
];

router.get('/', async (req,res)=>{
  const search = (req.query.search||'').toLowerCase();
  let games = sampleGames;
  if (search) games = games.filter(g=> g.name.toLowerCase().includes(search));
  res.json({ success:true, games });
});

router.get('/:gameId', async (req,res)=>{
  const g = sampleGames.find(x=> x._id === req.params.gameId || x.slug === req.params.gameId);
  if (!g) return res.status(404).json({ success:false, message:'Not found' });
  // minimal packs for UI
  res.json({ success:true, game: { ...g, packs: [ { packId:'p1', provider:'voucher', retailPrice: 100, resellerPrice: 95 } ] } });
});

router.post('/validate-user', async (req,res)=>{
  const { gameId, userId } = req.body;
  if (!gameId || !userId) return res.status(400).json({ success:false, message:'missing fields' });
  // Stub always valid
  return res.json({ success:true, valid:true, data: { username: userId, userId } });
});

router.get('/api-servers/:product', async (req,res)=>{
  return res.json({ success:true, servers:[{ id:'1', name:'Server 1' }, { id:'2', name:'Server 2' }] });
});

module.exports = router;