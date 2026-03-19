import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Loader2, 
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import * as api from '@/services/dispatchService';
import { TicketDetailDialog } from '@/components/tickets/TicketDetailDialog';

export const TechnicianManagement = () => {
  const { t } = useTranslation();
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
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 w-full max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedTech ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 text-primary rounded-xl backdrop-blur-md">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
                  {t('nav.members')}
                </h1>
                <p className="text-lg text-white/60 mt-1">
                  Monitor performance and manage assignments across the team.
                </p>
              </div>
            </div>

            {/* Tech Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicians.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => fetchTechDetails(tech)}
                  className="glass-card group p-6 border border-white/10 hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-secondary-foreground border border-white/10">
                      {tech.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                        {tech.full_name}
                      </h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                        {tech.department || 'General Maintenance'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black mb-1">Status</p>
                      <Badge variant={tech.active_tickets_count > 0 ? "secondary" : "success"} className="w-full justify-center">
                        {tech.active_tickets_count > 0 ? t('technician.busy') : t('technician.available')}
                      </Badge>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black mb-1">Active Tasks</p>
                      <p className="text-lg font-black text-white">{tech.active_tickets_count}</p>
                    </div>
                  </div>
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
            className="space-y-8"
          >
            {/* Action Bar */}
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team
            </button>

            {/* Profile Header */}
            <div className="glass-card p-8 border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
               
               <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-4xl font-black text-primary border border-primary/30 shadow-2xl shadow-primary/10">
                    {selectedTech.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-black text-white mb-2">{selectedTech.full_name}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                       <span className="flex items-center gap-2 text-white/60 text-sm">
                          <Briefcase className="w-4 h-4 text-primary" />
                          {selectedTech.department || 'Maintenance Dept'}
                       </span>
                       <span className="flex items-center gap-2 text-white/60 text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          Member since {new Date().getFullYear()}
                       </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="text-center bg-white/5 px-6 py-4 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <p className="text-3xl font-black text-white">{techDetails?.completed_count || 0}</p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Completed</p>
                     </div>
                     <div className="text-center bg-white/5 px-6 py-4 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <p className="text-3xl font-black text-white">{techDetails?.active_count || 0}</p>
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Active</p>
                     </div>
                  </div>
               </div>
            </div>

            {detailsLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Tasks Column */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="flex items-center gap-2 px-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Active Workload</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {techDetails?.active_tasks?.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-3xl bg-white/2">
                        <p className="text-white/30 text-sm font-medium">No active assignments</p>
                      </div>
                    ) : (
                      techDetails?.active_tasks?.map((task: any) => (
                        <div 
                          key={task.id}
                          onClick={() => { setSelectedTicket(task); setIsTicketOpen(true); }}
                          className="glass-card p-5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-bold">
                              {task.category_name}
                            </Badge>
                            <span className="text-[10px] text-white/30 font-bold uppercase">{task.status}</span>
                          </div>
                          <h5 className="font-bold text-white mb-1 line-clamp-2 group-hover:text-primary transition-colors">{task.description}</h5>
                          <p className="text-xs text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(task.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* History Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-2 px-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Fix History</h3>
                  </div>

                  <div className="space-y-4">
                    {techHistory.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl bg-white/2">
                        <CheckCircle2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 font-medium italic text-sm">No completed repairs yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {techHistory.map((history) => (
                          <div 
                            key={history.id}
                            onClick={() => { setSelectedTicket(history); setIsTicketOpen(true); }}
                            className="glass-card p-5 border border-white/5 border-l-4 border-l-emerald-500/30 hover:bg-white/5 transition-all cursor-pointer"
                          >
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-white/30 uppercase">#{history.id}</span>
                                <span className="text-[10px] font-bold text-emerald-500/60 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(history.updated_at).toLocaleDateString()}
                                </span>
                             </div>
                             <h6 className="font-bold text-white mb-2 line-clamp-1">{history.description}</h6>
                             <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-white/5 text-[9px] h-5 px-2">
                                  {history.category_name}
                                </Badge>
                                <span className="text-[10px] text-white/40 italic">Completed</span>
                             </div>
                          </div>
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
