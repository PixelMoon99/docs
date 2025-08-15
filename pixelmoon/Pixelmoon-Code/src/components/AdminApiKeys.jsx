import React, { useEffect, useState } from 'react';

export default function AdminApiKeys(){
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', scopes:'read:products', expiresAt:'', ipMode:'none', ipList:'' });
  async function fetchKeys(){
    setLoading(true);
    const res = await fetch('/api/admin/api-keys', { credentials:'include' });
    const j = await res.json();
    if (j.ok) setKeys(j.keys);
    setLoading(false);
  }
  useEffect(()=>{ fetchKeys() },[]);

  async function createKey(e){
    e.preventDefault();
    const body = { ...form, scopes: form.scopes.split(',').map(s=>s.trim()), ipList: form.ipList?form.ipList.split(',').map(s=>s.trim()):[] };
    const res = await fetch('/api/admin/api-keys/create', { method:'POST', credentials:'include', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
    const j = await res.json();
    if (j.ok) {
      alert('New key created. Save it now:\n' + j.key);
      fetchKeys();
    } else alert('Error: ' + (j.error||'unknown'));
  }

  async function toggleBlock(id, block){
    const url = `/api/admin/api-keys/${id}/${block?'block':'unblock'}`;
    const res = await fetch(url, { method:'POST', credentials:'include' });
    const j = await res.json();
    if (j.ok) fetchKeys(); else alert('Error');
  }

  async function updateIp(id){
    const idata = prompt('Enter IP mode (none, whitelist, blacklist) and comma-separated IPs. Example: whitelist 1.2.3.4,5.6.7.8');
    if (!idata) return;
    const parts = idata.split(' ');
    const ipMode = parts[0];
    const ipList = parts[1] ? parts[1].split(',').map(s=>s.trim()) : [];
    const res = await fetch(`/api/admin/api-keys/${id}/ip`, { method:'POST', credentials:'include', headers:{'content-type':'application/json'}, body: JSON.stringify({ ipMode, ipList }) });
    const j = await res.json();
    if (j.ok) fetchKeys(); else alert('Error');
  }

  async function downloadPdf(id){
    const win = window.open(`/api/admin/api-keys/${id}/pdf`, '_blank');
    if (!win) alert('Popup blocked. Allow popups to download PDF.');
  }

  return (<div style={{padding:20}}>
    <h2>API Key Management</h2>
    <form onSubmit={createKey} style={{marginBottom:20}}>
      <input required placeholder="Partner name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <input placeholder="scopes comma separated" value={form.scopes} onChange={e=>setForm({...form,scopes:e.target.value})} />
      <input placeholder="expiresAt (YYYY-MM-DD) optional" value={form.expiresAt} onChange={e=>setForm({...form,expiresAt:e.target.value})} />
      <input placeholder="allowed IPs comma separated" value={form.ipList} onChange={e=>setForm({...form,ipList:e.target.value})} />
      <select value={form.ipMode} onChange={e=>setForm({...form,ipMode:e.target.value})}>
        <option value="none">No IP rules</option>
        <option value="whitelist">Whitelist</option>
        <option value="blacklist">Blacklist</option>
      </select>
      <button type="submit">Generate API Key</button>
    </form>

    <button onClick={fetchKeys}>Refresh</button>
    {loading ? <div>Loading…</div> : (
      <table border="1" cellPadding="6" style={{marginTop:10}}>
        <thead><tr><th>Partner</th><th>Prefix</th><th>Status</th><th>Usage</th><th>LastUsed</th><th>Actions</th></tr></thead>
        <tbody>
          {keys.map(k=> (
            <tr key={k._id}>
              <td>{k.name}</td>
              <td>{k.prefix}</td>
              <td>{k.revoked ? 'Blocked' : 'Active'}</td>
              <td>{k.usageCount}</td>
              <td>{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : '-'}</td>
              <td>
                <button onClick={()=>toggleBlock(k._id, !k.revoked)}>{k.revoked ? 'Unblock' : 'Block'}</button>
                <button onClick={()=>updateIp(k._id)}>IP Rules</button>
                <button onClick={()=>downloadPdf(k._id)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>);
}
