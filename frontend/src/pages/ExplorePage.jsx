import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { destinationsAPI } from '../api';
import DestinationCard from '../components/DestinationCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';

const categories = ['All', 'beach', 'mountain', 'historic', 'urban'];
const seasons = ['All', 'Spring', 'Summer', 'Fall', 'Winter'];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('All');
  const [season, setSeason] = useState('All');
  const [maxBudget, setMaxBudget] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.query = query;
      if (category !== 'All') params.category = category;
      if (maxBudget) params.budget = maxBudget;
      
      const res = await destinationsAPI.search(params);
      let data = res.data;
      if (season !== 'All') {
        data = data.filter(d => d.best_season?.toLowerCase() === season.toLowerCase());
      }
      setDestinations(data);
    } catch {
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDestinations(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDestinations();
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setSeason('All');
    setMaxBudget('');
    setTimeout(fetchDestinations, 0);
  };

  return (
    <div className="page-container pt-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title">Explore <span className="gradient-text">Destinations</span></h1>
        <p className="text-white/40">Discover amazing places around the world</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field !pl-12"
              placeholder="Search destinations..."
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <HiOutlineFunnel className="w-4 h-4" /> Filters
          </button>
        </form>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="glass p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white/60">Filter Options</h3>
              <button onClick={clearFilters} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <HiOutlineXMark className="w-3 h-3" /> Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field text-sm">
                  {categories.map(c => <option key={c} value={c} className="bg-navy-900">{c === 'All' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Best Season</label>
                <select value={season} onChange={(e) => setSeason(e.target.value)} className="input-field text-sm">
                  {seasons.map(s => <option key={s} value={s} className="bg-navy-900">{s === 'All' ? 'All Seasons' : s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Max Budget (USD)</label>
                <input type="number" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="input-field text-sm" placeholder="e.g. 2000" />
              </div>
            </div>

            <button onClick={fetchDestinations} className="btn-primary text-sm">Apply Filters</button>
          </motion.div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : destinations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-lg">No destinations found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
