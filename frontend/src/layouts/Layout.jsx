import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'glass-strong !text-white !bg-navy-900 !border-white/10',
          duration: 4000,
        }}
      />
    </div>
  );
}
