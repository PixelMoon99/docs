const express = require('express');
const router = express.Router();
const ProductPricing = require('../models/ProductPricing');

// Compute pricing given a product input (RP / SOC / USD)
router.post('/compute', async (req,res)=>{
  const {productId, source, value, rpToInr=0.0053, socToInr=1.55, usdToInr=89, margins, manualPrices, mode='auto'} = req.body;
  // margins = {small:5, mid:10, large:15}; manualPrices={retail,reseller,tier1,tier2,tier3}
  let costInINR = 0;
  if(source === 'rp') costInINR = value * rpToInr;
  if(source === 'soc') costInINR = value * socToInr;
  if(source === 'usd') costInINR = value * usdToInr;
  // determine pack type
  let size = 'small';
  if(costInINR>500) size='large';
  else if(costInINR>200) size='mid';
  const margin = (margins && margins[size])? margins[size] : (size==='small'?5:(size==='mid'?10:15));

  let retail, reseller, tierPrices;
  if (mode === 'manual' && manualPrices) {
    retail = +Number(manualPrices.retail||0).toFixed(2);
    reseller = +Number(manualPrices.reseller||0).toFixed(2);
    tierPrices = {
      tier1: +Number(manualPrices.tier1||retail).toFixed(2),
      tier2: +Number(manualPrices.tier2||retail).toFixed(2),
      tier3: +Number(manualPrices.tier3||retail).toFixed(2),
    };
  } else {
    retail = +(costInINR*(1+margin/100)).toFixed(2);
    reseller = +(retail - 3).toFixed(2);
    tierPrices = {
      tier1: +(retail*(1-0.03)).toFixed(2),
      tier2: +(retail*(1-0.05)).toFixed(2),
      tier3: +(retail*(1-0.07)).toFixed(2),
    };
  }

  const doc = await ProductPricing.findOneAndUpdate({productId, source}, {
    productId, source, sourceCost:value, exchangeRateRp:rpToInr, exchangeRateUsd:usdToInr,
    costInINR, retailPrice:retail, resellerPrice:reseller, tierPrices, lastUpdated: new Date()
  }, {upsert:true, new:true});
  res.json({ok:true, pricing:doc});
});

module.exports = router;
