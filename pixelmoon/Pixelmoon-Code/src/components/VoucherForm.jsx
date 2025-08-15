import React, {useState} from 'react';
import axios from 'axios';
export default function VoucherForm(){
  const [form, setForm] = useState({code:'NEW10',name:'Discount',price:10,description:''});
  const create = async ()=> {
    const res = await axios.post('/api/v1/vouchers/create', form);
    alert('Created: ' + res.data.v.code);
  };
  return (
    <div>
      <h3>Create Voucher</h3>
      <input value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/>
      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input type="number" value={form.price} onChange={e=>setForm({...form,price: Number(e.target.value)})}/>
      <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
      <button onClick={create}>Create</button>
    </div>
  );
}
