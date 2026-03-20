import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Tag, Plus, Trash2, Settings, Loader2, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/services/infrastructureService';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

type Building = { id: number; name: string; code: string };
type Floor = { id: number; building_id: number; floor_number: string | number };
type Room = { id: number; floor_id: number; room_number: string; room_name: string };
type Category = { id: number; category_name: string };

export const InfrastructureManagement = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'facilities' | 'categories'>('facilities');
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState<{type: 'building' | 'floor' | 'room' | 'category' | null, open: boolean}>({ type: null, open: false });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, type: 'building' | 'floor' | 'room' | 'category', name: string} | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    number: '',
    description: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', code: '', number: '', description: '', category: '' });
  };

  const openDialog = (type: 'building' | 'floor' | 'room' | 'category') => {
    resetForm();
    setDialogOpen({ type, open: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (dialogOpen.type === 'building') {
        await api.createBuilding({ name: formData.name, code: formData.code });
      } else if (dialogOpen.type === 'floor' && selectedBuilding) {
        await api.createFloor({ building_id: selectedBuilding.id, floor_number: formData.number });
      } else if (dialogOpen.type === 'room' && selectedFloor) {
        await api.createRoom({ floor_id: selectedFloor.id, room_number: formData.number, room_name: formData.name });
      } else if (dialogOpen.type === 'category') {
        await api.createCategory({ category_name: formData.name });
      }
      await fetchData();
      setDialogOpen({ type: null, open: false });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: number, type: 'building' | 'floor' | 'room' | 'category', name: string) => {
    setItemToDelete({ id, type, name });
    setDeleteConfirmOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      if (itemToDelete.type === 'building') {
        await api.deleteBuilding(itemToDelete.id);
        if (selectedBuilding?.id === itemToDelete.id) {
          setSelectedBuilding(null);
          setSelectedFloor(null);
        }
      }
      await fetchData();
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
       console.error(error);
    } finally {
       setIsSubmitting(false);
    }
  };

  // Filter Data
  const buildingFloors = selectedBuilding ? floors.filter(f => f.building_id === selectedBuilding.id) : [];
  const floorRooms = selectedFloor ? rooms.filter(r => r.floor_id === selectedFloor.id) : [];

  const InputField = ({ label, name, value, placeholder, required = true }: any) => (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{label}</label>
      <input 
        required={required}
        value={value}
        onChange={(e) => setFormData({...formData, [name]: e.target.value})}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-3 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/30"
      />
    </div>
  );

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto font-sans">
      {/* Header - Scaled Down */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2rem] p-8 shadow-2xl bg-card border border-primary/20"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-[1rem] flex items-center justify-center border border-primary/20 shadow-xl backdrop-blur-xl">
                <Settings className="w-6 h-6 animate-slow-spin" />
              </div>
              <div>
                <h1 className="text-3xl font-headline font-black tracking-tight text-foreground uppercase italic leading-none">
                  Infra_Council
                </h1>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-2 opacity-60">Control_Protocol_v2.0</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2.5 ${activeTab === 'facilities' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Facilities
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2.5 ${activeTab === 'categories' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
            >
              <Tag className="w-3.5 h-3.5" />
              Taxonomy
            </button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary opacity-30" />
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">Syncing_Registry...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'facilities' && (
            <motion.div
              key="facilities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Buildings Column */}
              <div className="flex flex-col h-[600px] bg-card/60 rounded-[2rem] p-6 border border-border shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6 px-1">
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-headline font-black flex items-center gap-2.5 text-foreground uppercase tracking-tight italic">
                       Buildings
                    </h3>
                    <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Foundation</p>
                  </div>
                  <Button onClick={() => openDialog('building')} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-black shadow-lg hover:scale-110 transition-all">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                   {buildings.map((b) => (
                      <div key={b.id} className="group/item relative">
                         <button
                           onClick={() => { setSelectedBuilding(b); setSelectedFloor(null); }}
                           className={`w-full text-left p-4 rounded-[1.5rem] border transition-all duration-500 flex justify-between items-center relative overflow-hidden ${selectedBuilding?.id === b.id ? 'bg-primary border-primary shadow-xl shadow-primary/20' : 'bg-muted/30 border-border hover:border-primary/20'}`}
                         >
                            <div className="relative z-10">
                               <h4 className={`text-sm font-headline font-black uppercase tracking-tight leading-none mb-1.5 ${selectedBuilding?.id === b.id ? 'text-primary-foreground' : 'text-foreground'}`}>{b.name}</h4>
                               <p className={`text-[8px] font-black uppercase tracking-widest opacity-60 ${selectedBuilding?.id === b.id ? 'text-primary-foreground/60' : 'text-primary'}`}>Code: {b.code}</p>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-all duration-500 ${selectedBuilding?.id === b.id ? 'text-primary-foreground translate-x-1' : 'text-primary group-hover/item:translate-x-1'}`} />
                         </button>
                         {user?.role === 'Admin' && (
                            <button onClick={() => confirmDelete(b.id, 'building', b.name)} className="absolute -right-3 top-1/2 -translate-y-1/2 p-2 bg-red-500 text-white rounded-lg shadow-xl opacity-0 scale-0 group-hover/item:opacity-100 group-hover/item:scale-100 group-hover/item:right-3 transition-all duration-500 z-10 hover:bg-black">
                               <Trash2 className="w-3 h-3" />
                            </button>
                         )}
                      </div>
                   ))}
                </div>
              </div>

              {/* Floors Column */}
              <div className="flex flex-col h-[600px] bg-card/60 rounded-[2rem] p-6 border border-border shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6 px-1">
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-headline font-black flex items-center gap-2.5 text-foreground uppercase tracking-tight italic">
                       Floors
                    </h3>
                    <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Vertical</p>
                  </div>
                  {selectedBuilding && (
                    <Button onClick={() => openDialog('floor')} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-black shadow-lg hover:scale-110 transition-all">
                      <Plus className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                   {!selectedBuilding ? (
                     <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-border rounded-[1.5rem] p-8 text-center text-muted-foreground/30 font-black uppercase text-[8px] tracking-widest gap-2">Select_Target</div>
                   ) : (
                     buildingFloors.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFloor(f)}
                          className={`w-full text-left p-4 rounded-[1.5rem] border transition-all duration-500 flex justify-between items-center relative overflow-hidden ${selectedFloor?.id === f.id ? 'bg-primary border-primary shadow-xl shadow-primary/20' : 'bg-muted/30 border-border hover:border-primary/20'}`}
                        >
                           <div className="relative z-10">
                              <h4 className={`text-sm font-headline font-black uppercase tracking-tight leading-none mb-1.5 ${selectedFloor?.id === f.id ? 'text-primary-foreground' : 'text-foreground'}`}>Floor {f.floor_number}</h4>
                              <p className={`text-[8px] font-black uppercase tracking-widest opacity-60 ${selectedFloor?.id === f.id ? 'text-primary-foreground/60' : 'text-primary'}`}>{selectedBuilding.name}</p>
                           </div>
                           <ChevronRight className={`w-4 h-4 transition-all duration-500 ${selectedFloor?.id === f.id ? 'text-primary-foreground translate-x-1' : 'text-primary group-hover:translate-x-1'}`} />
                        </button>
                     ))
                   )}
                </div>
              </div>

              {/* Rooms Column */}
              <div className="flex flex-col h-[600px] bg-card/60 rounded-[2rem] p-6 border border-border shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6 px-1">
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-headline font-black flex items-center gap-2.5 text-foreground uppercase tracking-tight italic">
                       Rooms
                    </h3>
                    <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Units</p>
                  </div>
                  {selectedFloor && (
                    <Button onClick={() => openDialog('room')} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-black shadow-lg hover:scale-110 transition-all">
                      <Plus className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                   {!selectedFloor ? (
                     <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-border rounded-[1.5rem] p-8 text-center text-muted-foreground/30 font-black uppercase text-[8px] tracking-widest gap-2">Select_Level</div>
                   ) : (
                     floorRooms.map((r) => (
                        <div key={r.id} className="p-4 rounded-[1.5rem] border border-border bg-muted/40 backdrop-blur-md group hover:border-primary/40 transition-all duration-500 relative overflow-hidden shadow-inner">
                           <div className="flex items-center gap-4 relative z-10">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:text-primary transition-colors">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-sm font-headline font-black text-foreground uppercase tracking-tight leading-none mb-1">{r.room_number}</h4>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">{r.room_name}</p>
                              </div>
                           </div>
                        </div>
                     ))
                   )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center px-2">
                <div className="space-y-1">
                   <h3 className="text-3xl font-headline font-black uppercase tracking-tighter text-foreground italic">Taxonomy</h3>
                   <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Classification_Protocol</p>
                </div>
                <Button 
                   onClick={() => openDialog('category')} 
                   className="h-14 px-8 rounded-xl bg-slate-900 text-white font-black text-[9px] uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl"
                >
                  <Plus className="w-4 h-4 mr-3" />
                   Archetype
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((c) => (
                  <motion.div
                    key={c.id}
                    className="p-6 rounded-[2rem] bg-card border border-border flex items-center justify-between hover:border-primary/40 transition-all group shadow-lg"
                  >
                     <div className="flex items-center gap-3.5 relative z-10">
                       <div className="w-10 h-10 bg-muted/40 rounded-xl flex items-center justify-center border border-white/5 group-hover:text-primary transition-all">
                         <Tag className="w-4 h-4" />
                       </div>
                       <p className="font-headline font-black text-lg uppercase tracking-tight text-foreground">{c.category_name}</p>
                     </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Scaled Down Dialogs */}
      <Dialog open={dialogOpen.open} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, open })}>
        <DialogContent className="sm:max-w-[400px] bg-card dark:bg-[#0f0f0f] border-primary/20 rounded-[2rem] p-0 overflow-hidden shadow-2xl focus-visible:outline-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <DialogHeader className="p-8 pb-0 text-left">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20 shadow-lg">
                  <Plus className="w-6 h-6" />
               </div>
               <div>
                  <DialogTitle className="text-xl font-headline font-black text-foreground uppercase tracking-tight italic leading-none">
                    {dialogOpen.type === 'building' ? 'New_Bldg' : 
                     dialogOpen.type === 'floor' ? 'Add_Floor' : 
                     dialogOpen.type === 'room' ? 'Map_Room' : 'Define_Sec'}
                  </DialogTitle>
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1.5 opacity-60">Update_Protocol</p>
               </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
            <div className="space-y-4">
               {(dialogOpen.type === 'building' || dialogOpen.type === 'room' || dialogOpen.type === 'category') && (
                 <InputField label="Name/Designation" name="name" value={formData.name} placeholder="E.g. Engineering" />
               )}
               {dialogOpen.type === 'building' && (
                 <InputField label="System_Code" name="code" value={formData.code} placeholder="E.g. BLD_A1" />
               )}
               {(dialogOpen.type === 'floor' || dialogOpen.type === 'room') && (
                 <InputField label="Reference_No" name="number" value={formData.number} placeholder="E.g. 01" />
               )}
            </div>
            <DialogFooter className="pt-4 sm:flex-col gap-2">
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-lg border-none">
                {isSubmitting ? 'Syncing...' : 'Confirm_Registry'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen({ type: null, open: false })} className="w-full h-10 text-muted-foreground font-black text-[9px] uppercase tracking-[0.2em]">
                Dismiss
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm bg-card dark:bg-[#0f0f0f] border-red-500/20 rounded-[2rem] p-0 overflow-hidden shadow-2xl focus-visible:outline-none">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
          <div className="p-8 text-center space-y-6">
             <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 shadow-xl">
                <AlertTriangle className="w-8 h-8" />
             </div>
             <div className="space-y-2.5">
                <DialogHeader className="text-center p-0">
                  <DialogTitle className="text-xl font-headline font-black text-foreground uppercase tracking-tight italic leading-none text-center">
                    Erase_Protocol
                  </DialogTitle>
                  <p className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em] mt-2 opacity-60">Purge_Confirmation</p>
                </DialogHeader>
                <DialogDescription className="text-xs text-muted-foreground font-medium italic opacity-60 leading-relaxed px-4 text-center">
                   Permanently erase <span className="text-red-500 font-bold underline">{itemToDelete?.name}</span>? This action is irreversible.
                </DialogDescription>
             </div>
             <div className="pt-2 flex flex-col gap-2">
                <Button onClick={handleExecuteDelete} disabled={isSubmitting} className="w-full h-12 bg-red-500 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-lg border-none">
                   {isSubmitting ? 'Purging...' : 'Confirm_Erase'}
                </Button>
                <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="w-full h-10 text-muted-foreground font-black text-[9px] uppercase tracking-[0.2em]">
                   Abort
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
