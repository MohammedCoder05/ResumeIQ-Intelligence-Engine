import { useState } from 'react';
import { BrainCircuit, Sparkles, ChevronDown, ChevronUp, Copy, Terminal } from 'lucide-react';
import { predictInterviewQuestions } from '../utils/aiClient';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function InterviewPredictor({ resumeText, jobDescription }) {
  const [questions, setQuestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handlePredict = async () => {
    if (!jobDescription.trim()) {
      toast.error("Telemetry Missing: Please input a Job Description above.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await predictInterviewQuestions(resumeText, jobDescription);
      setQuestions(result);
      toast.success("Intelligence Synchronized: 5 Scenarios Extracted");
    } catch (err) {
      console.error(err);
      toast.error(`Neural Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Response Cloned to Buffer");
  };

  return (
    <div className="taste-card bg-white p-10 group overflow-hidden relative border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="bg-emerald-500 p-3.5 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Behavioral Predictor</h3>
            <p className="text-slate-500 font-medium text-lg mt-1 tracking-tight">Generate high-fidelity interview scenarios based on your current telemetry.</p>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={isAnalyzing}
          className={`flex items-center gap-3 px-10 py-5 rounded-[1.5rem] font-black text-lg tracking-tight transition-all duration-500 shadow-lg ${
            isAnalyzing 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
              : !jobDescription.trim()
                ? 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:-translate-y-1 hover:shadow-emerald-500/30'
          }`}
        >
          {isAnalyzing ? (
            <>Synthesizing Model <Sparkles className="w-5 h-5 animate-spin" /></>
          ) : (
            <>Predict Scenarios <Terminal className="w-5 h-5" /></>
          )}
        </button>
      </div>

      <div className="space-y-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {questions.length > 0 ? (
            questions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50/50 border border-slate-200/60 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-emerald-50/30 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <span className="bg-emerald-100 text-emerald-700 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-widest mt-1">Scenario {index + 1}</span>
                    <p className="text-xl font-bold text-slate-900 tracking-tight leading-relaxed pr-8">{item.question}</p>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {expandedIndex === index ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-12 pb-10 border-t border-slate-100 pt-8">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-2">
                            Precision Response established <Sparkles className="w-3 h-3" />
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(item.response); }}
                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Copy to buffer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-slate-600 text-lg font-medium leading-relaxed italic border-l-4 border-emerald-500/20 pl-8 ml-2">
                          "{item.response}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : !isAnalyzing && (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <BrainCircuit className="w-16 h-16 text-slate-200" />
                <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full"></div>
              </div>
              <p className="font-bold text-slate-400 tracking-tight text-xl max-w-sm leading-relaxed">
                <span className="text-slate-900 block mb-2 font-black">Awaiting Intelligence Sync</span>
                Initialize telemetry matching in the module above to generate predictive interview models.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {isAnalyzing && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-50 overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          ></motion.div>
        </div>
      )}
    </div>
  );
}
