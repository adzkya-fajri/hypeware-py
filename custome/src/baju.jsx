import React from 'react';

export default function Baju({ warnaBaju, teksDesain, warnaTeks }) {
  const fill = warnaBaju || '#ffffff';
  // Diset agar mirip mockup referensi (outline tebal + detail minimalis)
  const outline = '#2b2f3a';
  const seam = 'rgba(43, 47, 58, 0.45)';

  return (
    <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">

      {/* SVG kaos detail (outline, kerah, jahitan, lipatan) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full drop-shadow-2xl transition-colors duration-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradasi supaya mirip mockup: sedikit lebih terang di atas */}
          <linearGradient id="teeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={fill} stopOpacity="0.98" />
            <stop offset="0.55" stopColor={fill} stopOpacity="0.96" />
            <stop offset="1" stopColor={fill} stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id="teeDepth" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.12" />
            <stop offset="0.22" stopColor="#000" stopOpacity="0.05" />
            <stop offset="0.5" stopColor="#000" stopOpacity="0" />
            <stop offset="0.78" stopColor="#000" stopOpacity="0.06" />
            <stop offset="1" stopColor="#000" stopOpacity="0.12" />
          </linearGradient>
          <clipPath id="teeClip">
            {/* Siluet kaos (lebih mirip referensi: badan kotak & bawah membulat) */}
            <path d="M38 13c2.6 5.4 6.7 7.8 12 7.8s9.4-2.4 12-7.8h10.2c1.8 0 3 1.2 3.6 2.2l5.5 11.8c.6 1.3-.2 2.9-1.6 3.5l-6.2 2.6c-1.2.5-2.6 0-3.3-1.1l-3.2-5.1V83c0 3.3-2.7 6-6 6H39c-3.3 0-6-2.7-6-6V26.9l-3.2 5.1c-.7 1.1-2.1 1.6-3.3 1.1l-6.2-2.6c-1.4-.6-2.2-2.2-1.6-3.5l5.5-11.8c.6-1 1.8-2.2 3.6-2.2H38z" />
          </clipPath>
        </defs>

        {/* Base fill */}
        <path
          d="M38 13c2.6 5.4 6.7 7.8 12 7.8s9.4-2.4 12-7.8h10.2c1.8 0 3 1.2 3.6 2.2l5.5 11.8c.6 1.3-.2 2.9-1.6 3.5l-6.2 2.6c-1.2.5-2.6 0-3.3-1.1l-3.2-5.1V83c0 3.3-2.7 6-6 6H39c-3.3 0-6-2.7-6-6V26.9l-3.2 5.1c-.7 1.1-2.1 1.6-3.3 1.1l-6.2-2.6c-1.4-.6-2.2-2.2-1.6-3.5l5.5-11.8c.6-1 1.8-2.2 3.6-2.2H38z"
          fill="url(#teeFill)"
        />
        <path d="M38 13c2.6 5.4 6.7 7.8 12 7.8s9.4-2.4 12-7.8h10.2c1.8 0 3 1.2 3.6 2.2l5.5 11.8c.6 1.3-.2 2.9-1.6 3.5l-6.2 2.6c-1.2.5-2.6 0-3.3-1.1l-3.2-5.1V83c0 3.3-2.7 6-6 6H39c-3.3 0-6-2.7-6-6V26.9l-3.2 5.1c-.7 1.1-2.1 1.6-3.3 1.1l-6.2-2.6c-1.4-.6-2.2-2.2-1.6-3.5l5.5-11.8c.6-1 1.8-2.2 3.6-2.2H38z" fill="url(#teeDepth)" opacity="0.45" />

        {/* Outer outline */}
        <path
          d="M38 13c2.6 5.4 6.7 7.8 12 7.8s9.4-2.4 12-7.8h10.2c1.8 0 3 1.2 3.6 2.2l5.5 11.8c.6 1.3-.2 2.9-1.6 3.5l-6.2 2.6c-1.2.5-2.6 0-3.3-1.1l-3.2-5.1V83c0 3.3-2.7 6-6 6H39c-3.3 0-6-2.7-6-6V26.9l-3.2 5.1c-.7 1.1-2.1 1.6-3.3 1.1l-6.2-2.6c-1.4-.6-2.2-2.2-1.6-3.5l5.5-11.8c.6-1 1.8-2.2 3.6-2.2H38z"
          fill="none"
          stroke={outline}
          strokeWidth="2.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Collar (abu-abu seperti referensi) */}
        <path d="M41.5 15.2c2.8 3.6 5.6 5.4 8.5 5.4s5.7-1.8 8.5-5.4" fill="none" stroke="#9aa3b2" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M44.5 14.6c2.0 2.6 3.9 3.9 5.5 3.9s3.5-1.3 5.5-3.9" fill="none" stroke="#c3c9d6" strokeWidth="1.6" strokeLinecap="round" />

        {/* Garis lipatan bahu (seperti referensi) */}
        <path d="M33.5 22.5l9.5 3.2" fill="none" stroke={seam} strokeWidth="1.3" strokeLinecap="round" />
        <path d="M66.5 22.5l-9.5 3.2" fill="none" stroke={seam} strokeWidth="1.3" strokeLinecap="round" />

        {/* Hem line + double stitch */}
        <path d="M37 83.5h26" fill="none" stroke={outline} strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        <path d="M37 86h26" fill="none" stroke={seam} strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />

        {/* Side folds + inner shading */}
        <g clipPath="url(#teeClip)">
          {/* Lipatan gelap (garis seperti pada mockup) */}
          <path d="M38 30c-2 10-2.2 23-1.4 38" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3.0" strokeLinecap="round" />
          <path d="M62 30c2 10 2.2 23 1.4 38" fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="2.6" strokeLinecap="round" />

          {/* Sedikit depth tengah */}
          <path d="M50 24c0 14 0 30 0 46" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </svg>

      {/* Layer 3: Area Desain (Printing Area) */}
      <div className="absolute w-[45%] h-[50%] border-2 border-dashed border-[#0037b0]/30 rounded flex flex-col items-center justify-center p-2 z-10 mt-10">
        <span className="text-[7px] font-bold text-[#0037b0] opacity-40 uppercase tracking-widest absolute top-2">Printing Area</span>
        
        {/* Teks Dinamis */}
        {teksDesain && (
          <div 
            className="text-3xl font-black uppercase text-center break-words w-full"
            style={{ color: warnaTeks }}
          >
            {teksDesain}
          </div>
        )}
      </div>

    </div>
  );
}