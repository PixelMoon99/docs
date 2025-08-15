import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function AnalyticsDashboard(){
  const [data, setData] = useState(null);
  useEffect(()=>{ axios.get(`${import.meta.env.VITE_API_URL || ''}/analytics/summary`).then(r=>setData(r.data)); },[]);
  if(!data) return <div>Loading...</div>;
  return (
    <div>
      <h3>Analytics Summary</h3>
      <pre>{JSON.stringify(data,null,2)}</pre>
    </div>
  );
}
