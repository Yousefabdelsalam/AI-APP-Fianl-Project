import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { tripsAPI, destinationsAPI } from '../api';
import DestinationCard from '../components/DestinationCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import {
  HiOutlineMap, HiOutlineBookmark, HiOutlineSparkles,
  HiOutlineArrowRight, HiOutlineGlobeAlt, HiOutlineClock
} from 'react-icons/hi2';

export default function DashboardPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tripsAPI.myPlans().catch(() => ({ data: [] })),
      tripsAPI.myTrips().catch(() => ({ data: [] })),
      destinationsAPI.list(0, 4).catch(() => ({ data: [] })),
    ]).then(([p, s, d]) => {
      setPlans(p.data);
      setSavedTrips(s.data);
      setDestinations(d.data);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Trip Plans', value: plans.length, icon: HiOutlineMap, color: 'from-cyan-400 to-blue-500' },
    { label: 'Saved Trips', value: savedTrips.length, icon: HiOutlineBookmark, color: 'from-purple-400 to-pink-500' },
    { label: 'Destinations', value: destinations.length, icon: HiOutlineGlobeAlt, color: 'from-green-400 to-emerald-500' },
  ];

  return (
    <div className="page-container pt-24">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Traveler'}</span>
        </h1>
        <p className="text-white/40">Here's an overview of your travel activities</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card p-5 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-white/40">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link to="/planner" className="glass-card p-5 flex items-center gap-3 group">
          <HiOutlineSparkles className="w-8 h-8 text-cyan-400" />
          <div>
            <p className="font-semibold group-hover:text-cyan-400 transition-colors">Generate Trip</p>
            <p className="text-xs text-white/40">AI-powered planning</p>
          </div>
          <HiOutlineArrowRight className="w-5 h-5 text-white/30 ml-auto group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link to="/chat" className="glass-card p-5 flex items-center gap-3 group">
          <HiOutlineSparkles className="w-8 h-8 text-purple-400" />
          <div>
            <p className="font-semibold group-hover:text-purple-400 transition-colors">Ask AI Guide</p>
            <p className="text-xs text-white/40">Travel questions</p>
          </div>
          <HiOutlineArrowRight className="w-5 h-5 text-white/30 ml-auto group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link to="/budget" className="glass-card p-5 flex items-center gap-3 group">
          <HiOutlineSparkles className="w-8 h-8 text-green-400" />
          <div>
            <p className="font-semibold group-hover:text-green-400 transition-colors">Estimate Budget</p>
            <p className="text-xs text-white/40">Cost breakdown</p>
          </div>
          <HiOutlineArrowRight className="w-5 h-5 text-white/30 ml-auto group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Plans */}
      {plans.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold">Recent Trip Plans</h2>
            <Link to="/saved" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.slice(0, 4).map((plan, i) => (
              <motion.div
                key={plan.id}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                    <p className="text-white/40 text-sm">{plan.destination} • {plan.duration_days} days</p>
                  </div>
                  <span className="text-cyan-400 font-bold">${plan.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <HiOutlineClock className="w-3 h-3" />
                  {new Date(plan.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Destinations */}
      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : destinations.length > 0 ? (
        <div>
          <h2 className="text-xl font-display font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
