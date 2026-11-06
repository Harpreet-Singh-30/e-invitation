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

export default function ModernFloralTemplate({ data }: TemplateProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50" style={{ fontFamily: "'Lora', 'Cormorant Garamond', serif" }}>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-pink-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section - Opening Invitation */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Animated Floral Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Floating Flowers */}
            <div className={`absolute top-20 left-10 text-6xl transition-all duration-1000 ${mounted ? 'opacity-30' : 'opacity-0'}`} style={{ animation: 'float 6s ease-in-out infinite' }}>
              🌸
            </div>
            <div className={`absolute top-40 right-20 text-7xl transition-all duration-1000 ${mounted ? 'opacity-25' : 'opacity-0'}`} style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }}>
              🌺
            </div>
            <div className={`absolute bottom-32 left-20 text-6xl transition-all duration-1000 ${mounted ? 'opacity-30' : 'opacity-0'}`} style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '2s' }}>
              🌷
            </div>
            <div className={`absolute bottom-20 right-10 text-7xl transition-all duration-1000 ${mounted ? 'opacity-25' : 'opacity-0'}`} style={{ animation: 'float 9s ease-in-out infinite', animationDelay: '1.5s' }}>
              🌹
            </div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl transition-all duration-1000 ${mounted ? 'opacity-10' : 'opacity-0'}`} style={{ animation: 'float 10s ease-in-out infinite' }}>
              💐
            </div>
          </div>
        </div>

        {/* Watercolor Effect Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-pink-300 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-purple-300 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className={`relative z-10 text-center max-w-4xl transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Floral Header Ornament */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center">
              <div className="text-5xl">🌸</div>
              <div className="mx-4 w-32 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
              <div className="text-6xl">💐</div>
              <div className="mx-4 w-32 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
              <div className="text-5xl">🌸</div>
            </div>
          </div>

          {/* Pre-title */}
          <div className="mb-8">
            <p className="text-pink-600 text-sm tracking-[0.4em] uppercase font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Joyfully Together
            </p>
          </div>

          {/* Groom Name */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-800 mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.couple.groom}
          </h1>

          {/* Floral Divider with "and" */}
          <div className="my-10 flex items-center justify-center">
            <div className="text-3xl text-pink-400">❀</div>
            <div className="mx-6 text-5xl text-pink-500 font-light italic" style={{ fontFamily: "'Great Vibes', cursive" }}>
              and
            </div>
            <div className="text-3xl text-pink-400">❀</div>
          </div>

          {/* Bride Name */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-800 mb-10 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.couple.bride}
          </h1>

          {/* Tagline */}
          {data.couple.tagline && (
            <div className="mb-12 px-4">
              <p className="text-xl md:text-2xl text-gray-600 italic leading-relaxed max-w-2xl mx-auto">
                {data.couple.tagline}
              </p>
            </div>
          )}

          {/* Floral Footer Ornament */}
          <div className="mt-12">
            <div className="inline-flex items-center justify-center space-x-3">
              <span className="text-pink-400">✿</span>
              <span className="text-rose-400">❀</span>
              <span className="text-purple-400">✿</span>
              <span className="text-pink-400">❀</span>
              <span className="text-rose-400">✿</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16">
            <div className="inline-flex flex-col items-center animate-bounce">
              <span className="text-pink-500 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Scroll to Explore
              </span>
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}</style>
      </section>

      {/* Welcome Message Section */}
      {data.message && (
        <section className="py-24 px-4 bg-white/80 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative Floral Corners */}
          <div className="absolute top-10 left-10 text-8xl text-pink-200/30">🌺</div>
          <div className="absolute bottom-10 right-10 text-8xl text-purple-200/30 rotate-180">🌺</div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Floral Icon */}
            <div className="mb-10">
              <div className="inline-block">
                <div className="text-6xl mb-4">🌷</div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                  <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="relative px-8">
              <p className="text-2xl md:text-3xl lg:text-4xl text-gray-700 leading-relaxed font-light">
                {data.message}
              </p>
            </div>

            {/* Bottom Ornament */}
            <div className="mt-10 flex items-center justify-center space-x-2">
              <span className="text-pink-400">❀</span>
              <span className="text-rose-400">✿</span>
              <span className="text-pink-400">❀</span>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-rose-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="text-5xl mb-6">💐</div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Celebrations
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-20 h-px bg-pink-300"></div>
              <span className="text-3xl text-pink-400">✿</span>
              <div className="w-20 h-px bg-pink-300"></div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="space-y-12">
            {data.events.map((event, index) => (
              <EventCard key={event.key || index} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-5xl mb-4">🌸</div>
              <h2 className="text-5xl md:text-6xl font-light text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cherished Moments
              </h2>
              <p className="text-gray-600 text-lg">Our journey together</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.gallery.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-4 border-white"
                >
                  <img
                    src={`/uploads/${image}`}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floral Ornament */}
          <div className="mb-8">
            <div className="text-6xl mb-4">💐</div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-24 h-px bg-pink-300"></div>
              <span className="text-3xl text-pink-400">✿</span>
              <div className="w-24 h-px bg-pink-300"></div>
            </div>
          </div>

          {/* Couple Names */}
          <h3 className="text-3xl md:text-4xl font-light text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.couple.groom} & {data.couple.bride}
          </h3>

          {/* Thank You Message */}
          <p className="text-gray-600 text-lg mb-8 italic">
            Looking forward to celebrating with you
          </p>

          {/* Decorative Flowers */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl text-pink-400">❀</span>
            <span className="text-2xl text-rose-400">✿</span>
            <span className="text-2xl text-purple-400">❀</span>
            <span className="text-2xl text-pink-400">✿</span>
            <span className="text-2xl text-rose-400">❀</span>
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
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-pink-100 hover:shadow-2xl hover:border-pink-200 transition-all duration-500">
        {/* Floral Corner Decoration */}
        <div className="absolute -top-6 -right-6 text-7xl text-pink-200/50 rotate-45">🌸</div>
        <div className="absolute -bottom-6 -left-6 text-7xl text-purple-200/50 -rotate-45">🌺</div>

        <div className="relative z-10 md:flex">
          {/* Event Icon Section */}
          <div className="md:w-56 bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 p-10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/50">
                <span className="text-6xl filter drop-shadow-lg">{getEventIcon(event.key)}</span>
              </div>
              <div className="text-white text-sm uppercase tracking-widest font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Celebration {index + 1}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1 p-8 md:p-10">
            <h3 className="text-3xl md:text-4xl font-light text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {event.title}
            </h3>

            <div className="space-y-5 text-gray-700">
              {/* Date & Time */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-lg">{formattedDate}</div>
                  {event.time && <div className="text-gray-600 mt-1">{event.time}</div>}
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-lg">{event.venue}</div>
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
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white rounded-full hover:shadow-lg transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
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
    ceremony: '🌸',
    ganesh: '🙏',
    kirtan: '🎶'
  };
  return icons[eventKey] || '✨';
}
