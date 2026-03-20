import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Loader2, 
  Briefcase,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import * as api from '@/services/dispatchService';
import { TicketDetailDialog } from '@/components/tickets/TicketDetailDialog';

export const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<any | null>(null);
  const [techDetails, setTechDetails] = useState<any | null>(null);
  const [techHistory, setTechHistory] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // For viewing a specific ticket from history/active list
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await api.getAvailableTechnicians();
      setTechnicians(res.data.data || []);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechDetails = async (tech: any) => {
    setSelectedTech(tech);
    setDetailsLoading(true);
    try {
      const [detailsRes, historyRes] = await Promise.all([
        api.getTechnicianDetails(tech.id),
        api.getTechnicianWorkHistory(tech.id)
      ]);
      setTechDetails(detailsRes.data.data);
      setTechHistory(historyRes.data.data || []);
    } catch (error) {
      console.error("Error fetching tech details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleBack = () => {
    setSelectedTech(null);
    setTechDetails(null);
    setTechHistory([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 w-full max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedTech ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            {/* Header Container */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 border border-border dark:border-white/10 shadow-2xl bg-card dark:bg-black/40 backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 bg-primary/20 text-primary rounded-2xl backdrop-blur-md border border-primary/20 shadow-inner">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-foreground dark:text-white leading-none">
                       รายชื่อช่างเทคนิค
                    </h1>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2 ml-1">ทะเบียนบุคลากร</p>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl ml-1 font-medium leading-relaxed italic">
                   วิเคราะห์ดัชนีชี้วัดประสิทธิภาพทางเทคนิคและบริหารจัดการบุคลากรเฉพาะทางทั่วมหาวิทยาลัย
                </p>
              </div>
            </motion.div>

            {/* Tech Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technicians.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => fetchTechDetails(tech)}
                  className="glass-card group p-2 rounded-[2.5rem] bg-card/60 dark:bg-black/40 border border-border/50 dark:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative overflow-hidden shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-black text-primary border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {tech.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-headline font-black text-foreground dark:text-white text-xl truncate tracking-tight group-hover:text-primary transition-colors">
                          {tech.full_name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">
                          {tech.department || 'หน่วยงานส่วนกลาง'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted dark:bg-black/60 p-4 rounded-2xl border border-border dark:border-white/5 shadow-inner grow flex flex-col justify-center">
                        <p className="text-[9px] text-muted-foreground/50 uppercase font-black tracking-widest mb-2">สถานะการปฏิบัติงาน</p>
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${tech.active_tickets_count > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${tech.active_tickets_count > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                             {tech.active_tickets_count > 0 ? "ไม่ว่าง" : "ว่าง"}
                           </span>
                        </div>
                      </div>
                      <div className="bg-muted dark:bg-black/60 p-4 rounded-2xl border border-border dark:border-white/5 shadow-inner grow">
                        <p className="text-[9px] text-muted-foreground/50 uppercase font-black tracking-widest mb-1.5">ภาระงานปัจจุบัน</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-headline font-black text-foreground dark:text-white">{tech.active_tickets_count}</p>
                          <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">รายการ</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <button 
                onClick={handleBack}
                className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.3em]"
              >
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                ย้อนกลับ
              </button>
              
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4" />
                โปรโตคอลการจัดการบุคลากร
              </div>
            </div>

            {/* Profile Header */}
            <div className="glass-card p-10 md:p-14 rounded-[3rem] border border-border dark:border-white/10 relative overflow-hidden bg-card/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl">
               <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[30rem] h-[30rem] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
               
               <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center relative z-10">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-muted dark:bg-black/60 flex items-center justify-center text-5xl md:text-6xl font-headline font-black text-primary border border-border dark:border-white/10 shadow-inner relative z-10 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      {selectedTech.full_name?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl md:text-6xl font-headline font-black text-foreground dark:text-white mb-6 leading-none tracking-tighter">{selectedTech.full_name}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                       <span className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] bg-muted/50 dark:bg-black/20 px-4 py-2 rounded-full border border-border dark:border-white/5 shadow-sm">
                          <Briefcase className="w-4 h-4 text-primary" />
                          {selectedTech.department || 'ปฏิบัติการส่วนกลาง'}
                       </span>
                       <span className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] bg-muted/50 dark:bg-black/20 px-4 py-2 rounded-full border border-border dark:border-white/5 shadow-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          ปีที่ขึ้นทะเบียน {new Date().getFullYear()}
                       </span>
                    </div>
                  </div>

                  <div className="flex gap-6">
                     <div className="text-center bg-card dark:bg-black/60 px-10 py-6 rounded-[2rem] border border-border dark:border-white/5 shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-4xl md:text-5xl font-headline font-black text-foreground dark:text-white relative z-10">{techDetails?.completed_count || 0}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-[0.3em] mt-1 relative z-10">เสร็จสิ้น</p>
                     </div>
                     <div className="text-center bg-card dark:bg-black/60 px-10 py-6 rounded-[2rem] border border-border dark:border-white/5 shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-4xl md:text-5xl font-headline font-black text-foreground dark:text-white relative z-10">{techDetails?.active_count || 0}</p>
                        <p className="text-[10px] text-amber-600 dark:text-amber-500 font-black uppercase tracking-[0.3em] mt-1 relative z-10">กำลังซ่อม</p>
                     </div>
                  </div>
               </div>
            </div>

            {detailsLoading ? (
              <div className="flex justify-center py-32">
                <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Active Tasks Column */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="flex items-center gap-3 px-4">
                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                       <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-headline font-black text-foreground dark:text-white uppercase tracking-widest underline decoration-amber-500/30 underline-offset-8">งานที่กำลังดำเนินการ</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {techDetails?.active_tasks?.length === 0 ? (
                      <div className="p-14 text-center border-2 border-dashed border-border dark:border-white/10 rounded-[2rem] bg-muted/30 dark:bg-black/10">
                        <p className="text-muted-foreground/30 text-[10px] font-black uppercase tracking-[0.2em]">ไม่มีงานที่ค้างอยู่</p>
                      </div>
                    ) : (
                      techDetails?.active_tasks?.map((task: any) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={task.id}
                          onClick={() => { setSelectedTicket(task); setIsTicketOpen(true); }}
                          className="glass-card p-6 rounded-[2rem] border border-border/50 dark:border-white/5 bg-card/60 dark:bg-black/40 hover:bg-card dark:hover:bg-black transition-all cursor-pointer group shadow-xl"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-md">
                              {task.category_name}
                            </span>
                            <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">{task.status}</span>
                          </div>
                          <h5 className="font-headline font-black text-foreground dark:text-white text-lg mb-4 line-clamp-2 group-hover:text-amber-500 transition-colors duration-300">{task.description}</h5>
                          <div className="flex items-center gap-2 pt-4 border-t border-border dark:border-white/5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground/30" />
                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">
                               เริ่มเมื่อ {new Date(task.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* History Column */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center gap-3 px-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                       <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-headline font-black text-foreground dark:text-white uppercase tracking-widest underline decoration-emerald-500/30 underline-offset-8">ประวัติการทำงาน</h3>
                  </div>

                  <div className="space-y-6">
                    {techHistory.length === 0 ? (
                      <div className="p-24 text-center border-2 border-dashed border-border dark:border-white/10 rounded-[2.5rem] bg-muted/30 dark:bg-black/10">
                        <CheckCircle2 className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
                        <p className="text-muted-foreground/40 font-black text-[10px] uppercase tracking-[0.2em] italic">ไม่มีประวัติการทำงาน</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {techHistory.map((history, i) => (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={history.id}
                            onClick={() => { setSelectedTicket(history); setIsTicketOpen(true); }}
                            className="glass-card p-6 rounded-[2rem] border border-border/50 dark:border-white/5 border-l-4 border-l-emerald-500/30 bg-card/60 dark:bg-black/40 hover:bg-card dark:hover:bg-black transition-all cursor-pointer shadow-xl group"
                          >
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">รหัสงาน #{history.id}</span>
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500/60 flex items-center gap-1.5 uppercase tracking-widest">
                                  <Clock className="w-3.5 h-3.5" />
                                  {new Date(history.updated_at).toLocaleDateString()}
                                </span>
                             </div>
                             <h6 className="font-headline font-black text-foreground dark:text-white text-base mb-4 line-clamp-1 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{history.description}</h6>
                             <div className="flex items-center gap-3 pt-4 border-t border-border dark:border-white/5">
                                <Badge variant="outline" className="bg-muted dark:bg-white/5 text-[9px] h-6 px-3 border-border dark:border-white/5 font-black uppercase tracking-widest">
                                  {history.category_name}
                                </Badge>
                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest opacity-60">ตรวจสอบแล้ว</span>
                             </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <TicketDetailDialog 
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
};
