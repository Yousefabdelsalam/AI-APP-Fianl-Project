import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineCurrencyDollar, HiOutlineCalculator, HiOutlineLightBulb,
  HiOutlineHome, HiOutlineCake, HiOutlineTruck, HiOutlineTicket,
  HiOutlineArrowPath
} from 'react-icons/hi2';
import { aiAPI } from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

export default function BudgetEstimatorPage() {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    duration_days: 7,
    hotel_type: 'medium',
    food_style: 'local',
    activities_level: 'medium'
  });

  const handleEstimate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiAPI.estimateBudget(formData);
      setBudget(res.data);
    } catch (err) {
      toast.error("Failed to calculate budget.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = budget ? [
    { name: 'Accommodation', value: budget.hotel_cost, color: '#3b82f6', icon: HiOutlineHome },
    { name: 'Food', value: budget.food_cost, color: '#ec4899', icon: HiOutlineCake },
    { name: 'Transport', value: budget.transport_cost, color: '#eab308', icon: HiOutlineTruck },
    { name: 'Activities', value: budget.activities_cost, color: '#06b6d4', icon: HiOutlineTicket },
  ] : [];

  return (
    <div className="page-container pt-24 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="section-title">Budget <span className="gradient-text">Estimator</span></h1>
          <p className="text-white/40">Financial intelligence for your global travels</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
            <form onSubmit={handleEstimate} className="glass p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Destination</label>
                <input type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="input-field" placeholder="e.g. Switzerland" required />
              </div>
              <div>
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Duration (Days)</label>
                <input type="number" value={formData.duration_days} onChange={(e) => setFormData({...formData, duration_days: parseInt(e.target.value)})} className="input-field" required />
              </div>
              <div>
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Hotel Style</label>
                <select value={formData.hotel_type} onChange={(e) => setFormData({...formData, hotel_type: e.target.value})} className="input-field">
                  <option value="budget" className="bg-navy-900">Budget (Hostels/Guesthouses)</option>
                  <option value="medium" className="bg-navy-900">Standard (3-4 Star Hotels)</option>
                  <option value="luxury" className="bg-navy-900">Luxury (5 Star Resorts)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Dining</label>
                <select value={formData.food_style} onChange={(e) => setFormData({...formData, food_style: e.target.value})} className="input-field">
                  <option value="local" className="bg-navy-900">Local & Street Food</option>
                  <option value="medium" className="bg-navy-900">Mixed Restaurants</option>
                  <option value="fine" className="bg-navy-900">Fine Dining</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-4">
                {loading ? <HiOutlineArrowPath className="w-6 h-6 animate-spin" /> : <><HiOutlineCalculator className="w-5 h-5" /> Calculate Estimate</>}
              </button>
            </form>
          </motion.div>

          {/* Visualization */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {budget ? (
                <motion.div key="budget" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Box */}
                    <div className="glass-strong p-8 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Estimated Total</span>
                      <h2 className="text-5xl font-display font-bold mb-2">${budget.total_cost}</h2>
                      <p className="text-white/40 text-sm">For {formData.duration_days} days in {formData.destination}</p>
                    </div>

                    {/* Chart Box */}
                    <div className="glass p-6 h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%" cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0a1633', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Breakdown List */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {chartData.map((item, idx) => (
                      <div key={idx} className="glass p-4 border-l-4" style={{ borderColor: item.color }}>
                        <div className="flex items-center gap-2 text-white/40 mb-1">
                          <item.icon className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-bold tracking-tighter">{item.name}</span>
                        </div>
                        <p className="text-xl font-bold">${item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Saving Tips */}
                  <div className="glass p-6 bg-gradient-to-br from-navy-900 to-navy-950">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <HiOutlineLightBulb className="text-gold-400" /> AI Money-Saving Tips
                    </h3>
                    <div className="space-y-3">
                      {budget.saving_tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-white/60 bg-white/5 p-3 rounded-xl">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center text-white/20">
                   <HiOutlineCurrencyDollar className="w-16 h-16 mb-6 opacity-20" />
                   <h3 className="text-xl font-display font-bold">Waiting for Input</h3>
                   <p className="text-sm">Enter destination details to see a complete AI financial breakdown.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
