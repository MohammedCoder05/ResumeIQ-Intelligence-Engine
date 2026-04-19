import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { analyzeResume as baseAnalyzeResume } from '../utils/scoringEngine';

const ResumeContext = createContext();

export function useResume() {
  return useContext(ResumeContext);
}

export function ResumeProvider({ children }) {
  const { currentUser } = useAuth();

  // Core state from user requirements
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const [loading, setLoading] = useState(false);

  async function getUserResumes() {
    if (!currentUser) {
      setResumes([]);
      return;
    }
    
    setLoading(true);
    try {
      const q = query(collection(db, 'resumes'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedResumes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort natively by timestamp if present
      fetchedResumes.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      
      setResumes(fetchedResumes);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getUserResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  async function saveResume(fileName, parsedText, score = null) {
    if (!currentUser) throw new Error("Must be logged in to save resume");
    
    const newResume = {
      userId: currentUser.uid,
      fileName,
      parsedText,
      createdAt: serverTimestamp(),
      score: score 
    };

    const docRef = await addDoc(collection(db, 'resumes'), newResume);
    const fullyFormedResume = { id: docRef.id, ...newResume };
    
    // Update local state to reflect the new document safely
    setResumes(prev => [fullyFormedResume, ...prev]);
    return fullyFormedResume;
  }

  async function deleteResume(id) {
    if (!currentUser) throw new Error("Must be logged in to delete");
    try {
      await deleteDoc(doc(db, 'resumes', id));
      setResumes(prev => prev.filter(r => r.id !== id));
      
      // Safety check: if currently analyzing this resume, clear it out
      if (selectedResume?.id === id) {
        setSelectedResume(null);
        setAnalysisResults(null);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw error;
    }
  }

  // Requested function: wraps utility scoring engine to safely set context wide results
  function analyzeResume(text) {
    const results = baseAnalyzeResume(text);
    setAnalysisResults(results);
    return results;
  }

  const value = {
    // Stored vars
    resumes,
    selectedResume,
    analysisResults,
    
    // Provided functions and setters
    setResumes,
    setSelectedResume,
    setAnalysisResults,
    analyzeResume,
    deleteResume,
    
    // Auxiliary
    loading,
    saveResume,
    getUserResumes
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}
