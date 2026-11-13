import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const OCCASIONS = [
  { id: 'wedding', name: 'Wedding', icon: '💒', description: 'Beautiful wedding invitation designs' },
  { id: 'birthday', name: 'Birthday', icon: '🎂', description: 'Fun birthday celebration invites' },
  { id: 'anniversary', name: 'Anniversary', icon: '💝', description: 'Romantic anniversary invitations' },
  { id: 'baby_shower', name: 'Baby Shower', icon: '👶', description: 'Adorable baby shower designs' },
  { id: 'housewarming', name: 'Housewarming', icon: '🏠', description: 'Welcoming housewarming invites' },
  { id: 'party', name: 'Party', icon: '🎉', description: 'Exciting party invitation templates' },
  { id: 'religious', name: 'Religious', icon: '🙏', description: 'Sacred ceremony invitations' },
  { id: 'family_celebration', name: 'Family Celebration', icon: '👨‍👩‍👧‍👦', description: 'Family celebration designs' },
  { id: 'other', name: 'Other', icon: '🎊', description: 'All other special occasions' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                InviteHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#occasions" className="text-gray-700 hover:text-rose-600 transition font-medium">
                Occasions
              </a>
              <Link to="/templates" className="text-gray-700 hover:text-rose-600 transition font-medium">
                Templates
              </Link>
              <a href="#how-it-works" className="text-gray-700 hover:text-rose-600 transition font-medium">
                How It Works
              </a>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-rose-600 transition font-medium">
                    Dashboard
                  </Link>
                  <Link
                    to="/invitations/new"
                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-medium hover:from-rose-600 hover:to-rose-700 transition shadow-sm"
                  >
                    Create Invitation
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-rose-600 transition font-medium">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-medium hover:from-rose-600 hover:to-rose-700 transition shadow-sm"
                  >
                    Create Invitation
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-100">
              <a
                href="#occasions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Occasions
              </a>
              <Link
                to="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Templates
              </Link>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                How It Works
              </a>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/invitations/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg text-center font-medium"
                  >
                    Create Invitation
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg text-center font-medium"
                  >
                    Create Invitation
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Beautiful Invitations for{' '}
                <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                  Every Celebration
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover stunning digital invitation designs, personalize every detail, and share your special moments
                with everyone who matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/templates"
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition shadow-lg hover:shadow-xl text-center"
                >
                  Explore Templates
                </Link>
                <a
                  href="#occasions"
                  className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-50 transition border-2 border-gray-200 text-center"
                >
                  Browse Occasions
                </a>
              </div>
              <div className="mt-12 flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Beautiful Templates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Easy to Create</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Digital & Shareable</span>
                </div>
              </div>
            </div>

            {/* Right: Preview Mockup */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-rose-50 to-purple-50 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="inline-block">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                        💒
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">Sarah & James</h3>
                    <p className="text-gray-600 italic">Two hearts, one love</p>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Saturday, February 14, 2027</p>
                      <p className="text-sm text-gray-500">The Grand Palace, Mumbai</p>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium">
                      View Invitation
                    </button>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-200 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Categories */}
      <section id="occasions" className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Celebrate Every Occasion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From weddings to birthdays, we have beautiful invitation designs for all your special moments
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {OCCASIONS.map((occasion) => (
              <Link
                key={occasion.id}
                to={`/templates?category=${occasion.id}`}
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-rose-200"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {occasion.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{occasion.name}</h3>
                <p className="text-sm text-gray-600">{occasion.description}</p>
                <div className="mt-4 text-rose-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  Explore
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Create Your Invitation in Minutes
            </h2>
            <p className="text-xl text-gray-600">Simple, fast, and beautiful</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose a Template</h3>
              <p className="text-gray-600">
                Browse our beautiful collection and pick the perfect design for your celebration
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalize Details</h3>
              <p className="text-gray-600">
                Add your event information, customize colors, and make it uniquely yours
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Share & Celebrate</h3>
              <p className="text-gray-600">
                Share your beautiful invitation via WhatsApp, email, or social media with friends and family
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/templates"
              className="inline-block px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-rose-400 to-rose-500 bg-clip-text text-transparent mb-4">
                InviteHub
              </h3>
              <p className="text-gray-400 text-sm">
                Beautiful digital invitations for every celebration
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/templates" className="hover:text-white transition">
                    Templates
                  </Link>
                </li>
                <li>
                  <a href="#occasions" className="hover:text-white transition">
                    Occasions
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 InviteHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
