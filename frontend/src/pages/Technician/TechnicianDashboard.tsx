import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle2, Clock, MapPin, AlertCircle, Loader2, PlayCircle, Send, Eye, X } from 'lucide-react';
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
      alert("Failed to start task. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSubmitWork = async () => {
    if (!submittingTicket) return;
    if (!notes.trim()) {
      alert("Please provide completion notes.");
      return;
    }
    
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
      setSubmissionError("Network error. Please check your connection and try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderTicketCard = (ticket: any, i: number, isHistory: boolean = false) => (
    <motion.div
      layout
      key={ticket.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: i * 0.05 }}
      className={`glass-card p-6 flex flex-col gap-4 border transition-all ${
        isHistory ? 'border-white/5 opacity-80' : 'border-primary/20 hover:border-primary/50 group'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${isHistory ? 'bg-white/10 text-white/70' : 'bg-primary/20 text-primary'}`}>
              {ticket.category_name}
            </span>
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(ticket.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-white font-medium text-lg mb-1 leading-snug">
            {ticket.description}
          </p>
          <p className="text-sm text-white/50">
            {t('auth.reporter')}: <span className="text-white/80">{ticket.reporter_name}</span>
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
            className="text-white/20 hover:text-white hover:bg-white/10"
          >
            <Eye className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-3">
        <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${isHistory ? 'text-white/30' : 'text-primary/70'}`} />
        <div className="text-sm text-white/80 leading-snug">
          {ticket.building_name}, {t('infrastructure.floor')} {ticket.floor_number}
          <br />
          <span className="text-white/50">{ticket.room_name} ({t('infrastructure.room')} {ticket.room_number})</span>
        </div>
      </div>
      
      {!isHistory && (
        <div className="mt-2 text-right flex flex-col gap-4 border-t border-white/5 pt-4">
          {ticket.is_rejected === 1 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex flex-col gap-1 text-left">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                {t('technician.rejected')}
              </div>
              <p className="text-xs text-white/70 italic line-clamp-2">
                {ticket.latest_note?.replace('REJECTED: ', '') || 'No reason provided'}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              ticket.status === 'In_Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
              ticket.is_rejected ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
              'bg-white/5 text-white/40 border-white/10'
            }`}>
              {ticket.status.replace('_', ' ')}
            </span>
          
            {ticket.status === 'Assigned' && (
              <Button 
                size="sm" 
                onClick={() => handleStartWork(ticket.id)}
                disabled={actionLoadingId === ticket.id}
                className="bg-primary text-black hover:bg-white font-bold transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
              >
                {actionLoadingId === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <><PlayCircle className="w-4 h-4 mr-2" /> {t('technician.start_work')}</>
                )}
              </Button>
            )}
    
            {ticket.status === 'In_Progress' && (
              <Button 
                size="sm" 
                onClick={() => setSubmittingTicket(ticket)}
                className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/50 font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> {t('technician.complete_job')}
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
 
  return (
    <div className="space-y-8 pb-12 w-full max-w-5xl mx-auto relative">
      {/* Submit Dialog Overlay */}
      <AnimatePresence>
        {submittingTicket && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass border border-white/10 p-6 rounded-3xl w-full max-w-lg shadow-2xl space-y-4"
            >
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Send className="w-6 h-6 text-primary" />
                {t('technician.submit_report')}
              </h3>
              <p className="text-white/60 text-sm">
                {t('technician.submit_desc', { description: submittingTicket.description })}
              </p>
              
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">{t('technician.notes_label')}</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('technician.notes_placeholder')}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[100px]"
                  />
                </div>
                <div>
                  <FileUpload 
                    label={t('technician.image_label')}
                    onUploadSuccess={(url) => setImageAfter(url)}
                  />
                  {imageAfter && (
                    <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                      <img src={imageAfter} alt="Upload Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setImageAfter('')}
                          className="h-8 px-3"
                        >
                          <X className="w-4 h-4 mr-2" /> {t('common.remove')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {submissionError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submissionError}</span>
                  </div>
                )}
              </div>
 
              <div className="flex gap-3 pt-4 border-t border-white/10 mt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setSubmittingTicket(null)}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  className="flex-1 bg-primary text-black font-bold hover:bg-white" 
                  onClick={handleSubmitWork}
                  disabled={actionLoadingId === submittingTicket.id}
                >
                  {actionLoadingId === submittingTicket.id ? <Loader2 className="w-5 h-5 animate-spin" /> : t('technician.submit_to_admin')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(23,23,23,0.9) 0%, rgba(30,30,30,0.95) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.15)'
        }}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/20 text-primary rounded-xl backdrop-blur-md">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
                {t('technician.portal_title')}
              </h1>
              <p className="text-lg text-white/60 mt-1">
                {t('technician.portal_desc')}
              </p>
            </div>
          </div>
 
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl backdrop-blur-xl border border-white/5">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'assigned' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <AlertCircle className="w-4 h-4" />
              {t('technician.active_jobs')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'history' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {t('technician.history')}
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
        <AnimatePresence mode="wait">
          {activeTab === 'assigned' && (
            <motion.div
              layout
              key="assigned-tab"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold px-2">{t('technician.active_jobs')} ({assignedTickets.length})</h3>
              {assignedTickets.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-3xl text-white/40 bg-black/20">
                  <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  {t('technician.no_active')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold px-2 text-white/80">{t('technician.history')} ({historyTickets.length})</h3>
              {historyTickets.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-3xl text-white/40 bg-black/20">
                  {t('technician.no_history')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};
