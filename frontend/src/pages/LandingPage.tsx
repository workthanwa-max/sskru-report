import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, Award, Sparkles, Github, Globe, Users, ArrowRight, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const architects = [
    "นาย เจษฎา แก้วละมุล",
    "นาย ณัฏฐชัย โมคศิริ",
    "นาย ประมุข สีหะวงษ์",
    "นางสาว วริศรา ถาวร",
    "นางสาว วิมลนาฎ พรมด้วง"
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] selection:bg-primary/30 selection:text-primary overflow-x-hidden font-sans antialiased">
      {/* 💎 Ultra-Premium Aesthetic Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[80rem] h-[80rem] bg-primary/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70rem] h-[70rem] bg-amber-100/30 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/linen.png')] opacity-[0.1] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10" />
      </div>

      {/* 🧭 Sophisticated Institutional Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 md:py-6 flex justify-between items-center transition-all duration-700 bg-white/40 backdrop-blur-3xl border-b border-primary/10 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-5 group cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="relative">
             <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl border border-primary/15 p-2.5 shadow-xl transform transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110">
                <img src="/sskru-logo.png" alt="SSKRU" className="w-full h-full object-contain" />
             </div>
          </div>
          <div className="flex flex-col">
             <h1 className="font-headline font-black text-xl md:text-2xl uppercase tracking-[-0.03em] leading-none text-[#1a1a1a]">ระบบแจ้งซ่อมและรายงานผล SSKRU</h1>
             <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.5em] italic opacity-70">ระบบฐานข้อมูลทำงานปกติ</p>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <div className="hidden lg:flex gap-10">
             {['แพลตฟอร์ม', 'หน่วยงาน', 'โครงสร้างระบบ', 'การเชื่อมต่อ'].map((link) => (
                <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 hover:text-primary transition-colors">{link}</a>
             ))}
          </div>
          <div className="flex items-center gap-6 pl-6 border-l border-primary/10">
             <Button 
               onClick={() => navigate('/login')}
               className="bg-[#1a1a1a] text-white hover:bg-primary font-black text-[10px] uppercase tracking-[0.3em] px-8 rounded-xl h-12 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 border border-white/10"
             >
               เข้าสู่ระบบเพื่อใช้งาน
             </Button>
          </div>
        </motion.div>
      </nav>

      {/* 🚀 Hero Section - The Mission Gateway */}
      <main className="relative z-10 pt-64 pb-32">
        <section className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
           <motion.div 
             style={{ opacity, scale }}
             className="flex flex-col items-center space-y-12 mb-40"
           >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-8 py-3 bg-white border border-primary/20 rounded-full shadow-lg flex items-center gap-4 group hover:border-primary transition-all duration-500 cursor-default"
              >
                 <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] group-hover:tracking-[0.6em] transition-all">ระบบพร้อมสำหรับการประสานงาน</span>
              </motion.div>

              <div className="relative space-y-4">
                 <motion.h1 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="text-[4.5rem] md:text-[11rem] font-headline font-black text-[#1a1a1a] tracking-[-0.05em] leading-[0.85] uppercase italic"
                 >
                    ศูนย์กลาง<br/>
                    <span className="text-primary not-italic relative">
                       การแจ้งซ่อม
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '100%' }}
                         transition={{ delay: 1, duration: 1.5 }}
                         className="absolute -bottom-4 left-0 h-3 bg-primary/20 rounded-full" 
                        />
                    </span>
                 </motion.h1>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-3xl text-[#1a1a1a]/60 max-w-4xl leading-tight font-medium italic border-l-4 border-primary/20 pl-10 text-left md:text-center mt-12 bg-white/30 backdrop-blur-sm p-6 rounded-3xl"
              >
                 ระบบศูนย์กลางสำหรับการแจ้งซ่อมบำรุง ติดตามสถานะงาน และจัดการทรัพยากรภายในมหาวิทยาลัยอย่างมีประสิทธิภาพ
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col md:flex-row gap-6 pt-12"
              >
                 <Button 
                   onClick={() => navigate('/login')}
                   className="h-20 px-14 rounded-2xl bg-[#1a1a1a] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-primary shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-primary/30 active:scale-95 transition-all group border-2 border-white/20"
                 >
                   <span className="flex items-center gap-5">เข้าสู่ระบบเพื่อใช้งาน <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></span>
                 </Button>
                 
                 <Button 
                    variant="ghost"
                    className="h-20 px-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white border-2 border-primary/20 shadow-xl transition-all flex items-center gap-4 group"
                 >
                    <MousePointer2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    เข้าใช้งานระบบแจ้งซ่อม
                 </Button>
              </motion.div>
           </motion.div>

           {/* 🧬 Feature Cards - The Digital Dossier */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-64">
              {[
                { icon: Shield, title: "แจ้งซ่อมรวดเร็ว", desc: "แจ้งปัญหาผ่านระบบได้ทันที พร้อมแนบหลักฐานรูปภาพเพื่อความรวดเร็วในการแก้ไข", color: "bg-primary/5 border-primary/10 text-primary" },
                { icon: Zap, title: "ติดตามสถานะ", desc: "ตรวจสอบความคืบหน้าของงานซ่อมได้แบบเรียลไทม์ พร้อมการแจ้งเตือนเมื่อเสร็จสิ้น", color: "bg-[#1a1a1a] border-white/10 text-white" },
                { icon: Lock, title: "โปร่งใส ตรวจสอบได้", desc: "ประวัติการซ่อมบำรุงทั้งหมดถูกจัดเก็บไว้อย่างเป็นระบบเพื่อความโปร่งใส", color: "bg-white border-primary/10 text-[#1a1a1a]" }
              ].map((f, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 60 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1, duration: 0.8 }}
                   className={`p-12 md:p-16 rounded-[4rem] border group hover:-translate-y-4 transition-all duration-700 shadow-2xl relative overflow-hidden ${f.color}`}
                >
                   <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-3xl flex items-center justify-center mb-10 border border-white/20 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
                         <f.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-headline font-black uppercase tracking-tighter mb-6 leading-none">{f.title}</h3>
                      <p className="font-medium italic opacity-60 text-sm leading-relaxed max-w-[240px]">{f.desc}</p>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
                </motion.div>
              ))}
           </div>

           {/* ✍️ The Architects Section - Premium Dossier Style */}
           <section className="relative w-full rounded-[4.5rem] bg-[#1a1a1a] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] p-12 md:p-24 overflow-hidden text-white border border-white/5">
              <div className="absolute top-0 right-0 p-24 opacity-5">
                 <Award className="w-96 h-96 rotate-12" />
              </div>
              <div className="absolute -bottom-40 -left-40 w-[60rem] h-[60rem] bg-primary/20 blur-[180px] rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-16">
                 <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/10 pb-16">
                    <div className="space-y-6">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                             <Award className="w-7 h-7" />
                          </div>
                          <div>
                             <h2 className="text-5xl md:text-8xl font-headline font-black uppercase tracking-tighter italic">คณะผู้จัดทำ</h2>
                             <div className="flex items-center gap-3 mt-4">
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">คณะผู้พัฒนาระบบ</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {architects.map((name, i) => (
                       <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          className="group p-10 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-primary transition-all duration-700 hover:scale-105"
                       >
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black group-hover:bg-white group-hover:text-primary transition-all">
                                {i + 1}
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/60">รหัสนักพัฒนา_{i.toString().padStart(2, '0')}</p>
                                <p className="text-xl font-headline font-black uppercase tracking-tight group-hover:italic">{name}</p>
                             </div>
                          </div>
                       </motion.div>
                    ))}
                    <div className="flex flex-col justify-center items-center gap-2 p-10 bg-primary/5 rounded-[2.5rem] border border-dashed border-primary/20 opacity-40">
                       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-center italic leading-relaxed">บันทึกความร่วมมือทางวิชาการ มหาวิทยาลัยราชภัฏศรีสะเกษ</p>
                    </div>
                 </div>
              </div>
           </section>
        </section>
      </main>

      {/* 🏛️ Institutional Footer */}
      <footer className="relative pt-48 pb-20 px-8 bg-white border-t-8 border-primary/10">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-20">
               <div className="flex flex-col items-center lg:items-start space-y-10">
                  <div className="flex items-center gap-8 group">
                     <div className="w-20 h-20 bg-white rounded-3xl border border-primary/10 shadow-2xl p-3 transform transition-transform group-hover:-rotate-12 duration-500">
                        <img src="/sskru-logo.png" alt="University" className="w-full h-full object-contain" />
                     </div>
                     <div>
                        <h2 className="font-headline font-black text-4xl tracking-tighter uppercase italic text-[#1a1a1a]">ระบบแจ้งซ่อม SSKRU</h2>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mt-3 italic opacity-60">ระบบควบคุมส่วนกลาง</p>
                     </div>
                  </div>
                  <p className="text-[10px] font-black text-[#1a1a1a]/30 uppercase tracking-[1em] max-w-sm leading-relaxed text-center lg:text-left">
                     ลิขสิทธิ์ระบบรายงานผลการปฏิบัติงาน มหาวิทยาลัยราชภัฏศรีสะเกษ
                  </p>
               </div>

               <div className="flex flex-col items-center lg:items-end space-y-12">
                  <div className="flex gap-12 text-[#1a1a1a]/20">
                     <Github className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
                     <Globe className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
                     <Users className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
                  </div>
                  <div className="flex items-center gap-4 bg-[#1a1a1a]/5 px-8 py-4 rounded-full border border-[#1a1a1a]/10 backdrop-blur-lg">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-slow-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <span className="text-[9px] font-black text-[#1a1a1a]/40 uppercase tracking-[0.4em] italic">สถานะการเชื่อมต่อปลอดภัย</span>
                  </div>
               </div>
            </div>

            <div className="pt-20 border-t border-primary/5 text-center opacity-10">
               <p className="text-[8px] font-black uppercase tracking-[2.5em] text-[#1a1a1a]">ระบบบริหารจัดการข้อมูลพื้นฐาน V2.5</p>
            </div>
         </div>
      </footer>
    </div>
  );
};
