import React, { useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import tempelate from './tempelate/shot.avif';

// ─── Daftar font yang tersedia ───────────────────────────────────────────────
const FONT_LIST = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
];

// ─── Template kaos yang tersedia ──────────────────────────────────────────────
const TEMPLATES = [
  { id: 1, name: 'Basic White Tee', image: tempelate, color: '#ffffff' },
  { id: 2, name: 'Classic Black', image: tempelate, color: '#151c27' },
  { id: 3, name: 'Bold Red', image: tempelate, color: '#EE0000' },
  { id: 4, name: 'Cool Grey', image: tempelate, color: '#5e5e5e' },
];

// ─── Komponen Draggable ───────────────────────────────────────────────────────
function Draggable({ children, position, onPositionChange, containerRef, onClick, style = {} }) {
  const dragging = useRef(false);
  const startOffset = useRef({ x: 0, y: 0 });
  const elRef = useRef(null);

  const onMouseDown = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    startOffset.current = {
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y,
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let nx = e.clientX - rect.left - startOffset.current.x;
    let ny = e.clientY - rect.top - startOffset.current.y;
    onPositionChange({ x: nx, y: ny });
  }, [containerRef, onPositionChange]);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  const onTouchStart = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const touch = e.touches[0];
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    startOffset.current = {
      x: touch.clientX - rect.left - position.x,
      y: touch.clientY - rect.top - position.y,
    };
  };
  const onTouchMove = (e) => {
    if (!dragging.current || !containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    let nx = touch.clientX - rect.left - startOffset.current.x;
    let ny = touch.clientY - rect.top - startOffset.current.y;
    onPositionChange({ x: nx, y: ny });
  };
  const onTouchEnd = () => { dragging.current = false; };

  return (
    <div
      ref={elRef}
      style={{ position: 'absolute', left: position.x, top: position.y, cursor: 'grab', ...style }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── Modal Export Preview ─────────────────────────────────────────────────────
function ExportModal({ onClose, canvasRef }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generate = async () => {
      if (!canvasRef.current) return;
      try {
        const canvas = await html2canvas(canvasRef.current, {
          backgroundColor: null,
          useCORS: true,
          scale: 2,
          logging: false,
        });
        setPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [canvasRef]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `hypeware-design-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-[#151c27]">Preview Desain</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">
              <span className="animate-spin text-4xl">⏳</span>
            </div>
          ) : (
            <img src={previewUrl} alt="Preview" className="w-full rounded-xl border border-gray-100 shadow" />
          )}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-[#0037b0] text-white font-bold py-3 rounded-lg text-sm uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50"
          >
            ⬇ Unduh PNG
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal AI Image Generator ─────────────────────────────────────────────────
function AiGeneratorModal({ onClose, onAddImage }) {
  // Google API Key dari env variable (jika ada)
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
  
  const [prompt, setPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('Vector Logo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const PRESETS = [
    { label: 'Vector Logo', suffix: ', vector logo graphics, sharp lines, clean isolated illustration, white background' },
    { label: 'Streetwear', suffix: ', streetwear graphic design style, edgy, bold typography elements, high contrast' },
    { label: 'Cyberpunk', suffix: ', cyberpunk style, glowing neon lights, futuristic artwork, high detail' },
    { label: 'Vintage', suffix: ', vintage retro badge logo style, distressed print texture, 80s aesthetic' },
    { label: 'Anime / Manga', suffix: ', Japanese anime art style, vibrant colors, detailed character illustration' },
    { label: 'Minimalist', suffix: ', minimalist line art, simple elegant aesthetic, single color graphic' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Silakan ketikkan deskripsi/prompt gambar yang ingin dibuat.');
      return;
    }

    setLoading(true);
    setError('');

    const presetObj = PRESETS.find(p => p.label === selectedPreset);
    const fullPrompt = prompt.trim() + (presetObj ? presetObj.suffix : '');

    try {
      let imageUrl = null;

      // 1. Coba panggil Google AI Studio API
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(GOOGLE_API_KEY)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instances: [{ prompt: fullPrompt }],
              parameters: { sampleCount: 1, aspectRatio: '1:1', outputMimeType: 'image/png' }
            })
          }
        );
        const data = await response.json();
        if (response.ok && data.predictions?.[0]?.bytesBase64Encoded) {
          imageUrl = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        }
      } catch (e) {
        console.warn('Google API request warning:', e);
      }

      // 2. High-speed Fallback AI Engine jika Google API restricted/CORS fail
      if (!imageUrl) {
        imageUrl = await new Promise((resolve) => {
          const seed = Math.floor(Math.random() * 1000000);
          const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512&seed=${seed}&nologo=true`;
          
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || 512;
              canvas.height = img.naturalHeight || 512;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            } catch (err) {
              resolve(aiUrl);
            }
          };
          img.onerror = () => resolve(aiUrl);
          img.src = aiUrl;
        });
      }

      if (!imageUrl) {
        throw new Error('Gagal menghasilkan gambar. Silakan coba prompt lain.');
      }

      onAddImage(imageUrl);
      onClose();
    } catch (err) {
      console.error('AI Generation Error:', err);
      setError(err.message || 'Terjadi kesalahan saat memanggil AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8 border border-gray-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#0037b0] to-[#6025e0] text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="font-bold text-lg">Generate AI Design</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#151c27]">
              🎨 Deskripsi Gambar (Prompt)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Seekor harimau cyber dengan kacamata neon, logo t-shirt streetwear..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0037b0] focus:outline-none resize-none"
            />
          </div>

          {/* Preset Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 block">
              Pilih Gaya / Style (Opsional):
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setSelectedPreset(p.label)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                    selectedPreset === p.label
                      ? 'bg-[#0037b0] text-white border-[#0037b0] shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-xs leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#0037b0] text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider hover:brightness-110 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Memproses AI...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generate Desain Kaos</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-gray-400">
            Powered by Hypeware AI Generation Engine
          </p>

        </div>
      </div>
    </div>
  );
}

// ─── Halaman Checkout ─────────────────────────────────────────────────────────
function CheckoutPage({ onBack, designData, canvasRef }) {
  const { selectedColor, selectedSize, selectedTemplate, texts, images } = designData;
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  
  const BASE_PRICE = 179000;
  
  // Hitung biaya custom berdasarkan jumlah dan ukuran
  const calculateCustomFee = () => {
    let fee = 0;
    
    // Biaya per text: Rp 5.000 + (ukuran font / 10) * 500
    texts.forEach(txt => {
      const baseFee = 5000;
      const sizeFee = Math.floor((txt.fontSize / 10) * 500);
      fee += baseFee + sizeFee;
    });
    
    // Biaya per image: Rp 10.000 + ((width + height) / 100) * 1000
    images.forEach(img => {
      const baseFee = 10000;
      const sizeFee = Math.floor(((img.width + img.height) / 100) * 1000);
      fee += baseFee + sizeFee;
    });
    
    return fee;
  };
  
  const CUSTOM_FEE = calculateCustomFee();
  const total = (BASE_PRICE + CUSTOM_FEE) * qty;

  const colorNames = {
    '#ffffff': 'Putih', '#151c27': 'Hitam', '#EE0000': 'Merah', '#5e5e5e': 'Abu-abu',
  };

  useEffect(() => {
    const generate = async () => {
      if (!canvasRef.current) {
        setLoading(false);
        return;
      }
      try {
        // Tunggu sebentar agar DOM siap
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(canvasRef.current, {
          backgroundColor: null,
          useCORS: true,
          scale: 2,
          logging: false,
          allowTaint: true,
        });
        setPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Error generating preview:', err);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [canvasRef]);

  const handleWhatsApp = () => {
    const textItems = texts.map((t, i) => `  Teks ${i + 1}: "${t.content}" (Font: ${t.fontFamily.split(',')[0]}, Ukuran: ${t.fontSize}px, Warna: ${t.color}, Rotasi: ${t.rotation || 0}°)`).join('\n');
    const imgItems = images.map((img, i) => `  Gambar ${i + 1}: Ukuran ${img.width}x${img.height}px, Rotasi: ${img.rotation || 0}°`).join('\n');

    // Breakdown biaya
    let customBreakdown = '';
    if (texts.length > 0) {
      customBreakdown += `  - ${texts.length} Teks (total: Rp${texts.reduce((sum, txt) => {
        const baseFee = 5000;
        const sizeFee = Math.floor((txt.fontSize / 10) * 500);
        return sum + baseFee + sizeFee;
      }, 0).toLocaleString('id-ID')})\n`;
    }
    if (images.length > 0) {
      customBreakdown += `  - ${images.length} Gambar (total: Rp${images.reduce((sum, img) => {
        const baseFee = 10000;
        const sizeFee = Math.floor(((img.width + img.height) / 100) * 1000);
        return sum + baseFee + sizeFee;
      }, 0).toLocaleString('id-ID')})\n`;
    }

    const message = `Halo Hypeware! Saya ingin memesan kaos custom:\n\n` +
      `📦 *Detail Produk:*\n` +
      `  Produk: ${selectedTemplate?.name || 'Cotton Heavyweight Tee'}\n` +
      `  Warna: ${colorNames[selectedColor] || selectedColor}\n` +
      `  Ukuran: ${selectedSize}\n` +
      `  Jumlah: ${qty} pcs\n\n` +
      `🎨 *Detail Desain:*\n` +
      (textItems ? `${textItems}\n` : '') +
      (imgItems ? `${imgItems}\n` : '') +
      `\n💰 *Estimasi Harga:*\n` +
      `  Harga Kaos: Rp${BASE_PRICE.toLocaleString('id-ID')}\n` +
      (CUSTOM_FEE > 0 ? `  Biaya Custom Desain: Rp${CUSTOM_FEE.toLocaleString('id-ID')}\n${customBreakdown}` : '') +
      `  Jumlah: ${qty} pcs\n` +
      `  *Total: Rp${total.toLocaleString('id-ID')}*\n\n` +
      `Gambar desain: ${previewUrl ? '(Terlampir di bawah)' : '(Sedang diproses)'}`;

    const waNumber = '6281234567890'; // Ganti dengan nomor WA toko
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp
    window.open(waUrl, '_blank');
    
    // Download gambar untuk dilampirkan manual
    if (previewUrl) {
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = `hypeware-design-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Inter'] text-[#151c27]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#c4c5d7] flex items-center px-8 gap-4 sticky top-0 z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[#0037b0] font-bold text-sm hover:underline">
          ← Kembali ke Studio
        </button>
        <span className="text-gray-300">|</span>
        <h1 className="font-bold text-lg">Checkout Pesanan</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Kolom Kiri: Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-base mb-4 text-[#0037b0] uppercase tracking-wide text-sm">Preview Desain</h2>
              {loading ? (
                <div className="h-64 flex items-center justify-center text-gray-400">Memuat preview...</div>
              ) : (
                <img src={previewUrl} alt="Desain" className="w-full rounded-xl border border-gray-100 shadow" />
              )}
            </div>
          </div>

          {/* Kolom Kanan: Detail & Harga */}
          <div className="space-y-6">
            
            {/* Detail Produk */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#0037b0] text-white px-6 py-3">
                <h2 className="font-bold text-sm uppercase tracking-wide">Detail Produk</h2>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <TableRow label="Produk" value={selectedTemplate?.name || 'Cotton Heavyweight Tee'} />
                  <TableRow label="Warna" value={
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: selectedColor }} />
                      {colorNames[selectedColor] || selectedColor}
                    </span>
                  } />
                  <TableRow label="Ukuran" value={selectedSize} />
                  <TableRow label="Jumlah" value={
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 rounded border border-gray-300 font-bold text-sm flex items-center justify-center hover:bg-gray-50">−</button>
                      <span className="font-bold w-6 text-center">{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} className="w-7 h-7 rounded border border-gray-300 font-bold text-sm flex items-center justify-center hover:bg-gray-50">+</button>
                    </div>
                  } />
                </tbody>
              </table>
            </div>

            {/* Detail Desain */}
            {(texts.length > 0 || images.length > 0) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#0037b0] text-white px-6 py-3">
                  <h2 className="font-bold text-sm uppercase tracking-wide">Detail Desain</h2>
                </div>
                <div className="p-6 space-y-3">
                  {texts.map((t, i) => (
                    <div key={i} className="text-sm text-gray-600 border-l-2 border-[#0037b0] pl-3">
                      <span className="font-semibold text-[#151c27]">Teks {i + 1}:</span> "{t.content}"
                      <br /><span className="text-xs text-gray-400">Font: {t.fontFamily.split(',')[0]} · {t.fontSize}px · {t.color} · Rotasi: {t.rotation || 0}°</span>
                    </div>
                  ))}
                  {images.map((img, i) => (
                    <div key={i} className="text-sm text-gray-600 border-l-2 border-green-400 pl-3">
                      <span className="font-semibold text-[#151c27]">Gambar {i + 1}:</span> {img.width}×{img.height}px · Rotasi: {img.rotation || 0}°
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estimasi Harga */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#0037b0] text-white px-6 py-3">
                <h2 className="font-bold text-sm uppercase tracking-wide">Estimasi Harga</h2>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <TableRow label="Harga Kaos" value={`Rp${BASE_PRICE.toLocaleString('id-ID')}`} />
                  {CUSTOM_FEE > 0 && (
                    <>
                      <TableRow label="Biaya Custom Desain" value={`Rp${CUSTOM_FEE.toLocaleString('id-ID')}`} />
                      {texts.length > 0 && (
                        <tr className="text-xs text-gray-500">
                          <td className="px-6 py-1 pl-10">↳ {texts.length} Teks</td>
                          <td className="px-6 py-1 text-right">Rp{texts.reduce((sum, txt) => {
                            const baseFee = 5000;
                            const sizeFee = Math.floor((txt.fontSize / 10) * 500);
                            return sum + baseFee + sizeFee;
                          }, 0).toLocaleString('id-ID')}</td>
                        </tr>
                      )}
                      {images.length > 0 && (
                        <tr className="text-xs text-gray-500">
                          <td className="px-6 py-1 pl-10">↳ {images.length} Gambar</td>
                          <td className="px-6 py-1 text-right">Rp{images.reduce((sum, img) => {
                            const baseFee = 10000;
                            const sizeFee = Math.floor(((img.width + img.height) / 100) * 1000);
                            return sum + baseFee + sizeFee;
                          }, 0).toLocaleString('id-ID')}</td>
                        </tr>
                      )}
                    </>
                  )}
                  <TableRow label="Subtotal" value={`Rp${(BASE_PRICE + CUSTOM_FEE).toLocaleString('id-ID')}`} />
                  <TableRow label={`Qty`} value={`× ${qty}`} />
                  <tr className="bg-[#f0f4ff] font-bold">
                    <td className="px-6 py-4 border-t-2 border-[#0037b0]">Total Estimasi</td>
                    <td className="px-6 py-4 text-right text-lg text-[#0037b0] border-t-2 border-[#0037b0]">Rp{total.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </table>
              <div className="px-6 pb-4">
                <p className="text-xs text-gray-400">*Harga final akan dikonfirmasi via WhatsApp</p>
              </div>
            </div>

            {/* Tombol WA */}
            <button
              onClick={handleWhatsApp}
              disabled={loading}
              className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl text-base uppercase tracking-widest shadow-lg hover:brightness-110 transition flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Pesan via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ label, value }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-6 py-3 text-gray-500">{label}</td>
      <td className="px-6 py-3 text-right font-semibold">{value}</td>
    </tr>
  );
}

// ─── Komponen Utama HypewareStudio ───────────────────────────────────────────
const HypewareStudio = () => {
  // State produk
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTool, setActiveTool] = useState('template'); // Default: template
  const [page, setPage] = useState('studio'); // 'studio' | 'checkout'
  const [showExport, setShowExport] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // State teks (array of text objects)
  const [texts, setTexts] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);

  // State gambar (array of image objects)
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);

  // Responsive Canvas Scaling untuk layar HP Android / Mobile
  const [canvasScale, setCanvasScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        const availableWidth = screenWidth - 32;
        const scale = Math.min(1, Math.max(0.48, availableWidth / 600));
        setCanvasScale(scale);
      } else if (screenWidth < 768) {
        const availableWidth = screenWidth - 64;
        const scale = Math.min(1, Math.max(0.6, availableWidth / 600));
        setCanvasScale(scale);
      } else if (screenWidth < 1024) {
        const availableWidth = screenWidth - 360;
        const scale = Math.min(1, Math.max(0.65, availableWidth / 600));
        setCanvasScale(scale);
      } else {
        setCanvasScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const designAreaRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const uid = () => Math.random().toString(36).slice(2);

  const selectedText = texts.find(t => t.id === selectedTextId);
  const selectedImage = images.find(img => img.id === selectedImageId);

  // ── Template selection ───────────────────────────────────────────────────
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setSelectedColor(template.color);
    setActiveTool('teks'); // Pindah ke tool teks setelah pilih template
  };

  // ── Text actions ─────────────────────────────────────────────────────────
  const addText = () => {
    const id = uid();
    setTexts(prev => [...prev, {
      id,
      content: 'TEKS DESAIN',
      fontFamily: 'Inter, sans-serif',
      fontSize: 32,
      color: '#151c27',
      position: { x: 200, y: 200 },
      rotation: 0,
    }]);
    setSelectedTextId(id);
    setSelectedImageId(null);
    setActiveTool('teks');
  };

  const updateText = (id, patch) => setTexts(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  const deleteText = (id) => { setTexts(prev => prev.filter(t => t.id !== id)); setSelectedTextId(null); };

  // ── Image actions ─────────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const id = uid();
      setImages(prev => [...prev, {
        id,
        src: ev.target.result,
        width: 180,
        height: 180,
        position: { x: 210, y: 210 },
        rotation: 0,
      }]);
      setSelectedImageId(id);
      setSelectedTextId(null);
      setActiveTool('gambar');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const updateImage = (id, patch) => setImages(prev => prev.map(img => img.id === id ? { ...img, ...patch } : img));
  const deleteImage = (id) => { setImages(prev => prev.filter(img => img.id !== id)); setSelectedImageId(null); };

  const handleAddAiImage = (src) => {
    const id = uid();
    setImages(prev => [...prev, {
      id,
      src,
      width: 200,
      height: 200,
      position: { x: 200, y: 200 },
      rotation: 0,
    }]);
    setSelectedImageId(id);
    setSelectedTextId(null);
    setActiveTool('gambar');
  };

  // ── Deselect on canvas click ──────────────────────────────────────────────
  const handleCanvasClick = () => {
    setSelectedTextId(null);
    setSelectedImageId(null);
  };

  // ── Checkout data ─────────────────────────────────────────────────────────
  const designData = { selectedColor, selectedSize, selectedTemplate, texts, images };

  // ── Navigate to home ──────────────────────────────────────────────────────
  const goToHome = (e) => {
    e.preventDefault();
    // Coba beberapa path alternatif
    const paths = [
      '/index.html',
      '../index.html',
      '../../index.html',
      window.location.origin + '/index.html'
    ];
    
    // Gunakan path pertama yang tersedia
    window.location.href = paths[0];
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (page === 'checkout') {
    return <CheckoutPage onBack={() => setPage('studio')} designData={designData} canvasRef={canvasRef} />;
  }

  return (
    <div className="flex flex-col h-screen md:h-screen bg-[#f9f9ff] text-[#151c27] font-['Inter'] overflow-y-auto md:overflow-hidden">

      {/* HEADER */}
      <header className="min-h-16 bg-white border-b border-[#c4c5d7] flex flex-wrap items-center justify-between px-4 sm:px-8 py-2 md:py-0 z-20 shrink-0 gap-2">
        <div onClick={goToHome} className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition cursor-pointer">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-[#0037b0] rounded-[4px] flex items-center justify-center text-white text-xs md:text-sm font-bold">H</div>
          <h1 className="font-bold text-base md:text-lg tracking-tight uppercase">
            Hypeware <span className="font-normal opacity-50">Studio</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-[11px] font-bold uppercase tracking-widest text-[#434655]">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#0037b0] to-[#6025e0] text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold hover:shadow-md hover:scale-105 transition cursor-pointer normal-case tracking-normal"
          >
            <span>✨</span>
            <span>Generate with AI</span>
          </button>
          <button onClick={goToHome} className="hover:text-[#0037b0] cursor-pointer bg-transparent border-0 text-xs sm:text-sm">Beranda</button>
          <span className="text-[#0037b0] border-b-2 border-[#0037b0] text-xs sm:text-sm">Designer</span>
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* LEFT TOOLBAR */}
        <aside className="w-full md:w-20 bg-white border-b md:border-b-0 md:border-r border-[#c4c5d7] flex flex-row md:flex-col items-center justify-around py-2 md:py-8 gap-1 md:gap-6 shrink-0 z-10">
          <ToolButton
            icon="✨"
            label="AI Tool"
            active={showAiModal}
            onClick={() => setShowAiModal(true)}
          />
          <ToolButton
            icon="📐"
            label="Template"
            active={activeTool === 'template'}
            onClick={() => setActiveTool('template')}
          />
          <ToolButton
            icon="T"
            label="Teks"
            active={activeTool === 'teks'}
            onClick={addText}
          />
          <ToolButton
            icon="🖼"
            label="Gambar"
            active={activeTool === 'gambar'}
            onClick={() => { setActiveTool('gambar'); fileInputRef.current?.click(); }}
          />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </aside>

        {/* CENTER CANVAS */}
        <section className="flex-1 bg-[#e7eefe] relative flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden min-h-[380px] sm:min-h-[480px]">
          
          {/* Jika tool = template, tampilkan grid template */}
          {activeTool === 'template' && !selectedTemplate && (
            <div className="w-full max-w-3xl">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Pilih Template Kaos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className="bg-white rounded-xl p-3 md:p-4 shadow hover:shadow-xl transition border-2 border-transparent hover:border-[#0037b0] group"
                  >
                    <div className="relative w-full aspect-square mb-2 md:mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                      <img src={tpl.image} alt={tpl.name} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="font-bold text-xs md:text-sm text-center group-hover:text-[#0037b0]">{tpl.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Jika sudah pilih template atau tool lain, tampilkan canvas */}
          {(selectedTemplate || activeTool !== 'template') && (
            <div
              className="relative flex items-center justify-center transition-all duration-300 my-auto"
              style={{
                width: 600 * canvasScale,
                height: 600 * canvasScale,
              }}
            >
              <div
                ref={canvasRef}
                className="relative bg-transparent origin-top-left transition-transform duration-300"
                style={{
                  width: 600,
                  height: 600,
                  transform: `scale(${canvasScale})`,
                }}
              >
              {/* Mockup baju */}
              <img
                src={selectedTemplate?.image || tempelate}
                alt="Shirt Mockup"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              />

              {/* Design area overlay - hanya sebagai referensi visual */}
              <div
                ref={designAreaRef}
                className="absolute pointer-events-none"
                style={{
                  left: '27%', top: '22%',
                  width: '46%', height: '52%',
                }}
              ></div>

              {/* Container untuk elemen yang bisa di-drag - full canvas */}
              <div
                className="absolute inset-0"
                onClick={handleCanvasClick}
              >
                {/* Gambar-gambar */}
                {images.map(img => (
                  <Draggable
                    key={img.id}
                    position={img.position}
                    onPositionChange={(pos) => updateImage(img.id, { position: pos })}
                    containerRef={canvasRef}
                    onClick={(e) => { e.stopPropagation(); setSelectedImageId(img.id); setSelectedTextId(null); }}
                  >
                    <div className={`relative ${selectedImageId === img.id ? 'ring-2 ring-[#0037b0] ring-offset-1' : ''}`}>
                      <img
                        src={img.src}
                        alt="custom"
                        draggable={false}
                        style={{
                          width: img.width,
                          height: img.height,
                          objectFit: 'cover',
                          display: 'block',
                          userSelect: 'none',
                          transform: `rotate(${img.rotation || 0}deg)`,
                        }}
                      />
                    </div>
                  </Draggable>
                ))}

                {/* Teks-teks */}
                {texts.map(txt => (
                  <Draggable
                    key={txt.id}
                    position={txt.position}
                    onPositionChange={(pos) => updateText(txt.id, { position: pos })}
                    containerRef={canvasRef}
                    onClick={(e) => { e.stopPropagation(); setSelectedTextId(txt.id); setSelectedImageId(null); }}
                  >
                    <div
                      className={`px-1 ${selectedTextId === txt.id ? 'ring-2 ring-[#0037b0] ring-offset-1' : ''}`}
                      style={{
                        fontFamily: txt.fontFamily,
                        fontSize: txt.fontSize,
                        color: txt.color,
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                        transform: `rotate(${txt.rotation || 0}deg)`,
                      }}
                    >
                      {txt.content}
                    </div>
                  </Draggable>
                ))}

                {/* Placeholder jika kosong */}
                {images.length === 0 && texts.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-bold text-[#0037b0]/20 uppercase tracking-widest">Area Desain</span>
                  </div>
                )}
              </div>
            </div>
            </div>
          )}
        </section>

        {/* RIGHT PANEL */}
        <aside className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-[#c4c5d7] flex flex-col shrink-0">
          <div className="p-6 flex-1 overflow-y-auto space-y-6">

            {/* Produk info */}
            <div>
              <span className="text-[10px] font-bold text-[#0037b0] uppercase border-l-2 border-[#0037b0] pl-2">
                Hypeware Studio Exclusive
              </span>
              <h2 className="text-xl font-bold mt-2 leading-tight">
                {selectedTemplate?.name || 'Cotton Heavyweight Tee'}
              </h2>
              <div className="text-lg font-bold mt-1">Rp179.000</div>
            </div>

            {/* Warna */}
            <div>
              <label className="text-[10px] font-bold uppercase text-[#434655] block mb-3">Pilih Warna</label>
              <div className="flex flex-wrap gap-3">
                {['#ffffff', '#151c27', '#EE0000', '#5e5e5e'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border border-gray-300 transition-all ${selectedColor === color ? 'ring-2 ring-[#0037b0] ring-offset-2' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Ukuran */}
            <div>
              <label className="text-[10px] font-bold uppercase text-[#434655] block mb-3">Ukuran</label>
              <div className="grid grid-cols-4 gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-bold rounded border transition ${selectedSize === size ? 'bg-[#0037b0] border-[#0037b0] text-white' : 'border-gray-300 hover:border-[#0037b0]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel kontrol GAMBAR */}
            {selectedImage && (
              <div className="bg-[#f0f4ff] rounded-xl p-4 space-y-3 border border-[#c4c5d7]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#0037b0]">Pengaturan Gambar</span>
                  <button onClick={() => deleteImage(selectedImage.id)} className="text-red-500 text-xs font-bold hover:underline">🗑 Hapus</button>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Lebar (px)</label>
                  <input
                    type="range" min={60} max={400}
                    value={selectedImage.width}
                    onChange={e => updateImage(selectedImage.id, { width: +e.target.value })}
                    className="w-full accent-[#0037b0]"
                  />
                  <span className="text-xs text-gray-500">{selectedImage.width}px</span>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Tinggi (px)</label>
                  <input
                    type="range" min={60} max={400}
                    value={selectedImage.height}
                    onChange={e => updateImage(selectedImage.id, { height: +e.target.value })}
                    className="w-full accent-[#0037b0]"
                  />
                  <span className="text-xs text-gray-500">{selectedImage.height}px</span>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Rotasi (°)</label>
                  <input
                    type="range" min={0} max={360}
                    value={selectedImage.rotation || 0}
                    onChange={e => updateImage(selectedImage.id, { rotation: +e.target.value })}
                    className="w-full accent-[#0037b0]"
                  />
                  <span className="text-xs text-gray-500">{selectedImage.rotation || 0}°</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-[#0037b0] text-[#0037b0] text-xs font-bold py-2 rounded hover:bg-[#e7eefe] transition"
                >
                  🔄 Ganti Gambar
                </button>
              </div>
            )}

            {/* Panel kontrol TEKS */}
            {selectedText && (
              <div className="bg-[#f0f4ff] rounded-xl p-4 space-y-3 border border-[#c4c5d7]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#0037b0]">Pengaturan Teks</span>
                  <button onClick={() => deleteText(selectedText.id)} className="text-red-500 text-xs font-bold hover:underline">🗑 Hapus</button>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Isi Teks</label>
                  <input
                    type="text"
                    value={selectedText.content}
                    onChange={e => updateText(selectedText.id, { content: e.target.value })}
                    className="w-full border border-[#c4c5d7] rounded px-3 py-2 text-sm font-bold"
                    placeholder="Ketik teks..."
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Jenis Font</label>
                  <select
                    value={selectedText.fontFamily}
                    onChange={e => updateText(selectedText.id, { fontFamily: e.target.value })}
                    className="w-full border border-[#c4c5d7] rounded px-3 py-2 text-sm"
                    style={{ fontFamily: selectedText.fontFamily }}
                  >
                    {FONT_LIST.map(f => (
                      <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Ukuran Font</label>
                  <input
                    type="range" min={12} max={120}
                    value={selectedText.fontSize}
                    onChange={e => updateText(selectedText.id, { fontSize: +e.target.value })}
                    className="w-full accent-[#0037b0]"
                  />
                  <span className="text-xs text-gray-500">{selectedText.fontSize}px</span>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Rotasi (°)</label>
                  <input
                    type="range" min={0} max={360}
                    value={selectedText.rotation || 0}
                    onChange={e => updateText(selectedText.id, { rotation: +e.target.value })}
                    className="w-full accent-[#0037b0]"
                  />
                  <span className="text-xs text-gray-500">{selectedText.rotation || 0}°</span>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-2">Warna Teks</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {['#151c27', '#ffffff', '#FFD700', '#EE0000', '#0037b0', '#00b050', '#ff6600'].map(c => (
                      <button
                        key={c}
                        onClick={() => updateText(selectedText.id, { color: c })}
                        className={`w-7 h-7 rounded-full border-2 transition ${selectedText.color === c ? 'border-[#0037b0] scale-110' : 'border-gray-200'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedText.color}
                      onChange={e => updateText(selectedText.id, { color: e.target.value })}
                      className="w-7 h-7 rounded-full border-2 border-gray-200 cursor-pointer p-0"
                      title="Pilih warna custom"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hint jika tidak ada yang dipilih */}
            {!selectedText && !selectedImage && activeTool !== 'template' && (
              <div className="text-center text-xs text-gray-400 py-4">
                Klik elemen di kanvas untuk mengeditnya,<br />atau gunakan toolbar kiri untuk menambah.
              </div>
            )}

            {/* Hint untuk template */}
            {activeTool === 'template' && !selectedTemplate && (
              <div className="text-center text-xs text-gray-400 py-4">
                Pilih template kaos di tengah layar untuk memulai desain.
              </div>
            )}

          </div>

          {/* ACTION BUTTONS */}
          <div className="p-6 border-t border-[#c4c5d7] bg-white space-y-3 shrink-0">
            <button
              onClick={() => setShowExport(true)}
              disabled={!selectedTemplate && activeTool === 'template'}
              className="w-full border border-[#0037b0] text-[#0037b0] font-bold py-3 rounded-lg text-[11px] uppercase tracking-widest hover:bg-[#e7eefe] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              👁 Export View
            </button>
            <button
              onClick={() => setPage('checkout')}
              disabled={!selectedTemplate && activeTool === 'template'}
              className="w-full bg-[#0037b0] text-white font-bold py-3 rounded-lg text-[11px] uppercase tracking-widest shadow-lg hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Checkout Sekarang
            </button>
          </div>
        </aside>
      </main>

      {/* Export Modal */}
      {showExport && <ExportModal onClose={() => setShowExport(false)} canvasRef={canvasRef} />}

      {/* AI Generator Modal */}
      {showAiModal && (
        <AiGeneratorModal
          onClose={() => setShowAiModal(false)}
          onAddImage={handleAddAiImage}
        />
      )}
    </div>
  );
};

// Sub-komponen tombol toolbar
const ToolButton = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group w-full">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xl ${active ? 'bg-[#0037b0] text-white' : 'text-[#434655] hover:bg-[#e7eefe]'}`}>
      {icon}
    </div>
    <span className={`text-[8px] font-bold uppercase tracking-wider ${active ? 'text-[#151c27]' : 'text-[#747686]'}`}>
      {label}
    </span>
  </button>
);

export default HypewareStudio;
