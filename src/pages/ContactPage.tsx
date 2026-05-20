import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://bd-house-price-prediction.onrender.com/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to send your inquiry.');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Contact API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send your inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 py-24"
    >
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Contact Info */}
        <div className="flex-1 space-y-14">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Connect with us</h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">Direct channels for institutional inquiries, platform support, and data partnership requests.</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-soft">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Electronic Mail</p>
                <p className="text-xl font-bold text-slate-900">admin@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-soft">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Direct Line</p>
                <p className="text-xl font-bold text-slate-900">+880 1720184617</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-soft">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Physical Hub</p>
                <p className="text-xl font-bold text-slate-900">Shewrapara Mirpur, Dhaka</p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white overflow-hidden relative border border-slate-800">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MessageCircle className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex flex-col items-start gap-6">
              <h4 className="text-2xl font-bold tracking-tight">Assistance</h4>
              <p className="text-indigo-200/80 text-sm leading-relaxed max-w-sm font-medium">Connect with a market analyst for personalized property asset evaluation strategies.</p>
              <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-soft">
                Open Messenger
              </button>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1 bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-200/60 shadow-card">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-soft animate-bounce">
                <Send className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Inquiry Received</h3>
                <p className="text-slate-500 font-medium italic">"Queue sequence established. An advisor will contact you shortly."</p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline pt-4"
              >
                Return to form
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Identity</label>
                <input
                  required
                  type="text"
                  maxLength={255}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Johnathan Doe"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Coordinates</label>
                <input
                  required
                  type="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="j.doe@enterprise.com"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                <input
                  required
                  type="text"
                  maxLength={500}
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Data partnership inquiry"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Describe your data requirements or asset query..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 resize-none font-medium leading-relaxed"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-soft active:scale-95 disabled:opacity-60"
              >
                {loading ? 'Sending Inquiry...' : 'Dispatch Inquiry'} <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>


    </motion.div>
  );
}
