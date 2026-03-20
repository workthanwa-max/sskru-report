import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clock, CheckCircle2, Zap, Activity, ShieldCheck, Compass, MapPin, ChevronRight, AlertCircle, History, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import * as api from '@/services/ticketingService';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.ticketingService.getMyTickets();
        setRecentTickets(res.data.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Error fetching student tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);
  
  const stats = [
    { title: "รายการที่กำลังดำเนินการ", value: recentTickets.filter(t => t.status !== 'Resolved').length.toString(), icon: Activity, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    { title: "อยู่ระหว่างตรวจสอบ", value: recentTickets.filter(t => t.status === 'Verification').length.toString(), icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: "ดำเนินการเสร็จสิ้น", value: recentTickets.filter(t => t.status === 'Resolved').length.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-12 pb-16 w-full max-w-6xl mx-auto relative">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 border border-border dark:border-white/10 shadow-2xl bg-card dark:bg-black/40 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary/20 text-primary rounded-2xl backdrop-blur-md border border-primary/20 shadow-inner">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-foreground dark:text-white leading-none">
                  สวัสดีคุณ {user?.full_name?.split(' ')[0] || user?.username}
                </h1>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2 ml-1">ศูนย์รับรองและแจ้งซ่อม</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl ml-1 font-medium leading-relaxed italic">
               ภาพรวมการแจ้งซ่อมและข้อเสนอแนะเกี่ยวกับโครงสร้างพื้นฐานของคุณทั่วมหาวิทยาลัย
            </p>
          </div>
 
          <Button asChild className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 group">
             <Link to="/dashboard/facilities" className="flex items-center gap-3">
                <Zap className="w-5 h-5 group-hover:fill-current transition-all" />
                แจ้งซ่อมใหม่
             </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-8 rounded-[2.5rem] bg-card/60 dark:bg-black/40 border ${stat.border} shadow-2xl relative overflow-hidden group`}
          >
            <div className="flex justify-between items-start">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border ${stat.border} shadow-inner`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-4xl font-headline font-black text-foreground dark:text-white">{stat.value}</h3>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 dark:text-white/20 ml-1">{stat.title}</p>
              <div className="h-1.5 w-full bg-muted dark:bg-white/5 rounded-full mt-3 overflow-hidden shadow-inner">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: '40%' }} 
                   className={`h-full ${stat.bg.replace('/10', '')}`} 
                 />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Log */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-muted dark:bg-white/5 rounded-lg border border-border dark:border-white/5 text-muted-foreground">
                 <History className="w-5 h-5" />
              </div>
               <h3 className="text-xl font-headline font-black text-foreground dark:text-white uppercase tracking-widest underline decoration-primary/30 underline-offset-8">ประวัติการแจ้งซ่อม</h3>
           </div>
           <Link to="/dashboard/facilities" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">ดูทั้งหมด</Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
          </div>
        ) : recentTickets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center border-2 border-dashed border-border dark:border-white/10 rounded-[2.5rem] text-muted-foreground bg-card/50 dark:bg-black/10 backdrop-blur-sm"
          >
            <div className="mx-auto w-24 h-24 bg-muted dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-muted-foreground/20 border border-border dark:border-white/5 shadow-inner">
              <Compass className="w-12 h-12" />
            </div>
            <p className="text-2xl font-headline font-black text-foreground/40 dark:text-white/20 uppercase tracking-[0.2em]">ยังไม่มีรายการแจ้งซ่อม</p>
            <p className="text-sm mt-3 opacity-60 font-medium">รายการที่คุณแจ้งไปจะปรากฏที่นี่</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {recentTickets.map((ticket, i) => (
                <motion.div
                  layout
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 md:p-8 rounded-[2rem] bg-card dark:bg-black/40 border border-border dark:border-white/5 shadow-xl flex flex-col md:flex-row items-center gap-8 group hover:border-primary/20 transition-all duration-500"
                >
                  <div className={`p-4 rounded-2xl border ${
                    ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    ticket.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                       <h4 className="text-xl font-headline font-black text-foreground dark:text-white uppercase tracking-tight truncate max-w-sm">
                         {ticket.description}
                       </h4>
                       <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                         ticket.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                         'bg-blue-500/10 text-blue-500 border-blue-500/20'
                       }`}>
                         {ticket.status}
                       </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                       <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {ticket.building_name}</span>
                       <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Button variant="ghost" className="rounded-xl h-12 w-12 p-0 text-muted-foreground/20 hover:text-primary hover:bg-primary/10">
                     <ChevronRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Safety Alert (Shared Protocol) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl"
      >
        <div className="p-4 bg-amber-500 text-black rounded-3xl shadow-xl">
           <AlertCircle className="w-8 h-8" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
           <h4 className="text-xl font-headline font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">มาตรการความปลอดภัยส่วนกลาง</h4>
           <p className="text-muted-foreground font-medium italic opacity-60 leading-relaxed">
             ในกรณีที่เกิดเหตุฉุกเฉินหรืออันตรายร้ายแรงต่ออาคารสถานที่ โปรดติดต่อสายด่วนแจ้งเหตุฉุกเฉินทันที
           </p>
        </div>
        <Button className="bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.2em] h-12 rounded-xl px-8 hover:bg-white transition-all shadow-lg active:scale-95">
            ติดต่อแจ้งเหตุฉุกเฉิน
        </Button>
      </motion.div>
    </div>
  );
};
