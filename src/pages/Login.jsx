import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileCheck2, ArrowRight, ShieldCheck, Lock, Fingerprint, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/dashboard');
      toast.success(isLogin ? 'Authentication Successful!' : 'Record Established!', { icon: '👋' });
    } catch (err) {
      console.error(err);
      toast.error('Authentication Error');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Branding Sidebar */}
      <div className="hidden md:flex w-2/5 bg-slate-900 relative overflow-hidden flex-col justify-between p-16">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-16">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <FileCheck2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">ResumeIQ</h1>
              <p className="text-white/40 text-[0.6rem] font-bold uppercase tracking-[0.3em]">Neural Analyzer</p>
            </div>
          </div>

          <div className="space-y-12 max-w-xs">
            <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">
              Unlock your career's <br/>
              <span className="text-white/40">hidden intelligence.</span>
            </h2>
            <p className="text-white/50 font-medium leading-relaxed">
              ResumeIQ utilizes advanced neural matching to align your professional identity with global industry benchmarks.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="relative z-10 flex flex-wrap gap-8"
        >
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
             <span className="text-white/40 text-xs font-black uppercase tracking-widest">AES-256 Secure</span>
          </div>
          <div className="flex items-center gap-3">
             <Fingerprint className="w-5 h-5 text-white/40" />
             <span className="text-white/40 text-xs font-black uppercase tracking-widest">Biometric Ready</span>
          </div>
          <div className="flex items-center gap-3">
             <Globe className="w-5 h-5 text-white/40" />
             <span className="text-white/40 text-xs font-black uppercase tracking-widest">Global Sync</span>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 py-16 relative bg-slate-50/30">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-4 mb-12">
            <div className="bg-slate-900 p-3 rounded-2xl">
              <FileCheck2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">ResumeIQ</h1>
          </div>

          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              {isLogin ? 'Welcome Back' : 'Join Intelligence'}
            </h3>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] mb-12">
              {isLogin ? 'Enter security protocol' : 'Establish new record node'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[0.65rem] font-black tracking-[0.2em] text-slate-400 mb-2 uppercase group-focus-within:text-slate-900 transition-colors">Protocol Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 outline-none transition-all duration-300 focus:border-slate-900 focus:shadow-xl focus:shadow-slate-900/5 placeholder:text-slate-300 font-bold tracking-tight text-lg"
                      placeholder="commander@resumeiq.dev"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[0.65rem] font-black tracking-[0.2em] text-slate-400 mb-2 uppercase group-focus-within:text-slate-900 transition-colors">Security Passcode</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 outline-none transition-all duration-300 focus:border-slate-900 focus:shadow-xl focus:shadow-slate-900/5 placeholder:text-slate-300 font-medium text-lg tracking-[0.2em]"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-slate-400 transition-colors" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-10 flex items-center justify-center gap-4 bg-slate-900 hover:bg-black text-white font-black text-xl tracking-tighter py-5 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Confirming...' : isLogin ? 'Authenticate' : 'Establish Node'}
                {!loading && <ArrowRight className="w-6 h-6" />}
              </button>
            </form>

            <div className="mt-12 text-center border-t border-slate-100 pt-10">
              <p className="text-slate-400 font-medium mb-4">
                {isLogin ? "New to the engine?" : "Node already exists?"}
              </p>
              <button 
                type="button"
                className="text-slate-900 hover:text-slate-600 tracking-tighter font-black text-lg transition-colors"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Establish your record →" : "Authenticate identity →"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="mt-20 flex items-center justify-between text-[0.6rem] font-black text-slate-300 uppercase tracking-[0.3em] max-w-md w-full mx-auto">
          <span>V1.0.8 // Alpha</span>
          <span>© 2026 Resume/Q Intelligence</span>
        </div>
      </div>
    </div>
  )
}
