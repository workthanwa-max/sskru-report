import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Layers, MapPin, ChevronRight, Loader2, AlertCircle, X, CheckCircle2, Send, Activity, Zap, Compass, ShieldAlert } from 'lucide-react';
import * as api from '@/services/infrastructureService';
import { ticketingService } from '@/services/ticketingService';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/FileUpload';

type Building = { id: number; name: string; code: string };
type Floor = { id: number; building_id: number; floor_number: string | number };
type Room = { id: number; floor_id: number; room_number: string; room_name: string };
type Category = { id: number; category_name: string };

export const FacilityExplorer = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  
  // Reporting State
  const [reportingRoom, setReportingRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reportForm, setReportForm] = useState({
    category_id: '',
    description: '',
    image_before: ''
  });
  const [duplicateTicket, setDuplicateTicket] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, fRes, rRes, cRes] = await Promise.all([
          api.getBuildings(),
          api.getFloors(),
          api.getRooms(),
          api.getCategories()
        ]);
        setBuildings(bRes.data || []);
        setFloors(fRes.data || []);
        setRooms(rRes.data || []);
        setCategories(cRes.data || []);
      } catch (error) {
        console.error("Error fetching facility data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingRoom || !reportForm.category_id || !reportForm.description) return;

    setIsSubmitting(true);
    try {
      await ticketingService.createTicket({
        room_id: reportingRoom.id,
        category_id: parseInt(reportForm.category_id),
        description: reportForm.description,
        image_before: reportForm.image_before
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setReportingRoom(null);
        setSubmitSuccess(false);
        setReportForm({ category_id: '', description: '', image_before: '' });
      }, 2000);
    } catch (error: any) {
       if (error.response?.status === 409 && error.response.data?.code === 'DUPLICATE_TICKET') {
         setDuplicateTicket(error.response.data.data);
       } else {
         console.error("Failed to submit ticket:", error);
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Data
  const buildingFloors = selectedBuilding ? floors.filter(f => f.building_id === selectedBuilding.id) : [];
  const floorRooms = selectedFloor ? rooms.filter(r => r.floor_id === selectedFloor.id) : [];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 w-full max-w-6xl mx-auto relative">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 border border-border dark:border-white/10 shadow-2xl bg-card dark:bg-black/40 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/20 text-primary rounded-2xl backdrop-blur-md border border-primary/20 shadow-inner">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter text-foreground dark:text-white leading-none">
                ศูนย์สำรวจและแจ้งซ่อมสถานที่
              </h1>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-2 ml-1">การจัดการพื้นที่และทรัพยากร</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl ml-1 font-medium leading-relaxed italic mt-4">
             ระบบสำรวจโครงสร้างและแจ้งซ่อมบำรุงเชิงรุก เพื่อรักษามาตรฐานความปลอดภัยและสภาพแวดล้อมทั่วทั้งสถาบัน
          </p>
        </div>
      </motion.div>

      {/* Explorer Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Buildings Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
             <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
                <Building2 className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-headline font-black text-foreground dark:text-white uppercase tracking-widest underline decoration-primary/30 underline-offset-8">โครงสร้างพื้นฐาน</h3>
          </div>
          <div className="flex flex-col gap-4">
            {buildings.map((b, i) => (
              <motion.button
                key={b.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedBuilding(b);
                  setSelectedFloor(null);
                }}
                className={`text-left p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden shadow-xl ${
                  selectedBuilding?.id === b.id 
                    ? 'border-primary bg-primary/10 dark:bg-primary/5 shadow-primary/10' 
                    : 'border-border dark:border-white/5 bg-card/60 dark:bg-black/40 hover:border-primary/40'
                }`}
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className={`text-xl font-headline font-black tracking-tight ${selectedBuilding?.id === b.id ? 'text-primary' : 'text-foreground dark:text-white'}`}>{b.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mt-2">รหัสอาคาร: {b.code}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-all duration-500 ${selectedBuilding?.id === b.id ? 'text-primary translate-x-1 scale-110' : 'text-muted-foreground/30 group-hover:text-primary/60'}`} />
                </div>
              </motion.button>
            ))}
            {buildings.length === 0 && <p className="text-muted-foreground italic p-6 text-center opacity-40">Zero sectors recorded.</p>}
          </div>
        </div>

        {/* Floors Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
             <div className="p-2 bg-muted text-muted-foreground rounded-lg border border-border">
                <Layers className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-headline font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest">ชั้น</h3>
          </div>
          <AnimatePresence mode="wait">
            {!selectedBuilding ? (
              <motion.div
                key="empty-floor"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full min-h-[300px] border-2 border-dashed border-border dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground/30 p-10 text-center bg-card/20 dark:bg-black/10"
              >
                <Activity className="w-10 h-10 mb-4 opacity-20" />
                <p className="text-sm font-black uppercase tracking-widest leading-relaxed">กรุณาเลือกอาคารเพื่อดูรายละเอียดชั้น</p>
              </motion.div>
            ) : (
              <motion.div
                key="floor-list"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                {buildingFloors.map((f, i) => (
                  <motion.button
                    key={f.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedFloor(f)}
                    className={`text-left p-6 rounded-[1.5em] border transition-all duration-500 group flex justify-between items-center shadow-lg ${
                      selectedFloor?.id === f.id 
                        ? 'border-primary bg-primary/10 dark:bg-primary/5' 
                        : 'border-border dark:border-white/5 bg-card/60 dark:bg-black/40 hover:border-primary/40'
                    }`}
                  >
                    <div>
                      <h4 className={`text-lg font-black uppercase tracking-[0.2em] ${selectedFloor?.id === f.id ? 'text-primary' : 'text-foreground dark:text-white'}`}>ชั้น {f.floor_number}</h4>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-all duration-500 ${selectedFloor?.id === f.id ? 'text-primary translate-x-1' : 'text-muted-foreground/30'}`} />
                  </motion.button>
                ))}
                {buildingFloors.length === 0 && <p className="text-muted-foreground italic p-6 text-center opacity-40">No environmental levels found.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rooms Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
             <div className="p-2 bg-muted text-muted-foreground rounded-lg border border-border">
                <MapPin className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-headline font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest">ห้อง</h3>
          </div>
          <AnimatePresence mode="wait">
            {!selectedFloor ? (
              <motion.div
                key="empty-room"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full min-h-[300px] border-2 border-dashed border-border dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground/30 p-10 text-center bg-card/20 dark:bg-black/10"
              >
                <Zap className="w-10 h-10 mb-4 opacity-20" />
                <p className="text-sm font-black uppercase tracking-widest leading-relaxed">กรุณาเลือกชั้นเพื่อดูรายการห้อง</p>
              </motion.div>
            ) : (
              <motion.div
                key="room-list"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                {floorRooms.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-[2rem] border border-border dark:border-white/5 bg-card dark:bg-black/60 shadow-xl group flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted dark:bg-white/5 rounded-2xl group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500 border border-border dark:border-white/5">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-foreground dark:text-white group-hover:text-primary transition-colors">ห้อง {r.room_number}</h4>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-1 italic">{r.room_name}</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setReportingRoom(r)}
                      size="sm" 
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-black text-[10px] uppercase tracking-widest h-11 rounded-xl transition-all shadow-lg shadow-primary/5 border border-primary/20"
                    >
                      แจ้งซ่อมพื้นที่นี้
                    </Button>
                  </motion.div>
                ))}
                {floorRooms.length === 0 && <p className="text-muted-foreground italic p-6 text-center opacity-40">ไม่พบข้อมูลห้องในชั้นนี้</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reporting Modal */}
      <AnimatePresence>
        {reportingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setReportingRoom(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card dark:bg-black/60 border border-border dark:border-white/10 shadow-2xl p-10 md:p-14 rounded-[3rem] space-y-10"
              onClick={(e) => e.stopPropagation()}
            >
              {submitSuccess ? (
                <div className="py-16 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-10 border border-emerald-500/30 shadow-2xl">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-headline font-black text-foreground dark:text-white uppercase tracking-tight">ศูนย์ลงบันทึกรายงานแล้ว</h3>
                  <p className="text-lg text-muted-foreground font-medium italic mt-4">บันทึกข้อมูลปัญหาเรียบร้อยแล้ว ทีมงานจะดำเนินการตรวจสอบตามขั้นตอนมาตรฐาน</p>
                </div>
              ) : duplicateTicket ? (
                <div className="py-12 flex flex-col items-center text-center space-y-8">
                  <div className="w-20 h-20 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center border border-amber-500/30 shadow-xl">
                    <ShieldAlert className="w-10 h-10" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-3xl font-headline font-black text-foreground dark:text-white uppercase tracking-tight">พบรายการที่อยู่ระหว่างดำเนินการ</h3>
                     <p className="text-lg text-muted-foreground font-medium italic max-w-md leading-relaxed">
                       มีรายการซ่อมบำรุงสำหรับหมวด <span className="text-primary font-black not-italic uppercase tracking-widest">{categories.find(c => c.id === parseInt(reportForm.category_id))?.category_name}</span> ในพื้นที่นี้อยู่แล้ว ระบบงดรับแจ้งซ้ำเพื่อป้องกันการสับสน
                     </p>
                  </div>
                  <Button 
                    onClick={() => {
                        setReportingRoom(null);
                        setDuplicateTicket(null);
                    }}
                    className="bg-muted dark:bg-white/5 border border-border dark:border-white/10 text-foreground dark:text-white hover:bg-muted/80 dark:hover:bg-white/10 w-full rounded-2xl h-14 font-black text-[10px] uppercase tracking-[0.3em]"
                  >
                    รับทราบและปิดหน้าต่าง
                  </Button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setReportingRoom(null)}
                    className="absolute top-10 right-10 p-3 text-muted-foreground/30 hover:text-red-500 transition-colors bg-muted dark:bg-white/5 rounded-2xl border border-border dark:border-white/5"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-primary/20 text-primary rounded-2xl border border-primary/20">
                          <AlertCircle className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-headline font-black text-foreground dark:text-white uppercase tracking-tight leading-none">แจ้งซ่อมพื้นที่นี้</h3>
                          <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mt-2 ml-1">กำลังรายงานความผิดปกติของโครงสร้าง</p>
                       </div>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium italic leading-relaxed opacity-60 pt-6 border-t border-border dark:border-white/5">
                       ตำแหน่งอ้างอิง: <span className="text-foreground dark:text-white font-black not-italic uppercase tracking-widest">ห้อง {reportingRoom.room_number}</span> • <span className="text-foreground dark:text-white font-black not-italic uppercase tracking-widest">{selectedBuilding?.name}</span>
                    </p>
                  </div>

                  <form onSubmit={handleReportSubmit} className="space-y-10">
                    <div className="space-y-10">
                       <div className="group/select">
                          <label className="block text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-3 px-2">ประเภทของปัญหา</label>
                          <select 
                            required
                            value={reportForm.category_id}
                            onChange={(e) => setReportForm({...reportForm, category_id: e.target.value})}
                            className="w-full bg-muted dark:bg-black/60 border border-border dark:border-white/10 rounded-[2rem] p-6 text-foreground dark:text-white appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all group-hover/select:border-primary/30"
                          >
                             <option value="" disabled>ระบุประเภทความผิดปกติที่พบ...</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.id} className="bg-card dark:bg-black">{c.category_name}</option>
                            ))}
                          </select>
                       </div>

                       <div className="group/textarea">
                          <label className="block text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-3 px-2">รายละเอียดของปัญหา</label>
                          <textarea 
                            required
                            placeholder="ระบุความเสียหายหรือปัญหาที่พบโดยสังเขป..."
                            rows={4}
                            value={reportForm.description}
                            onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                            className="w-full bg-muted dark:bg-black/60 border border-border dark:border-white/10 rounded-[2.5rem] p-8 text-foreground dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none shadow-inner group-hover/textarea:border-primary/30"
                          />
                       </div>

                       <div className="space-y-4">
                         <label className="block text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-3 px-2">หลักฐานภาพถ่ายความเสียหาย</label>
                          <FileUpload 
                            label="แนบรูปถ่ายปัญหาที่พบ"
                            onUploadSuccess={(url) => setReportForm({...reportForm, image_before: url})}
                          />
                       </div>
                    </div>

                    <div className="pt-6 border-t border-border dark:border-white/5">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-16 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all rounded-[1.5rem] group shadow-2xl shadow-primary/20"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <div className="flex items-center gap-3">
                            ส่งรายงานผลเข้าสู่ระบบ
                            <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
