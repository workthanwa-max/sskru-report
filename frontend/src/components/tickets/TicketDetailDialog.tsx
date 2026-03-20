import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Calendar, MapPin, CheckCircle, Clock, ShieldCheck, FileText, Image as ImageIcon, Terminal, Zap, Activity, Camera } from 'lucide-react';

interface TicketDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

export const TicketDetailDialog: React.FC<TicketDetailDialogProps> = ({ isOpen, onClose, ticket }) => {

  if (!ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusThemes: Record<string, { bg: string, text: string, border: string, icon: any }> = {
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', icon: Clock },
    assigned: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', icon: Zap },
    in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', icon: Activity },
    review: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', icon: ShieldCheck },
    closed: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle },
  };

  const theme = statusThemes[ticket.status?.toLowerCase()] || statusThemes.pending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-hidden p-0 rounded-[2.5rem] border-border dark:border-white/10 bg-card dark:bg-[#151515] shadow-[0_50px_100px_rgba(0,0,0,0.6)] outline-none flex flex-col">
        <DialogTitle className="sr-only">
          {ticket.description || 'ไม่มีรายละเอียด'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          สถานที่: {ticket.building_name} ชั้น {ticket.floor_number} ห้อง {ticket.room_name}
        </DialogDescription>
        {/* Header - Advanced Academic Style */}
        <div className="relative p-8 md:p-12 border-b border-border dark:border-white/5 bg-muted/40 dark:bg-black/40">
           <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <div className={`px-4 py-1.5 rounded-full border shadow-sm flex items-center gap-2 ${theme.bg} ${theme.text} ${theme.border}`}>
                    <theme.icon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {ticket.status === 'pending' ? 'รอรับงาน' : 
                       ticket.status === 'assigned' ? 'มอบหมายแล้ว' : 
                       ticket.status === 'in_progress' ? 'กำลังดำเนินการ' : 
                       ticket.status === 'review' ? 'รอตรวจสอบ' : 
                       ticket.status === 'closed' ? 'เสร็จสิ้น' : ticket.status}
                    </span>
                 </div>
                 <div className="flex items-center gap-4 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    รหัสอ้างอิง_{ticket.id.toString().padStart(6, '0')}
                 </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground dark:text-white tracking-tighter leading-none pr-10">
                {ticket.description || 'ไม่มีรายละเอียด'}
              </h2>

              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                 <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-primary/40" />
                    {formatDate(ticket.created_at)}
                 </div>
                 <div className="w-1 h-1 rounded-full bg-border" />
                 <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-primary/40" />
                    <span className="text-primary">{ticket.category_name}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Dynamic Process Timeline Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 space-y-16">
           
           {/* Section 1: Visual Verification Flow (The images core) */}
           <div className="space-y-8">
              <div className="flex items-center gap-4 px-2">
                 <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-xl">
                    <Camera className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-headline font-black text-foreground dark:text-white uppercase tracking-tighter">บันทึกหลักฐานภาพถ่าย</h3>
                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em] mt-1">การตรวจสอบยืนยันตามขั้นตอน</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Image from Reporter (Student) */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h4 className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] italic">ภาพถ่ายขณะแจ้งซ่อม</h4>
                       <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">ผู้แจ้งซ่อม</span>
                    </div>
                    {ticket.image_before ? (
                       <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-border dark:border-white/5 bg-black/40 group/img shadow-2xl">
                          <img 
                             src={ticket.image_before} 
                             alt="Report Evidence" 
                             className="object-cover w-full h-full opacity-80 group-hover/img:opacity-100 transition-opacity duration-700"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                          <div className="absolute bottom-8 left-8 flex items-center gap-3">
                             <div className="p-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 font-black text-[9px] tracking-widest uppercase shadow-2xl">
                                แจ้งซ่อมแล้ว
                             </div>
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 italic">{ticket.reporter_name}</p>
                          </div>
                       </div>
                    ) : (
                       <div className="aspect-video rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground/20 bg-muted/20">
                          <ImageIcon className="w-10 h-10 mb-4" />
                           <p className="text-[9px] font-black uppercase tracking-[0.4em]">ไม่มีภาพประกอบการแจ้ง</p>
                       </div>
                    )}
                 </div>

                 {/* Image from Technician (After) */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h4 className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.4em] italic">ภาพถ่ายหลังซ่อมแซม</h4>
                       <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">ช่างเทคนิค</span>
                    </div>
                    {ticket.maintenance_photo ? (
                       <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-emerald-500/10 dark:border-emerald-500/5 bg-black/40 group/img shadow-[0_40px_80px_rgba(16,185,129,0.15)]">
                          <img 
                             src={ticket.maintenance_photo} 
                             alt="Resolution Result" 
                             className="object-cover w-full h-full opacity-80 group-hover/img:opacity-100 transition-opacity duration-700"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                          <div className="absolute bottom-8 left-8 flex items-center gap-3">
                             <div className="p-2 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-500/20 text-emerald-500 font-black text-[9px] tracking-widest uppercase shadow-2xl">
                                ซ่อมแซมเสร็จ
                             </div>
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500/40 italic">{ticket.technician_name}</p>
                          </div>
                       </div>
                    ) : (
                       <div className="aspect-video rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground/20 bg-muted/10 opacity-60">
                          <ImageIcon className="w-10 h-10 mb-4" />
                           <p className="text-[9px] font-black uppercase tracking-[0.4em]">รอตรวจสอบขั้นสุดท้าย</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Section 2: Details Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Spatial Sector */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                     <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">สถานที่เกิดเหตุ</h4>
                 </div>
                 <div className="bg-muted/50 dark:bg-black/30 p-8 rounded-[2.5rem] border border-border dark:border-white/5 flex gap-7 group/loc shadow-inner">
                    <div className="p-4 bg-primary/20 text-primary rounded-2xl border border-primary/20 shadow-xl self-start group-hover/loc:rotate-6 transition-transform">
                       <MapPin className="w-7 h-7" />
                    </div>
                    <div className="overflow-hidden">
                       <p className="font-headline font-black text-2xl text-foreground dark:text-white uppercase tracking-tighter mb-4 leading-none truncate">{ticket.building_name}</p>
                       <div className="flex flex-col gap-2">
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 border-b border-primary/10 pb-1">ชั้น {ticket.floor_number} • ห้อง {ticket.room_name}</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">รหัสห้อง: {ticket.room_number || 'ไม่ระบุ'}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Maintenance Archive (Special Note) */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full" />
                     <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">สรุปการซ่อมบำรุง</h4>
                 </div>
                 <div className={`p-8 rounded-[2.5rem] border shadow-2xl relative min-h-[140px] flex flex-col justify-center ${ticket.maintenance_notes ? 'bg-emerald-500/[0.03] border-emerald-500/10 dark:bg-emerald-400/[0.02]' : 'bg-muted/10 border-border/40 opacity-40 italic'}`}>
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                       <FileText className="w-20 h-20" />
                    </div>
                    {ticket.maintenance_notes ? (
                       <div className="space-y-4 relative z-10">
                          <p className="text-lg font-medium leading-relaxed italic text-foreground dark:text-white/80 border-l-2 border-emerald-500/40 pl-7">
                             "{ticket.maintenance_notes}"
                          </p>
                          <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500 group">
                             <CheckCircle className="w-3 h-3 group-hover:scale-125 transition-transform" />
                              ได้รับการยืนยันการซ่อม
                          </div>
                       </div>
                    ) : (
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground transition-all duration-700">รอสรุปผลการปฏิบัติงาน</p>
                    )}
                 </div>
              </div>
           </div>

           {/* Sector: Registry Personnel */}
           <div className="bg-muted/30 dark:bg-black/20 p-8 rounded-[2.5rem] border border-border dark:border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                 <div className="flex items-center gap-6 group/auth">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-muted-foreground group-hover/auth:border-primary/40 transition-colors shadow-inner">
                       {ticket.reporter_name?.charAt(0)}
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">ผู้แจ้งซ่อม</p>
                       <p className="font-headline font-black text-lg text-foreground dark:text-white uppercase tracking-tighter truncate leading-none">{ticket.reporter_name}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-6 group/tech">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-xl font-black transition-all shadow-inner ${ticket.technician_name ? 'bg-primary/10 border-primary/20 text-primary group-hover/tech:scale-110' : 'bg-white/5 border-white/5 text-white/20'}`}>
                       {ticket.technician_name?.charAt(0) || '?'}
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em]">ช่างเทคนิคผู้ดูแล</p>
                       <p className="font-headline font-black text-lg text-foreground dark:text-white uppercase tracking-tighter truncate leading-none">
                           {ticket.technician_name || 'รอการมอบหมายช่าง'}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Registry Footer */}
        <div className="p-8 md:p-10 border-t border-border dark:border-white/5 bg-muted/40 dark:bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
           <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
           
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 shadow-xl">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">บันทึกข้อมูลเสร็จสิ้น</p>
                  <p className="text-[10px] font-black text-foreground dark:text-white/60 uppercase tracking-widest leading-none">
                     {ticket.completion_date ? `ซ่อมเสร็จเมื่อ ${formatDate(ticket.completion_date)}` : 'กำลังดำเนินการในระบบ'}
                  </p>
              </div>
           </div>

           <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground/30 uppercase tracking-[0.5em] relative z-10">
              <Terminal className="w-3.5 h-3.5" />
              DATA_SCT_01_SECURE
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
