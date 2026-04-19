import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`relative flex items-center gap-2 px-3 sm:px-6 py-3 rounded-3xl transition-all duration-500 font-bold group ${
          active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'
        }`}
      >
        {active && (
          <motion.div 
            layoutId="bubble"
            className="absolute inset-0 bg-slate-100 border border-slate-200/50 rounded-3xl z-0"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Icon className={`w-4 h-4 relative z-10 transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="text-sm relative z-10 tracking-tight hidden sm:inline">{label}</span>
      </Link>
    );
  };

  if (!currentUser) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 sm:p-8 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="pointer-events-auto flex items-center gap-2 bg-white/70 backdrop-blur-2xl border border-white/60 px-5 py-3 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 hover:scale-[1.02] active:scale-100"
      >
        <Link to="/dashboard" className="flex items-center gap-3 sm:gap-4 group px-2 sm:px-4 mr-1 sm:mr-2">
          <Logo className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900 group-hover:rotate-12 transition-transform duration-500" />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tighter text-slate-900 leading-none">
              Resume<span className="italic">IQ</span>
            </span>
            <span className="text-[0.55rem] sm:text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 hidden xs:inline">Intelligence</span>
          </div>
        </Link>

        <div className="h-8 w-[1px] bg-slate-200/60 mx-2" />

        <div className="flex items-center gap-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Nodes" />
          <NavItem to="/analyze" icon={Search} label="Analysis" />
        </div>

        <div className="h-8 w-[1px] bg-slate-200/60 mx-2" />

        <button 
          onClick={handleLogout}
          className="p-3.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-[1.5rem] transition-all duration-500 ml-1"
          title="Disconnect Intelligence"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.nav>
    </div>
  );
}
