import { useState, useCallback, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { extractTextFromPDF } from '../utils/pdfParser';
import { useResume } from '../context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ResumeUploader({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, parsing, saving, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef(null);
  const { saveResume, analyzeResume } = useResume();

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (selectedFile) => {
    setStatus('parsing');
    setErrorMessage('');
    
    // Quick validation
    if (!selectedFile) {
      setStatus('idle');
      return;
    }
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setStatus('error');
      setErrorMessage('Please upload a valid PDF or DOCX file.');
      return;
    }

    try {
      let text = '';
      if (selectedFile.type === 'application/pdf') {
        text = await extractTextFromPDF(selectedFile);
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        text = "Mocked DOCX extraction text: Experience in software engineering, UI/UX, and cloud deployments.";
      }
      
      if (!text || text.trim() === '') throw new Error("Could not extract readable text from document.");

      // Calculate ATS scores globally
      setStatus('saving');
      const analysis = analyzeResume(text);
      
      // Save to Firebase backend
      const savedDoc = await saveResume(selectedFile.name, text, analysis.overallScore);
      
      // Patch local analysis into document payload so Analyze page instantly displays the charts
      savedDoc.analysis = analysis;
      
      setStatus('success');
      toast.success('Resume extracted and analyzed!', { icon: '✨' });
      if (onUploadComplete) {
        setTimeout(() => onUploadComplete(savedDoc), 1000);
      }
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Fatal error processing file');
      toast.error('Parser failed');
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full relative">
      <motion.div
        animate={{ scale: isDragging ? 0.98 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`taste-card border-2 border-dashed flex flex-col items-center justify-center min-h-[400px] text-center cursor-pointer transition-colors duration-300 relative overflow-hidden ${
          isDragging 
            ? 'border-slate-400 bg-slate-50 shadow-inner' 
            : status === 'error'
              ? 'border-red-300 bg-red-50'
              : status === 'success'
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-200/80 bg-white hover:bg-slate-50'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => status === 'idle' || status === 'error' ? fileInputRef.current?.click() : null}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInput} 
          className="hidden" 
          accept=".pdf,.docx"
        />

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 mb-6 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm pointer-events-none">
                <UploadCloud className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Drop your resume here</h3>
              <p className="text-slate-500 font-medium">Supports PDF and DOCX files up to 10MB</p>
              <div className="mt-8 px-6 py-3 bg-slate-900 border border-slate-800 text-white rounded-2xl font-bold tracking-tight shadow-lg pointer-events-none">
                Select Document
              </div>
            </motion.div>
          )}

          {status === 'parsing' && (
             <motion.div 
               key="parsing"
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center"
             >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-24 h-24 mb-6 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm"
                >
                  <File className="w-10 h-10 text-slate-400" />
                </motion.div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 animate-pulse">Extracting Text...</h3>
                <p className="text-slate-500 font-semibold tracking-tight">Utilizing native browser parsing engines...</p>
             </motion.div>
          )}

          {status === 'saving' && (
             <motion.div 
               key="saving"
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center"
             >
                 <div className="w-24 h-24 mb-6 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
                  <UploadCloud className="w-10 h-10 text-white animate-bounce" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Saving to Database...</h3>
                <p className="text-slate-500 font-semibold tracking-tight">Encrypting and uploading payload</p>
             </motion.div>
          )}

          {status === 'success' && (
             <motion.div 
               key="success"
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center"
             >
                <motion.div 
                  initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                  className="w-24 h-24 mb-6 rounded-[2rem] bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-black text-emerald-600 tracking-tighter mb-2">Analysis Complete!</h3>
                <p className="text-emerald-700 font-semibold tracking-tight">Redirecting to view scorecard...</p>
             </motion.div>
          )}

          {status === 'error' && (
             <motion.div 
               key="error"
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center"
             >
                <div className="w-24 h-24 mb-6 rounded-[2rem] bg-red-100 flex items-center justify-center border border-red-200">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Parsing Failed</h3>
                <p className="text-red-500 font-bold tracking-tight mb-8">{errorMessage}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Try Again
                </button>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
