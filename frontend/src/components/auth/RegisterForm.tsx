import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, User, Lock, Mail, Briefcase, ChevronLeft } from 'lucide-react';
import { authService } from '@/services/authService';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register({
        ...formData,
        role: 'Student', // Default role for open registration
      });
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleRegister} className="space-y-4">
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1 group-focus-within:text-primary transition-colors">
               ชื่อผู้ใช้งาน *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 transition-colors" />
              <input
                type="text" name="username" required
                className="flex h-11 w-full rounded-xl border border-input bg-muted/20 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 outline-none transition-all dark:bg-white/[0.03] dark:border-white/5 dark:text-white dark:placeholder:text-white/30"
                placeholder="ชื่อผู้ใช้งาน"
                value={formData.username} onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1 group-focus-within:text-primary transition-colors">
               รหัสผ่าน *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 transition-colors" />
              <input
                type="password" name="password" required
                className="flex h-11 w-full rounded-xl border border-input bg-muted/20 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 outline-none transition-all dark:bg-white/[0.03] dark:border-white/5 dark:text-white dark:placeholder:text-white/30"
                placeholder="••••••••"
                value={formData.password} onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1 group-focus-within:text-primary transition-colors">
             ชื่อ-นามสกุล
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 transition-colors" />
            <input
               type="text" name="full_name"
               className="flex h-11 w-full rounded-xl border border-input bg-muted/20 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 outline-none transition-all dark:bg-white/[0.03] dark:border-white/5 dark:text-white dark:placeholder:text-white/30"
               placeholder="ชื่อ-นามสกุล"
               value={formData.full_name} onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 ml-1 group-focus-within:text-primary transition-colors">
             แผนก/สาขาวิชา
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 transition-colors" />
            <input
               type="text" name="department"
               className="flex h-11 w-full rounded-xl border border-input bg-muted/20 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 outline-none transition-all dark:bg-white/[0.03] dark:border-white/5 dark:text-white dark:placeholder:text-white/30"
               placeholder="แผนก/สาขาวิชา"
               value={formData.department} onChange={handleInputChange}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-primary text-primary-foreground font-black rounded-xl shadow-lg mt-4 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ลงทะเบียน"}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link 
          to="/login" 
          className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
};
