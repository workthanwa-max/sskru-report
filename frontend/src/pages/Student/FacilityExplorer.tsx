import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Layers, MapPin, Search, ChevronRight, Loader2, AlertCircle, X, CheckCircle2, Send } from 'lucide-react';
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
         alert("Failed to submit maintenance request. Please try again.");
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/20 text-primary rounded-xl backdrop-blur-md">
              <Search className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
              Facility Directory
            </h1>
          </div>
          <p className="text-lg text-white/60 ml-1">
            Browse campus buildings, floors, and rooms. Select an area to report an issue.
          </p>
        </div>
      </motion.div>

      {/* Explorer Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Buildings Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white/90">
            <Building2 className="w-5 h-5 text-primary" />
            Buildings
          </h3>
          <div className="flex flex-col gap-3">
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
                className={`text-left p-4 rounded-xl border backdrop-blur-md transition-all group relative overflow-hidden ${selectedBuilding?.id === b.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className={`font-bold text-lg ${selectedBuilding?.id === b.id ? 'text-primary' : 'text-white'}`}>{b.name}</h4>
                    <p className="text-sm text-white/50">Code: {b.code}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${selectedBuilding?.id === b.id ? 'text-primary translate-x-1' : 'text-white/20 group-hover:text-white/50'}`} />
                </div>
              </motion.button>
            ))}
            {buildings.length === 0 && <p className="text-white/40 italic p-4">No buildings available.</p>}
          </div>
        </div>

        {/* Floors Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white/90">
            <Layers className="w-5 h-5 text-primary" />
            Floors
          </h3>
          <AnimatePresence mode="wait">
            {!selectedBuilding ? (
              <motion.div
                key="empty-floor"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[200px] border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-white/30 p-6 text-center"
              >
                Select a building to view floors
              </motion.div>
            ) : (
              <motion.div
                key="floor-list"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-3"
              >
                {buildingFloors.map((f, i) => (
                  <motion.button
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedFloor(f)}
                    className={`text-left p-4 rounded-xl border backdrop-blur-md transition-all group flex justify-between items-center ${selectedFloor?.id === f.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                  >
                    <div>
                      <h4 className={`font-bold text-lg ${selectedFloor?.id === f.id ? 'text-primary' : 'text-white'}`}>Floor {f.floor_number}</h4>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${selectedFloor?.id === f.id ? 'text-primary translate-x-1' : 'text-white/20 group-hover:text-white/50'}`} />
                  </motion.button>
                ))}
                {buildingFloors.length === 0 && <p className="text-white/40 italic p-4 bg-black/20 rounded-xl border border-white/5">No floors recorded.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rooms Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white/90">
            <MapPin className="w-5 h-5 text-primary" />
            Rooms
          </h3>
          <AnimatePresence mode="wait">
            {!selectedFloor ? (
              <motion.div
                key="empty-room"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[200px] border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-white/30 p-6 text-center"
              >
                Select a floor to view rooms
              </motion.div>
            ) : (
              <motion.div
                key="room-list"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-3"
              >
                {floorRooms.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-primary/50 transition-all group flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">Room {r.room_number}</h4>
                        <p className="text-sm text-white/50">{r.room_name}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setReportingRoom(r)}
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 text-primary hover:bg-primary hover:text-black font-bold h-8 px-3"
                    >
                      Report
                    </Button>
                  </motion.div>
                ))}
                {floorRooms.length === 0 && <p className="text-white/40 italic p-4 bg-black/20 rounded-xl border border-white/5">No rooms recorded.</p>}
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
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {submitSuccess ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">Report Submitted!</h3>
                  <p className="text-white/60">Thank you for your report. Maintenance will be notified shortly.</p>
                </div>
              ) : duplicateTicket ? (
                <div className="py-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center border border-yellow-500/30">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Active Report Found</h3>
                  <p className="text-white/60">
                    There is already an active report for <span className="text-primary">{categories.find(c => c.id === parseInt(reportForm.category_id))?.category_name}</span> in this room. Our team is already working on it!
                  </p>
                  <Button 
                    onClick={() => {
                        setReportingRoom(null);
                        setDuplicateTicket(null);
                    }}
                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10 w-full rounded-2xl h-12"
                  >
                    Got it, thanks!
                  </Button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setReportingRoom(null)}
                    className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/20 text-primary rounded-2xl">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Report Maintenance</h2>
                      <p className="text-white/40 font-medium">Room {reportingRoom.room_number} • {selectedBuilding?.name}</p>
                    </div>
                  </div>

                  <form onSubmit={handleReportSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-white/40 uppercase tracking-widest ml-1">Issue Category</label>
                      <select 
                        required
                        value={reportForm.category_id}
                        onChange={(e) => setReportForm({...reportForm, category_id: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white appearance-none focus:border-primary outline-none transition-all"
                      >
                        <option value="" disabled>Select a category...</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.category_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-white/40 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        required
                        placeholder="Please describe the issue in detail..."
                        rows={4}
                        value={reportForm.description}
                        onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                       <FileUpload 
                         label="Evidence Photo"
                         onUploadSuccess={(url) => setReportForm({...reportForm, image_before: url})}
                       />
                       {reportForm.image_before && (
                         <div className="mt-2 relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                           <img src={reportForm.image_before} alt="Evidence Preview" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button 
                               variant="destructive" 
                               size="sm" 
                               onClick={() => setReportForm({...reportForm, image_before: ''})}
                               className="h-8 px-3"
                             >
                               <X className="w-4 h-4 mr-2" /> Remove
                             </Button>
                           </div>
                         </div>
                       )}
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-14 bg-primary text-black font-black text-lg hover:bg-white hover:scale-[1.02] transition-all rounded-2xl group shadow-xl shadow-primary/20"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <div className="flex items-center gap-2">
                            Submit Report
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
