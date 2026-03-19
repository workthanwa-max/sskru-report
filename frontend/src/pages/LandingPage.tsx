import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Lock, Award, Heart, Sparkles, ChevronRight, Github, Globe, Users, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const architects = t('landing.architects', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 selection:bg-primary/20 selection:text-primary overflow-x-hidden font-sans">
      {/* Premium Aesthetic Layers - White & Gold */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60rem] h-[60rem] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50rem] h-[50rem] bg-amber-200/20 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.4] pointer-events-none" />
      </div>

      {/* Navigation - High-Fidelity Institutional Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 md:px-16 md:py-8 flex justify-between items-center backdrop-blur-2xl bg-white/70 border-b border-primary/20 shadow-[0_15px_50px_rgba(0,0,0,0.03)] focus:outline-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 group cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-[1.5rem] border-2 border-primary/10 p-2 shadow-2xl transform transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3">
                <img src="/sskru-logo.png" alt="University Logo" className="w-full h-full object-contain" />
             </div>
          </div>
          <div>
             <h1 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none text-slate-900">{t('landing.title')}</h1>
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mt-1.5 opacity-80 italic">SSKRU_Systems_Registry</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-10"
        >
          <LanguageSwitcher className="bg-white/50 border-primary/10 shadow-sm" />
          <Button 
            onClick={() => navigate('/login')}
            className="hidden lg:flex bg-slate-900 text-white hover:bg-primary font-black text-[10px] uppercase tracking-[0.3em] px-12 rounded-2xl h-14 transition-all shadow-xl shadow-slate-900/10 border-2 border-white"
          >
            {t('landing.start_button')}
          </Button>
        </motion.div>
      </nav>

      <main className="relative pt-64 pb-48 px-8 md:px-16 container mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-16 mb-64">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="px-10 py-3.5 bg-primary/5 border border-primary/20 rounded-full text-[11px] font-black text-primary uppercase tracking-[0.6em] shadow-sm flex items-center gap-4 hover:bg-primary/10 transition-colors"
           >
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              SSKRU_UNIT_READY
           </motion.div>

           <div className="space-y-8 max-w-7xl">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[4rem] md:text-[9.5rem] font-headline font-black text-slate-900 tracking-[-0.04em] leading-[0.8] uppercase italic"
              >
                 Unified<br/><span className="text-primary not-italic">Support.</span>
              </motion.h1>
           </div>

           <motion.p 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="text-xl md:text-3xl text-slate-500/70 max-w-5xl leading-tight font-medium italic border-l-8 border-primary/10 pl-12 mt-10 text-left md:text-center"
           >
              {t('landing.desc')}
           </motion.p>
           
           <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-10"
           >
              <Button 
                onClick={() => navigate('/login')}
                className="h-24 px-16 rounded-[2.5rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.3em] hover:bg-primary hover:scale-105 active:scale-95 transition-all shadow-2xl group border-4 border-white"
              >
                <span className="flex items-center gap-6">{t('landing.start_button')} <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></span>
              </Button>
           </motion.div>
        </section>

        {/* Feature Grid - Simplified Labels */}
        <section className="mb-72">
           <div className="flex items-center gap-6 mb-24 opacity-60">
              <div className="w-16 h-[2.5px] bg-primary" />
              <h2 className="text-[10px] font-black uppercase tracking-[1em] text-slate-400 font-sans italic">{t('landing.features_title')}</h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
              {[
                { icon: Shield, title: t('landing.feature_1_title'), desc: t('landing.feature_1_desc'), color: "text-primary bg-primary/5 border-primary/10" },
                { icon: Zap, title: t('landing.feature_2_title'), desc: t('landing.feature_2_desc'), color: "text-slate-800 bg-slate-50 border-slate-200" },
                { icon: Lock, title: t('landing.feature_3_title'), desc: t('landing.feature_3_desc'), color: "text-primary bg-primary/5 border-primary/10" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="bg-white p-16 rounded-[4.5rem] group hover:shadow-[0_60px_120px_rgba(0,0,0,0.08)] transition-all duration-1000 border border-slate-100 flex flex-col items-center text-center shadow-sm"
                >
                   <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-12 border-2 ${feature.color} shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6`}>
                      <feature.icon className="w-10 h-10" />
                   </div>
                   <h3 className="text-3xl font-headline font-black uppercase tracking-tighter mb-8 text-slate-900 leading-none">{feature.title}</h3>
                   <p className="text-slate-400 font-medium italic leading-relaxed text-sm max-w-[220px]">{feature.desc}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* The Architects Section */}
        <section className="relative overflow-hidden rounded-[5.5rem] bg-white border-2 border-primary/5 shadow-2xl p-16 md:p-32">
           <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
              <Award className="w-96 h-96 text-primary rotate-12" />
           </div>
           <div className="absolute -bottom-20 -left-20 w-[40rem] h-[40rem] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

           <div className="relative z-10 space-y-20">
              <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-primary/10 pb-16">
                 <div className="space-y-6 max-w-4xl">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-primary/10 text-primary rounded-2xl border border-primary/10 shadow-xl">
                          <Award className="w-10 h-10" />
                       </div>
                       <div>
                          <h2 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tighter text-slate-900 italic">{t('landing.credits_title')}</h2>
                          <div className="flex items-center gap-3 mt-4">
                             <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                             <p className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Senior_System_Design_Council</p>
                          </div>
                       </div>
                    </div>
                    <p className="text-2xl text-slate-500/80 leading-snug font-medium italic mt-10">
                       {t('landing.inspiration_note')}
                    </p>
                 </div>
              </div>

              {/* Architects Registry List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {Array.isArray(architects) && architects.map((name, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: -20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="group flex items-center gap-8 bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-700 cursor-default"
                    >
                       <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl font-black text-primary shadow-sm group-hover:border-primary/40 transition-colors">
                          {i + 1}
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Architect_IDN_{i.toString().padStart(2, '0')}</p>
                          <p className="text-xl font-headline font-black text-slate-900 uppercase tracking-tighter leading-none">{name}</p>
                       </div>
                    </motion.div>
                 ))}
                 
                 <div className="group flex flex-col justify-center items-center gap-4 bg-primary/[0.02] p-10 rounded-[2.5rem] border border-dashed border-primary/20 opacity-60">
                    <Heart className="w-6 h-6 text-primary mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 text-center">Institutional Acknowledgement for Collaborative Excellence</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="relative pt-48 pb-20 px-8 md:px-16 bg-[#ffffff] border-t-8 border-primary/5 overflow-hidden">
         <div className="max-w-7xl mx-auto space-y-24 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-20">
               <div className="flex flex-col items-center lg:items-start gap-10">
                  <div className="flex items-center gap-8">
                     <div className="w-24 h-24 bg-white rounded-3xl border shadow-2xl p-3 transform -rotate-6">
                        <img src="/sskru-logo.png" alt="University Logo" className="w-full h-full object-contain" />
                     </div>
                     <div>
                        <h2 className="font-headline font-black text-4xl tracking-tighter uppercase italic text-slate-900 leading-none">SSKRU_REPORT.</h2>
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.6em] mt-3 italic">Administrative_Systems_Registry</p>
                     </div>
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[1em] max-w-sm leading-relaxed mx-auto lg:mx-0">
                     {t('landing.all_rights')}
                  </p>
               </div>

               <div className="flex flex-col items-center lg:items-end gap-10">
                  <div className="flex gap-14 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                     <Github className="w-7 h-7" />
                     <Globe className="w-7 h-7" />
                     <Users className="w-7 h-7" />
                  </div>
                  <div className="bg-slate-50 px-10 py-5 rounded-full border border-slate-100 flex items-center gap-5 shadow-inner">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">DATA_PROTOCOL_HEARTBEAT_SECURE</span>
                  </div>
               </div>
            </div>

            <div className="pt-20 border-t border-slate-100 text-center opacity-10">
               <p className="text-[9px] font-black uppercase tracking-[2em] text-slate-400">ADMINISTRATIVE_GEO_REGISTRY_PROTOCOLS_V2.5</p>
            </div>
         </div>
      </footer>
    </div>
  );
};
