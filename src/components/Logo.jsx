import { motion } from 'framer-motion';

export default function Logo({ className = "w-10 h-10" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Abstract document geometry */}
      <motion.svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        initial="initial"
        animate="animate"
        className="w-full h-full"
      >
        <motion.rect 
          x="20" y="20" width="60" height="60" rx="16" 
          stroke="currentColor" strokeWidth="6"
          variants={{
            initial: { pathLength: 0, opacity: 0 },
            animate: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" }}
          }}
        />
        <motion.path 
          d="M40 45H60M40 55H55" 
          stroke="currentColor" strokeWidth="6" strokeLinecap="round"
          variants={{
            initial: { pathLength: 0, opacity: 0 },
            animate: { pathLength: 1, opacity: 1, transition: { delay: 0.5, duration: 1 }}
          }}
        />
        <motion.circle 
          cx="75" cy="25" r="8" 
          fill="rgb(15, 23, 42)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 1.2
          }}
        />
      </motion.svg>
      
      {/* Glow effect (Neutralized) */}
      <div className="absolute inset-0 bg-slate-900/10 blur-xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}
