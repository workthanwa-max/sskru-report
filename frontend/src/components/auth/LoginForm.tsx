import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, User, Lock, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({
        username,
        password,
      });

      const { access_token, user } = data;
      login(access_token, user);
      navigate(`/dashboard/${user.role.toLowerCase()}`, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || t('auth.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold rounded-2xl flex items-center gap-2"
          >
            <div className="w-1 h-4 bg-destructive rounded-full" />
            {error}
          </motion.div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 group-focus-within:text-primary transition-colors">
               {t('auth.username')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary/60 transition-colors" />
              <input
                type="text"
                required
                className="flex h-12 w-full rounded-2xl border border-input bg-muted/20 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:bg-white/[0.03] dark:border-white/10 dark:text-white dark:placeholder:text-white/30"
                placeholder={t('auth.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 group-focus-within:text-primary transition-colors">
               {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary/60 transition-colors" />
              <input
                type="password"
                required
                className="flex h-12 w-full rounded-2xl border border-input bg-muted/20 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:bg-white/[0.03] dark:border-white/10 dark:text-white dark:placeholder:text-white/30"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-primary hover:bg-white text-black font-black rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 active:scale-[0.98] group"
        >
          {loading ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {t('auth.login_button').toUpperCase()}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-4 text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-4 w-full opacity-50">
           <div className="h-px bg-border flex-1" />
           <span className="text-muted-foreground">{t('auth.no_account')}</span>
           <div className="h-px bg-border flex-1" />
        </div>
        <Link 
          to="/register" 
          className="text-foreground hover:text-primary transition-all py-2 px-6 rounded-full border border-border hover:border-primary/30 bg-muted/10 hover:bg-muted/30"
        >
          {t('auth.register')}
        </Link>
      </div>
    </div>
  );
};
