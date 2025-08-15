import React from 'react';
export default function BalanceDisplay({ title, amount, color = 'primary' }){
  return (
    <div className={`card border-${color}`}>
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
        <h4 className={`card-title text-${color}`}>{amount}</h4>
      </div>
    </div>
  );
}