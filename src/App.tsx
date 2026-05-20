import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home as HomeIcon, LineChart, Map as MapIcon, Info, Mail, Menu, X, Building2 } from 'lucide-react';
import { cn } from './lib/utils';

// Page Components
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import PredictionPageModel from './pages/PredictionPageModel';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PredictionHistoryPage from './pages/PredictionHistoryPage';
import Footer from './pages/Footer';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'PredictionAi', path: '/prediction', icon: LineChart },
    { name: 'PredictionModel', path: '/predictionmodel', icon: LineChart },
    { name: 'Market Map', path: '/map', icon: MapIcon },
    { name: 'About Model', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
    { name: 'Prediction History', path: '/prediction-history', icon: LineChart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                  <Building2 className="text-white w-5 h-5" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                House Price Predictor
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
                  location.pathname === item.path
                    ? "bg-slate-900 text-white shadow-soft"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 rounded-xl text-xs font-black tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              {isOpen ? "CLOSE" : "MENU"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-2xl border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                    location.pathname === item.path
                      ? "bg-slate-900 text-white shadow-soft"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans antialiased">
        <Navbar />
        <main className="pt-16 min-h-screen">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/predictionmodel" element={<PredictionPageModel />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/prediction-history" element={<PredictionHistoryPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
