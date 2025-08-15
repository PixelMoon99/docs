import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function Leaderboard(){
  const [data,setData]=useState([]);
  useEffect(()=>{ axios.get(`${import.meta.env.VITE_API_URL || ''}/leaderboard/top?days=30`).then(r=>setData(r.data.users||[])); },[]);
  return (
    <div>
      <h3>30-day Leaderboard</h3>
      <ol>{data.map(u=>
        <li key={u.userId}>{u.username} — {u.count} orders{typeof u.totalSpent!=='undefined' ? ` — ₹${u.totalSpent}`:''}</li>
      )}</ol>
    </div>
  );
}
