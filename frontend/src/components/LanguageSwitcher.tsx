import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

export const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(newLang);
  };

  const isTH = i18n.language === 'th';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleLanguage}
      className={`relative flex items-center bg-black/40 dark:bg-white/5 border border-white/10 rounded-full p-1 h-10 w-24 shadow-inner group overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <motion.div 
        animate={{ x: isTH ? 0 : 44 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute w-[44px] h-8 bg-primary rounded-full shadow-lg z-10"
      />

      <div className="relative z-20 flex w-full h-full justify-between items-center px-3 font-black text-[9px] uppercase tracking-widest pointer-events-none">
        <span className={`${isTH ? 'text-primary-foreground' : 'text-muted-foreground/40'} transition-colors duration-500`}>TH</span>
        <span className={`${!isTH ? 'text-primary-foreground' : 'text-muted-foreground/40'} transition-colors duration-500`}>EN</span>
      </div>

      <Languages className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white/5 pointer-events-none group-hover:scale-125 transition-transform" />
    </motion.button>
  );
};
