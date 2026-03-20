import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, ClipboardList, ChevronRight, Activity, Users, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import * as reportService from '@/services/reportService';

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await reportService.getDashboardSummary();
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const menuItems = [
    {
      title: "จัดการโครงสร้างพื้นฐาน",
      description: "จัดการอาคาร ชั้น ห้อง และประเภทของงานซ่อมบำรุง",
      icon: Building2,
      path: '/dashboard/infrastructure',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: "จ่ายหน้าที่งานซ่อม",
      description: "ตรวจสอบรายการแจ้งซ่อมและมอบหมายหน้าที่ให้กับช่างเทคนิค",
      icon: ClipboardList,
      path: '/dashboard/dispatch',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      title: "จัดการช่างเทคนิค",
      description: "จัดการข้อมูลช่างเทคนิคและติดตามผลการปฏิบัติงาน",
      icon: Users,
      path: '/dashboard/technicians',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-10 pb-16 w-full max-w-6xl mx-auto">
      {/* Header Container */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 border border-border dark:border-white/10 shadow-2xl bg-card dark:bg-black/40 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 bg-primary/20 text-primary rounded-2xl backdrop-blur-md border border-primary/20 shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tighter text-foreground dark:text-white leading-none">
                พอร์ทัลการจัดการ
              </h1>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2 ml-1">ศูนย์ปฏิบัติการกลาง SSKRU</p>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl ml-1 font-medium leading-relaxed italic">
            สวัสดีคุณ {user?.full_name || 'ผู้ดูแลระบบ'}, ยินดีต้อนรับสู่ระบบบริหารจัดการและติดตามการซ่อมบำรุงภายในสถาบัน
          </p>
        </div>
      </motion.div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              to={item.path}
              className={`group relative flex flex-col p-8 rounded-[2rem] border border-border/50 dark:border-white/5 bg-card/50 dark:bg-black/40 backdrop-blur-xl hover:bg-card dark:hover:bg-black/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-8 text-foreground/5 dark:text-white/5 group-hover:text-primary/10 transition-colors duration-500">
                <item.icon className="w-32 h-32 rotate-12 transition-transform duration-700 group-hover:scale-125" />
              </div>
              
              <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 ${item.bgColor} ${item.color} border border-border dark:border-white/5 shadow-inner`}>
                <item.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-headline font-black text-foreground dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-medium">
                {item.description}
              </p>
              
              <div className="mt-auto flex items-center text-[10px] font-black tracking-[0.2em] text-primary uppercase group-hover:translate-x-2 transition-transform duration-300">
                เข้าสู่ระบบจัดการ
                <ChevronRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'รอการจ่ายงาน', value: summary?.pending_dispatch ?? '0', icon: ClipboardList, color: 'text-amber-500' },
           { label: 'กำลังดำเนินการ', value: summary?.active_repairs ?? '0', icon: Activity, color: 'text-blue-500' },
           { label: 'ช่างเทคนิคทั้งหมด', value: summary?.staff_total ?? '0', icon: Users, color: 'text-emerald-500' },
         ].map((stat, i) => (
           <motion.div
             key={stat.label}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 + (i * 0.1) }}
             className="glass-card p-6 border border-border/50 dark:border-white/5 bg-card/30 dark:bg-black/20 flex items-center gap-5 shadow-inner"
           >
              <div className={`p-3.5 bg-muted dark:bg-black/40 rounded-2xl ${stat.color} border border-border dark:border-white/5 shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.3em] font-black mb-1">{stat.label}</p>
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary opacity-20" />
                ) : (
                  <h4 className="text-3xl font-headline font-black text-foreground dark:text-white leading-none">{stat.value}</h4>
                )}
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
};
