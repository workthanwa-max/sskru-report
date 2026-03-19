import { motion } from 'framer-motion';
import { Building2, ClipboardList, ChevronRight, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ManagerDashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Infrastructure Management',
      description: 'Configure buildings, floors, rooms, and maintenance categories.',
      icon: Building2,
      path: '/dashboard/infrastructure',
      color: 'bg-blue-500/10 text-blue-400',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Ticket Dispatch',
      description: 'Review new requests and assign them to available technicians.',
      icon: ClipboardList,
      path: '/dashboard/dispatch',
      color: 'bg-amber-500/10 text-amber-400',
      borderColor: 'border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-8 pb-12 w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(23,23,23,0.9) 0%, rgba(30,30,30,0.95) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.15)'
        }}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm mb-2">
            Management Portal
          </h1>
          <p className="text-lg text-white/60 ml-1">
            Welcome back, {user?.full_name || 'Manager'}. Oversee facilities and maintenance workflow.
          </p>
        </div>
      </motion.div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              to={item.path}
              className={`group relative flex flex-col p-8 rounded-3xl border ${item.borderColor} bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-white/10 transition-colors">
                <item.icon className="w-32 h-32 rotate-12" />
              </div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.color} border border-white/5`}>
                <item.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-white/50 leading-relaxed mb-6">
                {item.description}
              </p>
              
              <div className="mt-auto flex items-center text-sm font-bold text-primary gap-2">
                Get Started
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Pending Dispatch', value: '5', icon: ClipboardList },
           { label: 'Active Repairs', value: '12', icon: Activity },
           { label: 'Staff Online', value: '8', icon: Users },
         ].map((stat, i) => (
           <motion.div
             key={stat.label}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 + (i * 0.1) }}
             className="glass-card p-6 border border-white/5 flex items-center gap-4"
           >
              <div className="p-3 bg-white/5 rounded-xl text-white/40">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-black">{stat.label}</p>
                <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
};
