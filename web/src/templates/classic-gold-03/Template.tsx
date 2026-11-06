import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface TemplateProps {
  data: {
    couple: {
      groom: string;
      bride: string;
      tagline?: string;
    };
    events: Array<{
      key: string;
      title: string;
      date: string;
      time?: string;
      venue: string;
      address?: string;
      mapUrl?: string;
    }>;
    gallery?: string[];
    music?: {
      enabled: boolean;
      trackId?: string;
    };
    message?: string;
  };
}

export default function ClassicGoldTemplate({ data }: TemplateProps) {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      setScrollProgress((scrolled / documentHeight) * 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdfbf7 0%, #fef9f3 50%, #fdfbf7 100%)', fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section - Royal Opening */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Ornate Border Frame */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Corners */}
          <div className="absolute top-0 left-0 w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/20" fill="currentColor">
              <path d="M0,0 L100,0 L100,10 L90,10 L90,20 L80,20 L80,30 L70,30 L70,40 L60,40 L60,50 L50,50 L50,60 L40,60 L40,70 L30,70 L30,80 L20,80 L20,90 L10,90 L10,100 L0,100 Z" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/20 transform scale-x-[-1]" fill="currentColor">
              <path d="M0,0 L100,0 L100,10 L90,10 L90,20 L80,20 L80,30 L70,30 L70,40 L60,40 L60,50 L50,50 L50,60 L40,60 L40,70 L30,70 L30,80 L20,80 L20,90 L10,90 L10,100 L0,100 Z" />
            </svg>
          </div>
          {/* Bottom Corners */}
          <div className="absolute bottom-0 left-0 w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/20 transform scale-y-[-1]" fill="currentColor">
              <path d="M0,0 L100,0 L100,10 L90,10 L90,20 L80,20 L80,30 L70,30 L70,40 L60,40 L60,50 L50,50 L50,60 L40,60 L40,70 L30,70 L30,80 L20,80 L20,90 L10,90 L10,100 L0,100 Z" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/20 transform scale-[-1]" fill="currentColor">
              <path d="M0,0 L100,0 L100,10 L90,10 L90,20 L80,20 L80,30 L70,30 L70,40 L60,40 L60,50 L50,50 L50,60 L40,60 L40,70 L30,70 L30,80 L20,80 L20,90 L10,90 L10,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className={`relative z-10 text-center max-w-5xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Crown Icon */}
          <div className="mb-10">
            <div className="text-7xl mb-6">👑</div>
          </div>

          {/* Ornamental Top Line */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-amber-400 max-w-xs"></div>
            <div className="mx-6">
              <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-400 to-amber-400 max-w-xs"></div>
          </div>

          {/* Pre-title */}
          <div className="mb-8">
            <p className="text-amber-700 text-xs tracking-[0.5em] uppercase font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Request The Honour Of Your Presence
            </p>
          </div>

          {/* Groom Name */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wide bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
            {data.couple.groom}
          </h1>

          {/* Elegant Ampersand */}
          <div className="my-10">
            <div className="inline-flex items-center">
              <div className="w-24 h-px bg-amber-400/40"></div>
              <div className="mx-8 text-5xl text-amber-600" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                &
              </div>
              <div className="w-24 h-px bg-amber-400/40"></div>
            </div>
          </div>

          {/* Bride Name */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-10 tracking-wide bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
            {data.couple.bride}
          </h1>

          {/* Tagline */}
          {data.couple.tagline && (
            <div className="mb-12 relative">
              <div className="absolute -left-4 top-0 text-5xl text-amber-400/30">"</div>
              <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed max-w-3xl mx-auto px-8">
                {data.couple.tagline}
              </p>
              <div className="absolute -right-4 bottom-0 text-5xl text-amber-400/30">"</div>
            </div>
          )}

          {/* Ornamental Bottom Line */}
          <div className="flex items-center justify-center mt-12">
            <div className="flex items-center space-x-2">
              <span className="text-amber-500 text-2xl">✦</span>
              <span className="text-amber-600 text-lg">✧</span>
              <span className="text-amber-500 text-2xl">❖</span>
              <span className="text-amber-600 text-lg">✧</span>
              <span className="text-amber-500 text-2xl">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      {data.message && (
        <section className="py-24 px-4 bg-white/60 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 text-8xl text-amber-200/20">✦</div>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 text-8xl text-amber-200/20">✦</div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Icon */}
            <div className="mb-10">
              <div className="inline-block p-6 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100">
                <svg className="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="border-t-2 border-b-2 border-amber-300/50 py-10">
              <p className="text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-relaxed font-light">
                {data.message}
              </p>
            </div>

            {/* Bottom Ornament */}
            <div className="mt-10 flex items-center justify-center space-x-3">
              <div className="w-16 h-px bg-amber-300"></div>
              <span className="text-2xl text-amber-500">❖</span>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-amber-900 mb-6">
                Events & Celebrations
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-12">
            {data.events.map((event, index) => (
              <EventCard key={event.key || index} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-br from-amber-50 to-yellow-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-5xl mb-4">👑</div>
              <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-4">
                Memories
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-amber-500">✦</span>
                <span className="text-amber-600">✧</span>
                <span className="text-amber-500">✦</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.gallery.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-amber-200 hover:border-amber-400"
                >
                  <img
                    src={`/uploads/${image}`}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100">
        <div className="max-w-4xl mx-auto text-center">
          {/* Crown */}
          <div className="text-6xl mb-6">👑</div>

          {/* Ornamental Line */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-px bg-amber-400"></div>
            <div className="mx-4">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </div>
            <div className="w-24 h-px bg-amber-400"></div>
          </div>

          {/* Couple Names */}
          <h3 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            {data.couple.groom} & {data.couple.bride}
          </h3>

          {/* Thank You Message */}
          <p className="text-amber-800 text-lg mb-8">
            We await your gracious presence
          </p>

          {/* Decorative Elements */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-amber-600 text-xl">✦</span>
            <span className="text-amber-500 text-base">✧</span>
            <span className="text-amber-600 text-2xl">❖</span>
            <span className="text-amber-500 text-base">✧</span>
            <span className="text-amber-600 text-xl">✦</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  let formattedDate = '';
  try {
    formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
  } catch {
    formattedDate = event.date;
  }

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-8 border-amber-500 hover:shadow-2xl hover:border-amber-600 transition-all duration-500">
        <div className="md:flex">
          {/* Decorative Side Panel */}
          <div className="md:w-52 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
              }}></div>
            </div>

            <div className="text-center relative z-10">
              <div className="w-24 h-24 mx-auto mb-4 border-4 border-white/50 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded">
                <span className="text-5xl">{getEventIcon(event.key)}</span>
              </div>
              <div className="text-white text-xs uppercase tracking-[0.3em] font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Event {index + 1}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1 p-8 md:p-10">
            <h3 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6 uppercase tracking-wide">
              {event.title}
            </h3>

            <div className="space-y-5 text-gray-700">
              {/* Date & Time */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded bg-amber-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg">{formattedDate}</div>
                  {event.time && <div className="text-gray-600 mt-1">{event.time}</div>}
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded bg-amber-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg">{event.venue}</div>
                  {event.address && <div className="text-gray-600 mt-1">{event.address}</div>}
                </div>
              </div>

              {/* Get Directions */}
              {event.mapUrl && (
                <div className="pt-4">
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    View Location
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getEventIcon(eventKey: string): string {
  const icons: Record<string, string> = {
    mehendi: '🎨',
    sangeet: '🎵',
    haldi: '💛',
    wedding: '💍',
    reception: '🥂',
    ceremony: '👑',
    ganesh: '🙏',
    kirtan: '🎶'
  };
  return icons[eventKey] || '✨';
}
