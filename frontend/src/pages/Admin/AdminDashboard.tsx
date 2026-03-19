import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Shield, UserMinus, Loader2, Search, Edit2, Check, X, ShieldCheck, Mail, Briefcase, History, Clock, Activity } from 'lucide-react';
import { authService } from '@/services/authService';
import { getAuditLogs } from '@/services/auditLogService';

export const AdminDashboard = () => {  
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authService.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (activeTab === 'users') fetchUsers();
    else fetchLogs();
  }, [activeTab]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setActionLoading(id);
    try {
      await authService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditStart = (user: any) => {
    setEditingId(user.id);
    setEditFormData({
      full_name: user.full_name,
      role: user.role,
      department: user.department || ''
    });
  };

  const handleEditSave = async (id: number) => {
    setActionLoading(id);
    try {
      await authService.updateUser(id, editFormData);
      setUsers(users.map(u => u.id === id ? { ...u, ...editFormData } : u));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/20 text-primary rounded-xl backdrop-blur-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
                Admin Console
              </h1>
            </div>
            <p className="text-lg text-white/60 ml-1">
              System management, user directory, and activity audits.
            </p>
          </div>
          
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${
                activeTab === 'users' ? 'bg-primary text-black shadow-lg text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${
                activeTab === 'logs' ? 'bg-primary text-black shadow-lg text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              Audit Logs
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content based on active tab */}
      {activeTab === 'users' ? (
        <>
          {/* Stats Quick View */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400' },
               { label: 'Technicians', value: users.filter(u => u.role === 'Technician').length, icon: Shield, color: 'text-amber-400' },
               { label: 'Managers', value: users.filter(u => u.role === 'Manager').length, icon: ShieldCheck, color: 'text-emerald-400' },
               { label: 'Admins', value: users.filter(u => u.role === 'Admin').length, icon: UserPlus, color: 'text-purple-400' },
             ].map((stat, i) => (
                <motion.div 
                   key={stat.label}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 + (i * 0.05) }}
                   className="glass-card p-4 flex items-center gap-4 border border-white/5"
                >
                   <div className={`p-2 rounded-lg bg-black/40 ${stat.color} border border-white/5`}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-xs text-white/40 font-medium">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                   </div>
                </motion.div>
             ))}
          </div>

          <div className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
             <Search className="w-5 h-5 text-white/30 ml-2" />
             <input 
               type="text" 
               placeholder="Search users..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none text-white outline-none w-full py-1"
             />
          </div>

          {/* Users List */}
          <div className="glass-card overflow-hidden border border-white/10 shadow-2xl">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">User Info</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Role</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Department</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence mode="popLayout">
                      {filteredUsers.map((u) => (
                        <motion.tr 
                          key={u.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                {u.full_name?.charAt(0) || u.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                {editingId === u.id ? (
                                   <input 
                                     className="bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-sm"
                                     value={editFormData.full_name}
                                     onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                                   />
                                ) : (
                                  <p className="font-bold text-white mb-0.5">{u.full_name}</p>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                   <Mail className="w-3 h-3" />
                                   {u.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {editingId === u.id ? (
                              <select 
                                className="bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-sm outline-none focus:border-primary"
                                value={editFormData.role}
                                onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                              >
                                <option value="Student">Student</option>
                                <option value="Technician">Technician</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                              </select>
                            ) : (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                u.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                u.role === 'Manager' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                u.role === 'Technician' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>
                                {u.role}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                             {editingId === u.id ? (
                                <input 
                                  className="bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-sm w-full"
                                  value={editFormData.department}
                                  onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                                />
                             ) : (
                               <div className="flex items-center gap-1.5 text-sm text-white/60">
                                  <Briefcase className="w-3.5 h-3.5 text-white/20" />
                                  {u.department || 'N/A'}
                               </div>
                             )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {editingId === u.id ? (
                                <>
                                  <button 
                                    onClick={() => handleEditSave(u.id)}
                                    disabled={actionLoading === u.id}
                                    className="p-2 bg-primary/20 text-primary hover:bg-primary hover:text-black rounded-lg transition-all"
                                  >
                                    {actionLoading === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                  </button>
                                  <button 
                                    onClick={() => setEditingId(null)}
                                    className="p-2 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => handleEditStart(u)}
                                    className="p-2 text-white/30 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(u.id)}
                                    disabled={actionLoading === u.id}
                                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                  >
                                    {actionLoading === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Audit Logs Tab */
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 border border-white/5 flex flex-col gap-2"
              >
                <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 mb-2">
                   <Activity className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-white/60">System Health</p>
                <p className="text-2xl font-black text-white">OPERATIONAL</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 border border-white/5 flex flex-col gap-2"
              >
                <div className="p-2 w-fit rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/20 mb-2">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-white/60">Total Events Logged</p>
                <p className="text-2xl font-black text-white">{logs.length}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 border border-white/5 flex flex-col gap-2"
              >
                <div className="p-2 w-fit rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/20 mb-2">
                   <Clock className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-white/60">Last Alert</p>
                <p className="text-2xl font-black text-white">NONE</p>
              </motion.div>
           </div>

           <div className="glass-card overflow-hidden border border-white/10 shadow-2xl">
              <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    System Audit Trail
                 </h2>
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-64 bg-black/40 border border-white/10 rounded-xl px-3 flex items-center gap-2">
                       <Search className="w-4 h-4 text-white/20" />
                       <input 
                         type="text" 
                         placeholder="Filter by action or module..."
                         className="bg-transparent border-none py-2 text-sm text-white outline-none w-full"
                         value={logSearchQuery}
                         onChange={(e) => setLogSearchQuery(e.target.value)}
                       />
                    </div>
                    <button 
                      onClick={fetchLogs}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white"
                    >
                      <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                 </div>
              </div>
              
              {loading && logs.length === 0 ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
                 </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Timestamp</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Actor</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Action</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Module</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-xs">
                      {logs
                        .filter(log => 
                          log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                          log.module?.toLowerCase().includes(logSearchQuery.toLowerCase())
                        )
                        .map((log) => (
                        <tr 
                          key={log.id} 
                          onClick={() => {
                            setSelectedLog(log);
                            setIsLogModalOpen(true);
                          }}
                          className="hover:bg-white/[0.05] transition-colors border-l-2 border-transparent hover:border-primary/40 cursor-pointer"
                        >
                          <td className="px-6 py-4 text-white/60 whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] text-white/80">
                                  {log.actor_name?.charAt(0).toUpperCase() || '?'}
                               </div>
                               <span className="text-white/80 font-bold">{log.actor_name || 'System'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              log.action.includes('ERROR') || log.action.includes('FAILED') ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                              log.action.includes('CREATED') || log.action.includes('SUCCESS') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                              'bg-white/10 text-white/80 border border-white/5'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/40">
                             {log.module}
                          </td>
                          <td className="px-6 py-4 text-white/40 max-w-xs truncate" title={log.details}>
                             {log.details || '-'}
                          </td>
                        </tr>
                      ))}
                      {logs.length === 0 && !loading && (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center text-white/30">
                             No audit logs recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Log Detail Modal */}
      <AnimatePresence>
        {isLogModalOpen && selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsLogModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider mb-2 inline-block border ${
                      selectedLog.action.includes('ERROR') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {selectedLog.module} Log Item
                    </span>
                    <h2 className="text-3xl font-black text-white">{selectedLog.action}</h2>
                  </div>
                  <button 
                    onClick={() => setIsLogModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white/40" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black mb-1">Timestamp</p>
                      <p className="text-sm text-white/80">{new Date(selectedLog.created_at).toLocaleString()}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black mb-1">Actor</p>
                      <p className="text-sm text-white/80">{selectedLog.actor_name || 'System'}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black mb-1">IP Address</p>
                      <p className="text-sm text-white/80 font-mono">{selectedLog.ip_address || 'Internal'}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black mb-1">Module</p>
                      <p className="text-sm text-white/80">{selectedLog.module}</p>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] text-white/30 uppercase font-black mb-2 px-2">Data Details</p>
                   <div className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-xs overflow-auto max-h-64 scrollbar-hide">
                      {selectedLog.details && selectedLog.details.startsWith('{') ? (
                        <pre className="text-emerald-400/80 leading-relaxed">
                          {JSON.stringify(JSON.parse(selectedLog.details), null, 2)}
                        </pre>
                      ) : (
                        <p className="text-white/60 leading-relaxed italic">{selectedLog.details || 'No data recorded.'}</p>
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
