import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlinePhoto, HiOutlineSparkles, HiOutlineArrowPath,
  HiOutlineArrowDownTray, HiOutlineEye
} from 'react-icons/hi2';
import { aiAPI } from '../api';
import toast from 'react-hot-toast';

export default function VirtualDestinationGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    style: 'realistic',
    time_of_day: 'day',
    description: ''
  });

  const styles = ['realistic', 'cinematic', 'watercolor', 'cyberpunk', 'vintage', 'anime'];
  const times = ['day', 'night', 'sunset', 'sunrise', 'golden hour'];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiAPI.virtualDestination(formData);
      setResult(res.data);
      toast.success("Virtual tour generated!");
    } catch (err) {
      toast.error("Generation failed. Check your API settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">Virtual <span className="gradient-text">Destination</span> Generator</h1>
          <p className="text-white/40">Visualise your next adventure before you even book it</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 space-y-6 h-fit"
          >
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Destination</label>
                <input 
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="input-field"
                  placeholder="e.g. Kyoto Temple Garden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Art Style</label>
                  <select 
                    value={formData.style}
                    onChange={(e) => setFormData({...formData, style: e.target.value})}
                    className="input-field"
                  >
                    {styles.map(s => <option key={s} value={s} className="bg-navy-900 capitalize">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Lighting</label>
                  <select 
                    value={formData.time_of_day}
                    onChange={(e) => setFormData({...formData, time_of_day: e.target.value})}
                    className="input-field"
                  >
                    {times.map(t => <option key={t} value={t} className="bg-navy-900 capitalize">{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-2">Atmosphere (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field min-h-[100px]"
                  placeholder="Describe the mood, specific elements, or artistic details..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
              >
                {loading ? <HiOutlineArrowPath className="w-6 h-6 animate-spin" /> : <><HiOutlineSparkles className="w-5 h-5" /> Generate Visual</>}
              </button>
            </form>
          </motion.div>

          {/* Output Display */}
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="glass-strong overflow-hidden relative group aspect-[4/3] shadow-2xl shadow-cyan-500/10">
                    <img 
                      src={result.image_url} 
                      alt="Generated Destination" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href={result.image_url} target="_blank" rel="noopener noreferrer" download className="btn-primary !p-3 rounded-full"><HiOutlineArrowDownTray className="w-6 h-6" /></a>
                    </div>
                  </div>

                  <div className="glass p-6">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">AI Vision Prompt</h3>
                    <p className="text-white/60 text-sm italic leading-relaxed mb-4">
                      "{result.prompt_used}"
                    </p>
                    <p className="text-xs text-white/30 uppercase tracking-widest">Model: {result.model_type || "Generative AI"}</p>
                    
                    <button 
                      onClick={handleGenerate} 
                      disabled={loading}
                      className="w-full mt-4 btn-secondary flex items-center justify-center gap-2 py-3"
                    >
                      {loading ? <HiOutlineArrowPath className="w-5 h-5 animate-spin" /> : <><HiOutlineArrowPath className="w-5 h-5" /> Regenerate Visual</>}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                    <HiOutlinePhoto className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white/40 mb-2">Ready to Imagine</h3>
                  <p className="text-white/20 text-sm">Enter a destination and select your preferred style to generate a virtual visual preview.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
