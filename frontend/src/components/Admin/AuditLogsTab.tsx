import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Loader2, X, Activity, ShieldCheck, Clock } from 'lucide-react';
import { getAuditLogs } from '@/services/auditLogService';

export const AuditLogsTab = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs(100);
      setLogs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    (log.module || '').toLowerCase().includes(logSearchQuery.toLowerCase()) ||
    (log.actor_name || '').toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Audit Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'System Health', value: 'OPERATIONAL', icon: Activity, color: 'text-emerald-500' },
          { label: 'Total Events', value: logs.length, icon: ShieldCheck, color: 'text-blue-500' },
          { label: 'Last Alert', value: 'NONE', icon: Clock, color: 'text-amber-500' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border border-border/50 dark:border-white/5 bg-card/50 backdrop-blur-md flex flex-col gap-2"
          >
            <div className={`p-2.5 w-fit rounded-xl bg-muted dark:bg-black/40 ${stat.color} border border-border dark:border-white/5`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-headline font-black text-foreground dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card overflow-hidden border border-border/50 dark:border-white/10 shadow-2xl bg-card/80 dark:bg-black/40">
        <div className="px-6 py-4 border-b border-border dark:border-white/10 bg-muted/30 dark:bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-headline font-black text-foreground dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            System Audit Trail
          </h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-64 bg-muted/50 dark:bg-black/40 border border-border dark:border-white/10 rounded-xl px-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground/20" />
              <input 
                type="text" 
                placeholder="Filter action matrix..."
                className="bg-transparent border-none py-2 text-sm text-foreground dark:text-white outline-none w-full font-medium"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchLogs}
              className="p-2.5 bg-muted dark:bg-white/5 rounded-xl transition-all text-muted-foreground/40 hover:text-primary border border-border dark:border-white/5"
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 dark:bg-white/5 border-b border-border dark:border-white/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground/50">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground/50">Actor</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground/50">Action</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground/50">Module</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground/50">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5 font-mono text-[10px]">
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => {
                    setSelectedLog(log);
                    setIsLogModalOpen(true);
                  }}
                  className="hover:bg-muted/30 dark:hover:bg-white/[0.05] transition-colors border-l-2 border-transparent hover:border-primary/40 cursor-pointer"
                >
                  <td className="px-6 py-4 text-muted-foreground dark:text-white/60 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-md bg-muted dark:bg-white/10 flex items-center justify-center text-[10px] text-muted-foreground dark:text-white/80 border border-border dark:border-white/5">
                          {log.actor_name?.charAt(0).toUpperCase() || '?'}
                       </div>
                       <span className="text-foreground dark:text-white/80 font-black uppercase tracking-widest">{log.actor_name || 'System'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      log.action.includes('ERROR') || log.action.includes('FAILED') ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      log.action.includes('CREATED') || log.action.includes('SUCCESS') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      'bg-muted dark:bg-white/10 text-muted-foreground dark:text-white/80 border border-border dark:border-white/5'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-white/40">
                     {log.module}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-white/40 max-w-xs truncate" title={log.details}>
                     {log.details || '-'}
                  </td>
                </tr>
              ))}
              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground/30 font-black uppercase tracking-[0.3em] font-sans">
                     No event matrix recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {isLogModalOpen && selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsLogModalOpen(false)}
              className="absolute inset-0 bg-background/80 dark:bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-card dark:bg-[#0f0f0f] border border-border dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider mb-2 inline-block border ${
                      selectedLog.action.includes('ERROR') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {selectedLog.module} Item Entry
                    </span>
                    <h2 className="text-3xl font-headline font-black text-foreground dark:text-white">{selectedLog.action}</h2>
                  </div>
                  <button 
                    onClick={() => setIsLogModalOpen(false)}
                    className="p-2 hover:bg-muted dark:hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-muted-foreground/40" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-muted/30 dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-white/5">
                      <p className="text-[10px] text-muted-foreground/40 uppercase font-black mb-1">Timestamp</p>
                      <p className="text-sm font-bold text-foreground dark:text-white/80">{new Date(selectedLog.created_at).toLocaleString()}</p>
                   </div>
                   <div className="bg-muted/30 dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-white/5">
                      <p className="text-[10px] text-muted-foreground/40 uppercase font-black mb-1">Actor</p>
                      <p className="text-sm font-bold text-foreground dark:text-white/80">{selectedLog.actor_name || 'System Environment'}</p>
                   </div>
                   <div className="bg-muted/30 dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-white/5">
                      <p className="text-[10px] text-muted-foreground/40 uppercase font-black mb-1">IP Address</p>
                      <p className="text-sm font-mono text-foreground dark:text-white/80">{selectedLog.ip_address || 'Internal Network'}</p>
                   </div>
                   <div className="bg-muted/30 dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-white/5">
                      <p className="text-[10px] text-muted-foreground/40 uppercase font-black mb-1">Module</p>
                      <p className="text-sm font-bold text-foreground dark:text-white/80">{selectedLog.module}</p>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] text-muted-foreground/40 uppercase font-black mb-2 px-2">Action Details Matrix</p>
                   <div className="bg-muted dark:bg-black/60 p-6 rounded-2xl border border-border dark:border-white/5 font-mono text-xs overflow-auto max-h-64 scrollbar-hide shadow-inner">
                      {selectedLog.details && selectedLog.details.startsWith('{') ? (
                        <pre className="text-emerald-600 dark:text-emerald-400/80 leading-relaxed">
                          {JSON.stringify(JSON.parse(selectedLog.details), null, 2)}
                        </pre>
                      ) : (
                        <p className="text-muted-foreground dark:text-white/60 leading-relaxed italic">{selectedLog.details || 'No trace recorded.'}</p>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
