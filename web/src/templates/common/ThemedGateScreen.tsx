import React from 'react';

export type GateTheme =
  | 'arcade'
  | 'storybook'
  | 'safari'
  | 'whiskey_distillery'
  | 'metallic_silver'
  | 'metallic_gold'
  | 'ruby_gem'
  | 'boho_sun'
  | 'film_noir'
  | 'woodland_fable'
  | 'royal_nursery'
  | 'sunshine'
  | 'boho_rainbow'
  | 'scandi_haven'
  | 'rajasthani_jharokha'
  | 'urban_loft'
  | 'coastal_cottage'
  | 'tropical_luau'
  | 'studio54_disco'
  | 'speakeasy_20s'
  | 'palm_springs_pool'
  | 'ganesh_mandap'
  | 'waheguru_darbar'
  | 'cathedral_grace'
  | 'islamic_mehfil'
  | 'vintage_archive'
  | 'picnic_carnival'
  | 'diwali_milan'
  | 'nautical_anchorage'
  | 'commencement'
  | 'philanthropy_crystal'
  | 'tech_summit'
  | 'wanderlust_airmail'
  | 'default';

export interface ThemedGateProps {
  gateTheme: GateTheme;
  hostName: string;
  coHostName?: string;
  tagline: string;
  badgeText: string;
  badgeEmoji?: string;
  actionText?: string;
  onOpen: () => void;
  colors?: {
    bg?: string;
    primaryText?: string;
    accentText?: string;
    mutedText?: string;
    cardBg?: string;
    sealGlow?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
}

export const ThemedGateScreen: React.FC<ThemedGateProps> = ({
  gateTheme,
  hostName,
  coHostName,
  tagline,
  badgeText,
  badgeEmoji = '✨',
  actionText,
  onOpen,
  colors,
  fonts,
}) => {
  const headingFont = fonts?.heading || 'Georgia, serif';
  const bodyFont = fonts?.body || 'system-ui, sans-serif';

  // 1. RETRO SYNTHWAVE ARCADE
  if (gateTheme === 'arcade') {
    return (
      <div className="min-h-screen bg-slate-950 text-cyan-400 flex items-center justify-center p-4 relative overflow-hidden select-none font-mono">
        {/* Neon Grid Horizon & Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,128,0.06),rgba(0,255,255,0.06))] bg-[length:100%_4px,6px_100%]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[linear-gradient(to_bottom,transparent,rgba(236,72,153,0.15))] [perspective:500px] pointer-events-none">
          <div className="w-full h-full [transform:rotateX(60deg)] bg-[linear-gradient(rgba(6,182,212,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Arcade Cabinet Screen Frame */}
          <div className="w-full bg-slate-900/90 border-4 border-fuchsia-500 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(236,72,153,0.4)] backdrop-blur-md relative overflow-hidden">
            <div className="flex justify-between items-center text-xs tracking-widest text-fuchsia-400 border-b border-fuchsia-500/40 pb-2 mb-4">
              <span>★ 1-PLAYER GAME</span>
              <span className="animate-pulse">HI-SCORE: 300,000</span>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-semibold mb-2">
              {badgeEmoji} {badgeText} {badgeEmoji}
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300 mb-2 drop-shadow-[0_2px_10px_rgba(34,211,238,0.5)]">
              {hostName}
            </h1>
            {coHostName && (
              <p className="text-lg font-bold text-yellow-300 mb-3 tracking-wide">
                {coHostName}
              </p>
            )}

            <p className="text-xs text-pink-200/80 italic mb-8 max-w-xs mx-auto">
              "{tagline}"
            </p>

            {/* Arcade Coin Slot Button */}
            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.6)] text-white font-extrabold tracking-widest text-sm uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-3 border-2 border-yellow-300"
            >
              <span className="text-2xl animate-bounce">🪙</span>
              <span>{actionText || 'PRESS START TO PLAY'}</span>
              <span className="text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded font-black">25¢</span>
            </button>

            <div className="mt-4 flex justify-center gap-6 text-[10px] text-cyan-300/70 uppercase tracking-widest">
              <span>● CREDITS: 01</span>
              <span>● READY PLAYER ONE</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ENCHANTED STORYBOOK GARDEN
  if (gateTheme === 'storybook') {
    return (
      <div className="min-h-screen bg-emerald-950 text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none">
        {/* Floating Fireflies & Enchanted Dust */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#fde68a_1.5px,transparent_1.5px)] [background-size:36px_36px] opacity-20 animate-pulse" />
        
        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Leather Book Cover with Gilded Filigree */}
          <div className="w-full bg-[#1c2e24] border-4 border-amber-400/80 rounded-2xl p-7 sm:p-9 shadow-[0_0_50px_rgba(251,191,36,0.25)] relative overflow-hidden">
            <div className="absolute top-3 left-3 text-amber-400 text-lg">⚜</div>
            <div className="absolute top-3 right-3 text-amber-400 text-lg">⚜</div>
            <div className="absolute bottom-3 left-3 text-amber-400 text-lg">⚜</div>
            <div className="absolute bottom-3 right-3 text-amber-400 text-lg">⚜</div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-serif mb-3">
              {badgeEmoji} {badgeText} {badgeEmoji}
            </p>

            <p className="text-sm italic font-serif text-amber-200/70 mb-1">Chapter of Celebration</p>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-2 leading-snug drop-shadow">
              {hostName} {coHostName ? `& ${coHostName}` : ''}
            </h1>

            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />

            <p className="text-xs font-serif italic text-emerald-200/90 mb-8 max-w-xs mx-auto leading-relaxed">
              "{tagline}"
            </p>

            {/* Gilded Book Clasp Button */}
            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-xl shadow-xl text-emerald-950 font-serif font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-amber-200"
            >
              <span className="text-lg">📖</span>
              <span>{actionText || 'OPEN THE STORYBOOK'}</span>
              <span className="text-lg">✨</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-300/60 font-serif">
              A fairy tale celebration awaits
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. SAFARI LITTLE EXPLORER
  if (gateTheme === 'safari') {
    return (
      <div className="min-h-screen bg-[#243324] text-amber-50 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Wooden Field Journal */}
          <div className="w-full bg-[#1b271b] border-4 border-[#85542b] rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center text-xs text-amber-300/80 border-b border-[#85542b]/50 pb-2 mb-4">
              <span>🦁 EXPEDITION LOG</span>
              <span>WILD ONE TOUR</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.3em] text-lime-400 font-bold mb-2">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-100 mb-1 tracking-wide">
              {hostName} {coHostName ? `& ${coHostName}` : ''}
            </h1>

            <p className="text-xs text-lime-200/80 italic mb-7">"{tagline}"</p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 rounded-2xl shadow-xl text-stone-950 font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-3 border-2 border-amber-300"
            >
              <span className="text-2xl">🧭</span>
              <span>{actionText || 'UNLOCK JUNGLE TRAIL'}</span>
              <span className="text-xl">🌿</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-200/60 font-semibold">
              Gear up for a wild safari adventure
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. AGED TO PERFECTION (DISTILLERY / WHISKEY)
  if (gateTheme === 'whiskey_distillery') {
    return (
      <div className="min-h-screen bg-[#140e0b] text-amber-200 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Charred Oak Barrel Head */}
          <div className="w-full bg-[#1e1511] border-4 border-amber-700/80 rounded-full p-8 sm:p-12 shadow-[0_0_50px_rgba(217,119,6,0.25)] relative overflow-hidden aspect-square flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-sans font-bold mb-2">
              {badgeEmoji} {badgeText}
            </div>

            <p className="text-xs text-amber-400/80 tracking-widest uppercase mb-1 font-sans">PRIVATE RESERVE</p>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2 leading-snug">
              {hostName}
            </h1>
            {coHostName && (
              <p className="text-sm font-semibold text-amber-400 mb-2 font-sans">{coHostName}</p>
            )}

            <p className="text-xs italic text-amber-200/70 mb-6 max-w-[240px] leading-relaxed">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group py-3 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-full shadow-lg text-stone-950 font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-300"
            >
              <span>🥃</span>
              <span>{actionText || 'BREAK BARREL SEAL'}</span>
            </button>

            <p className="mt-4 text-[9px] uppercase tracking-widest text-amber-500/70 font-sans">
              Single Barrel Vintage Batch
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. METALLIC SILVER JUBILEE
  if (gateTheme === 'metallic_silver') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Polished Silver Foil Folio */}
          <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-300/80 rounded-2xl p-7 sm:p-9 shadow-[0_0_50px_rgba(148,163,184,0.3)] relative overflow-hidden">
            <span className="text-3xl text-slate-300 mb-2 block">💍</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-sans font-medium mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-normal text-white mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-slate-300">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-slate-300/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-xl shadow-xl text-slate-900 font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-slate-400"
            >
              <span>💎</span>
              <span>{actionText || 'UNSEAL SILVER JUBILEE'}</span>
              <span>💎</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-400 font-sans">
              25 Years of Timeless Devotion
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 6. 50TH GOLDEN JUBILEE
  if (gateTheme === 'metallic_gold') {
    return (
      <div className="min-h-screen bg-[#0c1f17] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* 24K Royal Gold Palace Folio */}
          <div className="w-full bg-[#11291e] border-4 border-amber-400 rounded-3xl p-7 sm:p-9 shadow-[0_0_60px_rgba(251,191,36,0.35)] relative overflow-hidden">
            <span className="text-3xl text-amber-400 mb-2 block">👑</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-amber-300">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-amber-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-2xl shadow-xl text-stone-950 font-sans font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
            >
              <span>✨</span>
              <span>{actionText || 'OPEN GOLDEN JUBILEE'}</span>
              <span>✨</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold">
              Half a Century of Eternal Love
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 7. RUBY ROMANCE 40TH
  if (gateTheme === 'ruby_gem') {
    return (
      <div className="min-h-screen bg-[#1f090d] text-rose-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#2b0d13] border-2 border-rose-500/80 rounded-2xl p-7 sm:p-9 shadow-[0_0_50px_rgba(244,63,94,0.35)] relative overflow-hidden">
            <span className="text-3xl text-rose-400 mb-2 block animate-pulse">💎</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-rose-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-rose-300">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-rose-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 rounded-xl shadow-xl text-white font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-rose-300"
            >
              <span>🌹</span>
              <span>{actionText || 'TOUCH THE RUBY TALISMAN'}</span>
              <span>🌹</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-rose-400/80 font-sans">
              40 Years of Devotion
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 8. BOHO SUNSET VOWS
  if (gateTheme === 'boho_sun') {
    return (
      <div className="min-h-screen bg-[#2c1810] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:30px_30px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#3d2217] border-2 border-amber-600/70 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <span className="text-3xl text-amber-400 mb-2 block">🌾</span>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-sans font-semibold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-normal text-amber-100 mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-amber-400">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-amber-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 rounded-2xl shadow-xl text-stone-950 font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-amber-300"
            >
              <span>☀️</span>
              <span>{actionText || 'REVEAL GATHERING'}</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400/70 font-sans">
              Golden Hour Vows &amp; Starlight
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 9. CINEMATIC NOIR
  if (gateTheme === 'film_noir') {
    return (
      <div className="min-h-screen bg-black text-stone-200 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Vintage Hollywood Premiere Ticket */}
          <div className="w-full bg-stone-900 border-2 border-stone-600 rounded-2xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] text-stone-400 border-b border-stone-700 pb-2 mb-4 font-mono tracking-widest">
              <span>★ ADMIT ONE</span>
              <span>PREMIERE SCREENING</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-400 font-bold mb-2">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-snug">
              {hostName} {coHostName ? `& ${coHostName}` : ''}
            </h1>

            <p className="text-xs italic text-stone-400 mb-7 max-w-xs mx-auto font-serif">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-stone-200 via-white to-stone-300 rounded-xl shadow-xl text-black font-extrabold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-stone-400"
            >
              <span>🎬</span>
              <span>{actionText || 'ADMIT ONE - OPEN TICKET'}</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-stone-500 font-mono">
              35mm Masterpiece in Motion
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 10. WOODLAND FABLE BABY SHOWER
  if (gateTheme === 'woodland_fable') {
    return (
      <div className="min-h-screen bg-[#1c2e22] text-emerald-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:30px_30px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#243d2c] border-3 border-emerald-400/60 rounded-3xl p-7 sm:p-9 shadow-[0_0_50px_rgba(52,211,153,0.2)] relative overflow-hidden">
            <span className="text-3xl text-emerald-300 mb-2 block">🦌</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-normal text-white mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-emerald-300">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-emerald-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 rounded-2xl shadow-xl text-stone-950 font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-emerald-300"
            >
              <span>🌲</span>
              <span>{actionText || 'STEP INTO THE WOODS'}</span>
              <span>🐿️</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-emerald-400/80 font-sans">
              A sweet new fable begins
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 11. ROYAL NURSERY CROWN
  if (gateTheme === 'royal_nursery') {
    return (
      <div className="min-h-screen bg-[#0e1726] text-blue-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#18263d] border-2 border-amber-300/80 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <span className="text-3xl text-amber-300 mb-2 block">👑</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-blue-300">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-blue-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 rounded-2xl shadow-xl text-stone-950 font-sans font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-amber-200"
            >
              <span>🧸</span>
              <span>{actionText || 'WELCOME LITTLE HIGHNESS'}</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400/80 font-sans">
              Royal Baby Shower Celebration
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 12. HERE COMES THE SUN
  if (gateTheme === 'sunshine') {
    return (
      <div className="min-h-screen bg-[#35250a] text-yellow-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#4a3511] border-3 border-yellow-400/80 rounded-3xl p-7 sm:p-9 shadow-[0_0_50px_rgba(250,204,21,0.3)] relative overflow-hidden">
            <span className="text-4xl text-yellow-300 mb-2 block animate-spin" style={{ animationDuration: '20s' }}>☀️</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300 font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-snug font-serif">
              {hostName} {coHostName ? `& ${coHostName}` : ''}
            </h1>

            <p className="text-xs italic text-yellow-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-2xl shadow-xl text-stone-950 font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-yellow-200"
            >
              <span>🌼</span>
              <span>{actionText || 'OPEN THE SUNSHINE'}</span>
              <span>🌼</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-yellow-400/80 font-semibold">
              A little ray of sunshine is on the way
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 13. BOHO RAINBOW MIRACLE
  if (gateTheme === 'boho_rainbow') {
    return (
      <div className="min-h-screen bg-[#241715] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:30px_30px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#362320] border-2 border-orange-400/60 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <span className="text-4xl text-orange-300 mb-2 block">🌈</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-orange-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-normal text-white mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-orange-300">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-orange-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl shadow-xl text-stone-950 font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-orange-200"
            >
              <span>🌿</span>
              <span>{actionText || 'UNFOLD THE MIRACLE'}</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-orange-400/80 font-sans">
              Handcrafted with Love &amp; Wonder
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 14. SCANDI MINIMALIST SANCTUARY
  if (gateTheme === 'scandi_haven') {
    return (
      <div className="min-h-screen bg-[#1c221e] text-emerald-50 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Vertical Nordic Oak Door Slat Aesthetic */}
          <div className="w-full bg-[#262e29] border border-stone-500/60 rounded-2xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <span className="text-3xl text-amber-300 mb-2 block">🔑</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-stone-300 font-semibold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-light text-white mb-2 leading-snug tracking-wide">
              {hostName} {coHostName ? <span className="text-emerald-300">&amp; {coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-stone-300/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-stone-200 via-white to-stone-300 rounded-xl shadow-xl text-stone-900 font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-stone-400"
            >
              <span>🌿</span>
              <span>{actionText || 'UNLOCK THE NEW HOME'}</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-stone-400">
              Nordic Warmth &amp; New Beginnings
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 15. RAJASTHANI JHAROKHA GRIHA
  if (gateTheme === 'rajasthani_jharokha') {
    return (
      <div className="min-h-screen bg-[#1c0d0a] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Carved Sandstone Palace Jharokha Arch */}
          <div className="w-full bg-[#2d1712] border-4 border-amber-500 rounded-3xl p-7 sm:p-9 shadow-[0_0_60px_rgba(245,158,11,0.35)] relative overflow-hidden">
            <div className="text-3xl text-amber-400 mb-1">🪔</div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2 leading-snug">
              {hostName}
            </h1>
            {coHostName && (
              <p className="text-sm font-semibold text-amber-300 mb-2 font-sans">{coHostName}</p>
            )}

            <p className="text-xs italic text-amber-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-2xl shadow-xl text-stone-950 font-sans font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
            >
              <span>🌸</span>
              <span>{actionText || 'PADHARO MHARE DESH / ENTER'}</span>
              <span>🌸</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold">
              Shubh Griha Pravesh Mahotsav
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 16. SHREE GANESH MANDAP
  if (gateTheme === 'ganesh_mandap') {
    return (
      <div className="min-h-screen bg-[#240a04] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Saffron & Kumkum Temple Sanctum */}
          <div className="w-full bg-[#381108] border-4 border-amber-400 rounded-3xl p-7 sm:p-9 shadow-[0_0_60px_rgba(249,115,22,0.4)] relative overflow-hidden">
            <span className="text-4xl text-amber-400 mb-2 block">🕉️</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2 leading-snug">
              {hostName}
            </h1>
            {coHostName && (
              <p className="text-sm font-semibold text-amber-300 mb-2 font-sans">{coHostName}</p>
            )}

            <p className="text-xs italic text-amber-200/90 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 rounded-2xl shadow-xl text-stone-950 font-sans font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
            >
              <span>🪔</span>
              <span>{actionText || 'SHREE GANESHAY NAMAH / DARSHAN'}</span>
              <span>🪔</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold">
              Vakratunda Mahakaya Suryakoti Samaprabha
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 17. WAHEGURU ANAND BLESSINGS
  if (gateTheme === 'waheguru_darbar') {
    return (
      <div className="min-h-screen bg-[#071329] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Royal Gurmukhi Darbar Sahib Sanctum */}
          <div className="w-full bg-[#0d2247] border-4 border-amber-400 rounded-3xl p-7 sm:p-9 shadow-[0_0_60px_rgba(251,191,36,0.35)] relative overflow-hidden">
            <span className="text-4xl text-amber-400 mb-2 block font-bold">ੴ</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">
              {hostName}
            </h1>
            {coHostName && (
              <p className="text-sm font-semibold text-amber-300 mb-2 font-sans">{coHostName}</p>
            )}

            <p className="text-xs italic text-blue-200/90 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-2xl shadow-xl text-stone-950 font-sans font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
            >
              <span>☬</span>
              <span>{actionText || 'ENTER KIRTAN DARBAR'}</span>
              <span>☬</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold">
              Waheguru Ji Ka Khalsa • Waheguru Ji Ki Fateh
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 18. TROPICAL SUNSET LUAU
  if (gateTheme === 'tropical_luau') {
    return (
      <div className="min-h-screen bg-[#2d120a] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#421d12] border-4 border-amber-500 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <span className="text-3xl text-orange-400 mb-2 block">🌺</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-orange-300 font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 mb-2 leading-snug">
              {hostName} {coHostName ? `& ${coHostName}` : ''}
            </h1>

            <p className="text-xs italic text-amber-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-2xl shadow-xl text-stone-950 font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-300"
            >
              <span>🍹</span>
              <span>{actionText || 'ENTER THE TIKI LUAU'}</span>
              <span>🌴</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-orange-400 font-semibold">
              Sunset Cocktails &amp; Island Beats
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 19. STUDIO 54 DISCO GLAM
  if (gateTheme === 'studio54_disco') {
    return (
      <div className="min-h-screen bg-[#18051e] text-fuchsia-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#270b30] border-3 border-fuchsia-400 rounded-3xl p-7 sm:p-9 shadow-[0_0_60px_rgba(236,72,153,0.4)] relative overflow-hidden">
            <span className="text-4xl text-fuchsia-300 mb-2 block animate-pulse">🪩</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-fuchsia-300 font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-snug">
              {hostName} {coHostName ? <span className="text-fuchsia-400">&amp; ${coHostName}</span> : ''}
            </h1>

            <p className="text-xs italic text-fuchsia-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600 rounded-2xl shadow-xl text-white font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-fuchsia-300"
            >
              <span>✨</span>
              <span>{actionText || 'VIP ALL-ACCESS PASS'}</span>
              <span>✨</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-fuchsia-400 font-semibold">
              Exclusive Midnight Disco Soirée
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 20. DIWALI SNEH MILAN
  if (gateTheme === 'diwali_milan') {
    return (
      <div className="min-h-screen bg-[#240813] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-serif">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-[#380e1f] border-4 border-amber-400 rounded-3xl p-7 sm:p-9 shadow-[0_0_60px_rgba(245,158,11,0.4)] relative overflow-hidden">
            <span className="text-4xl text-amber-400 mb-2 block">🪔</span>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-sans font-bold mb-3">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2 leading-snug">
              {hostName} {coHostName ? `& ${coHostName}` : ''}
            </h1>

            <p className="text-xs italic text-amber-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 rounded-2xl shadow-xl text-stone-950 font-sans font-black tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
            >
              <span>🎆</span>
              <span>{actionText || 'SHUBH DEEPAWALI / ILLUMINATE'}</span>
              <span>🎆</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold">
              Festival of Lights &amp; Joyous Reunion
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 21. TECH SUMMIT FUTURE VISION
  if (gateTheme === 'tech_summit') {
    return (
      <div className="min-h-screen bg-slate-950 text-cyan-200 flex items-center justify-center p-4 relative overflow-hidden select-none font-mono">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:30px_30px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          <div className="w-full bg-slate-900 border-2 border-cyan-400 rounded-2xl p-7 sm:p-9 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] text-cyan-400 border-b border-cyan-500/40 pb-2 mb-4 tracking-widest">
              <span>● ACCESS LEVEL: EXECUTIVE</span>
              <span className="animate-pulse">ENCRYPTION: AES-256</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300 font-bold mb-2">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-snug">
              {hostName}
            </h1>
            {coHostName && (
              <p className="text-sm font-semibold text-cyan-400 mb-2">{coHostName}</p>
            )}

            <p className="text-xs italic text-cyan-200/70 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-xl shadow-xl text-white font-extrabold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-cyan-300"
            >
              <span>⚡</span>
              <span>{actionText || 'BIOMETRIC SCAN / ENTER SUMMIT'}</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-cyan-500 font-mono">
              The Next Decade of Innovation
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 22. BON VOYAGE & WANDERLUST (AIRMAIL / BOARDING PASS)
  if (gateTheme === 'wanderlust_airmail') {
    return (
      <div className="min-h-screen bg-[#241a14] text-amber-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-md w-full mx-auto text-center flex flex-col items-center">
          {/* Vintage International Airmail Parcel */}
          <div className="w-full bg-[#36261d] border-4 border-[#b45309] rounded-2xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] text-amber-300/80 border-b border-[#b45309]/50 pb-2 mb-4 font-mono tracking-widest">
              <span>✈️ PAR AVION • AIR MAIL</span>
              <span>FLIGHT: 2027</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-400 font-bold mb-2">
              {badgeEmoji} {badgeText}
            </p>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-snug">
              {hostName} {coHostName ? `& ${coHostName}` : ''}
            </h1>

            <p className="text-xs italic text-amber-200/80 mb-7 max-w-xs mx-auto">
              "{tagline}"
            </p>

            <button
              onClick={onOpen}
              className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 rounded-xl shadow-xl text-stone-950 font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-amber-300"
            >
              <span>🎟️</span>
              <span>{actionText || 'OPEN BOARDING PASS'}</span>
              <span>✈️</span>
            </button>

            <p className="mt-4 text-[10px] uppercase tracking-widest text-amber-400/70 font-mono">
              Ready for Departure &amp; World Adventure
            </p>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT / FALLBACK ELEGANT THEMATIC GATE
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none"
      style={{
        backgroundColor: colors?.bg || '#0f172a',
        color: colors?.primaryText || '#ffffff',
        fontFamily: headingFont,
      }}
    >
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-sm w-full mx-auto text-center flex flex-col items-center">
        <div
          className="w-full border-2 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm"
          style={{
            backgroundColor: colors?.cardBg || 'rgba(30, 41, 59, 0.9)',
            borderColor: colors?.accentText || '#e2e8f0',
          }}
        >
          <p
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] mb-2 font-medium"
            style={{ color: colors?.accentText || '#93c5fd' }}
          >
            {badgeEmoji} {badgeText} {badgeEmoji}
          </p>

          <h2 className="text-xl sm:text-2xl font-normal mb-1 leading-snug">
            {hostName} {coHostName ? `& ${coHostName}` : ''}
          </h2>

          <p
            className="text-xs italic mb-6"
            style={{
              color: colors?.mutedText || '#94a3b8',
              fontFamily: bodyFont,
            }}
          >
            "{tagline}"
          </p>

          <button
            onClick={onOpen}
            className="group relative w-full py-4 px-6 rounded-xl shadow-xl font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
            }}
          >
            <span>✨</span>
            <span>{actionText || 'OPEN INVITATION'}</span>
            <span>✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};

