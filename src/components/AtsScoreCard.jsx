import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { analyzeResume } from '../utils/scoringEngine';
import { generateResumeRecommendations } from '../utils/aiClient';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AtsScoreCard({ parsedText }) {
  const [aiRecs, setAiRecs] = useState([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const fetchAiRecs = async () => {
    setIsGeneratingAi(true);
    try {
      const recs = await generateResumeRecommendations(parsedText);
      setAiRecs(recs);
      toast.success('AI Insights Extracted');
    } catch (err) {
      console.error(err);
      toast.error(`Fatal AI Error: ${err.message}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const analysis = useMemo(() => {
    if (!parsedText) return null;
    return analyzeResume(parsedText);
  }, [parsedText]);

  if (!analysis) return null;

  return (
    <div className="p-8 sm:p-14">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 border-b border-slate-100 pb-10 md:pb-14 mb-10 md:mb-14">
        <div className="flex flex-col items-center justify-center relative shrink-0">
          <svg className="w-40 h-40 sm:w-56 sm:h-56 transform -rotate-90 filter drop-shadow-sm">
            <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
            <motion.circle 
              initial={{ strokeDashoffset: 641 }}
              animate={{ strokeDashoffset: 641 - (641 * analysis.overallScore) / 100 }}
              transition={{ duration: 1.5, type: "spring", stiffness: 40 }}
              cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" 
              strokeDasharray="641" 
              className="text-slate-900" 
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter">{analysis.overallScore}</span>
            <span className="text-slate-400 font-bold uppercase text-[0.6rem] sm:text-xs tracking-widest mt-1">/ 100</span>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <span className="px-4 py-1.5 bg-slate-100 text-slate-700 font-bold tracking-tight text-sm rounded-full mb-6 inline-block border border-slate-200">Algorithmic Assessment</span>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-4 sm:mb-6 leading-tight">ATS Integrity Matrix</h3>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
             Your core document parameters have been successfully verified against standard tracking heuristics. Focus heavily on expanding impact verbs to elevate this index score directly into the top 5%.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200/60 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Optimization Geometry</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-5">
              {analysis.sectionScores.length === 100 ? <div className="p-2 bg-emerald-100 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div> : <div className="p-2 bg-red-100 rounded-xl"><XCircle className="w-5 h-5 text-red-600" /></div>}
              <div>
                <p className="font-bold text-slate-900 text-xl tracking-tight">Length Analysis <span className="text-slate-400">({analysis.metrics?.wordCount || 0} words)</span></p>
                <p className="text-slate-500 font-medium mt-1 leading-relaxed">Algorithms confidently prioritize specific document lengths between 350 and 800 words to maximize readability.</p>
              </div>
            </li>
            <li className="flex items-start gap-5">
              {analysis.sectionScores.keywords === 100 ? <div className="p-2 bg-emerald-100 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div> : <div className="p-2 bg-amber-100 rounded-xl"><AlertCircle className="w-5 h-5 text-amber-600" /></div>}
              <div>
                <p className="font-bold text-slate-900 text-xl tracking-tight">Keyword Saturation</p>
                <p className="text-slate-500 font-medium mt-1 leading-relaxed">Assesses the strict frequency velocity of recognizable technical and core soft-skill parameters.</p>
              </div>
            </li>
          </ul>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200/60 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Structural Integrity</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-5">
              {analysis.sectionScores.sections === 100 ? (
                <div className="p-2 bg-emerald-100 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
              ) : (
                <div className="p-2 bg-red-100 rounded-xl"><XCircle className="w-5 h-5 text-red-600" /></div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-xl tracking-tight">Detection Heuristics</p>
                <p className="text-slate-500 font-medium mt-1 leading-relaxed">Tracking parsers require perfectly distinct layout zones for Education and Experience data pools.</p>
              </div>
            </li>
            <li className="flex items-start gap-5">
              {analysis.sectionScores.actionVerbs === 100 ? <div className="p-2 bg-emerald-100 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div> : <div className="p-2 bg-amber-100 rounded-xl"><AlertCircle className="w-5 h-5 text-amber-600" /></div>}
              <div>
                <p className="font-bold text-slate-900 text-xl tracking-tight">Vanguard Vocabulary</p>
                <p className="text-slate-500 font-medium mt-1 leading-relaxed">Utilizing aggressive action verbs at the start of bullets drastically amplifies hiring manager conversion metrics.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-12 p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5">
            <h4 className="font-black text-2xl sm:text-3xl tracking-tighter flex flex-wrap items-center gap-4 drop-shadow-sm">
              Intelligence Context
              {aiRecs.length > 0 && <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-slate-800 border border-slate-700 rounded-full text-[0.6rem] sm:text-xs uppercase tracking-widest">{aiRecs.length} extracted goals</span>}
            </h4>
            <button
              onClick={fetchAiRecs}
              disabled={isGeneratingAi}
              className="flex items-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isGeneratingAi ? (
                <>Parsing Model <Sparkles className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Generate AI Insights <Sparkles className="w-5 h-5" /></>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {aiRecs.length > 0 ? (
              <motion.ul 
                key="ai-recs"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="pl-6 space-y-5 text-slate-100 font-semibold text-lg list-disc marker:text-slate-500"
              >
                {aiRecs.map((s, i) => (
                  <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="leading-relaxed">{s}</motion.li>
                ))}
              </motion.ul>
            ) : analysis.suggestions?.length > 0 ? (
              <motion.div key="heuristics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-slate-400 mb-6 font-bold uppercase text-xs tracking-widest">Base Algorithmic Warnings</p>
                <ul className="pl-6 space-y-4 text-slate-200 font-medium text-lg list-disc marker:text-slate-500">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="leading-relaxed">{s}</li>
                  ))}
                </ul>
              </motion.div>
            ) : (
               <motion.p key="perfect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-300 font-bold tracking-tight text-lg mt-4">
                 All algorithmic tracking variables cleared successfully. Launch the AI Insight generator for contextual analysis.
               </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        {/* Abstract Geometry (Neutralized) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-800 rounded-full blur-[80px] opacity-60 -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>
      </motion.div>
    </div>
  );
}
