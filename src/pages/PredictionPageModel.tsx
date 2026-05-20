import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, MapPin, Calculator, Home, Info, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PredictionInput } from '../types';
import { CITY_THANA_MAP } from '../constants';
import { cn } from '../lib/utils';

export default function PredictionPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ predictedPrice: number; formattedPrice: string; reasoning?: string } | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<PredictionInput>({
    area_sqft: 1200,
    city: 'Dhaka',
    thana: 'Gulshan-1',
    bedrooms: 3,
    bathrooms: 2,
    floor_level: 2,
    total_floors: 6,
    building_age: 10,
    lift: true,
    gas_line: true,
    airco: false,
    generator: true,
    security: true,
    parking: true,
    garagepl: false,
    road_width_ft: 20,
    distance_main_road_m: 100,
    near_school: true,
    near_hospital: true,
    near_market: true,
    driveway: true,
    fullbase: false,
    prefarea: false
  });

  const handleInputChange = (field: keyof PredictionInput, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      ...(field === 'city' ? { thana: CITY_THANA_MAP[value][0] } : {}) 
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://bd-house-price-prediction.onrender.com/api/predict/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to get prediction.');
      }

      const predictedPrice = Number(data.predicted_price ?? data.predictedPrice ?? data.price ?? 0);

      setResult({
        predictedPrice,
        formattedPrice: data.formatted_price || data.formattedPrice || `BDT ${predictedPrice.toLocaleString()}`,
        reasoning: data.reasoning,
      });
      setStep(4);
    } catch (error) {
      console.error('Prediction API error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Location', icon: MapPin },
    { title: 'Dimensions', icon: Building2 },
    { title: 'Amenities', icon: Home },
    { title: 'Result', icon: Calculator },
  ];

  const selectedAmenities = [
    ['Lift', formData.lift],
    ['Gas Line', formData.gas_line],
    ['Air Conditioning', formData.airco],
    ['Generator', formData.generator],
    ['Security', formData.security],
    ['Parking', formData.parking],
    ['Garage', formData.garagepl],
    ['Driveway', formData.driveway],
    ['Full Basement', formData.fullbase],
    ['Near School', formData.near_school],
    ['Near Hospital', formData.near_hospital],
    ['Near Market', formData.near_market],
    ['Preferred Area', formData.prefarea],
  ].filter(([, enabled]) => enabled);

  const propertyDetails = [
    { label: 'Location', value: `${formData.thana}, ${formData.city}` },
    { label: 'Area', value: `${formData.area_sqft.toLocaleString()} sqft` },
    { label: 'Bedrooms', value: formData.bedrooms },
    { label: 'Bathrooms', value: formData.bathrooms },
    { label: 'Floor', value: `${formData.floor_level} of ${formData.total_floors}` },
    { label: 'Building Age', value: `${formData.building_age} years` },
    { label: 'Road Width', value: `${formData.road_width_ft} ft` },
    { label: 'Main Road Distance', value: `${formData.distance_main_road_m} m` },
  ];

  const valuationChartData = result ? [
    { label: 'Low', price: Math.round(result.predictedPrice * 0.9) },
    { label: 'Predicted', price: result.predictedPrice },
    { label: 'High', price: Math.round(result.predictedPrice * 1.1) },
  ] : [];

  const pricePerSqft = result && formData.area_sqft > 0
    ? Math.round(result.predictedPrice / formData.area_sqft)
    : 0;

  const formatShortPrice = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(2)} Lac`;
    return value.toLocaleString();
  };

  const renderStepIcon = (idx: number) => {
    const StepIcon = steps[idx].icon;
    const isActive = step === idx + 1;
    const isCompleted = step > idx + 1;

    return (
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
          isActive ? "bg-indigo-600 text-white scale-110 shadow-lg" : 
          isCompleted ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
        )}>
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
        </div>
        <span className={cn(
          "text-xs mt-2 font-medium",
          isActive ? "text-indigo-600" : "text-gray-400"
        )}>{steps[idx].title}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Market Valuation Engine</h2>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">Analyze technical parameters to generate high-fidelity property value estimations.</p>
      </div>

      {/* Progress Tracker */}
      <div className="flex justify-between items-center mb-16 max-w-lg mx-auto">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 flex items-center last:flex-none">
            {renderStepIcon(i)}
            {i < 3 && <div className={cn("h-[2px] flex-1 mx-4 mt-[-20px]", step > i + 1 ? "bg-indigo-500" : "bg-slate-200")} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-card p-10 md:p-14 min-h-[550px] flex flex-col relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="font-black text-slate-900 tracking-tighter animate-pulse">GENERATING VALUATION...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Market / City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  >
                    {Object.keys(CITY_THANA_MAP).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sub-Market / Thana</label>
                  <select
                    value={formData.thana}
                    onChange={(e) => handleInputChange('thana', e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  >
                    {CITY_THANA_MAP[formData.city].map(thana => (
                      <option key={thana} value={thana}>{thana}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Infrastructural Road Width (ft)</label>
                  <input
                    type="number"
                    value={formData.road_width_ft}
                    onChange={(e) => handleInputChange('road_width_ft', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Distance to Main Artery (m)</label>
                  <input
                    type="number"
                    value={formData.distance_main_road_m}
                    onChange={(e) => handleInputChange('distance_main_road_m', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 pt-4">
                {['near_school', 'near_hospital', 'near_market', 'prefarea'].map(field => (
                   <label key={field} className={cn(
                     "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                     formData[field as keyof PredictionInput] 
                      ? "bg-indigo-50/50 border-indigo-200 text-indigo-700" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                   )}>
                     <input
                       type="checkbox"
                       checked={formData[field as keyof PredictionInput] as boolean}
                       onChange={(e) => handleInputChange(field as keyof PredictionInput, e.target.checked)}
                       className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                     />
                     <span className="text-xs font-bold uppercase tracking-wider">{field.replace('_', ' ')}</span>
                   </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Net Area (sqft)</label>
                  <input
                    type="number"
                    value={formData.area_sqft}
                    onChange={(e) => handleInputChange('area_sqft', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bedroom Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bathroom Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Floor Level</label>
                  <input
                    type="number"
                    value={formData.floor_level}
                    onChange={(e) => handleInputChange('floor_level', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Vertical Capacity</label>
                  <input
                    type="number"
                    value={formData.total_floors}
                    onChange={(e) => handleInputChange('total_floors', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Asset Age (years)</label>
                  <input
                    type="number"
                    value={formData.building_age}
                    onChange={(e) => handleInputChange('building_age', parseInt(e.target.value))}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-5"
            >
              {['lift', 'gas_line', 'airco', 'generator', 'security', 'parking', 'garagepl', 'driveway', 'fullbase'].map(field => (
                 <label key={field} className={cn(
                   "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                   formData[field as keyof PredictionInput] 
                    ? "bg-indigo-50/50 border-indigo-200 text-indigo-700" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                 )}>
                   <input
                     type="checkbox"
                     checked={formData[field as keyof PredictionInput] as boolean}
                     onChange={(e) => handleInputChange(field as keyof PredictionInput, e.target.checked)}
                     className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                   />
                   <span className="text-[10px] font-black uppercase tracking-widest">{field.replace('_', ' ')}</span>
                 </label>
              ))}
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div
              key="step4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-10 py-10"
            >
              <div>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Final Valuation Estimate</p>
                <h3 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter">
                  <span>{result.formattedPrice}</span>
                  <span className="hidden">
                  ৳{result.predictedPrice.toLocaleString()}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price per sqft</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">BDT {pricePerSqft.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Size</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{formData.area_sqft.toLocaleString()} sqft</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Amenities</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{selectedAmenities.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Property Details</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {propertyDetails.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                        <p className="mt-1 text-sm font-bold text-slate-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Valuation Range</h4>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={valuationChartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={formatShortPrice} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                          formatter={(value) => [`BDT ${Number(value).toLocaleString()}`, 'Price']}
                          cursor={{ fill: '#eef2ff' }}
                          contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)' }}
                        />
                        <Bar dataKey="price" fill="#4f46e5" radius={[10, 10, 4, 4]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-left">
                <div className="flex items-center gap-2 mb-5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Included Amenities</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map(([label]) => (
                    <span key={label as string} className="rounded-full bg-white border border-indigo-100 px-4 py-2 text-xs font-bold text-indigo-700">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
             
              
              <button 
                onClick={() => { setStep(1); setResult(null); setError(''); }}
                className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors py-2"
              >
                Reset Parameters and Re-Calculate
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-14 flex justify-between">
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-8 py-4 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-all outline-none"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 flex items-center gap-2.5 shadow-soft transition-all active:scale-95 outline-none"
            >
              Next Parameters <ChevronRight className="w-5 h-5" />
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 flex items-center gap-2.5 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 outline-none"
            >
              Run Neural Valuation <Sparkles className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
        <div className="p-2 bg-amber-100 rounded-lg h-fit">
          <Info className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Disclaimer</h4>
          <p className="text-sm text-amber-800 opacity-80">This prediction is based on statistical modeling and may not reflect the absolute market price. Always consult with a professional real estate agent before making financial decisions.</p>
        </div>
      </div> */}
    </motion.div>
  );
}
