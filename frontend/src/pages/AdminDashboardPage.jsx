import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineUsers, HiOutlineGlobeAlt, HiOutlineMap, 
  HiOutlineChatBubbleLeft, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash 
} from 'react-icons/hi2';
import { adminAPI, destinationsAPI } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, destRes] = await Promise.all([
        adminAPI.stats(),
        destinationsAPI.list(0, 10)
      ]);
      setStats(statsRes.data);
      setDestinations(destRes.data);
    } catch (err) {
      toast.error("Access denied or server error.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: HiOutlineUsers, color: 'text-blue-400' },
    { label: 'Destinations', value: stats.total_destinations, icon: HiOutlineGlobeAlt, color: 'text-green-400' },
    { label: 'AI Plans', value: stats.total_trips, icon: HiOutlineMap, color: 'text-purple-400' },
    { label: 'Reviews', value: stats.total_reviews, icon: HiOutlineChatBubbleLeft, color: 'text-gold-400' },
  ] : [];

  const chartData = [
    { name: 'Users', count: stats?.total_users || 0 },
    { name: 'Destinations', count: stats?.total_destinations || 0 },
    { name: 'Trip Plans', count: stats?.total_trips || 0 },
    { name: 'Reviews', count: stats?.total_reviews || 0 },
  ];

  return (
    <div className="page-container pt-24 pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="section-title">Admin <span className="gradient-text">Dashboard</span></h1>
          <p className="text-white/40">System-wide overview and management</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Destination
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((s, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-bold">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart */}
        <div className="lg:col-span-8 glass p-8">
          <h3 className="text-xl font-display font-bold mb-6">Growth Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                <YAxis stroke="#ffffff40" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a1633', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Manage Table */}
        <div className="lg:col-span-12 glass overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-display font-bold">Manage Destinations</h3>
            <span className="text-xs text-white/30 font-bold uppercase tracking-widest">Showing Latest {destinations.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-bold text-white/40 tracking-widest">
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={dest.image_url} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-semibold text-sm">{dest.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">{dest.country}</td>
                    <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md capitalize text-xs">{dest.category}</span></td>
                    <td className="px-6 py-4 text-sm font-bold text-green-400">${dest.average_cost}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-white/20 hover:text-cyan-400 transition-colors"><HiOutlinePencil className="w-5 h-5" /></button>
                        <button className="p-2 text-white/20 hover:text-red-400 transition-colors"><HiOutlineTrash className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
