import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fdfcfb]/80 backdrop-blur-2xl">
      {/* 💎 Ultra-Premium Aesthetic Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center gap-12">
        {/* Animated Geometric Logo Core */}
        <div className="relative w-24 h-24">
          <motion.div 
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1, 1.1, 1],
              borderRadius: ["20%", "40%", "20%", "40%", "20%"]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-primary/10 border-2 border-primary/20 shadow-2xl backdrop-blur-xl"
          />
          <motion.div 
            animate={{ 
              rotate: [360, 270, 180, 90, 0],
              scale: [0.8, 1, 0.8, 1, 0.8],
              borderRadius: ["40%", "20%", "40%", "20%", "40%"]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-4 bg-white shadow-xl flex items-center justify-center p-2 overflow-hidden"
          >
            <img src="/sskru-logo.png" alt="SSKRU" className="w-full h-full object-contain" />
          </motion.div>
        </div>

        {/* Sophisticated Status Indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
             <motion.div 
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-1.5 h-1.5 rounded-full bg-primary" 
             />
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">กำลังเริ่มระบบ...</h2>
          </div>
          
          <div className="w-48 h-[2px] bg-primary/5 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
            />
          </div>
        </div>

        {/* Professional Metadata */}
        <p className="text-[8px] font-black text-[#1a1a1a]/20 uppercase tracking-[0.8em] mt-2">
          ระบบบริหารจัดการ SSKRU กำลังทำงาน
        </p>
      </div>
    </div>
  );
};

export default Loading;
