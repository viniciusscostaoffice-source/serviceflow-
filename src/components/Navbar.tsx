import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Preços', href: '#precos' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha menu ao redimensionar para desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleAnchor = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-secondary/95 backdrop-blur-md border-b border-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 bg-primary flex items-center justify-center group-hover:bg-white transition-colors duration-200">
                <Wrench size={16} className="text-secondary" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg text-offwhite tracking-tight">
                  Service<span className="text-primary">Flow</span>
                </span>
                <span className="text-[10px] text-gray-500 tracking-wide hidden sm:block">
                  comissão sem briga
                </span>
              </div>
            </Link>

            {/* Links — desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleAnchor(link.href)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-offwhite transition-colors duration-150 font-medium cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTAs — desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-gray-400 hover:text-offwhite transition-colors font-medium border border-transparent hover:border-gray-700 rounded-full"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary font-display text-sm hover:bg-white hover:text-secondary transition-colors duration-200 uppercase tracking-wide shadow-[0_0_16px_rgba(255,107,26,0.25)]"
              >
                Começar grátis
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Hamburguer — mobile */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-gray-400 hover:text-offwhite transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-secondary/98 backdrop-blur-md border-b border-primary/20 shadow-2xl md:hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleAnchor(link.href)}
                  className="block w-full text-left px-4 py-3 text-base text-gray-300 hover:text-primary hover:bg-primary/5 transition-colors font-medium rounded cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-800 mt-4">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-6 py-3 border border-gray-700 text-offwhite font-medium text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-secondary font-display text-base hover:bg-white transition-colors uppercase"
                >
                  Começar grátis — 7 dias
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
