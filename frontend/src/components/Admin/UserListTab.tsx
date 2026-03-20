import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Shield, UserMinus, Loader2, Search, Edit2, Check, X, ShieldCheck, Mail, Briefcase } from 'lucide-react';
import { authService } from '@/services/authService';

interface UserListTabProps {
  onUsersUpdate?: () => void;
}

export const UserListTab = ({ onUsersUpdate }: UserListTabProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authService.getUsers();
      setUsers(response.data || []);
      if (onUsersUpdate) onUsersUpdate();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานรายนี้?')) return;
    setActionLoading(id);
    try {
      await authService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
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
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'ผู้ใช้งานทั้งหมด', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'ช่างเทคนิค', value: users.filter(u => u.role === 'Technician').length, icon: Shield, color: 'text-amber-500' },
    { label: 'ผู้ดูแลระบบ', value: users.filter(u => u.role === 'Manager').length, icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'ผู้ดูแลระบบสูงสุด', value: users.filter(u => u.role === 'Admin').length, icon: UserPlus, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* User Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex items-center gap-4 border border-border/50 dark:border-white/5 bg-card/50 backdrop-blur-md"
          >
            <div className={`p-2.5 rounded-xl bg-muted dark:bg-black/40 ${stat.color} border border-border dark:border-white/5 shadow-inner`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-headline font-black text-foreground dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-4 bg-muted/50 dark:bg-black/40 p-3 rounded-2xl border border-border dark:border-white/5 backdrop-blur-md">
        <Search className="w-5 h-5 text-muted-foreground/40 ml-2" />
        <input 
          type="text" 
          placeholder="ค้นหาข้อมูลผู้ใช้งาน..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-foreground dark:text-white placeholder:text-muted-foreground/30 outline-none w-full py-1 text-sm font-medium"
        />
      </div>

      {/* Users Table Container */}
      <div className="glass-card overflow-hidden border border-border/50 dark:border-white/10 shadow-2xl bg-card/80 dark:bg-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 dark:bg-white/5 border-b border-border dark:border-white/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">ข้อมูลตัวตน</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">ระดับการเข้าถึง</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">หน่วยงาน/คณะ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((u) => (
                  <motion.tr 
                    key={u.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-inner">
                          {u.full_name?.charAt(0) || u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          {editingId === u.id ? (
                             <input 
                               className="bg-muted border border-border dark:bg-black/40 dark:border-white/20 rounded-lg px-2 py-1 text-foreground dark:text-white text-sm outline-none focus:ring-1 ring-primary/50"
                               value={editFormData.full_name}
                               onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                             />
                          ) : (
                            <p className="font-bold text-foreground dark:text-white mb-0.5">{u.full_name}</p>
                          )}
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                             <Mail className="w-3 h-3" />
                             {u.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === u.id ? (
                        <select 
                          className="bg-muted border border-border dark:bg-black/40 dark:border-white/20 rounded-lg px-2 py-1 text-foreground dark:text-white text-sm outline-none focus:ring-1 ring-primary/50 cursor-pointer"
                          value={editFormData.role}
                          onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                        >
                          <option value="Student">นักศึกษา</option>
                          <option value="Technician">ช่างเทคนิค</option>
                          <option value="Manager">ผู้ดูแลระบบ</option>
                          <option value="Admin">ผู้ดูแลระบบสูงสุด</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          u.role === 'Admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                          u.role === 'Manager' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                          u.role === 'Technician' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        }`}>
                          {u.role === 'Admin' ? 'ผู้ดูแลระบบสูงสุด' : u.role === 'Manager' ? 'ผู้ดูแลระบบ' : u.role === 'Technician' ? 'ช่างเทคนิค' : 'นักศึกษา'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       {editingId === u.id ? (
                          <input 
                            className="bg-muted border border-border dark:bg-black/40 dark:border-white/20 rounded-lg px-2 py-1 text-foreground dark:text-white text-sm w-full outline-none focus:ring-1 ring-primary/50"
                            value={editFormData.department}
                            onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                          />
                       ) : (
                         <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                            <Briefcase className="w-3.5 h-3.5 text-muted-foreground/30" />
                            {u.department || 'หน่วยงานส่วนกลาง'}
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
                              className="p-2 bg-primary/20 text-primary hover:bg-primary hover:text-black rounded-lg transition-all shadow-sm"
                            >
                              {actionLoading === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-2 bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-white rounded-lg transition-all shadow-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEditStart(u)}
                              className="p-2 text-muted-foreground/40 hover:text-primary hover:bg-primary/20 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={actionLoading === u.id}
                              className="p-2 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
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
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground/40 font-black uppercase tracking-[0.3em] italic">
                    ไม่พบข้อมูลผู้ใช้งานในสถาบัน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
