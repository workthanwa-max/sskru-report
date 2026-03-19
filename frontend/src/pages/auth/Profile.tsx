import { useState, useEffect } from 'react';
import { useAuth, type User } from '@/context/AuthContext';
import { User as UserIcon, Building2, Briefcase, GraduationCap, Server, Shield, LogOut, Fingerprint, Calendar, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '@/services/authService';

export const Profile = () => {
  const { user: localUser, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe();
        setProfile(data.user);
      } catch (err) {
        setProfile(localUser);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [localUser]);

  if (loading) {
     return (
       <div className="h-96 flex items-center justify-center">
         <motion.div 
           animate={{ rotate: 360 }} 
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full" 
         />
       </div>
     );
  }

  if (!profile) return null;

  const roleConfig = {
    Admin: { icon: Server, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    Manager: { icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    Technician: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    Student: { icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  };

  const currentRole = roleConfig[profile.role as keyof typeof roleConfig] || roleConfig.Student;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 border border-border dark:border-white/10 shadow-2xl bg-card/80 dark:bg-black/40 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-5xl font-black border border-primary/20 shadow-2xl overflow-hidden">
               {profile.full_name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
               <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
                  <UserIcon className="w-8 h-8" />
               </div>
            </div>
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl ${currentRole.bg} ${currentRole.color} ${currentRole.border} border flex items-center justify-center shadow-lg backdrop-blur-md animate-bounce`}>
               <currentRole.icon className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
               <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight text-foreground dark:text-white leading-tight">
                 {profile.full_name || profile.username}
               </h1>
               <span className={`w-fit md:mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentRole.bg} ${currentRole.color} ${currentRole.border} dark:brightness-110`}>
                 {profile.role} Level
               </span>
            </div>
            <p className="text-lg text-muted-foreground dark:text-white/40 flex items-center justify-center md:justify-start gap-2 font-medium italic">
               <Fingerprint className="w-4 h-4" />
               System Identity: {profile.username}
            </p>
            
            <div className="pt-6 flex flex-wrap justify-center md:justify-start gap-3">
               <button 
                 onClick={logout}
                 className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all font-bold text-sm group"
               >
                 <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 Sign Out Permanent
               </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
         <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group glass-card p-8 border border-border dark:border-white/5 hover:border-primary/20 transition-colors"
         >
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-muted rounded-xl border border-border dark:border-white/10 text-muted-foreground group-hover:text-primary transition-colors">
                  <UserIcon className="w-5 h-5" />
               </div>
               <h3 className="text-xs font-black text-muted-foreground/40 dark:text-white/30 uppercase tracking-[0.3em]">Personal Matrix</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-black text-muted-foreground/40 dark:text-white/20 ml-1">Full Identity</p>
                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-white/[0.02] border border-border dark:border-white/5 font-bold text-foreground dark:text-white/80">
                   {profile.full_name || 'Anonymous User'}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-black text-muted-foreground/40 dark:text-white/20 ml-1">Access Credential</p>
                <div className="p-4 rounded-2xl bg-muted/30 dark:bg-white/[0.02] border border-border dark:border-white/5 font-mono text-xs text-primary dark:text-primary/60 flex items-center gap-2">
                   <Lock className="w-3 h-3" />
                   SSKRU_ID_{profile.id.toString().padStart(5, '0')}
                </div>
              </div>
            </div>
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group glass-card p-8 border border-white/5 hover:border-primary/20 transition-colors"
         >
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/40 group-hover:text-primary transition-colors">
                  <Building2 className="w-5 h-5" />
               </div>
               <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Organizational Sector</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-black text-white/20 ml-1">Primary Department</p>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 font-bold text-white/80 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                   {profile.department || 'Unassigned Sector'}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-black text-white/20 ml-1">Member Since</p>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 font-medium text-white/40 flex items-center gap-2 text-sm italic">
                   <Calendar className="w-3.5 h-3.5" />
                   Operationalized in March 2026
                </div>
              </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};
