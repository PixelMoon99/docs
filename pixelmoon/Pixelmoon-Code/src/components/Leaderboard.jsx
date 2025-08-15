import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function Leaderboard(){
  const [data,setData]=useState([]);
  useEffect(()=>{ 
    let active = true;
    const fetchOnce = async ()=>{
      const r = await axios.get(`${import.meta.env.VITE_API_URL || ''}/leaderboard/top?days=30`, { headers: { 'Cache-Control':'no-cache' } });
      if (active) setData(r.data.users||[]);
    };
    fetchOnce();
    const id = setInterval(fetchOnce, 30000);
    return ()=>{ active=false; clearInterval(id); };
  },[]);
  return (
    <div>
      <h3>30-day Leaderboard</h3>
      <ol>{data.map(u=>
        <li key={u.userId}>{u.username} — {u.count} orders{typeof u.totalSpent!=='undefined' ? ` — ₹${u.totalSpent}`:''}</li>
      )}</ol>
    </div>
  );
}
