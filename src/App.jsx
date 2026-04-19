import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Dynamically code-split our heavy routes using React.lazy
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analyze = lazy(() => import('./pages/Analyze'));

// A sleek loading fallback for Suspense boundaries
const PageLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-[#f9fafb] text-slate-900 font-sans overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Background Motion Layer */}
      <div className="vibe-blobs">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 max-w-7xl relative z-10">
        <Toaster 
          position="bottom-center" 
          toastOptions={{ 
            style: { background: '#ffffff', color: '#0f172a', border: '1px solid rgba(226, 232, 240, 0.6)', borderRadius: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', padding: '12px 24px', fontWeight: '500' } 
          }} 
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/analyze" element={
              <ProtectedRoute>
                <Analyze />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
