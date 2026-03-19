import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle2, Clock, MapPin, AlertCircle, Loader2, Send, Eye, X, ShieldCheck, ChevronRight, Activity, Zap, ClipboardCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import * as api from '@/services/technicianService';
import { TicketDetailDialog } from '@/components/tickets/TicketDetailDialog';
import { FileUpload } from '@/components/ui/FileUpload';

export const TechnicianDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'assigned' | 'history'>('assigned');
  const [assignedTickets, setAssignedTickets] = useState<any[]>([]);
  const [historyTickets, setHistoryTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for actions
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [submittingTicket, setSubmittingTicket] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [imageAfter, setImageAfter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignedRes, historyRes] = await Promise.all([
        api.getAssignedTickets(),
        api.getTicketHistory()
      ]);
      setAssignedTickets(assignedRes.data.data || []);
      setHistoryTickets(historyRes.data.data || []);
    } catch (error) {
      console.error("Error fetching technician tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartWork = async (ticketId: number) => {
    setActionLoadingId(ticketId);
    try {
      await api.startTicket(ticketId);
      // Update local state without full reload
      setAssignedTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, status: 'In_Progress' } : t
      ));
    } catch (error) {
      console.error("Error starting work:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSubmitWork = async () => {
    if (!submittingTicket) return;
    if (!notes.trim()) return;
    
    setActionLoadingId(submittingTicket.id);
    setSubmissionError(null);
    try {
      await api.submitTicket(submittingTicket.id, {
        notes,
        image_after: imageAfter
      });
      // SUCCESS: Clear states and close dialog
      setSubmittingTicket(null);
      setNotes('');
      setImageAfter('');
      fetchData(); // Refetch to get updated lists
    } catch (error) {
      console.error("Error submitting work:", error);
      setSubmissionError("Protocol error. Verify telemetry connection.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderTicketCard = (ticket: any, i: number, isHistory: boolean = false) => (
    <motion.div
      layout
      key={ticket.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: i * 0.05 }}
      className={`glass-card p-6 rounded-[2.5rem] bg-card/60 dark:bg-black/40 border transition-all duration-500 flex flex-col gap-6 relative overflow-hidden group shadow-2xl ${
        isHistory ? 'border-border/50 dark:border-white/5 opacity-70 hover:opacity-100' : 'border-border/50 dark:border-white/10 hover:border-primary/40'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${isHistory ? 'bg-muted dark:bg-white/5 text-muted-foreground border-border dark:border-white/5' : 'bg-primary/10 text-primary border-primary/20'}`}>
              {ticket.category_name}
            </span>
            <span className="text-[10px] font-black text-muted-foreground/40 flex items-center gap-1.5 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {new Date(ticket.created_at).toLocaleDateString()}
            </span>
          </div>
          <h4 className="text-2xl font-headline font-black text-foreground dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
            {ticket.description}
          </h4>
          <p className="text-sm text-muted-foreground font-medium italic opacity-60">
            System Request by <span className="font-bold uppercase tracking-widest">{ticket.reporter_name}</span>
          </p>
        </div>
        
        {isHistory && (
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

      <div className="bg-muted dark:bg-black/60 p-5 rounded-[2rem] border border-border dark:border-white/5 flex items-start gap-4 shadow-inner grow">
        <div className={`p-3 rounded-2xl border shadow-sm ${isHistory ? 'bg-muted text-muted-foreground border-border' : 'bg-primary/10 text-primary border-primary/20'}`}>
          <MapPin className="w-5 h-5" />
        </div>
        <div className="text-sm leading-relaxed overflow-hidden">
          <p className="font-black text-foreground dark:text-white uppercase tracking-widest truncate">{ticket.building_name}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">Level {ticket.floor_number} • {ticket.room_name} <span className="opacity-40">(Section {ticket.room_number})</span></p>
        </div>
      </div>
      
      {!isHistory && (
        <div className="mt-2 space-y-6">
          {ticket.is_rejected === 1 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-[1.5rem] p-5 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <AlertCircle className="w-4 h-4" />
                Protocol Non-Compliance
              </div>
              <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                "{ticket.latest_note?.replace('REJECTED: ', '') || 'Awaiting further clarification'}"
              </p>
            </motion.div>
          )}
          
          <div className="flex items-center justify-between pt-6 border-t border-border dark:border-white/5">
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${ticket.status === 'In_Progress' ? 'bg-blue-500 animate-pulse' : 'bg-muted-foreground'}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                 ticket.status === 'In_Progress' ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
               }`}>
                 {ticket.status.replace('_', ' ')}
               </span>
            </div>
          
            {ticket.status === 'Assigned' && (
              <Button 
                size="sm" 
                onClick={() => handleStartWork(ticket.id)}
                disabled={actionLoadingId === ticket.id}
                className="bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-xl px-6 h-11 hover:scale-105 transition-all shadow-xl shadow-primary/20 group/btn"
              >
                {actionLoadingId === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <span className="flex items-center gap-2">Initialize Sequence <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></span>
                )}
              </Button>
            )}
    
            {ticket.status === 'In_Progress' && (
              <Button 
                size="sm" 
                onClick={() => setSubmittingTicket(ticket)}
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-black border border-emerald-500/30 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl px-6 h-11 transition-all shadow-lg shadow-emerald-500/10 group/btn"
              >
                <span className="flex items-center gap-2">Finalize Protocol <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /></span>
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
 
  return (
    <div className="space-y-10 pb-16 w-full max-w-6xl mx-auto relative">
      {/* Submit Dialog Overlay */}
      <AnimatePresence>
        {submittingTicket && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card dark:bg-black/60 border border-border dark:border-white/10 p-10 md:p-14 rounded-[3rem] w-full max-w-2xl shadow-2xl space-y-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/20 text-primary rounded-2xl border border-primary/20">
                      <Send className="w-8 h-8" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-headline font-black text-foreground dark:text-white uppercase tracking-tight leading-none">Execution Report</h3>
                      <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mt-2">Protocol Finalization</p>
                   </div>
                </div>
                <p className="text-lg text-muted-foreground font-medium italic leading-relaxed opacity-60 pt-4 border-t border-border dark:border-white/5">
                   Finalizing maintenance sequence for: <span className="text-foreground dark:text-white font-black not-italic">"{submittingTicket.description}"</span>
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="group/textarea">
                  <label className="block text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-3 px-2">Compliance Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Document structural modifications and sequence resolution..."
                    className="w-full bg-muted dark:bg-black/60 border border-border dark:border-white/10 rounded-[2rem] p-8 text-foreground dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[160px] text-sm font-medium shadow-inner transition-all group-hover/textarea:border-primary/30"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-3 px-2">Visual Documentation</label>
                  <FileUpload 
                    label="Capture Execution Result"
                    onUploadSuccess={(url) => setImageAfter(url)}
                  />
                  {imageAfter && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-video rounded-[2rem] overflow-hidden border border-border dark:border-white/10 group shadow-2xl"
                    >
                      <img src={imageAfter} alt="Upload Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setImageAfter('')}
                          className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl"
                        >
                          <X className="w-4 h-4 mr-2" /> Discard Documentation
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {submissionError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-start gap-4 text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{submissionError}</p>
                  </motion.div>
                )}
              </div>
 
              <div className="flex flex-col md:flex-row gap-5 pt-10 border-t border-border dark:border-white/5">
                <Button variant="ghost" className="md:flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:bg-muted" onClick={() => setSubmittingTicket(null)}>
                  Abort Submission
                </Button>
                <Button 
                  className="md:flex-1 h-14 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 rounded-2xl" 
                  onClick={handleSubmitWork}
                  disabled={actionLoadingId === submittingTicket.id}
                >
                  {actionLoadingId === submittingTicket.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log Protocol Data'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Container */}
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
                <Wrench className="w-8 h-8" />
              </div>
                  <div>
                <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-foreground dark:text-white leading-none">
                  {t('technician.portal_title')}
                </h1>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2 ml-1">Terminal_Sector_01</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl ml-1 font-medium leading-relaxed italic">
               {t('technician.portal_desc')}
            </p>
          </div>
 
          <div className="flex bg-muted/50 dark:bg-black/40 p-1.5 rounded-2xl border border-border dark:border-white/5 backdrop-blur-md shadow-inner self-stretch md:self-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap flex items-center gap-2 ${activeTab === 'assigned' ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'text-muted-foreground/40 hover:text-foreground'}`}
            >
              <Zap className="w-4 h-4" />
              {t('technician.active_jobs')}
              <span className="ml-1 bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded-md">{assignedTickets.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap flex items-center gap-2 ${activeTab === 'history' ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'text-muted-foreground/40 hover:text-foreground'}`}
            >
              <ClipboardCheck className="w-4 h-4" />
              {t('technician.history')}
              <span className="ml-1 bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded-md">{historyTickets.length}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'assigned' && (
            <motion.div
              layout
              key="assigned-tab"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 px-4">
                 <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
                    <Activity className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-headline font-black text-foreground dark:text-white uppercase tracking-widest underline decoration-primary/30 underline-offset-8">Terminal_Active_Load</h3>
              </div>

              {assignedTickets.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 text-center border-2 border-dashed border-border dark:border-white/10 rounded-[2.5rem] text-muted-foreground bg-card/50 dark:bg-black/10 backdrop-blur-sm"
                >
                  <div className="mx-auto w-24 h-24 bg-muted dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-muted-foreground/20 border border-border dark:border-white/5 shadow-inner">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  <p className="text-2xl font-headline font-black text-foreground/40 dark:text-white/20 uppercase tracking-[0.2em]">{t('technician.no_active')}</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AnimatePresence mode="popLayout">
                    {assignedTickets.map((ticket, i) => renderTicketCard(ticket, i, false))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 px-4">
                 <div className="p-2 bg-muted text-muted-foreground rounded-lg border border-border">
                    <ClipboardCheck className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-headline font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest underline decoration-border underline-offset-8">Unit_History_Archive</h3>
              </div>

              {historyTickets.length === 0 ? (
                 <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 text-center border-2 border-dashed border-border dark:border-white/10 rounded-[2.5rem] text-muted-foreground bg-card/50 dark:bg-black/10 backdrop-blur-sm"
                >
                  <p className="text-lg font-headline font-black text-foreground/20 dark:text-white/10 uppercase tracking-[0.2em]">{t('technician.no_history')}</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {historyTickets.map((ticket, i) => renderTicketCard(ticket, i, true))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <TicketDetailDialog 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        ticket={selectedTicket} 
      />

      {/* Terminal Console Section */}
      
    </div>
  );
};
