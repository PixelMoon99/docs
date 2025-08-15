import React, {useState} from 'react';
import axios from 'axios';
export default function ImageUpload(){
  const [file,setFile]=useState(null);
  const upload = async ()=>{
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/media/upload`, fd, {headers: {'Content-Type':'multipart/form-data'}});
    alert('Uploaded: '+JSON.stringify(res.data, null, 2));
  };
  return (
    <div>
      <h3>Upload Media</h3>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button onClick={upload} disabled={!file}>Upload</button>
    </div>
  );
}
