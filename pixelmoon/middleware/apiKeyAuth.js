const ApiKey = require('../models/ApiKey');
const ApiUsage = require('../models/ApiUsage');
const crypto = require('crypto');

module.exports = function(requiredScopes = []) {
  return async function(req, res, next) {
    try {
      const auth = (req.get('authorization') || '').trim();
      let provided = null;
      if (auth && auth.startsWith('ApiKey ')) provided = auth.slice(7).trim();
      if (!provided) {
        return res.status(401).json({ ok:false, error: 'Missing API key' });
      }
      const prefix = provided.slice(0, 8);
      const keyDoc = await ApiKey.findOne({ prefix });
      if (!keyDoc || keyDoc.revoked) return res.status(401).json({ ok:false, error: 'Invalid API key' });
      const hashed = crypto.createHash('sha256').update(provided).digest('hex');
      if (hashed !== keyDoc.hashedKey) return res.status(401).json({ ok:false, error: 'Invalid API key' });

      // IP checks
      const clientIp = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
      if (keyDoc.ipMode === 'whitelist' && keyDoc.ipList.length > 0) {
        if (!keyDoc.ipList.includes(clientIp)) {
          return res.status(403).json({ ok:false, error: 'IP not allowed' });
        }
      }
      if (keyDoc.ipMode === 'blacklist' && keyDoc.ipList.length > 0) {
        if (keyDoc.ipList.includes(clientIp)) {
          return res.status(403).json({ ok:false, error: 'IP blocked' });
        }
      }

      // scope checks
      if (requiredScopes.length) {
        const has = requiredScopes.every(s => (keyDoc.scopes || []).includes(s));
        if (!has) return res.status(403).json({ ok:false, error: 'Insufficient scopes' });
      }

      req.apiKey = keyDoc;

      // log usage (best-effort)
      ApiUsage.create({
        apiKey: keyDoc._id,
        route: req.originalUrl,
        method: req.method,
        ip: clientIp,
        userAgent: req.get('user-agent') || '',
        status: 200
      }).catch(()=>{});

      // increment and update lastUsedAt
      ApiKey.updateOne({ _id: keyDoc._id }, { $inc: { usageCount: 1 }, $set: { lastUsedAt: new Date() } }).catch(()=>{});

      next();
    } catch (e) {
      console.error('apiKeyAuth error', e);
      return res.status(500).json({ ok:false, error: 'Internal error' });
    }
  };
};
