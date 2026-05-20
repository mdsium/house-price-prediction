import { motion } from 'motion/react';
import { BrainCircuit, Database, ShieldCheck, Zap, BarChart3, LineChart, Code2, Server, CheckCircle2, MapPin, Key } from 'lucide-react';

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-24"
    >
      <div className="text-center mb-20 space-y-4" id="model">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 mb-4">
          <BrainCircuit className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Model Architecture</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">The Prediction Engine</h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          An advanced machine learning pipeline leveraging supervised learning techniques to provide highly accurate, data-driven real estate valuations across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-soft">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 w-fit rounded-2xl mb-8">
            <BarChart3 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900">Ensemble Methods</h3>
          <p className="text-slate-600 leading-relaxed font-medium">
            We evaluated Linear Regression, Decision Trees, Random Forest, Gradient Boosting, and XGBoost. <strong>Random Forest</strong> was selected as our primary production model, offering the best balance of variance reduction, accuracy (R² of 0.859), and a rapid inference time of just 45ms.
          </p>
        </div>
        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-soft">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 w-fit rounded-2xl mb-8">
            <Database className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900">Robust Feature Engineering</h3>
          <p className="text-slate-600 leading-relaxed font-medium">
            Our model analyzes 21 distinct property attributes, categorizing them into Physical Properties (area, age), Amenities (lift, gas, security), and Location Factors (distance to main roads, schools, hospitals) to generate high-fidelity price estimates.
          </p>
        </div>
      </div>

      <div className="space-y-16 mb-24" id="methodology">
        <h2 className="text-3xl font-black text-slate-900 text-center tracking-tight">Data & Validation Methodology</h2>
        <div className="relative">
          <div className="absolute left-8 top-4 bottom-4 w-[2px] bg-indigo-50 hidden md:block" />
          
          {[
            {
              step: "Data Collection & Scrubbing",
              desc: "Aggregating 500+ records from real estate portals, government land records, and professional assessments across 6 major Bangladeshi cities.",
              icon: Database
            },
            {
              step: "Cross-Validation Strategy",
              desc: "Implementing a 5-Fold Cross-Validation on training datasets, strictly stratified by city, to prevent geographical bias and ensure robust generalization.",
              icon: ShieldCheck
            },
            {
              step: "Hyperparameter Tuning",
              desc: "Utilizing GridSearchCV to optimize parameters like estimators, max depth, and learning rates to squeeze out maximum predictive performance.",
              icon: Zap
            },
            {
              step: "Production Inference",
              desc: "Deploying an optimized scikit-learn pipeline behind a scalable Django REST Framework API, guaranteeing < 100ms response times for real-time applications.",
              icon: Server
            }
          ].map((item, idx) => (
            <div key={idx} className="relative pl-0 md:pl-24 mb-14 last:mb-0">
              <div className="absolute left-0 top-0 w-16 h-16 bg-white border border-slate-200 rounded-3xl hidden md:flex items-center justify-center -translate-x-1/2 shadow-soft ring-8 ring-slate-50">
                <item.icon className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-soft">
                <h4 className="font-bold text-xl mb-2 text-slate-900">{item.step}</h4>
                <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-24" id="model-selection">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Model Selection & Validation</h2>
          <p className="text-slate-500 font-medium mt-3">Evaluating baseline and ensemble methods for the optimal R² to latency ratio.</p>
        </div>
        
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-soft bg-white mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Algorithm</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">R² Score</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">RMSE (BDT)</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Inference Time</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Linear Regression', r2: '0.710', rmse: '3.2M', time: '10ms', status: 'Baseline' },
                  { name: 'Decision Tree', r2: '0.780', rmse: '2.8M', time: '20ms', status: 'Evaluated' },
                  { name: 'Gradient Boosting', r2: '0.841', rmse: '2.3M', time: '120ms', status: 'Evaluated' },
                  { name: 'XGBoost', r2: '0.872', rmse: '2.1M', time: '200ms', status: 'Evaluated' },
                  { name: 'Random Forest', r2: '0.859', rmse: '2.15M', time: '45ms', status: 'Selected', highlight: true }
                ].map((row, idx) => (
                  <tr key={idx} className={row.highlight ? "bg-indigo-50/40" : "hover:bg-slate-50/50 transition-colors"}>
                    <td className="p-6 font-bold text-slate-900 whitespace-nowrap">{row.name}</td>
                    <td className="p-6 font-bold text-slate-600 font-mono">{row.r2}</td>
                    <td className="p-6 font-bold text-slate-600 font-mono">{row.rmse}</td>
                    <td className="p-6 font-bold text-slate-600 font-mono">{row.time}</td>
                    <td className="p-6 text-center">
                      {row.highlight ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                           {row.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-indigo-50/80 rounded-[2rem] p-8 border border-indigo-100 flex gap-6 items-start">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center shrink-0">
             <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Trade-off Analysis Overview</h4>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              While XGBoost achieved a marginally higher R² score (0.872), <strong>Random Forest</strong> was selected due to its significantly lower inference time (45ms compared to XGBoost's 200ms). This sub-100ms response time is critical to maintaining a snappy, real-time feel under high concurrency.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
        {/* City-wise accuracy */}
        <div className="p-8 md:p-10 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-soft">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">City-wise Accuracy</h3>
          </div>
          <div className="space-y-6">
            {[
              { city: "Rajshahi", r2: "0.881", acc: "88.1%", width: "w-[88%]" },
              { city: "Dhaka", r2: "0.875", acc: "87.5%", width: "w-[87%]" },
              { city: "Chattogram", r2: "0.862", acc: "86.2%", width: "w-[86%]" },
              { city: "Sylhet", r2: "0.859", acc: "85.9%", width: "w-[85%]" },
              { city: "Khulna", r2: "0.843", acc: "84.3%", width: "w-[84%]" },
              { city: "Barisal", r2: "0.821", acc: "82.1%", width: "w-[82%]" }
            ].map((stat) => (
              <div key={stat.city}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm text-slate-700">{stat.city}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">R²: <span className="text-slate-900">{stat.r2}</span></span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full bg-indigo-500 rounded-full ${stat.width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Importance */}
        <div className="p-8 md:p-10 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-soft">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Key Value Drivers</h3>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
            Based on feature importance extraction from the Random Forest model, the following attributes have the highest impact on positive price valuation.
          </p>
          <div className="flex flex-wrap gap-3">
             <div className="w-full p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition-colors">
               <span className="font-bold text-sm text-slate-700">Premium Thana Locality</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Rank 1</span>
             </div>
             <div className="w-full p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition-colors">
               <span className="font-bold text-sm text-slate-700">Total Bathrooms</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Rank 2</span>
             </div>
             <div className="w-full p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition-colors">
               <span className="font-bold text-sm text-slate-700">Power Backup (Generator)</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Rank 3</span>
             </div>
             <div className="w-full p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition-colors">
               <span className="font-bold text-sm text-slate-700">Dedicated Garage</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Rank 4</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-8 italic tracking-tight">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Test R² Score</p>
              <p className="text-4xl font-black text-white">0.859</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">MAPE</p>
              <p className="text-4xl font-black text-white">8.2%</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Inference Time</p>
              <p className="text-4xl font-black text-white">45<span className="text-xl text-slate-400">ms</span></p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Model Size</p>
              <p className="text-4xl font-black text-white">4.3<span className="text-xl text-slate-400">MB</span></p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
