import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Home, Map, ClipboardList, Users, Menu as MenuIcon, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import theme from '@/theme/theme';
import { useState, useEffect } from 'react';

export const DashboardLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { to: `/dashboard/${user.role.toLowerCase()}`, icon: Home, label: "แดชบอร์ด" },
    { to: '/profile', icon: UserIcon, label: "ข้อมูลส่วนตัว" },
    ...(user.role === 'Student' ? [{ to: '/dashboard/facilities', icon: Map, label: "ค้นหาสถานที่" }] : []),
    ...(user.role === 'Admin' || user.role === 'Manager' ? [{ to: '/dashboard/infrastructure', icon: Building2, label: "จัดการโครงสร้าง" }] : []),
    ...(user.role === 'Manager' ? [
      { to: '/dashboard/dispatch', icon: ClipboardList, label: "จ่ายหน้าที่งานซ่อม" },
      { to: '/dashboard/technicians', icon: Users, label: "จัดการช่างเทคนิค" }
    ] : [])
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-10 px-2 min-h-[64px]">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/20 overflow-hidden shrink-0"
            style={{ background: `linear-gradient(to bottom right, ${theme.colors.brand.goldLight}, ${theme.colors.brand.goldDark})` }}
          >
             <img src="/sskru-logo.png" alt="SSKRU" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-primary-foreground font-black text-2xl tracking-tighter">SS</span>'; }} />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-headline font-black tracking-tighter text-2xl text-foreground dark:text-white uppercase italic leading-none truncate">SSKRU</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mt-1 truncate">พอร์ทัลส่วนกลาง</p>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-muted-foreground hover:bg-muted dark:hover:bg-white/5 rounded-xl transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 mb-4 px-4">เมนูนำทางระบบ</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.to}
              to={item.to} 
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-500 group relative ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30 font-bold' 
                  : 'text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:scale-110'}`} />
              <span className="text-xs tracking-[0.1em] font-black uppercase">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-[-1.5rem] w-2 h-8 bg-primary rounded-r-full hidden md:block"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 flex flex-col gap-6">
        
        <div className="p-6 bg-muted/30 dark:bg-black/40 rounded-[2rem] border border-border dark:border-white/5 relative overflow-hidden group shadow-inner">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full translate-x-8 -translate-y-8" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
              {user.full_name?.charAt(0) || user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-foreground dark:text-white truncate leading-none mb-1.5">{user.full_name || user.username}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 truncate opacity-80">{user.department || "หน่วยงานส่วนกลาง"}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-center gap-3 h-12 text-[10px] font-black uppercase tracking-[0.3em] border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-xl relative z-10 shadow-lg group/btn" 
            onClick={() => setIsLogoutConfirmOpen(true)}
          >
            <LogOut className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/10 dark:bg-[#050505] flex flex-col md:flex-row overflow-hidden relative">
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card dark:bg-[#0f0f0f] border border-border dark:border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative z-10 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-inner overflow-hidden">
                <LogOut className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h3 className="text-3xl font-headline font-black text-foreground dark:text-white uppercase tracking-tight mb-3">ยืนยันการออกจากระบบหรือไม่?</h3>
                <p className="text-sm text-muted-foreground font-medium italic opacity-60 px-4">
                  โปรดยืนยันว่าคุณต้องการตัดการเชื่อมต่อบัญชีผู้ใช้ของคุณออกจากระบบพอร์ทัลส่วนกลาง
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={logout}
                  className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-500/20 transition-all border-none"
                >
                  ยืนยันการออกจากระบบ
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="w-full h-12 text-muted-foreground hover:text-foreground font-black text-[10px] uppercase tracking-[0.3em]"
                >
                  ใช้งานระบบต่อไป
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-card dark:bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-border dark:border-white/5 shadow-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-muted dark:bg-white/5 rounded-2xl text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter uppercase italic leading-none text-foreground dark:text-white">SSKRU</span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/60">พอร์ทัลส่วนกลาง</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
          {user.username.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-card dark:bg-[#0f0f0f] border-r border-border dark:border-white/5 min-h-screen flex-col z-20 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/[0.02] blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
         <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[40] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-card dark:bg-[#0f0f0f] z-[50] md:hidden shadow-[20px_0_60px_rgba(0,0,0,0.5)] flex flex-col"
            >
               <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-[calc(100vh-64px)] md:h-screen scroll-smooth">
        {/* Global System Header */}
        <header className="sticky top-0 z-30 hidden md:flex items-center justify-between px-12 py-6 bg-[#050505]/20 backdrop-blur-md border-b border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">ระบบควบคุมชุดคำสั่ง</span>
           </div>
           <div className="flex items-center gap-6">
           </div>
        </header>

        <div className="h-full w-full p-6 md:p-12 lg:p-16">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
             className="min-h-full w-full max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};
