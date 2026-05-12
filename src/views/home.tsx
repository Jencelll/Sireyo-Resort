import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { slideshowImages } from '../constants';
import { ChevronRight, MapPin, ShieldCheck, Waves, Sparkles, Utensils, Plane, Compass } from 'lucide-react';

const ResortFeatureCard = ({ icon, title, description, className = '' }: { icon: React.ReactNode; title: string; description: string; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className={`bg-surface-container-lowest/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-on-surface/5 hover:border-primary/30 transition-all duration-500 group flex flex-col ${className}`}
  >
    <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 28, strokeWidth: 1.5 })}
    </div>
    <h4 className="font-headline font-medium text-xl text-on-surface mb-4 tracking-tight">{title}</h4>
    <p className="text-on-surface-variant text-sm leading-relaxed font-light opacity-80">{description}</p>
    <div className="mt-auto pt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all duration-500">
      Explore More <ChevronRight size={14} />
    </div>
  </motion.div>
);

const HomeView = () => {
  const baseSlides = [
    { title: 'Where luxury', subtitle: 'meets the soul', description: 'Welcome to the inner sanctum of Sireyo. Experience a masterpiece of tropical architecture nestled in the pristine landscapes of El Nido.', tag: 'SANCTUARY' },
    { title: 'Defining', subtitle: 'Exclusivity', description: "Experience unparalleled privacy and personalized service in the heart of nature's most beautiful landscapes.", tag: 'ELEGANCE' },
    { title: 'Crafting', subtitle: 'Elegance', description: 'Every detail is meticulously designed to provide an atmosphere of sophisticated luxury and timeless beauty.', tag: 'EASE' },
  ];

  const slides = slideshowImages.map((image, index) => ({
    image,
    ...baseSlides[index % baseSlides.length],
    tag: `${String(index + 1).padStart(2, '0')} ${baseSlides[index % baseSlides.length].tag}`,
  }));

  const galleryTitles = ['Lagoon Villa', 'Sunset Terrace', 'Infinity Pool', 'Garden Suite', 'Beach Club', 'Poolside View', 'Signature Sireyo', 'Scenic Retreat', 'Sunrise Escape', 'Golden Hour Pool', 'Tent Haven', 'Tiny House Stay', 'Tropical Trees'];
  const galleryItems = slideshowImages.map((img, index) => ({ img, title: galleryTitles[index] ?? `Sanctuary View ${index + 1}` }));

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-surface text-on-surface w-full overflow-x-hidden">
      {/* Hero Slideshow Section */}
      <section className="relative h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2, ease: 'easeInOut' }} className="absolute inset-0 z-0">
            <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: 'linear' }} src={slides[currentSlide].image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-linear-to-b from-surface/20 via-surface/40 to-surface" />
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div key={`content-${currentSlide}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
            <span className="text-primary font-bold text-xs tracking-[0.6em] uppercase mb-8 block">{slides[currentSlide].tag}</span>
            <h1 className="font-headline font-medium text-6xl lg:text-9xl text-on-surface tracking-tighter leading-[0.9] mb-12">
              {slides[currentSlide].title} <br />
              <span className="italic text-primary">{slides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-on-surface-variant text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12 opacity-80">{slides[currentSlide].description}</p>
            <div className="flex flex-col items-center gap-6">
              <button className="px-10 py-5 bg-primary text-on-surface rounded-full font-bold text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-105 transition-all duration-500">Begin Your Journey</button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-1 transition-all duration-500 rounded-full ${index === currentSlide ? 'w-12 bg-primary' : 'w-4 bg-on-surface/20 hover:bg-on-surface/40'}`} />
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-6 block">The Sireyo Philosophy</span>
            <h2 className="font-headline font-medium text-4xl lg:text-6xl text-on-surface tracking-tight leading-[1.1] mb-10">
              A masterpiece of <br /><span className="italic text-primary">tropical architecture</span>
            </h2>
            <p className="text-on-surface-variant text-lg lg:text-xl font-light leading-relaxed mb-12 opacity-80">
              Nestled in the pristine landscapes of El Nido, Sireyo is more than a resort—it's a living testament to the harmony between luxury and nature.
            </p>
            <div className="grid grid-cols-2 gap-12 mb-12">
              {[{ label: 'Private Pool Villas', value: '24' }, { label: 'Forest Suites', value: '12' }, { label: 'Dedicated Staff', value: '150+' }, { label: 'Guest Rating', value: '4.9' }].map((stat, i) => (
                <div key={i} className="space-y-2 group">
                  <p className="text-4xl font-headline font-medium text-on-surface group-hover:text-primary transition-colors duration-500">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="pt-12 border-t border-on-surface/5 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center shrink-0"><MapPin size={22} className="text-primary" /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 opacity-50">Location</p>
                  <p className="text-sm text-on-surface font-medium">Bacuit Bay, El Nido, Palawan</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center shrink-0"><ShieldCheck size={22} className="text-primary" /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 opacity-50">Security</p>
                  <p className="text-sm text-on-surface font-medium">24/7 Private Protection</p>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="relative isolate">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="aspect-4/5 rounded-[3rem] overflow-hidden shadow-2xl bg-surface-container-lowest flex items-center justify-center">
              <img src="/sireyoicon.png" alt="Sireyo Logo" className="w-2/3 h-2/3 object-contain drop-shadow-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Features Section */}
      <section className="py-32 bg-surface-container/30">
        <div className="px-6 lg:px-10 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-6 block">Exclusive Amenities</span>
            <h2 className="font-headline font-medium text-4xl lg:text-6xl text-on-surface tracking-tight">Curated for the <span className="italic">extraordinary</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ResortFeatureCard className="md:col-span-2" icon={<Waves />} title="Private Beach Sanctuary" description="2 kilometers of untouched white sand exclusively for our guests. Experience the ultimate seclusion with private cabanas and personalized beach butler service." />
            <ResortFeatureCard icon={<Sparkles />} title="Zen Spa" description="Holistic treatments inspired by ancient Filipino healing traditions." />
            <ResortFeatureCard icon={<Utensils />} title="Fine Dining" description="Three world-class restaurants serving organic, locally-sourced cuisine." />
            <ResortFeatureCard className="md:col-span-2" icon={<Plane />} title="Global Access" description="Direct private jet transfers from Manila and international hubs. Our concierge handles all logistics for a seamless arrival to your tropical paradise." />
            <ResortFeatureCard icon={<ShieldCheck />} title="Total Privacy" description="Advanced security and secluded layouts for high-profile guests." />
            <ResortFeatureCard icon={<MapPin />} title="Prime Location" description="Located in the heart of Palawan, the world's best island." />
            <ResortFeatureCard icon={<Compass />} title="Island Expeditions" description="Private yacht tours to hidden lagoons and secret coves." />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 overflow-hidden">
        <div className="px-6 lg:px-10 max-w-7xl mx-auto mb-16 flex justify-between items-end">
          <div>
            <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-6 block">Visual Journey</span>
            <h2 className="font-headline font-medium text-4xl lg:text-5xl text-on-surface tracking-tight">The Sanctuary Experience</h2>
          </div>
          <button className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-5 transition-all">View Full Gallery <ChevronRight size={16} /></button>
        </div>
        <div className="flex gap-8 px-6 lg:px-10 overflow-x-auto pb-12">
          {galleryItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="min-w-100 h-125 rounded-[2.5rem] overflow-hidden relative group cursor-pointer">
              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-linear-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <h4 className="text-2xl font-headline font-medium text-on-surface mb-2">{item.title}</h4>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">Discover More</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto bg-primary text-on-surface p-16 lg:p-24 rounded-[4rem] text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10">
            <h2 className="font-headline font-medium text-4xl lg:text-7xl tracking-tight mb-12">Ready to find your <br /> <span className="italic">inner peace?</span></h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-12 py-6 bg-on-surface text-primary rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all duration-500">Book Your Stay</button>
              <button className="px-12 py-6 bg-white/10 backdrop-blur-md text-on-surface rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-white/20 transition-all duration-500">Contact Concierge</button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomeView;
