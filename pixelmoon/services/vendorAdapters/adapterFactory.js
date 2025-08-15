/**
 * adapterFactory - returns a vendor adapter based on provider key.
 * This file is a placeholder: create concrete adapters in services/vendorAdapters/
 */
module.exports = function adapterFactory(providerKey) {
  // extend with actual adapters like 'smileone', 'yokcash', etc.
  const adapters = {
    // 'smileone': require('./smileoneAdapter'),
  };
  return adapters[providerKey] || null;
};
