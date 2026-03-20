import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, History, ShieldCheck } from 'lucide-react';
import { UserListTab } from '@/components/Admin/UserListTab';
import { AuditLogsTab } from '@/components/Admin/AuditLogsTab';

export const AdminDashboard = () => {  
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

  return (
    <div className="space-y-8 pb-12 w-full max-w-6xl mx-auto">
      {/* Header Container */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-border dark:border-white/10 shadow-2xl bg-card/80 dark:bg-black/40 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/20 text-primary rounded-2xl backdrop-blur-md border border-primary/20 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-foreground dark:text-white leading-none">
                  คอนโซลควบคุมดูแลระบบ
                </h1>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2 ml-1">ศูนย์กลางการจัดการระบบ</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl ml-1 font-medium leading-relaxed italic">
              การกำกับดูแลระบบ การจัดการบัญชีผู้ใช้งาน และการตรวจสอบประวัติกิจกรรมเชิงลึก
            </p>
          </div>
          
          <div className="flex bg-muted/50 dark:bg-black/40 p-1.5 rounded-2xl border border-border dark:border-white/5 backdrop-blur-md shadow-inner self-stretch md:self-auto">
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all duration-500 font-black text-xs uppercase tracking-widest ${
                activeTab === 'users' ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'text-muted-foreground/40 hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              ผู้ใช้งาน
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all duration-500 font-black text-xs uppercase tracking-widest ${
                activeTab === 'logs' ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'text-muted-foreground/40 hover:text-foreground'
              }`}
            >
              <History className="w-4 h-4" />
              บันทึกกิจกรรม
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Tab Interface */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: activeTab === 'users' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {activeTab === 'users' ? <UserListTab /> : <AuditLogsTab />}
      </motion.div>
    </div>
  );
};
