import React, {useState} from 'react';
import axios from 'axios';
export default function OTPLogin(){
  const [email,setEmail]=useState(''), [code,setCode]=useState('');
  const req = async ()=> { await axios.post('/api/v1/auth/otp/request',{email}); alert('OTP requested — check server logs (dev)'); };
  const verify = async ()=> { const r = await axios.post('/api/v1/auth/otp/verify',{email,code}); alert('Logged in, token: '+r.data.token); };
  return (<div>
    <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
    <button onClick={req}>Request OTP</button>
    <input placeholder="code" value={code} onChange={e=>setCode(e.target.value)} />
    <button onClick={verify}>Verify</button>
  </div>);
}
