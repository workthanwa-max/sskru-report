import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, User as UserIcon, Settings, Home, Building2, Map, ClipboardList, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import theme from '@/theme/theme';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const DashboardLayout = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass border-r md:min-h-screen flex flex-col p-4 z-20 shadow-2xl">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            {/* Logo Placeholder */}
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-white/20 overflow-hidden"
              style={{ background: `linear-gradient(to bottom right, ${theme.colors.brand.goldLight}, ${theme.colors.brand.goldDark})` }}
            >
               <img src="/sskru-logo.png" alt="SSKRU" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-primary-foreground font-black text-xl tracking-tighter">SS</span>'; }} />
            </div>
            <div>
              <h2 className="font-headline font-black tracking-tight text-xl text-foreground uppercase italic leading-none">SSKRU</h2>
              <p className="text-[10px] text-primary/80 font-black uppercase tracking-[0.2em] mt-1">{user.role} {t('nav.portal')}</p>
            </div>
          </div>
          <LanguageSwitcher className="md:hidden" />
        </div>

        <nav className="flex-1 space-y-2">
          <Link to={`/dashboard/${user.role.toLowerCase()}`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 text-primary font-medium hover-lift">
            <Home className="w-4 h-4" />
            {t('nav.dashboard')}
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors hover-lift">
            <UserIcon className="w-4 h-4" />
            {t('nav.profile')}
          </Link>
          {user.role === 'Student' && (
            <Link to="/dashboard/facilities" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors hover-lift">
              <Map className="w-4 h-4" />
              {t('nav.facilities')}
            </Link>
          )}
          {user.role === 'Admin' && (
            <Link to="/dashboard/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors hover-lift">
              <Settings className="w-4 h-4" />
              {t('nav.audit')}
            </Link>
          )}
          {(user.role === 'Admin' || user.role === 'Manager') && (
            <Link to="/dashboard/infrastructure" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors hover-lift">
              <Building2 className="w-4 h-4" />
              {t('nav.infrastructure')}
            </Link>
          )}
          {user.role === 'Manager' && (
            <>
              <Link to="/dashboard/dispatch" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors hover-lift">
                <ClipboardList className="w-4 h-4" />
                {t('nav.dispatch')}
              </Link>
              <Link to="/dashboard/technicians" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors hover-lift">
                <Users className="w-4 h-4" />
                {t('nav.members')}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('common.language')}</span>
            <LanguageSwitcher className="hidden md:flex" />
          </div>
          
          <div className="p-4 glass-card rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                {user.full_name?.charAt(0) || user.username.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.full_name || user.username}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.department || t('common.no_department')}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2 h-10 text-xs font-bold border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-xl" onClick={logout}>
              <LogOut className="w-4 h-4" />
              {t('nav.logout').toUpperCase()}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
           className="h-full w-full max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};
