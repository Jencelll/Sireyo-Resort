import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { slideshowImages } from '../constants';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        onLogin();
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      // Fallback: Check the "real credentials" locally if the backend is currently offline
      if (email === 'admin@sireyo.com' && password === 'password') {
        onLogin();
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const baseSlides = [
    { title: 'Curating', subtitle: 'Serenity', description: "Welcome to the inner sanctum of Sireyo. Manage your sanctuary with the same precision and care you provide to your guests.", tags: ['Exclusivity', 'Elegance', 'Ease'] },
    { title: 'Defining', subtitle: 'Exclusivity', description: "Experience unparalleled privacy and personalized service in the heart of nature's most beautiful landscapes.", tags: ['Privacy', 'Service', 'Nature'] },
    { title: 'Crafting', subtitle: 'Elegance', description: 'Every detail is meticulously designed to provide an atmosphere of sophisticated luxury and timeless beauty.', tags: ['Detail', 'Luxury', 'Beauty'] },
  ];

  const slides = slideshowImages.map((image, index) => ({ image, ...baseSlides[index % baseSlides.length] }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row overflow-hidden">
      {/* Visual Side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 relative bg-surface-container-highest overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0">
            <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 5, ease: 'linear' }} src={slides[currentSlide].image} alt="Resort Background" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-surface-container-lowest rounded-full overflow-hidden shadow-xl border-4 border-surface-container-lowest">
              <img src="/sireyoicon.png" alt="Sireyo Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-headline font-medium text-on-surface text-xl tracking-[0.2em] uppercase">Sireyo</span>
          </div>
          <div className="max-w-md">
            <AnimatePresence mode="wait">
              <motion.div key={`text-${currentSlide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }}>
                <h2 className="font-headline font-medium text-6xl text-on-surface leading-tight tracking-tight">
                  {slides[currentSlide].title} <br />
                  <span className="text-primary italic">{slides[currentSlide].subtitle}</span>
                </h2>
                <p className="text-on-surface-variant mt-6 text-lg font-normal leading-relaxed">{slides[currentSlide].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-8">
            {slides[currentSlide].tags.map((value, i) => (
              <motion.div key={`${currentSlide}-${value}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-on-surface-variant">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 bg-surface relative">
        <div className="absolute top-10 left-10 lg:hidden">
          <div className="w-12 h-12 bg-surface-container-lowest rounded-full overflow-hidden shadow-lg border-2 border-surface-container-lowest">
            <img src="/sireyoicon.png" alt="Sireyo Logo" className="w-full h-full object-cover scale-110" />
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
          <div className="mb-12">
            <h3 className="font-headline font-medium text-3xl lg:text-4xl text-on-surface tracking-tight">Sign In</h3>
            <p className="text-on-surface-variant mt-2 font-normal">Access the Sireyo Administrative Suite</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-xl text-xs font-bold tracking-wider">
                {error}
              </div>
            )}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@sireyo.com" className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm font-normal placeholder:text-on-surface-variant/20 transition-all duration-300" required />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Password</label>
                <a href="#" className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface-container border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-sm font-normal placeholder:text-on-surface-variant/20 transition-all duration-300 pr-14" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant/40 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="pt-4">
              <motion.button disabled={isLoading} whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} type="submit" className={`w-full bg-primary text-on-surface py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isLoading ? 'Authenticating...' : 'Log In'}
              </motion.button>
            </div>
          </form>
          <div className="mt-12 pt-12 border-t border-on-surface/5 flex justify-between items-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-on-surface-variant/40">© 2024 Sireyo Resort</p>
            <div className="flex gap-6">
              <a href="#" className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors">Help</a>
              <a href="#" className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
