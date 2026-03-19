import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Ticket, Clock, CheckCircle } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { title: 'Active Tickets', value: '2', icon: Ticket, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'In Progress', value: '1', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Resolved', value: '4', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.full_name?.split(' ')[0] || user?.username}!</h1>
        <p className="text-muted-foreground mt-2">Here is an overview of your repair requests.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 glass-card p-8 min-h-[300px] flex items-center justify-center border-dashed">
        <div className="text-center text-muted-foreground">
          <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Recent activity will appear here once you submit a ticket.</p>
        </div>
      </div>
    </div>
  );
};
