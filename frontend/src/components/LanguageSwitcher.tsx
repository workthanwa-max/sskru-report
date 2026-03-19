import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

export const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all font-bold text-xs ${className}`}
    >
      <Languages className="w-4 h-4 text-primary" />
      <span>{i18n.language === 'th' ? 'EN' : 'TH'}</span>
    </motion.button>
  );
};
