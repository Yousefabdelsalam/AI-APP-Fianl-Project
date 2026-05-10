import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineBookmark, HiOutlineTrash, HiOutlineEye, 
  HiOutlineMap, HiOutlineCalendar, HiOutlineCurrencyDollar
} from 'react-icons/hi2';
import { tripsAPI } from '../api';
import toast from 'react-hot-toast';

export default function SavedTripsPage() {
  const [savedTrips, setSavedTrips] = useState([]);
  const [generatedPlans, setGeneratedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'generated'

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const [saved, generated] = await Promise.all([
        tripsAPI.myTrips(),
        tripsAPI.myPlans()
      ]);
      setSavedTrips(saved.data);
      setGeneratedPlans(generated.data);
    } catch (err) {
      toast.error("Failed to load your trips.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await tripsAPI.delete(id);
      toast.success("Trip removed.");
      fetchTrips();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="page-container pt-24 min-h-screen pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-title">Your <span className="gradient-text">Trips</span></h1>
        <p className="text-white/40">Manage your saved experiences and AI-generated itineraries</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('saved')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'saved' ? 'bg-cyan-500 text-navy-950 shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Saved Trips ({savedTrips.length})
        </button>
        <button 
          onClick={() => setActiveTab('generated')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'generated' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          Generated Plans ({generatedPlans.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === 'saved' ? (
            savedTrips.length > 0 ? savedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip.trip_plan} onRemove={() => handleDelete(trip.id)} />
            )) : <EmptyState message="No saved trips yet. Explore destinations to save them!" />
          ) : (
            generatedPlans.length > 0 ? generatedPlans.map((plan) => (
              <TripCard key={plan.id} trip={plan} hideRemove />
            )) : <EmptyState message="You haven't generated any AI trip plans yet." />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TripCard({ trip, onRemove, hideRemove }) {
  if (!trip) return null;
  return (
    <motion.div layout className="glass p-6 group relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center">
          <HiOutlineMap className="w-6 h-6 text-cyan-400" />
        </div>
        {!hideRemove && (
          <button onClick={onRemove} className="p-2 text-white/20 hover:text-red-400 transition-colors">
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        )}
      </div>

      <h3 className="text-xl font-display font-bold mb-1 truncate">{trip.title}</h3>
      <p className="text-white/40 text-sm mb-6 flex items-center gap-1">
        {trip.destination}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase font-bold mb-1">
            <HiOutlineCalendar className="w-3 h-3" /> Duration
          </div>
          <p className="font-bold text-sm">{trip.duration_days} Days</p>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase font-bold mb-1">
            <HiOutlineCurrencyDollar className="w-3 h-3" /> Budget
          </div>
          <p className="font-bold text-sm text-green-400">${trip.budget}</p>
        </div>
      </div>

      <button className="w-full btn-secondary flex items-center justify-center gap-2 text-sm !py-2.5">
        <HiOutlineEye className="w-4 h-4" /> View Details
      </button>
    </motion.div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="col-span-full py-20 text-center glass border-dashed">
      <HiOutlineBookmark className="w-12 h-12 text-white/10 mx-auto mb-4" />
      <p className="text-white/30">{message}</p>
    </div>
  );
}
