import React, {useState} from 'react';
import axios from 'axios';

export default function AdminPricing(){ 
  const [form, setForm] = useState({productId:'weekly_pass', source:'rp', value:22098});
  const compute = async ()=> {
    const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/pricing/compute`, form);
    alert('Pricing saved: ' + JSON.stringify(res.data.pricing,null,2));
  };
  return (
    <div>
      <h3>Admin Pricing Tool</h3>
      <label>Source<select value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>
        <option value="rp">RP</option><option value="soc">SOC</option><option value="usd">USD</option>
      </select></label>
      <label>Value<input type="number" value={form.value} onChange={e=>setForm({...form,value: Number(e.target.value)})} /></label>
      <button onClick={compute}>Compute & Save</button>
    </div>
  );
}
