import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineSparkles, HiOutlineCalendar, HiOutlineCurrencyDollar, 
  HiOutlineHeart, HiOutlineCheckCircle, HiOutlineArrowDownTray,
  HiOutlineBookmark
} from 'react-icons/hi2';
import { aiAPI, tripsAPI } from '../api';
import toast from 'react-hot-toast';

export default function AITripPlannerPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  // Read destination from location.state (from DestinationDetailsPage) or searchParams fallback
  const passedDestination = location.state?.destination;
  const initialDestinationName = passedDestination?.name || searchParams.get('dest') || '';
  
  const [formData, setFormData] = useState({
    destination: initialDestinationName,
    duration_days: 7,
    budget: passedDestination?.average_cost || 1500,
    travel_style: 'cultural',
    interests: []
  });

  const travelStyles = ['cultural', 'adventure', 'luxury', 'budget', 'relaxing', 'family'];
  const interestOptions = ['history', 'food', 'nature', 'nightlife', 'art', 'shopping', 'hiking'];

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    try {
      const res = await aiAPI.generateTrip(formData);
      setPlan(res.data);
      toast.success("Itinerary generated successfully!");
    } catch (err) {
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan?.id) return;
    try {
      await tripsAPI.save(plan.id);
      toast.success("Trip plan saved to your profile!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save trip");
    }
  };

  return (
    <div className="page-container pt-24 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">AI Trip <span className="gradient-text">Planner</span></h1>
          <p className="text-white/40">Crafting your perfect journey with artificial intelligence</p>
        </motion.div>

        {/* Input Form */}
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleGenerate}
          className="glass p-8 mb-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-white/50 block mb-2">Where to?</label>
              <input 
                type="text" 
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="input-field" 
                placeholder="e.g. Kyoto, Japan"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-2">How many days?</label>
              <input 
                type="number" 
                value={formData.duration_days}
                onChange={(e) => setFormData({...formData, duration_days: parseInt(e.target.value)})}
                className="input-field" 
                min="1" max="14"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-2">Budget (USD)</label>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input 
                  type="number" 
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                  className="input-field !pl-12" 
                  placeholder="1500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-2">Travel Style</label>
              <select 
                value={formData.travel_style}
                onChange={(e) => setFormData({...formData, travel_style: e.target.value})}
                className="input-field"
              >
                {travelStyles.map(s => <option key={s} value={s} className="bg-navy-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/50 block mb-3">Your Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                    formData.interests.includes(interest)
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {interest.charAt(0).toUpperCase() + interest.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <><HiOutlineSparkles className="w-5 h-5" /> Generate My Itinerary</>
            )}
          </button>
        </motion.form>

        {/* Plan Output */}
        <AnimatePresence mode="wait">
          {plan && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-8"
            >
              <div className="glass-strong p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 flex gap-2">
                  <button onClick={handleSave} className="p-2 bg-white/10 hover:bg-cyan-500/20 rounded-lg transition-colors text-cyan-400">
                    <HiOutlineBookmark className="w-6 h-6" />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/60">
                    <HiOutlineArrowDownTray className="w-6 h-6" />
                  </button>
                </div>
                <h2 className="text-3xl font-display font-bold mb-3">{plan.title}</h2>
                <p className="text-white/60 mb-6 max-w-2xl mx-auto">{plan.summary}</p>
                <div className="flex flex-wrap justify-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-xs text-white/30 uppercase font-bold tracking-wider">Est. Cost</span>
                    <span className="text-2xl font-bold text-green-400">${plan.total_estimated_cost}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/30 uppercase font-bold tracking-wider">Style</span>
                    <span className="text-2xl font-bold text-cyan-400 capitalize">{formData.travel_style}</span>
                  </div>
                </div>
              </div>

              {/* Day by Day */}
              <div className="space-y-6">
                {plan.daily_plan.map((day, idx) => (
                  <motion.div 
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass overflow-hidden"
                  >
                    <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center font-bold text-cyan-400">
                          {day.day}
                        </div>
                        <span className="text-lg font-bold">Day {day.day}</span>
                      </div>
                      <span className="text-sm text-white/40 font-bold tracking-wider uppercase">${day.estimated_cost}</span>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Morning</span>
                        <p className="text-white/70 text-sm leading-relaxed">{day.morning}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Afternoon</span>
                        <p className="text-white/70 text-sm leading-relaxed">{day.afternoon}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Evening</span>
                        <p className="text-white/70 text-sm leading-relaxed">{day.evening}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="glass p-8 bg-gradient-to-br from-navy-900 to-navy-950">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-cyan-400" /> Professional Travel Tips
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/60 text-sm bg-white/5 p-4 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
