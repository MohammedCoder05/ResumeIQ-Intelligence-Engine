import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ResumeUploader from '../components/ResumeUploader';
import AtsScoreCard from '../components/AtsScoreCard';
import JobMatcher from '../components/JobMatcher';
import InterviewPredictor from '../components/InterviewPredictor';
import AiRewriteEngine from '../components/AiRewriteEngine';
import { useResume } from '../context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Analyze() {
  const location = useLocation();
  const { selectedResume, setSelectedResume, analysisResults, setAnalysisResults, analyzeResume } = useResume();
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (location.state?.resumeToLoad) {
      const resume = location.state.resumeToLoad;
      setSelectedResume(resume);
      
      if (resume.analysis) {
        setAnalysisResults(resume.analysis);
      } else if (resume.parsedText) {
        // Trigger a slight visual delay to match the premium processing animations before injecting state
        setTimeout(() => {
          setAnalysisResults(analyzeResume(resume.parsedText));
        }, 800);
      }
    }
  }, [location.state, setSelectedResume, setAnalysisResults, analyzeResume]);

  const handleUploadComplete = (savedDoc) => {
    setSelectedResume(savedDoc);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-12"
    >
      <header className="text-center mb-10 sm:mb-16 pt-4 sm:pt-8 px-4">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 mb-6 drop-shadow-sm leading-tight">Analyze Intelligence</h1>
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium tracking-tight">
          Extract algorithms and leverage AI-powered metrics to instantly verify your document against screening gates.
        </p>
      </header>
      
      <AnimatePresence mode="wait">
      {!selectedResume ? (
        <motion.div 
          key="uploader"
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}
        >
           <ResumeUploader onUploadComplete={handleUploadComplete} />
        </motion.div>
      ) : (
        <motion.div 
          key="results"
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="space-y-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">Insights</h2>
              <p className="text-slate-500 font-bold mt-4 tracking-tight uppercase text-[0.65rem] sm:text-sm">
                Target File: <span className="text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 block sm:inline mt-2 sm:mt-0 max-w-xs truncate">{selectedResume.fileName}</span>
              </p>
            </div>
            <button 
              onClick={() => {
                setSelectedResume(null);
                setAnalysisResults(null);
              }}
              className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-slate-900 pb-1"
            >
              Analyze Another Output
            </button>
          </div>
          
          <div className="taste-card bg-white p-0 overflow-hidden shadow-2xl shadow-slate-900/5 border-slate-200">
            {analysisResults ? (
              <AtsScoreCard parsedText={selectedResume.parsedText} />
            ) : (
              <div className="p-24 flex flex-col justify-center items-center gap-6">
                 <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 border-l-slate-900 rounded-full animate-spin"></div>
                 <p className="font-bold tracking-tight text-slate-400">Running parsing geometries...</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-12">
            <JobMatcher resumeText={selectedResume.parsedText} jobDescription={jobDescription} setJobDescription={setJobDescription} />
            <InterviewPredictor resumeText={selectedResume.parsedText} jobDescription={jobDescription} />
            <AiRewriteEngine />
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  )
}
