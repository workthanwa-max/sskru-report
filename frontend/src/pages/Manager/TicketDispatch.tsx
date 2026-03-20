import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, UserCheck, AlertCircle, Loader2, Clock, MapPin, CheckCircle2, XCircle, Eye, History, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as api from '@/services/dispatchService';
import { TicketDetailDialog } from '@/components/tickets/TicketDetailDialog';

type Tab = 'pending' | 'review' | 'history';

export const TicketDispatch = () => {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [tickets, setTickets] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const [ticketsRes, techsRes] = await Promise.all([
          api.getPendingTickets(),
          api.getAvailableTechnicians()
        ]);
        setTickets(ticketsRes.data.data || []);
        setTechnicians(techsRes.data.data || []);
      } else if (activeTab === 'review') {
        const res = await api.getReviewTickets();
        setTickets(res.data.data || []);
      } else {
        const res = await api.getHistoryTickets();
        setTickets(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching dispatch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAssign = async (ticketId: number) => {
    const techIdStr = assignments[ticketId];
    if (!techIdStr) return;
    
    const techId = parseInt(techIdStr);
    setActionLoading(ticketId);
    try {
      await api.assignTicket(ticketId, techId);
      setTickets(tickets.filter(t => t.id !== ticketId));
    } catch (error) {
      console.error("Error assigning ticket:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (ticketId: number) => {
    setActionLoading(ticketId);
    try {
      await api.approveTicket(ticketId);
      setTickets(tickets.filter(t => t.id !== ticketId));
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error approving ticket:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (ticketId: number) => {
    const note = prompt("เหตุผลที่ตีกลับ" + ":");
    if (note === null) return;
    
    setActionLoading(ticketId);
    try {
      await api.rejectTicket(ticketId, note);
      setTickets(tickets.filter(t => t.id !== ticketId));
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error rejecting ticket:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-10 pb-16 w-full max-w-6xl mx-auto">
      {/* Header Container */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 border border-border dark:border-white/10 shadow-2xl bg-card dark:bg-black/40 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-primary/20 text-primary rounded-2xl backdrop-blur-md border border-primary/20 shadow-inner">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-foreground dark:text-white leading-none">
                   ศูนย์จ่ายงานซ่อมบำรุง
                </h1>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2 ml-1">การประสานงานงานซ่อม</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl ml-1 font-medium leading-relaxed italic">
               วิเคราะห์ดัชนีชี้วัดประสิทธิภาพทางเทคนิคและบริหารจัดการบุคลากรเฉพาะทางทั่วมหาวิทยาลัย
            </p>
          </div>

          <div className="flex bg-muted/50 dark:bg-black/40 p-1.5 rounded-2xl border border-border dark:border-white/5 backdrop-blur-md shadow-inner self-stretch md:self-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'pending', icon: AlertCircle, label: "งานที่มอบหมาย", count: activeTab === 'pending' ? tickets.length : null },
              { id: 'review', icon: CheckCircle2, label: "รอตรวจสอบ", count: activeTab === 'review' ? tickets.length : null },
              { id: 'history', icon: History, label: "ประวัติการทำงาน", count: activeTab === 'history' ? tickets.length : null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 font-black text-[10px] uppercase tracking-widest whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'text-muted-foreground/40 hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && <span className="ml-1 bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded-md">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        <div className="space-y-8">
           <AnimatePresence mode="popLayout">
            {tickets.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="py-32 text-center border-2 border-dashed border-border dark:border-white/10 rounded-[2.5rem] text-muted-foreground bg-card/50 dark:bg-black/10 backdrop-blur-sm"
              >
                <div className="mx-auto w-24 h-24 bg-muted dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-muted-foreground/20 border border-border dark:border-white/5 shadow-inner">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <p className="text-2xl font-headline font-black text-foreground/40 dark:text-white/20 uppercase tracking-[0.2em]">ไม่มีรายการแจ้งซ่อม</p>
                <p className="text-sm mt-2 opacity-60">ระบบอยู่ในสภาวะปกติ</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tickets.map((ticket, index) => (
                  <motion.div
                    layout
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-4 rounded-[2.5rem] bg-card/60 dark:bg-black/40 border border-border/50 dark:border-white/10 shadow-2xl relative group overflow-hidden"
                  >
                    <div className="p-4 md:p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${activeTab === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'}`}>
                              {ticket.category_name}
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground/40 flex items-center gap-1.5 uppercase tracking-[0.2em]">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-2xl md:text-3xl font-headline font-black text-foreground dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                            {ticket.description}
                          </h4>
                          <p className="text-sm text-muted-foreground font-medium italic opacity-60">
                            ผู้แจ้ง: <span className="font-bold uppercase tracking-widest">{ticket.reporter_name}</span>
                          </p>
                        </div>
                        
                        {(activeTab === 'review' || activeTab === 'history') && (
                          <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => {
                               setSelectedTicket(ticket);
                               setIsDetailOpen(true);
                             }}
                             className="text-muted-foreground/30 hover:text-primary hover:bg-primary/10 rounded-2xl"
                          >
                             <Eye className="w-5 h-5" />
                          </Button>
                        )}
                      </div>

                      <div className="bg-muted dark:bg-black/60 p-5 rounded-[2rem] border border-border dark:border-white/5 flex items-start gap-5 shadow-inner grow">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-sm">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="text-sm leading-relaxed overflow-hidden">
                          <p className="font-black text-foreground dark:text-white uppercase tracking-widest truncate">{ticket.building_name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">ชั้น {ticket.floor_number} • {ticket.room_name} <span className="opacity-40">(ห้อง {ticket.room_number})</span></p>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-border dark:border-white/5">
                        {activeTab === 'pending' ? (
                          <div className="flex flex-col gap-5">
                            <div className="relative group/select">
                               <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/20 group-hover/select:text-primary/40 transition-colors">
                                  <UserCheck  className="w-full h-full" />
                               </div>
                               <select 
                                 className="w-full bg-muted dark:bg-black/60 border border-border dark:border-white/10 text-foreground dark:text-white rounded-[1.25rem] pl-12 pr-10 py-4 text-sm font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer shadow-inner"
                                 value={assignments[ticket.id] || ''}
                                 onChange={(e) => setAssignments({ ...assignments, [ticket.id]: e.target.value })}
                               >
                                 <option value="" disabled>ยังไม่ได้มอบหมาย</option>
                                 {technicians.map(tech => (
                                   <option 
                                     key={tech.id} 
                                     value={tech.id} 
                                     disabled={tech.active_tickets_count > 0}
                                     className={`${tech.active_tickets_count > 0 ? 'text-muted-foreground/40' : 'text-foreground'} bg-card dark:bg-[#1a1a1a]`}
                                   >
                                     {tech.full_name} • {tech.department || "ไม่มีต้นสังกัด"} {tech.active_tickets_count > 0 ? `[ไม่ว่าง]` : `[ว่าง]`}
                                   </option>
                                 ))}
                               </select>
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]">
                                  <ChevronRight className="w-full h-full rotate-90" />
                               </div>
                            </div>
                            <Button 
                              onClick={() => handleAssign(ticket.id)}
                              disabled={!assignments[ticket.id] || actionLoading === ticket.id}
                              className="w-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 h-14 rounded-[1.25rem] group/btn"
                            >
                              {actionLoading === ticket.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <span className="flex items-center gap-2">มอบหมายงาน <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></span>
                              )}
                            </Button>
                          </div>
                        ) : activeTab === 'review' ? (
                          <div className="flex flex-col gap-6">
                             <div>
                                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] font-black mb-2 px-1">ช่างเทคนิค</p>
                                <div className="p-4 bg-muted dark:bg-black/40 rounded-2xl border border-border dark:border-white/5 font-black text-foreground dark:text-white text-sm tracking-widest shadow-inner">
                                  {ticket.technician_name}
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <Button 
                                  onClick={() => handleReject(ticket.id)}
                                  disabled={actionLoading === ticket.id}
                                  className="bg-card dark:bg-white/5 border border-border dark:border-white/10 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 font-black text-[10px] uppercase tracking-widest h-12 rounded-2xl transition-all"
                                >
                                  {actionLoading === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-2" /> ตีกลับงาน</>}
                               </Button>
                               <Button 
                                  onClick={() => handleApprove(ticket.id)}
                                  disabled={actionLoading === ticket.id}
                                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-black font-black text-[10px] uppercase tracking-widest h-12 rounded-2xl transition-all shadow-lg shadow-emerald-500/10"
                                >
                                  {actionLoading === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> อนุมัติและเสร็จสิ้น</>}
                               </Button>
                             </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-muted dark:bg-black/40 rounded-2xl border border-border dark:border-white/5 shadow-inner">
                             <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] font-black mb-1">ช่างเทคนิค</p>
                             <p className="text-sm font-black text-foreground dark:text-white tracking-widest">{ticket.technician_name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      <TicketDetailDialog 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        ticket={selectedTicket} 
      />
    </div>
  );
};
