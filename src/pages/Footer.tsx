import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Model', path: '/about#model' },
      { name: 'Methodology', path: '/about#methodology' },
      { name: 'Careers', path: '#' },
    ],
    services: [
      { name: 'Property Prediction', path: '/prediction' },
      { name: 'Market Explorer', path: '/map' },
      { name: 'Data API', path: '#' },
      { name: 'Consultancy', path: '/contact' },
    ],
    support: [
      { name: 'Help Center', path: '#' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
    ],
  };

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                <Building2 className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900">
                House Price <span className="text-indigo-600">Predictor</span>
              </span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              Empowering the real estate market with institutional-grade data intelligence and high-fidelity machine learning models for precise asset valuation.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 hover:text-indigo-600 font-bold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Intelligence</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 hover:text-indigo-600 font-bold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 hover:text-indigo-600 font-bold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              © {currentYear} House Price Predictor. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <MapPin className="w-3 h-3 text-indigo-400" /> DHAKA, BD
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Phone className="w-3 h-3 text-indigo-400" /> +880 1234 5678
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Status: Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
