import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Terminal, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-primary/30">
      {/* 🎨 Luxury Aesthetic Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60rem] h-[60rem] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-amber-100/20 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/linen.png')] opacity-[0.05]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Abstract 404 Core */}
        <div className="relative mb-16">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12rem] md:text-[18rem] font-headline font-black tracking-[-0.08em] leading-none text-primary/5 select-none"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-primary/20 shadow-2xl transform -rotate-3 group hover:rotate-0 transition-transform duration-700">
               <ShieldAlert className="w-20 h-20 text-primary animate-slow-pulse" />
            </div>
          </div>
        </div>

        {/* Institutional Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 text-[11px] font-black text-primary uppercase tracking-[0.5em]">
              <Terminal className="w-4 h-4" />
              ไม่พบส่วนงานที่ระบุ
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter italic text-[#1a1a1a]">
              ไม่พบหน้าที่คุณต้องการ
            </h2>
          </div>

          <p className="text-lg md:text-xl text-[#1a1a1a]/50 font-medium italic border-l-2 border-primary/30 pl-8 text-left max-w-lg mx-auto py-2 leading-relaxed">
            หน้าเว็บที่คุณกำลังเรียกหาถูกย้าย หรืออาจจะถูกลบออกจากฐานข้อมูลระบบแล้ว
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-12 items-center justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="h-16 px-12 rounded-2xl bg-[#1a1a1a] text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary shadow-2xl transition-all group border border-white/10"
            >
              <Home className="w-4 h-4 mr-4 group-hover:scale-110 transition-transform" />
              กลับสู่หน้าหลัก
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-16 px-12 rounded-2xl border-2 border-primary/20 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:border-primary/40 transition-all flex items-center gap-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              ย้อนกลับ
            </Button>
          </div>
        </div>

        {/* Debug Console Shadow */}
        <div className="mt-24 pt-12 border-t border-primary/5 w-full">
           <p className="text-[9px] font-black uppercase tracking-[1em] text-[#1a1a1a]/10">
              ระบบบริหารจัดการข้อมูลสารสนเทศ SSKRU V2.5
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
