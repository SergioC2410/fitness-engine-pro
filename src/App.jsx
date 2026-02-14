import React, { useState, useEffect } from 'react';
import { 
  Activity, Utensils, Calendar, Ruler, Dumbbell, Timer, 
  ClipboardList, Trophy, Footprints, Medal, 
  TrendingUp, ChevronLeft, ChevronRight, 
  Download, Sparkles, X, Loader2, Bot, Upload, MapPin, Moon, Info, Copy, Flame, Zap
} from 'lucide-react';

// --- CONSTANTES ---
const STORAGE_KEY = 'sergio_fitness_data';

// --- COMPONENTES UI ---
const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all shadow-sm group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors`}>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
    </div>
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    <div className="text-sm text-slate-400 font-medium">{title}</div>
    {subtext && <div className="text-xs text-slate-500 mt-1 border-t border-slate-700/50 pt-1">{subtext}</div>}
  </div>
);

// --- MODAL "PUENTE A GEM" ---
const GemBridgeModal = ({ isOpen, onClose, onCopy }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col items-center text-center p-8">
        <div className="p-4 bg-indigo-500/20 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Conectar con tu Gem</h3>
        <p className="text-slate-400 text-sm mb-6">
          Haz clic para copiar tus datos de esta semana y pegarlos en tu chat personalizado.
        </p>
        <button onClick={onCopy} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mb-3">
            <Copy className="w-5 h-5" /> Copiar Datos
        </button>
        <button onClick={onClose} className="text-slate-500 hover:text-white text-sm mt-2">Cancelar</button>
      </div>
    </div>
  );
};

// --- VISTA NUTRICIÓN (MEJORADA VISUALMENTE) ---
const NutritionView = ({ weekData, activeDay, setActiveDay }) => {
  const maxKcal = 3500;
  const dayOrder = { 'Lunes':1, 'Martes':2, 'Miércoles':3, 'Jueves':4, 'Viernes':5, 'Sábado':6, 'Domingo':7 };
  const sortedWeek = [...(weekData || [])].sort((a,b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99));
  const activeDayLabel = Object.keys(dayOrder).find(key => dayOrder[key] === activeDay + 1);
  const currentDayData = sortedWeek.find(d => d.day === activeDayLabel) || { day: 'Selecciona día', totalKcal: 0, meals: [] };

  // Helper para colores de comida
  const getMealStyle = (type) => {
      const t = type.toLowerCase();
      if (t.includes('desayuno')) return 'border-l-4 border-l-orange-500 bg-orange-500/5';
      if (t.includes('almuerzo')) return 'border-l-4 border-l-blue-500 bg-blue-500/5';
      if (t.includes('cena')) return 'border-l-4 border-l-indigo-500 bg-indigo-500/5';
      if (t.includes('snack') || t.includes('suplemento')) return 'border-l-4 border-l-emerald-500 bg-emerald-500/5';
      return 'border-l-4 border-l-slate-500 bg-slate-800';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* GRÁFICA SEMANAL */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm shadow-xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Balance Calórico
          </h2>
          <div className="flex gap-3 text-[10px] uppercase font-bold text-slate-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Real</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-700"></div> Meta</span>
          </div>
        </div>
        <div className="w-full h-48 flex items-end justify-between gap-2">
          {sortedWeek.map((day, idx) => {
             const realIdx = (dayOrder[day.day] || 1) - 1;
             const isActive = activeDay === realIdx;
             return (
              <button key={idx} onClick={() => setActiveDay(realIdx)} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                <div className={`w-full max-w-[40px] rounded-t-md transition-all duration-300 relative ${isActive ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700 hover:bg-slate-600'}`} style={{ height: `${Math.min((day.totalKcal / maxKcal) * 100, 100)}%` }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-900 text-white px-2 py-1 rounded border border-slate-600 transition-opacity whitespace-nowrap z-10">{day.totalKcal}</div>
                </div>
                <span className={`mt-2 text-[10px] font-bold uppercase ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{day.day.substring(0,3)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* DETALLE DEL DÍA */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* CABECERA DE DÍA */}
        <div className="p-6 border-b border-slate-700 bg-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {currentDayData.day} <span className="text-sm font-mono font-normal text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{currentDayData.date || '--/--'}</span>
            </h3>
            <p className="text-blue-300 text-sm mt-1 font-medium">{currentDayData.summary || 'Sin registro'}</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-700">
             <div className="text-right border-r border-slate-700 pr-4">
                <div className="text-2xl font-black text-white">{currentDayData.totalKcal}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Kcal Totales</div>
             </div>
             <div className="flex gap-2">
                <div className="flex flex-col items-center px-2">
                   <div className="text-xs font-bold text-blue-400">P</div>
                   <div className="w-1 h-6 bg-slate-700 rounded-full relative overflow-hidden"><div className="absolute bottom-0 w-full bg-blue-500 h-3/4"></div></div>
                </div>
                <div className="flex flex-col items-center px-2">
                   <div className="text-xs font-bold text-emerald-400">C</div>
                   <div className="w-1 h-6 bg-slate-700 rounded-full relative overflow-hidden"><div className="absolute bottom-0 w-full bg-emerald-500 h-full"></div></div>
                </div>
                <div className="flex flex-col items-center px-2">
                   <div className="text-xs font-bold text-orange-400">G</div>
                   <div className="w-1 h-6 bg-slate-700 rounded-full relative overflow-hidden"><div className="absolute bottom-0 w-full bg-orange-500 h-1/4"></div></div>
                </div>
             </div>
          </div>
        </div>

        {/* LISTA DE COMIDAS (GRID) */}
        <div className="p-6 bg-slate-900/30">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Utensils className="w-3 h-3" /> Registro de Comidas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentDayData.meals && currentDayData.meals.length > 0 ? (
              currentDayData.meals.map((meal, i) => (
                <div key={i} className={`p-4 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-all shadow-sm ${getMealStyle(meal.type)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-70 bg-black/20 px-2 py-0.5 rounded">
                      {meal.type}
                    </span>
                    <div className="text-white font-mono font-bold text-lg leading-none">
                       {meal.kcal} <span className="text-[10px] font-sans text-slate-400 font-normal">kcal</span>
                    </div>
                  </div>
                  <h4 className="text-slate-200 font-medium text-sm leading-snug">{meal.item}</h4>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                <Utensils className="w-8 h-8 mb-2 opacity-20 mx-auto"/>
                <span>No hay comidas registradas</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- VISTA ENTRENAMIENTO ---
const TrainingView = ({ activeDay, setActiveDay, weekData }) => {
  const session = weekData.trainingData ? weekData.trainingData[activeDay] : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, idx) => (
          <button key={idx} onClick={() => setActiveDay(idx)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeDay === idx ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            {day}
          </button>
        ))}
      </div>

      {session && session.hasData ? (
        session.type === 'rest' ? (
           <div className="flex flex-col items-center justify-center py-20 bg-slate-800 rounded-xl border border-slate-700 border-dashed">
             <Moon className="w-16 h-16 text-blue-400 mb-4 opacity-50 animate-pulse" />
             <h3 className="text-xl font-bold text-white">{session.title}</h3>
             <p className="text-slate-400 mt-2">{session.notes}</p>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <StatCard title="Volumen" value={session.volume} icon={Dumbbell} color="blue" />
               <StatCard title="Tiempo" value={session.duration} icon={Timer} color="emerald" />
               <StatCard title="Series" value={session.sets} icon={ClipboardList} color="purple" />
               <StatCard title="Récords" value={session.exercises?.filter(e => e.note?.includes('🏆')).length > 0 ? "PR 🏆" : "-"} icon={Trophy} color="yellow" />
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 bg-slate-800/50">
                 <h3 className="text-xl font-bold text-white">{session.title}</h3>
                 <p className="text-sm text-blue-400 font-medium">{session.focus}</p>
                 <p className="text-xs text-slate-500 mt-2 italic flex items-center gap-1"><Info className="w-3 h-3"/> {session.notes}</p>
              </div>
              <div className="divide-y divide-slate-700">
                {session.exercises?.map((ex, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-700/20 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-slate-200">{ex.name}</h4>
                      {ex.note && <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">{ex.note}</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {ex.sets.map((set, sIdx) => (
                        <div key={sIdx} className="bg-slate-900 p-2 rounded text-center border border-slate-700">
                          <div className="text-[10px] text-slate-500 mb-0.5">Set {sIdx + 1}</div>
                          <div className="text-xs font-bold text-white">{set.weight}</div>
                          <div className="text-[10px] text-slate-400">x {set.reps}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-800 rounded-xl border border-slate-700 border-dashed opacity-50">
          <Dumbbell className="w-12 h-12 mb-4" />
          <p>Sin datos de entrenamiento para este día</p>
        </div>
      )}
    </div>
  );
};

// --- VISTA MOVILIDAD ---
const MobilityView = ({ weekData }) => {
  const dayOrder = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 7 };
  const sortedMobility = [...(weekData.mobilityData || [])].sort((a,b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Footprints className="w-6 h-6 text-orange-400" /> Registro GPS y Pasos
        </h3>
        <div className="grid gap-3">
          {sortedMobility.length > 0 ? (
            sortedMobility.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-700">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                     {item.day?.substring(0,3) || 'Día'}
                   </div>
                   <div>
                     <div className="text-white font-medium">{item.activity}</div>
                     <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> {item.notes}</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-orange-400 font-mono font-bold">{item.distance}</div>
                   <div className="text-blue-400 text-xs font-bold">{item.duration}</div>
                 </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">No hay registros de movilidad esta semana.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- VISTA RÉCORDS ---
const RecordsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-6 rounded-2xl border border-yellow-500/30 mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Medal className="w-8 h-8 text-yellow-400" /> Salón de la Fama
            </h2>
            <p className="text-slate-300 text-sm mt-1">Hitos alcanzados durante el ciclo actual.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
             <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">PR!</div>
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-bold text-white">Jalón al Pecho</h3>
                </div>
                <div className="text-3xl font-extrabold text-white">45 kg <span className="text-sm font-normal text-slate-400">x 10 reps</span></div>
                <p className="text-xs text-slate-500 mt-2">Viernes - Semana 1</p>
             </div>
             
             <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white">Volumen Pierna</h3>
                </div>
                <div className="text-3xl font-extrabold text-white">5,107 kg</div>
                <p className="text-xs text-slate-500 mt-2">Mayor densidad de trabajo (Lunes)</p>
             </div>
        </div>
    </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [{ 
      weekLabel: "Semana 09/02 - 15/02", 
      nutritionData: [], 
      trainingData: {}, 
      mobilityData: [] 
    }];
  });

  const [activeWeek, setActiveWeek] = useState(0);
  const [activeTab, setActiveTab] = useState('nutrition');
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); 
  const [showBridgeModal, setShowBridgeModal] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); }, [appData]);

  const currentWeek = appData[activeWeek] || appData[0];

  const handleExportData = () => {
      const dataStr = JSON.stringify(appData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fitness_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleCopyForGem = () => {
    const promptData = {
        meta: "Sergio | 1.70m | 86kg -> 75kg | Recomposición",
        data: currentWeek
    };
    navigator.clipboard.writeText(JSON.stringify(promptData, null, 2));
    setShowBridgeModal(false);
    alert("✅ Datos copiados al portapapeles. Pégalos en tu Gem.");
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const dayOrder = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 7 };

    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        const newWeeks = Array.isArray(imported) ? imported : [imported.data || imported];

        setAppData(prevData => {
            let updatedData = [...prevData];

            newWeeks.forEach(newWeekData => {
                const weekIndex = updatedData.findIndex(w => w.weekLabel === newWeekData.weekLabel);

                if (weekIndex === -1) {
                    updatedData.push(newWeekData);
                } else {
                    const weekToUpdate = updatedData[weekIndex];
                    
                    const mergedNutrition = (newWeekData.nutritionData || []).reduce((acc, newDay) => {
                        const dayIdx = acc.findIndex(d => d.date === newDay.date);
                        if (dayIdx !== -1) acc[dayIdx] = { ...acc[dayIdx], ...newDay, isProjected: false };
                        else acc.push({ ...newDay, isProjected: false });
                        return acc;
                    }, [...(weekToUpdate.nutritionData || [])]);
                    mergedNutrition.sort((a, b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99));

                    const mergedMobility = [...(weekToUpdate.mobilityData || [])];
                    (newWeekData.mobilityData || []).forEach(newItem => {
                        const idx = mergedMobility.findIndex(m => m.day === newItem.day);
                        if (idx !== -1) mergedMobility[idx] = newItem;
                        else mergedMobility.push(newItem);
                    });
                    mergedMobility.sort((a, b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99));

                    updatedData[weekIndex] = {
                        ...weekToUpdate,
                        nutritionData: mergedNutrition,
                        trainingData: { ...(weekToUpdate.trainingData || {}), ...(newWeekData.trainingData || {}) },
                        mobilityData: mergedMobility
                    };
                }
            });
            return updatedData;
        });
        alert("✅ Datos importados correctamente.");
      } catch (err) {
        console.error(err);
        alert("❌ Error en el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans pb-10">
      <GemBridgeModal isOpen={showBridgeModal} onClose={() => setShowBridgeModal(false)} onCopy={handleCopyForGem} />

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">FITNESS<span className="text-blue-500">ENGINE</span></h1>
            
            <div className="flex items-center gap-3 mt-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700 w-fit">
               <button onClick={() => setActiveWeek(p => Math.max(0, p - 1))} disabled={activeWeek === 0} className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"><ChevronLeft className="w-4 h-4"/></button>
               <span className="text-xs font-mono text-blue-300 px-2">{currentWeek?.weekLabel || 'Cargando...'}</span>
               <button onClick={() => setActiveWeek(p => Math.min(appData.length - 1, p + 1))} disabled={activeWeek === appData.length - 1} className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>

          <div className="flex gap-3">
             <button onClick={handleExportData} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2 text-sm font-bold transition-all">
               <Download className="w-4 h-4" /> Exportar
             </button>
            <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 cursor-pointer flex items-center gap-2 text-sm font-bold transition-all">
              <Upload className="w-4 h-4" /> Importar <input type="file" className="hidden" onChange={handleImportData} accept=".json" />
            </label>
            <button onClick={() => setShowBridgeModal(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg transition-all active:scale-95">
              <Sparkles className="w-4 h-4" /> Enviar a mi Gem
            </button>
          </div>
        </header>

        <nav className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'nutrition', label: 'Nutrición', icon: Utensils },
            { id: 'training', label: 'Entrenamiento', icon: Dumbbell },
            { id: 'mobility', label: 'Movilidad', icon: Footprints },
            { id: 'records', label: 'Récords', icon: Medal },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : ''}`} /> {tab.label}
            </button>
          ))}
        </nav>

        <main className="min-h-125">
          {activeTab === 'nutrition' && <NutritionView weekData={currentWeek?.nutritionData} activeDay={activeDay} setActiveDay={setActiveDay} />}
          {activeTab === 'training' && <TrainingView activeDay={activeDay} setActiveDay={setActiveDay} weekData={currentWeek} />}
          {activeTab === 'mobility' && <MobilityView weekData={currentWeek} />}
          {activeTab === 'records' && <RecordsView />}
        </main>
      </div>
    </div>
  );
}