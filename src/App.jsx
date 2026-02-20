import React, { useState } from "react";
import NutritionView from "./components/NutritionView";
import TrainingView from "./components/TrainingView";
import MobilityView from "./components/MobilityView";
import RecordsView from "./components/RecordsView";
import AIAnalysisModal from "./components/AIAnalysisModal";
import { useFitnessData } from "./hooks/useFitnessData";
import {
  Utensils,
  Dumbbell,
  Footprints,
  Medal,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Sparkles,
  User,
  Settings,
  LogOut,
  Database,
  PlusCircle,
  Flame,
  LineChart,
} from "lucide-react";

export default function App() {
  const {
    appData,
    activeWeek,
    setActiveWeek,
    currentWeek,
    handleImport,
    handleExport,
    currentStreak, // 🔥 LEEMOS EL VALOR DEL ALGORITMO
  } = useFitnessData();

  const [activeTab, setActiveTab] = useState("nutrition");
  const [activeDay, setActiveDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
  );
  const [showAiModal, setShowAiModal] = useState(false);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = {
    name: "Sergio",
    gender: "male",
    avatar: "/avatar.png",
    plan: "Pro",
  };

  // --- ESTILOS DINÁMICOS ---
  const isMale = user.gender === "male";
  const glowEffect = isMale
    ? "drop-shadow-[0_0_15px_rgba(56,189,248,0.6)] hover:drop-shadow-[0_0_25px_rgba(56,189,248,0.9)]"
    : "drop-shadow-[0_0_15px_rgba(236,72,153,0.6)] hover:drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]";

  const colorFilter = isMale
    ? "invert(66%) sepia(61%) saturate(1605%) hue-rotate(163deg) brightness(103%) contrast(105%)"
    : "invert(83%) sepia(28%) saturate(6085%) hue-rotate(298deg) brightness(102%) contrast(106%)";

  const TABS = [
    { id: "nutrition", icon: Utensils, label: "Dieta" },
    { id: "training", icon: Dumbbell, label: "Entreno" },
    { id: "mobility", icon: Footprints, label: "GPS" },
    { id: "records", icon: Medal, label: "PRs" },
    { id: "progress", icon: LineChart, label: "Progreso" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      <AIAnalysisModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        data={currentWeek}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
          <div className="text-center md:text-left flex items-center gap-5">
            <div className="relative z-10 flex-shrink-0">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-transparent border-none p-0 outline-none hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-contain ${glowEffect} transition-all duration-300`}
                  style={{ filter: colorFilter }}
                />
              </button>

              {showUserMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-3 z-50 animate-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-800 mb-2">
                    <p className="text-lg font-black text-white">{user.name}</p>
                    <p
                      className={`text-xs font-bold font-mono uppercase tracking-widest ${isMale ? "text-sky-400" : "text-pink-400"}`}
                    >
                      {user.plan} Member
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      alert("Característica CRUD en desarrollo 🛠️")
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <PlusCircle className="w-5 h-5 text-emerald-400" /> Añadir
                    Registro Manual
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <User className="w-5 h-5 text-blue-400" /> Datos Biométricos
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <Settings className="w-5 h-5 text-slate-400" />{" "}
                    Configuración de Metas
                  </button>
                  <div className="border-t border-slate-800 mt-2 pt-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-5 h-5" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter leading-none">
                  FITNESS ENGINE{" "}
                  <span className="text-blue-500 not-italic">PRO</span>
                </h1>

                {/* 🔥 INDICADOR DE RACHA MATEMÁTICO */}
                <div
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-500 ${
                    currentStreak > 0
                      ? "bg-orange-500/10 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                      : "bg-slate-800/50 border-slate-700/50 grayscale opacity-50"
                  }`}
                  title="Días de racha activa (Se rompe si pasas 3 días seguidos sin entrenar/moverte)"
                >
                  <Flame
                    className={`w-4 h-4 ${currentStreak > 0 ? "text-orange-500" : "text-slate-500"}`}
                  />
                  <span
                    className={`${currentStreak > 0 ? "text-orange-400" : "text-slate-500"} font-bold text-xs tracking-wide`}
                  >
                    {currentStreak} DÍAS
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-bold tracking-widest uppercase mt-2">
                Tu Centro de Comando
              </p>
            </div>
          </div>

          <div className="flex gap-2 relative mt-4 md:mt-0">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-3 rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <Download className="w-5 h-5" />
              </button>

              {showExportMenu && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in zoom-in-95">
                  <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 mb-1">
                    <Database className="w-3 h-3" /> Opciones de Backup
                  </div>
                  <button
                    onClick={() => {
                      handleExport();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-blue-600 hover:text-white transition-colors font-bold"
                  >
                    📦 Exportar Todo (Full Backup)
                  </button>
                  {appData.map((week, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleExport(week.weekLabel);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-t border-slate-800/50"
                    >
                      📅 {week.weekLabel}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-3 rounded-xl border border-slate-700 cursor-pointer transition-all flex items-center gap-2 shadow-sm">
              <Upload className="w-5 h-5" />
              <input
                type="file"
                className="hidden"
                onChange={handleImport}
                accept=".json"
              />
            </label>
            <button
              onClick={() => setShowAiModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 active:scale-95 transition-all border border-blue-400/20"
            >
              <Sparkles className="w-4 h-4" /> AI Coach
            </button>
          </div>
        </header>

        {/* BARRA DE NAVEGACIÓN SUPERIOR */}
        <nav className="mb-8">
          <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 flex overflow-x-auto no-scrollbar md:justify-center backdrop-blur-md">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 min-w-[120px] ${
                    isActive
                      ? "bg-slate-800 text-white shadow-md border border-slate-600"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${isActive ? "text-blue-400" : "opacity-70"}`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* SELECTOR DE SEMANA (Oculto si estamos en la pestaña de progreso global) */}
        {activeTab !== "progress" && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => setActiveWeek((w) => Math.max(0, w - 1))}
              disabled={activeWeek === 0}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-all border border-slate-800 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="bg-slate-900 px-6 py-2.5 rounded-xl border border-slate-700 shadow-inner">
              <span className="font-mono text-sm font-bold text-blue-400 tracking-wide">
                {currentWeek?.weekLabel || "Añade datos para empezar"}
              </span>
            </div>

            <button
              onClick={() =>
                setActiveWeek((w) => Math.min(appData.length - 1, w + 1))
              }
              disabled={
                activeWeek === appData.length - 1 || appData.length === 0
              }
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-all border border-slate-800 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "nutrition" && (
            <NutritionView
              data={currentWeek?.nutritionData}
              activeDay={activeDay}
              onDayChange={setActiveDay}
            />
          )}
          {activeTab === "training" && (
            <TrainingView
              data={currentWeek?.trainingData}
              activeDay={activeDay}
              onDayChange={setActiveDay}
            />
          )}
          {activeTab === "mobility" && (
            <MobilityView data={currentWeek?.mobilityData} />
          )}
          {activeTab === "records" && <RecordsView history={appData} />}

          {/* NUEVO: MÓDULO DE PROGRESO PREPARADO */}
          {activeTab === "progress" && (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed h-96">
              <div className="relative mb-6">
                <LineChart className="w-20 h-20 text-blue-500 opacity-20" />
                <LineChart className="w-16 h-16 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                Estadísticas y Análisis
              </h3>
              <p className="text-sm text-center max-w-md text-slate-400">
                Aquí implementaremos la gráfica interactiva que cruzará tu{" "}
                <strong>Peso Corporal</strong> contra el{" "}
                <strong>Volumen de Entrenamiento</strong> total, permitiéndote
                ver la recomposición corporal en tiempo real.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
