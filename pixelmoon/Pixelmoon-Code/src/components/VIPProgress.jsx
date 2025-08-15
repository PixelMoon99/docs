import React from 'react';

export default function VIPProgress({current, required}) {
  const pct = Math.min(100, Math.round((current/required)*100));
  return (
    <div className="vip-progress">
      <div>Progress: {current} / {required}</div>
      <div style={{background:'#eee',height:10,borderRadius:6,overflow:'hidden'}}>
        <div style={{width: pct+'%', height:10, background:'#7b61ff'}} />
      </div>
      {pct>=100 ? <div className="badge">Eligible!</div> : null}
    </div>
  );
}
