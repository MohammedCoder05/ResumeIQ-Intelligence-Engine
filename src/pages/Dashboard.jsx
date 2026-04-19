import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { FileText, Calendar, ChevronRight, Activity, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { resumes, loading, deleteResume } = useResume();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteResume(resumeToDelete.id);
      toast.success('Resume permanently eradicated.');
      setDeleteModalOpen(false);
      setResumeToDelete(null);
    } catch (err) {
      toast.error('Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  const averageScore = resumes?.length 
    ? Math.round(resumes.reduce((acc, r) => acc + (r.score || 0), 0) / resumes.length) 
    : 0;

  const formatDate = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return 'Just now';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }).format(timestamp.toDate());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
      className="space-y-12 max-w-5xl mx-auto"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-4 gap-6">
        <div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter drop-shadow-sm">Dashboard</h1>
          <p className="text-slate-500 mt-3 font-semibold tracking-tight text-base sm:text-lg">
            Welcome back, <span className="text-slate-900 font-bold">{currentUser?.email}</span>
          </p>
        </div>
        <Link 
          to="/analyze" 
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-3xl font-bold tracking-tight transition-all taste-shadow hover:-translate-y-1 inline-flex items-center gap-3"
        >
          <Activity className="w-5 h-5" />
          New Analysis
        </Link>
      </header>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="taste-card flex flex-col justify-center items-center relative overflow-hidden group min-h-[220px]"
        >
           <div className="relative z-10 text-center">
             <p className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm leading-none">{resumes?.length || 0}</p>
             <h3 className="text-slate-400 font-black tracking-[0.15em] mt-6 uppercase text-[0.65rem]">Intelligence Capacity</h3>
           </div>
           {/* Deco Blob (Neutralized) */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2"></div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="taste-card col-span-2 flex flex-col justify-center items-start relative overflow-hidden group min-h-[220px]"
        >
           <div className="relative z-10 flex items-baseline gap-2">
             <p className="text-7xl sm:text-9xl font-black text-slate-900 tracking-tighter drop-shadow-sm leading-none">
               {averageScore > 0 ? `${averageScore}` : '--'}
             </p>
             {averageScore > 0 && <span className="text-2xl sm:text-4xl font-black text-slate-200 tracking-tighter">/100</span>}
           </div>
           <h3 className="text-slate-400 font-black tracking-[0.15em] mt-6 uppercase text-[0.65rem] relative z-10">Neural Compatibility Index</h3>
           
           {/* Abstract Data Waveform deco */}
           <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-50 pointer-events-none z-0">
             <Activity className="w-64 h-64 rotate-12 opacity-40 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-1000" />
           </div>
           
           {/* Background Gradient */}
           <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/50 z-0"></div>
        </motion.div>
      </div>

      <section>
        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter drop-shadow-sm line-clamp-1">Recent Intelligence Stream</h2>
        {loading ? (
          <div className="grid gap-5 w-full">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse taste-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 w-full">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl shrink-0"></div>
                  <div className="space-y-3 w-full">
                    <div className="h-5 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-100 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center rounded-[3rem] border border-slate-200 border-dashed bg-white/40 backdrop-blur-sm flex flex-col items-center shadow-inner relative overflow-hidden"
          >
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm mb-10 border border-slate-100 relative z-10">
               <Logo className="w-20 h-20 text-slate-200" />
            </div>
            <p className="text-slate-900 font-black text-4xl mb-4 tracking-tighter relative z-10">Static Intelligence Node</p>
            <p className="text-slate-500 font-semibold mb-12 text-xl max-w-sm mx-auto leading-relaxed relative z-10">Your neural data stream is currently empty. Initialize your first document to begin analysis.</p>
            <Link to="/analyze" className="group relative z-10 text-white tracking-tight font-black bg-slate-900 hover:bg-slate-800 px-10 py-5 rounded-3xl transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-4">
              Launch Analysis Engine <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] z-0 pointer-events-none"></div>
          </motion.div>
        ) : (
          <div className="grid gap-5 w-full">
            <AnimatePresence>
              {resumes.map(resume => (
                <motion.div 
                  layout
                  layoutId={resume.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  key={resume.id} 
                  className="bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer group"
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-slate-50 group-hover:bg-slate-100 p-5 rounded-3xl transition-colors duration-500 border border-slate-100 group-hover:border-slate-200">
                      <FileText className="w-7 h-7 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <div className="flex flex-col justify-center h-16">
                      <h4 className="text-slate-900 font-black tracking-tight text-xl group-hover:text-slate-700 transition-colors line-clamp-1">
                        {resume.fileName}
                      </h4>
                      <div className="flex items-center text-xs font-bold text-slate-400 gap-5 mt-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(resume.createdAt)}
                        </span>
                        {resume.score && (
                          <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm"></span>
                            Score: {resume.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link 
                      to="/analyze" 
                      state={{ resumeToLoad: resume }}
                      className="text-slate-900 font-bold text-sm px-6 py-3 bg-white border border-slate-200 hover:border-slate-400 shadow-sm rounded-2xl transition-all hover:shadow-md active:scale-95 whitespace-nowrap h-fit"
                    >
                      Re-Analyze
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeToDelete(resume);
                        setDeleteModalOpen(true);
                      }}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm hover:shadow-md"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="text-slate-200 group-hover:text-slate-900 transition-colors hidden sm:block pl-2">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Premium Deletion Modal */}
      <AnimatePresence>
        {deleteModalOpen && resumeToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl"
            onClick={() => { if(!isDeleting) { setDeleteModalOpen(false); setResumeToDelete(null); } }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-200/60 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-sm border border-red-100">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-2">Eradicate Node?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Are you absolutely sure you want to permanently delete
                <strong className="font-black text-slate-900 break-all block my-4 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
                  {resumeToDelete.fileName}
                </strong>
                This action cannot be undone.
              </p>
              
              <div className="flex w-full gap-4">
                <button 
                  onClick={() => { setDeleteModalOpen(false); setResumeToDelete(null); }}
                  disabled={isDeleting}
                  className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-red-500/20 disabled:opacity-50"
                >
                  {isDeleting ? 'Erasing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
