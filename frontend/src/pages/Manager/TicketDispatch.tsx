import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, UserCheck, AlertCircle, Loader2, Clock, MapPin, CheckCircle2, XCircle, Eye, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import * as api from '@/services/dispatchService';
import { TicketDetailDialog } from '@/components/tickets/TicketDetailDialog';

type Tab = 'pending' | 'review' | 'history';

export const TicketDispatch = () => {
  const { t } = useTranslation();
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
      alert("Failed to assign ticket.");
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
      alert("Failed to approve ticket.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (ticketId: number) => {
    const note = prompt("Please provide a reason for rejection:");
    if (note === null) return;
    
    setActionLoading(ticketId);
    try {
      await api.rejectTicket(ticketId, note);
      setTickets(tickets.filter(t => t.id !== ticketId));
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      alert("Failed to reject ticket.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(23,23,23,0.9) 0%, rgba(30,30,30,0.95) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.15)'
        }}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 text-primary rounded-xl backdrop-blur-md">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
                Ticket Administration
              </h1>
              <p className="text-lg text-white/60 mt-1">
                {activeTab === 'pending' ? 'Dispatch new requests to technicians.' : 'Review and finalize completed repairs.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl backdrop-blur-xl border border-white/5">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'pending' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <AlertCircle className="w-4 h-4" />
              Pending
              {activeTab === 'pending' && <span className="ml-1 bg-black/20 px-1.5 rounded text-[10px]">{tickets.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'review' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Review
              {activeTab === 'review' && <span className="ml-1 bg-black/20 px-1.5 rounded text-[10px]">{tickets.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'history' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <History className="w-4 h-4" />
              {t('tickets.history')}
              {activeTab === 'history' && <span className="ml-1 bg-black/20 px-1.5 rounded text-[10px]">{tickets.length}</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        <div className="space-y-6">
           <AnimatePresence mode="popLayout">
            {tickets.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-24 text-center border-2 border-dashed border-white/10 rounded-3xl text-white/40 bg-black/10 backdrop-blur-sm"
              >
                <div className="mx-auto w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20 border border-white/5">
                  <ClipboardList className="w-10 h-10" />
                </div>
                <p className="text-xl font-medium">No tickets in this section.</p>
                <p className="text-sm">Everything is running smoothly!</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket, index) => (
                  <motion.div
                    layout
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6 flex flex-col gap-4 border border-white/10 hover:border-primary/30 transition-all hover:bg-black/50 group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${activeTab === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {ticket.category_name}
                          </span>
                          <span className="text-[10px] font-bold text-white/30 flex items-center gap-1 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                          {ticket.description}
                        </h4>
                        <p className="text-sm text-white/40">
                          Reported by <span className="text-white/70">{ticket.reporter_name}</span>
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
                           className="text-white/20 hover:text-primary hover:bg-primary/10"
                        >
                           <Eye className="w-5 h-5" />
                        </Button>
                      )}
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="text-sm leading-relaxed">
                        <p className="font-bold text-white/90">{ticket.building_name}</p>
                        <p className="text-white/40">Floor {ticket.floor_number} • {ticket.room_name} (Room {ticket.room_number})</p>
                      </div>
                    </div>
                    {activeTab === 'pending' ? (
                      <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
                        <div className="relative">
                           <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                             <select 
                             className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary outline-none transition-all appearance-none"
                             value={assignments[ticket.id] || ''}
                             onChange={(e) => setAssignments({ ...assignments, [ticket.id]: e.target.value })}
                           >
                             <option value="" disabled>{t('tickets.unassigned')}</option>
                             {technicians.map(tech => (
                               <option 
                                 key={tech.id} 
                                 value={tech.id} 
                                 disabled={tech.active_tickets_count > 0}
                                 className={`${tech.active_tickets_count > 0 ? 'text-white/20' : 'text-white'} bg-[#1a1a1a]`}
                               >
                                 {tech.full_name} ({tech.department || 'General'}) - {tech.active_tickets_count > 0 ? `[${t('technician.busy')}]` : `[${t('technician.available')}]`}
                               </option>
                             ))}
                           </select>
                        </div>
                        <Button 
                          onClick={() => handleAssign(ticket.id)}
                          disabled={!assignments[ticket.id] || actionLoading === ticket.id}
                          className="w-full bg-primary text-black font-black hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 h-12"
                        >
                          {actionLoading === ticket.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Assignment'}
                        </Button>
                      </div>
                    ) : activeTab === 'review' ? (
                      <div className="mt-auto pt-6 border-t border-white/5 grid grid-cols-2 gap-3">
                         <div className="col-span-2 mb-2">
                            <p className="text-xs text-white/30 uppercase tracking-widest font-black mb-1">Assigned Tech</p>
                            <p className="text-sm font-bold text-white/80">{ticket.technician_name}</p>
                         </div>
                         <Button 
                            onClick={() => handleReject(ticket.id)}
                            disabled={actionLoading === ticket.id}
                            className="bg-white/5 border border-white/10 text-red-400 hover:bg-red-400/10 hover:border-red-400/50 font-bold h-10"
                         >
                            {actionLoading === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-2" /> Reject</>}
                         </Button>
                         <Button 
                            onClick={() => handleApprove(ticket.id)}
                            disabled={actionLoading === ticket.id}
                            className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold h-10"
                         >
                            {actionLoading === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Approve</>}
                         </Button>
                      </div>
                    ) : (
                      <div className="mt-auto pt-6 border-t border-white/5">
                         <p className="text-xs text-white/30 uppercase tracking-widest font-black mb-1">{t('auth.technician')}</p>
                         <p className="text-sm font-bold text-white/80">{ticket.technician_name}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Detail View modal removed in favor of TicketDetailDialog */}

      <TicketDetailDialog 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        ticket={selectedTicket} 
      />
    </div>
  );
};
