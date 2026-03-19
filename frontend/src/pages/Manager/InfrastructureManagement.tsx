import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Layers, MapPin, Tag, Plus, Trash2, Settings, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/services/infrastructureService';

type Building = { id: number; name: string; code: string };
type Floor = { id: number; building_id: number; floor_number: string | number };
type Room = { id: number; floor_id: number; room_number: string; room_name: string };
type Category = { id: number; category_name: string };

export const InfrastructureManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'facilities' | 'categories'>('facilities');
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

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

  const handleCreateBuilding = async () => {
    const name = prompt('Enter Building Name:');
    const code = prompt('Enter Building Code:');
    if (name && code) {
      await api.createBuilding({ name, code });
      fetchData();
    }
  };

  const handleDeleteBuilding = async (id: number) => {
    if (confirm('Are you sure you want to delete this building?')) {
      await api.deleteBuilding(id);
      if (selectedBuilding?.id === id) {
        setSelectedBuilding(null);
        setSelectedFloor(null);
      }
      fetchData();
    }
  };

  const handleCreateFloor = async () => {
    if (!selectedBuilding) return;
    const floorNumber = prompt('Enter Floor Number/Name:');
    if (floorNumber) {
      await api.createFloor({ building_id: selectedBuilding.id, floor_number: floorNumber });
      fetchData();
    }
  };

  const handleCreateRoom = async () => {
    if (!selectedFloor) return;
    const roomNumber = prompt('Enter Room Number:');
    const roomName = prompt('Enter Room Name/Description:');
    if (roomNumber && roomName) {
      await api.createRoom({ floor_id: selectedFloor.id, room_number: roomNumber, room_name: roomName });
      fetchData();
    }
  };

  const handleCreateCategory = async () => {
    const name = prompt('Enter Category Name:');
    if (name) {
      await api.createCategory({ category_name: name });
      fetchData();
    }
  };

  // Filter Data
  const buildingFloors = selectedBuilding ? floors.filter(f => f.building_id === selectedBuilding.id) : [];
  const floorRooms = selectedFloor ? rooms.filter(r => r.floor_id === selectedFloor.id) : [];

  return (
    <div className="space-y-8 pb-12 w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(23,23,23,0.9) 0%, rgba(30,30,30,0.95) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.15)'
        }}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/20 text-primary rounded-xl backdrop-blur-md">
                <Settings className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
                Infrastructure Management
              </h1>
            </div>
            <p className="text-lg text-white/60 ml-1">
              Configure physical facilities, add floors, rooms, and maintenance categories.
            </p>
          </div>
          
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl backdrop-blur-xl border border-white/5">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'facilities' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Building2 className="w-4 h-4" />
              Facilities
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'categories' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Tag className="w-4 h-4" />
              Categories
            </button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'facilities' && (
            <motion.div
              key="facilities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Buildings Column */}
              <div className="space-y-4 flex flex-col h-full bg-black/20 p-5 border border-white/5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white/90">
                    <Building2 className="w-5 h-5 text-primary" />
                    Buildings
                  </h3>
                  <Button onClick={handleCreateBuilding} size="sm" className="bg-primary text-black font-bold hover:bg-white shrink-0">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                  {buildings.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`relative flex items-center rounded-xl overflow-hidden transition-all ${selectedBuilding?.id === b.id ? 'border-primary shadow-[0_0_15px_rgba(255,215,0,0.15)] ring-1 ring-primary' : 'border border-white/10 hover:border-white/30'}`}
                    >
                      <button
                        onClick={() => {
                          setSelectedBuilding(b);
                          setSelectedFloor(null);
                        }}
                        className={`flex-1 text-left p-4 bg-black/40 backdrop-blur-md group flex justify-between items-center ${selectedBuilding?.id === b.id ? 'bg-primary/10' : ''}`}
                      >
                        <div>
                          <h4 className={`font-bold text-lg ${selectedBuilding?.id === b.id ? 'text-primary' : 'text-white'}`}>{b.name}</h4>
                          <p className="text-sm text-white/50">Code: {b.code}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${selectedBuilding?.id === b.id ? 'text-primary translate-x-1' : 'text-white/20 group-hover:text-white/50'}`} />
                      </button>
                      <button onClick={() => handleDeleteBuilding(b.id)} className="absolute right-12 p-2 text-white/20 hover:text-red-400 opacity-0 hover:opacity-100 transition-opacity" style={{ opacity: selectedBuilding?.id === b.id ? 1 : undefined }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  {buildings.length === 0 && <div className="text-white/40 italic p-6 text-center border-2 border-dashed border-white/10 rounded-xl">No buildings</div>}
                </div>
              </div>

              {/* Floors Column */}
              <div className="space-y-4 flex flex-col h-full bg-black/20 p-5 border border-white/5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white/90">
                    <Layers className="w-5 h-5 text-primary" />
                    Floors
                  </h3>
                  {selectedBuilding && (
                    <Button onClick={handleCreateFloor} size="sm" className="bg-primary text-black font-bold hover:bg-white shrink-0">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {!selectedBuilding ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex text-white/30 items-center justify-center border-2 border-dashed border-white/5 rounded-xl p-6 text-center">
                      Select a building to view/add floors
                    </motion.div>
                  ) : (
                    <motion.div key="floors-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                      {buildingFloors.map((f, i) => (
                        <motion.button
                          key={f.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedFloor(f)}
                          className={`text-left p-4 rounded-xl border backdrop-blur-md transition-all group flex justify-between items-center ${selectedFloor?.id === f.id ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-[0_0_15px_rgba(255,215,0,0.15)]' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                        >
                          <div>
                            <h4 className={`font-bold text-lg ${selectedFloor?.id === f.id ? 'text-primary' : 'text-white'}`}>Floor {f.floor_number}</h4>
                            <p className="text-xs text-white/40 mt-1">{buildings.find(b=>b.id===f.building_id)?.name}</p>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-transform ${selectedFloor?.id === f.id ? 'text-primary translate-x-1' : 'text-white/20 group-hover:text-white/50'}`} />
                        </motion.button>
                      ))}
                      {buildingFloors.length === 0 && <div className="text-white/40 italic p-6 text-center border border-white/5 bg-black/20 rounded-xl">No floors found</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rooms Column */}
              <div className="space-y-4 flex flex-col h-full bg-black/20 p-5 border border-white/5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5 text-primary" />
                    Rooms
                  </h3>
                  {selectedFloor && (
                    <Button onClick={handleCreateRoom} size="sm" className="bg-primary text-black font-bold hover:bg-white shrink-0">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {!selectedFloor ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex text-white/30 items-center justify-center border-2 border-dashed border-white/5 rounded-xl p-6 text-center">
                      Select a floor to view/add rooms
                    </motion.div>
                  ) : (
                    <motion.div key="rooms-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                      {floorRooms.map((r, i) => (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-primary/50 transition-colors group cursor-default"
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
                        </motion.div>
                      ))}
                      {floorRooms.length === 0 && <div className="text-white/40 italic p-6 text-center border border-white/5 bg-black/20 rounded-xl">No rooms found</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-bold tracking-tight">Maintenance Categories</h3>
                <Button onClick={handleCreateCategory} className="bg-primary text-black hover:bg-white gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-6 flex items-center justify-between hover:border-primary/30 transition-colors group"
                  >
                     <div className="flex items-center gap-4">
                       <div className="p-2.5 bg-black/40 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors border border-white/5">
                         <Tag className="w-5 h-5" />
                       </div>
                       <p className="font-semibold text-lg">{c.category_name}</p>
                     </div>
                  </motion.div>
                ))}
                {categories.length === 0 && (
                   <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-2xl text-white/40">
                      No categories defined yet.
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
