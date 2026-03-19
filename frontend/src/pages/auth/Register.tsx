import { motion } from 'framer-motion';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const Register = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <RegisterForm />
    </motion.div>
  );
};
