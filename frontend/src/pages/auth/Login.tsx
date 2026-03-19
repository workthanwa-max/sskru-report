import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';

export const Login = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <LoginForm />
    </motion.div>
  );
};
