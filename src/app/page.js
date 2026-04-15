"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Instagram, Send, Ghost, Check, X, Maximize2, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Vault() {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isSelect, setIsSelect] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase.storage.from('vault').list();
      if (data) {
        setPhotos(data.map(f => ({
          id: f.id,
          name: f.name,
          url: supabase.storage.from('vault').getPublicUrl(f.name).data.publicUrl
        })));
      }
    };
    fetchPhotos();
  }, []);

  const downloadPhoto = async (url, index) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const bUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = bUrl;
    a.download = `lakshit_${(index + 1).toString().padStart(2, '0')}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(bUrl);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="fixed top-0 w-full z-50 glass px-6 py-5 flex justify-between items-center border-b border-white/5">
        <h1 className="text-[10px] font-black tracking-[0.8em] uppercase italic opacity-70">Photo's Vault</h1>
        <div className="flex gap-4">
          <button onClick={() => {setIsSelect(!isSelect); setSelected([]);}} className="text-[9px] uppercase tracking-widest opacity-40">
            {isSelect ? "[ Close ]" : "[ Select ]"}
          </button>
          <button 
            onClick={() => (selected.length > 0 ? photos.filter((_, i) => selected.includes(i)) : photos).forEach((p, i) => setTimeout(() => downloadPhoto(p.url, i), i * 500))}
            className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase"
          >
            Download {selected.length > 0 ? `(${selected.length})` : 'All'}
          </button>
        </div>
      </nav>

      <main className="pt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">
        {photos.map((p, i) => (
          <div 
            key={i} 
            onClick={() => isSelect && setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
            className="relative aspect-square overflow-hidden border-[0.1px] border-white/5 group bg-zinc-900 cursor-crosshair"
          >
            <img src={p.url} className={`w-full h-full object-cover transition-transform duration-[1.5s] ${selected.includes(i) ? 'scale-75 opacity-30' : 'group-hover:scale-110'}`} loading="lazy" />
            {!isSelect && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                <button onClick={(e) => {e.stopPropagation(); setPreview(p);}} className="p-3 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition"><Maximize2 size={16}/></button>
                <button onClick={(e) => {e.stopPropagation(); downloadPhoto(p.url, i);}} className="p-3 bg-white text-black rounded-full hover:scale-110 transition"><Download size={16}/></button>
              </div>
            )}
            {selected.includes(i) && <div className="absolute inset-0 flex items-center justify-center"><Check size={40} className="text-white drop-shadow-2xl" /></div>}
          </div>
        ))}
      </main>

      <footer className="py-32 flex flex-col items-center border-t border-white/5">
        <div className="flex gap-12 mb-10">
          <a href="https://instagram.com/pxl.lakshit" target="_blank" className="opacity-30 hover:opacity-100 hover:scale-110 transition-all"><Instagram size={24}/></a>
          <a href="https://t.me/pxllakshit" target="_blank" className="opacity-30 hover:opacity-100 hover:scale-110 transition-all"><Send size={24}/></a>
          <a href="https://www.snapchat.com/add/enc.lakshitt" target="_blank" className="opacity-30 hover:opacity-100 hover:scale-110 transition-all"><Ghost size={24}/></a>
        </div>
        <p className="text-[8px] tracking-[0.5em] opacity-10 uppercase italic">Photo's Vault • Professional Photographer System</p>
      </footer>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-5">
             <button onClick={() => setPreview(null)} className="absolute top-10 right-10 opacity-40 hover:opacity-100"><X size={30}/></button>
             <img src={preview.url} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
             <div className="mt-10 flex gap-4">
                <button onClick={() => navigator.share({url: window.location.href})} className="px-8 py-3 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest"><Share2 size={14}/></button>
                <button onClick={() => downloadPhoto(preview.url, 0)} className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black uppercase">Download RAW</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

