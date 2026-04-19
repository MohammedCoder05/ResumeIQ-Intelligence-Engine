import { useState } from 'react';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { matchJobDescription } from '../utils/matcher';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobMatcher({ resumeText, jobDescription, setJobDescription }) {
  const [matchResult, setMatchResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleMatch = () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    // Simulate slight delay to make analysis tool feel weighty and intelligent visually
    setTimeout(() => {
      const result = matchJobDescription(resumeText, jobDescription);
      setMatchResult(result);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="taste-card bg-white p-10 group">
      <div className="flex items-center gap-5 mb-10">
        <div className="bg-emerald-500 p-3.5 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Job Target Alignment</h3>
          <p className="text-slate-500 font-medium text-lg mt-1 tracking-tight">Paste a raw target job description to mathematically verify keyword resonance.</p>
        </div>
      </div>

      <div className="space-y-8">
        <textarea
          className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-[2rem] p-8 min-h-[160px] outline-none transition-all duration-500 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white focus:shadow-xl focus:shadow-emerald-500/10 resize-y text-lg placeholder:text-slate-400 font-medium"
          placeholder="Paste the full job description text here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        
        <div className="flex justify-end">
          <button 
            onClick={handleMatch}
            disabled={isAnalyzing || !jobDescription.trim()}
            className={`px-8 py-4 rounded-[1.5rem] font-black text-lg tracking-tight transition-all duration-300 shadow-lg ${
              isAnalyzing || !jobDescription.trim() 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:-translate-y-1 hover:shadow-emerald-500/30'
            }`}
          >
            {isAnalyzing ? 'Processing Layouts...' : 'Compare Telemetry'}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
      {matchResult && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-12 pt-12 border-t border-slate-100"
        >
          <div className="mb-10 flex items-center justify-between">
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Match Confidence</h4>
            <div className="flex items-end gap-2">
              <span className={`text-6xl font-black tracking-tighter drop-shadow-sm ${matchResult.matchScore >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {matchResult.matchScore}
              </span>
              <span className="text-slate-400 font-bold uppercase tracking-widest text-lg pb-1">%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-inner">
              <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Verified Hits
              </h5>
              <div className="flex flex-wrap gap-2.5">
                {matchResult.matchedKeywords.length === 0 ? (
                  <span className="text-slate-500 font-medium">No verified matches generated.</span>
                ) : (
                  matchResult.matchedKeywords.map((kw, i) => (
                    <motion.span 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="px-5 py-2.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl border border-emerald-200/50 shadow-sm text-sm tracking-tight"
                    >
                      {kw}
                    </motion.span>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-red-50/50 p-8 rounded-[2rem] border border-red-100">
              <h5 className="flex items-center gap-3 text-sm font-black text-red-400 uppercase tracking-widest mb-6 border-b border-red-100 pb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Missing Parameters
              </h5>
              <div className="flex flex-wrap gap-2.5">
                {matchResult.missingKeywords.length === 0 ? (
                  <span className="text-red-500 font-medium">All major constraints successfully cleared!</span>
                ) : (
                  matchResult.missingKeywords.map((kw, i) => (
                    <motion.span 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="px-5 py-2.5 bg-white text-red-600 font-bold rounded-xl border border-red-200 shadow-sm text-sm tracking-tight"
                    >
                      {kw}
                    </motion.span>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
