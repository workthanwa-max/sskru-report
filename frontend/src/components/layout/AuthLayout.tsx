import { Navigate, Outlet, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthLayout = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to dashboard if already logged in
  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements - SSKRU White & Gold aesthetic */}
      <div 
         className="absolute -top-24 -left-20 w-[30rem] h-[30rem] rounded-full mix-blend-soft-light filter blur-[80px] opacity-20 dark:opacity-30 animate-pulse"
         style={{ backgroundColor: 'oklch(0.70 0.12 85)' }}
      ></div>
      <div 
         className="absolute top-1/4 -right-20 w-[25rem] h-[25rem] rounded-full mix-blend-soft-light filter blur-[100px] opacity-15 dark:opacity-20 animate-pulse animation-delay-2000"
         style={{ backgroundColor: 'oklch(0.85 0.10 90)' }}
      ></div>
      <div 
         className="absolute -bottom-24 right-1/4 w-[28rem] h-[28rem] rounded-full mix-blend-soft-light filter blur-[90px] opacity-10 dark:opacity-15 animate-pulse animation-delay-4000"
         style={{ backgroundColor: 'oklch(0.60 0.08 85)' }}
      ></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10 glass-card p-10 border border-border dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-card/80 dark:bg-black/40"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          {/* Logo Placeholder */}
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-inner overflow-hidden p-2">
             <img src="/sskru-logo.png" alt="SSKRU Logo" className="w-full h-full object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-primary font-bold text-3xl tracking-tighter">SS</span>'; }} />
          </div>
          <h1 className="text-4xl font-headline font-black tracking-tight text-foreground mb-2 uppercase italic bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
             ศูนย์รับรองและแจ้งซ่อม
          </h1>
          <div className="h-0.5 w-12 bg-primary mb-4 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
          <p className="text-sm font-medium text-muted-foreground max-w-[240px] leading-relaxed italic">ระบบบริหารจัดการการแจ้งซ่อมและบำรุงรักษาภายในมหาวิทยาลัย</p>
        </div>

        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </motion.div>

      {/* Floating Preview Button - Bottom Left */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-10 left-10 z-50 group"
      >
        <Link 
          to="/" 
          className="flex items-center gap-4 bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/40 backdrop-blur-md px-6 py-4 rounded-[1.5rem] shadow-2xl transition-all duration-500 group-hover:-translate-y-1"
        >
          <div className="p-2 bg-primary/20 text-primary rounded-xl border border-primary/20 group-hover:rotate-12 transition-transform">
             <Home className="w-4 h-4" />
          </div>
          <div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground dark:text-white/80">ดูตัวอย่างหน้าเว็บ</span>
             <p className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-0.5">กลับสู่หน้าแรก</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};
