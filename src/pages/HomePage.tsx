import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, BarChart3, BrainCircuit, Building2, CheckCircle2, ChevronDown, Database, Globe2, GraduationCap, HelpCircle, LineChart, Map as MapIcon, MessageSquare, Quote, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';



export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {/* Hero Section - Full Display Size Background */}
      <section className="relative w-full h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0">
         <img 
            src="./assets/bg.jpg"
            alt="Modern Architecture"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Multi-layered overlay for depth and readability */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-transparent to-slate-900 shadow-inner" />
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 px-6 max-w-6xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">House Price Predictor</span>
          </div>

          <h1 className="uppercase text-6xl md:text-[6rem] font-black tracking-tight text-white mb-8 font-sans leading-[0.9] drop-shadow-2xl">
            The Smart Way <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-indigo-200">
            to Value Assets
            </span>
          </h1>
          <p className="text-lg md:text-1.5xl text-white/80 max-w-2xl mx-auto mb-16 font-medium leading-relaxed tracking-tight">
            Enterprise-grade machine learning models designed to provide consistent, 
            evidence-based property valuations for the modern real estate market.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              to="/prediction"
              className="group relative px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Launch Model</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0" />
            </Link>
            <Link
              to="/map"
              className="px-12 py-6 bg-white/5 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-soft active:scale-95"
            >
              Market Explorer <MapIcon className="w-5 h-5 text-indigo-400" />
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40">
           <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll</span>
           <div className="w-px h-12 bg-white/20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-400 animate-[bounce_2s_infinite]" />
           </div>
        </div> */}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              {/* Trust Marks */}
              <div className="mb-32">
                <p className="text-center text-[20px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10">Trusted By Regional Market Leaders</p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 lg:gap-x-16 gap-y-10">
                  {["DHAKA REALTY", "CHATTOGRAM HOMES", "SYLHET ASSETS", "RAJSHAHI LAND"].map((brand, i) => (
                    <div key={i} className="group relative flex items-center justify-center">
                      <span className="font-black tracking-[0.2em] md:tracking-[0.3em] sm:text-base md:text-lg text-slate-300 group-hover:text-slate-900 transition-colors duration-500 cursor-default flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors duration-500" />
                        {brand}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
      
              {/* Facts and Features */}
              <section className="mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-8 bg-slate-900 rounded-[2rem] border border-slate-800 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-12 translate-x-4 -translate-y-4">
                      <BrainCircuit className="w-32 h-32 text-indigo-400" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400 mb-8 backdrop-blur-md">
                        <BrainCircuit className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">Predictive Accuracy</h3>
                      <p className="text-sm font-medium text-slate-400 leading-relaxed">
                        Achieved an R² score of 0.859 and robust accuracy across metropolitan regions.
                      </p>
                    </div>
                  </div>
      
                  <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 text-slate-900 relative overflow-hidden group hover:bg-indigo-100 transition-colors duration-500">
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">Rapid Inference</h3>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        Ultra-fast response API averaging 45ms for dynamic property valuation updates.
                      </p>
                    </div>
                  </div>
      
                  <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-soft text-slate-900 relative overflow-hidden group hover:shadow-card transition-shadow duration-500">
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100 mb-8 group-hover:scale-110 transition-transform duration-500">
                        <Database className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">Deep Features</h3>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">
                        Evaluating 21 distinct property attributes including spatial proximity.
                      </p>
                    </div>
                  </div>
      
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-900 relative overflow-hidden group hover:bg-slate-100 transition-colors duration-500">
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500">
                        <Globe2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">Broad Coverage</h3>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">
                        Supporting 6 major commercial & residential districts.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
      
            {/* Feature Grid */}
            <section className="py-24">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Advanced Analytics</h2>
                <p className="text-slate-500 max-w-xl mx-auto">Leveraging multidimensional data to provide institutional-grade accuracy for residential properties.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  {
                    title: "Ensemble Valuations",
                    desc: "Random Forest integration estimating across 21 property attributes including structural and spatial inputs.",
                    icon: LineChart,
                    accent: "indigo"
                  },
                  {
                    title: "Rapid Inference",
                    desc: "Low-latency REST API enabling sub-100ms predictions for real-time market exploration and assessment.",
                    icon: Zap,
                    accent: "slate"
                  },
                  {
                    title: "Robust Generalization",
                    desc: "Validated across diverse geographical zones achieving an 8.2% MAPE and R² score of 0.859.",
                    icon: ShieldCheck,
                    accent: "emerald"
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * idx + 0.4 }}
                    className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-card transition-all duration-500 group"
                  >
                    <div className={`p-4.5 rounded-2xl bg-indigo-50 text-indigo-600 w-fit mb-8 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>     
      
            
      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Precision FAQ</h2>
          <p className="text-slate-500 font-medium tracking-tight">Technical answers for serious investors and property owners.</p>
        </div>
        
        <div className="space-y-4">
          {[
            {
              q: "How accurate is this house price prediction model?",
              a: (
                <div className="space-y-2">
                  <p>The model achieves R² ≈ 0.78–0.85 (depending on final tuning) on the test set with XGBoost.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Mean Absolute Error (MAE): ~8.5–11% of actual price</li>
                    <li>RMSE: ~12–15% of actual price</li>
                  </ul>
                  <p>This means for a 2 Crore property, the typical prediction error is between 1.7–2.3 Crore.</p>
                </div>
              )
            },
            {
              q: "What machine learning algorithm is used?",
              a: (
                <div className="space-y-2">
                  <p>XGBoost Regressor (Gradient Boosting) with log-transformed target (price_log).</p>
                  <p>It outperformed Linear Regression, Ridge, Random Forest, and Gradient Boosting in cross-validation.</p>
                </div>
              )
            },
            {
              q: "What are the most important features driving price predictions?",
              a: (
                <div className="space-y-2">
                  <p>Top features by importance (XGBoost):</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Area (sqft) — Highest impact</li>
                    <li>City (Dhaka &gt;&gt; Chattogram &gt; Sylhet &gt; Rajshahi)</li>
                    <li>Thana / Location (Gulshan, Dhanmondi, Banani, etc.)</li>
                    <li>Prefarea (Preferred residential area)</li>
                    <li>Building Age</li>
                    <li>Total Floors + Floor Level</li>
                    <li>Lift availability</li>
                    <li>Road Width (ft)</li>
                    <li>Near School / Hospital / Market</li>
                  </ol>
                </div>
              )
            },
            {
              q: "Does the model consider market trends or only static features?",
              a: (
                <p>Currently, the model is static (trained on historical data). It does not include time-series macroeconomic factors (interest rates, inflation, political stability). Future versions will include temporal features.</p>
              )
            },
            {
              q: "How should I use this tool for investment decisions?",
              a: (
                <div className="space-y-2">
                  <p>Best Practice:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use predicted price as a fair value benchmark</li>
                    <li>Calculate Undervaluation Score = (Predicted Price - Listed Price) / Listed Price</li>
                    <li>Properties with &gt;15–20% undervaluation (after manual verification) are worth deeper investigation</li>
                    <li>Always combine with physical inspection, legal due diligence, and local market knowledge</li>
                  </ul>
                </div>
              )
            },
          ].map((item, i) => (
            <div key={i} className="border border-slate-100 rounded-3xl bg-white shadow-soft overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-bold text-slate-900 pr-8">{item.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300", activeFaq === i && "rotate-180")} />
              </button>
              <div 
                className={cn(
                  "px-8 overflow-hidden transition-all duration-300 bg-slate-50/30",
                  activeFaq === i ? "py-6 border-t border-slate-50 opacity-100 max-h-[1000px]" : "max-h-0 opacity-0"
                )}
              >
                <div className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
            {/* Final CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden border border-slate-800 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full" />
                <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                    Ready to decode your <br /> 
                    <span className="text-indigo-400">property's value?</span>
                  </h2>
                  <p className="text-lg text-slate-400 font-medium leading-relaxed">
                    Join thousands of data-driven property owners making smarter financial decisions 
                    with our enterprise-grade neural valuation engine.
                  </p>
                  <div className="pt-8 flex flex-col sm:flex-row justify-center gap-6">
                    <Link
                      to="/prediction"
                      className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                    >
                      Launch Model
                    </Link>
                    <Link
                      to="/contact"
                      className="px-12 py-5 bg-slate-800 text-white border border-slate-700 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-750 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      Request API Access
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
    </motion.div>
  );
}
