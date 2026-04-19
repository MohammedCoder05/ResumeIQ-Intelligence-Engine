import { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, AlertCircle } from 'lucide-react';
import { rewriteBulletPoint } from '../utils/aiClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiRewriteEngine() {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setError('');
    
    try {
      const results = await rewriteBulletPoint(inputText);
      setSuggestions(results);
    } catch (err) {
      setError(err.message || 'An error occurred while communicating with the AI.');
      toast.error('AI Request Failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="taste-card p-10 relative overflow-hidden bg-white group border border-slate-100">
      <div className="flex items-center gap-5 mb-10">
        <div className="bg-slate-900 p-3.5 rounded-[1.5rem] shadow-xl shadow-slate-900/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">AI Phrase Reconstruction</h3>
          <p className="text-slate-500 font-medium text-lg mt-1 tracking-tight">Convert boring vocabulary into devastatingly effective success metrics.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="relative group/input">
           <textarea
            className="w-full bg-slate-50/50 border-2 border-slate-100 text-slate-900 rounded-[2rem] p-8 min-h-[160px] outline-none transition-all duration-500 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:shadow-xl focus:shadow-slate-900/5 resize-y text-lg placeholder:text-slate-400 font-medium"
            placeholder="Paste a weak bullet point here... e.g., 'Responsible for making sure the servers never went down and adding some features.'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-200 flex items-start gap-4 shadow-sm"
            >
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <p className="font-bold tracking-tight">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end">
          <button
            onClick={handleRewrite}
            disabled={isGenerating || !inputText.trim()}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-lg tracking-tight transition-all duration-300 shadow-xl ${
              isGenerating || !inputText.trim() 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-transparent' 
                : 'bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-1 hover:shadow-slate-900/20'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-3">Translating Parameters <Sparkles className="w-5 h-5 animate-spin" /></span>
            ) : (
              <span className="flex items-center gap-3">Optimize Text <ArrowRight className="w-5 h-5" /></span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {suggestions.length > 0 && !isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="mt-12 space-y-8 pt-12 border-t border-slate-100"
          >
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Optimized Variations</h4>
            <div className="grid gap-6">
              {suggestions.map((suggestion, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  key={i} 
                  onClick={() => {
                    navigator.clipboard.writeText(suggestion);
                    toast.success('Copied perfectly!');
                  }}
                  className="p-8 bg-white border-2 border-slate-50 rounded-[2rem] text-slate-800 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md gap-4"
                >
                  <span className="leading-relaxed font-semibold text-lg md:max-w-[85%]">{suggestion}</span>
                  <div className="bg-slate-900 shrink-0 px-6 py-3 rounded-xl border border-slate-800 text-white text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    Copy Node
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
