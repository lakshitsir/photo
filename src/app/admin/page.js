"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload } from 'lucide-react';

export default function Admin() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = `${Date.now()}_${i}.${file.name.split('.').pop()}`;
      await supabase.storage.from('vault').upload(name, file);
    }
    setLoading(false);
    alert("50+ Photos Synced to Vault!");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="max-w-sm w-full border border-white/5 p-10 rounded-[40px] text-center bg-zinc-900/30">
        <h1 className="text-[10px] font-black tracking-[0.6em] mb-10 opacity-50 uppercase">Vault Upload</h1>
        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="mb-8 block w-full text-[10px] text-zinc-500" />
        <button onClick={handleUpload} className="w-full bg-white text-black py-4 rounded-full font-black uppercase text-[10px] flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>}
          {loading ? "Processing..." : `Push ${files.length} Photos`}
        </button>
      </div>
    </div>
  );
         }
        
