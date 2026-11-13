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

export default function RoyalMaroonTemplate({ data }: TemplateProps) {
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showRSVP, setShowRSVP] = useState(false);

  // Find main wedding event
  const mainEvent = data.events.find(e => e.key === 'wedding') || data.events[0];

  useEffect(() => {
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      setScrollProgress((scrolled / documentHeight) * 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  if (!invitationOpened) {
    return <OpeningAnimation onOpen={() => setInvitationOpened(true)} coupleData={data.couple} />;
  }

  return (
    <div className="min-h-screen bg-[#faf8f3]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-red-900 via-amber-600 to-red-900 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Navigation */}
      <StickyNavigation 
        scrollToSection={scrollToSection}
        coupleNames={`${data.couple.groom} & ${data.couple.bride}`}
        onRSVPClick={() => setShowRSVP(true)}
      />

      {/* Hero Banner with Image */}
      <HeroBanner couple={data.couple} mainEvent={mainEvent} />

      {/* Main Wedding Event Highlight */}
      <MainEventHighlight event={mainEvent} />

      {/* Countdown Timer */}
      <CountdownTimer targetDate={mainEvent.date} />

      {/* Welcome Message */}
      {data.message && <WelcomeMessage message={data.message} />}

      {/* Other Events */}
      <section id="events" className="py-24 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-red-900 mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
              Other Celebrations
            </h2>
            <div className="flex items-center justify-center">
              <div className="w-24 h-px bg-red-900/30"></div>
              <div className="mx-6">
                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="w-24 h-px bg-red-900/30"></div>
            </div>
          </div>

          <div className="space-y-16">
            {data.events.filter(e => e.key !== mainEvent.key).map((event, index) => (
              <EventCard key={event.key || index} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section id="gallery" className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-red-900 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Moments
              </h2>
              <p className="text-gray-600 text-lg">Cherished memories of our journey</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.gallery.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={`/uploads/${image}`}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <RSVPSection id="rsvp" coupleNames={`${data.couple.groom} & ${data.couple.bride}`} />

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-br from-red-950 via-red-900 to-amber-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-32 h-px bg-amber-400/30"></div>
            <div className="mx-6">
              <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </div>
            <div className="w-32 h-px bg-amber-400/30"></div>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-amber-100 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            {data.couple.groom} & {data.couple.bride}
          </h3>

          <p className="text-amber-200 text-lg mb-8">
            We look forward to celebrating with you
          </p>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-amber-400">✦</span>
            <span className="text-amber-500">❖</span>
            <span className="text-amber-400">✦</span>
          </div>
        </div>
      </footer>

      {/* RSVP Modal */}
      {showRSVP && <RSVPModal onClose={() => setShowRSVP(false)} />}
    </div>
  );
}

// Opening Animation Component
function OpeningAnimation({ onOpen, coupleData }: { onOpen: () => void; coupleData: any }) {
  const [doorOpen, setDoorOpen] = useState(false);

  const handleOpen = () => {
    setDoorOpen(true);
    setTimeout(() => onOpen(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-amber-950 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${20 + Math.random() * 30}px`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Door Animation */}
      <div className="relative w-full max-w-4xl aspect-[3/4] mx-4 perspective-1000">
        {/* Left Door */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-red-900 to-red-800 border-4 border-amber-400/50 transition-transform duration-1500 origin-left ${
            doorOpen ? '-translate-x-full rotate-y-90' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="text-6xl mb-4 text-amber-300">💍</div>
            <div className="w-full h-px bg-amber-400/30 mb-4"></div>
            <p className="text-amber-200 text-sm uppercase tracking-[0.3em]">You're Invited</p>
          </div>
        </div>

        {/* Right Door */}
        <div
          className={`absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-red-900 to-red-800 border-4 border-amber-400/50 transition-transform duration-1500 origin-right ${
            doorOpen ? 'translate-x-full rotate-y-90' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="text-6xl mb-4 text-amber-300">💑</div>
            <div className="w-full h-px bg-amber-400/30 mb-4"></div>
            <p className="text-amber-200 text-sm uppercase tracking-[0.3em]">Wedding</p>
          </div>
        </div>

        {/* Center Content (revealed when doors open) */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${doorOpen ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
            {coupleData.groom}
          </h1>
          <div className="text-4xl text-amber-400 my-4">&</div>
          <h1 className="text-5xl md:text-6xl font-bold text-amber-100 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
            {coupleData.bride}
          </h1>
        </div>

        {/* Open Button */}
        {!doorOpen && (
          <button
            onClick={handleOpen}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-red-900 rounded-full font-bold text-lg hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-2xl animate-bounce"
          >
            Open Invitation
          </button>
        )}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-90 {
          transform: rotateY(-90deg);
        }
      `}</style>
    </div>
  );
}

// Sticky Navigation
function StickyNavigation({ scrollToSection, coupleNames, onRSVPClick }: any) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className={`font-bold transition-all ${scrolled ? 'text-red-900 text-lg' : 'text-amber-100 text-xl'}`} style={{ fontFamily: "'Cinzel', serif" }}>
          {coupleNames}
        </div>
        <div className="flex items-center space-x-6">
          {['Home', 'Events', 'Gallery', 'RSVP'].map((item) => (
            <button
              key={item}
              onClick={() => item === 'RSVP' ? onRSVPClick() : scrollToSection(item.toLowerCase())}
              className={`transition-colors text-sm uppercase tracking-wider ${
                scrolled ? 'text-gray-700 hover:text-red-900' : 'text-amber-200 hover:text-amber-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Hero Banner
function HeroBanner({ couple, mainEvent }: any) {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/80 to-amber-900/90">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-4">
        <div className="mb-8">
          <div className="text-6xl mb-6 animate-bounce">💍</div>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-amber-100 mb-6 animate-fade-in" style={{ fontFamily: "'Cinzel', serif" }}>
          {couple.groom} & {couple.bride}
        </h1>

        {couple.tagline && (
          <p className="text-2xl md:text-3xl text-amber-200 italic mb-8">
            {couple.tagline}
          </p>
        )}

        {mainEvent && (
          <div className="mb-8">
            <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border-2 border-amber-400/50">
              <p className="text-amber-200 text-lg">
                {format(new Date(mainEvent.date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 animate-bounce">
          <svg className="w-8 h-8 mx-auto text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// Main Event Highlight
function MainEventHighlight({ event }: any) {
  let formattedDate = '';
  try {
    formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
  } catch {
    formattedDate = event.date;
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-r from-red-900 via-red-800 to-amber-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-amber-400/20 mb-6">
            <span className="text-6xl">💍</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-100 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            {event.title}
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-24 h-px bg-amber-400/50"></div>
            <span className="text-2xl text-amber-400">❖</span>
            <div className="w-24 h-px bg-amber-400/50"></div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-amber-400/30 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-300 text-sm uppercase tracking-wider mb-2">Date & Time</p>
                <p className="text-white text-xl font-semibold">{formattedDate}</p>
                {event.time && <p className="text-amber-200">{event.time}</p>}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-300 text-sm uppercase tracking-wider mb-2">Venue</p>
                <p className="text-white text-xl font-semibold">{event.venue}</p>
                {event.address && <p className="text-amber-200">{event.address}</p>}
              </div>
            </div>
          </div>

          {event.mapUrl && (
            <div className="mt-8 text-center">
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-red-900 rounded-full font-bold text-lg hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-xl"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Countdown Timer
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-12" style={{ fontFamily: "'Cinzel', serif" }}>
          Counting Down to Our Big Day
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-8 shadow-xl border-2 border-red-100 transform hover:scale-105 transition-transform">
              <div className="text-5xl md:text-6xl font-bold text-red-900 mb-2">{value}</div>
              <div className="text-gray-600 uppercase tracking-wider text-sm">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Welcome Message
function WelcomeMessage({ message }: { message: string }) {
  return (
    <section className="py-24 px-4 bg-white/60 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-12">
          <div className="inline-block">
                <svg className="w-16 h-16 text-red-900 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
            </div>

        <div className="relative">
          <div className="absolute -top-6 -left-4 text-6xl text-red-900/10 leading-none">"</div>
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-relaxed font-light px-8">
            {message}
          </p>
          <div className="absolute -bottom-6 -right-4 text-6xl text-red-900/10 leading-none">"</div>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="w-12 h-px bg-red-900/20"></div>
          <div className="mx-4 w-2 h-2 rounded-full bg-red-900/30"></div>
          <div className="w-12 h-px bg-red-900/20"></div>
        </div>
      </div>
    </section>
  );
}

// RSVP Section
function RSVPSection({ id }: { id: string; coupleNames?: string }) {
  const [formData, setFormData] = useState({ name: '', email: '', guests: '1', message: '', attending: 'yes' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send to backend
    console.log('RSVP submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id={id} className="py-24 px-4 bg-gradient-to-br from-amber-50 to-red-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-red-900 mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
            RSVP
          </h2>
          <p className="text-gray-700 text-lg">Please let us know if you can join us</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-amber-200">
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
              <p className="text-gray-600">We've received your RSVP</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Will you attend? *</label>
                <div className="flex gap-4">
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                      className="mr-2"
                    />
                    <span>Yes, I'll be there!</span>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                      className="mr-2"
                    />
                    <span>Sorry, can't make it</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests</label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder="Any special requirements or messages for the couple..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-full font-bold text-lg hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                Submit RSVP
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// RSVP Modal
function RSVPModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-red-900">RSVP</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <RSVPSection id="modal-rsvp" coupleNames="" />
        </div>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, index }: { event: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
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
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        <div className="md:flex">
          <div className="md:w-48 bg-gradient-to-br from-red-900 to-red-800 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-amber-400/30 flex items-center justify-center bg-red-950/50">
                <span className="text-5xl">{getEventIcon(event.key)}</span>
              </div>
              <div className="text-amber-300 text-sm uppercase tracking-widest">Event {index + 1}</div>
            </div>
          </div>

          <div className="flex-1 p-8 md:p-10">
            <h3 className="text-3xl md:text-4xl font-bold text-red-900 mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
              {event.title}
            </h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-amber-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-semibold text-lg">{formattedDate}</div>
                  {event.time && <div className="text-gray-600">{event.time}</div>}
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-amber-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="font-semibold text-lg">{event.venue}</div>
                  {event.address && <div className="text-gray-600 mt-1">{event.address}</div>}
                </div>
              </div>

              {event.mapUrl && (
                <div className="pt-4">
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-full hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
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
    ceremony: '🙏',
    ganesh: '🙏',
    kirtan: '🎶'
  };
  return icons[eventKey] || '✨';
}
