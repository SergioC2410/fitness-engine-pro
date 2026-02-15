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
} from "lucide-react";

export default function App() {
  const {
    appData,
    activeWeek,
    setActiveWeek,
    currentWeek,
    handleImport,
    handleExport,
  } = useFitnessData();

  const [activeTab, setActiveTab] = useState("nutrition");
  const [activeDay, setActiveDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
  );
  const [showAiModal, setShowAiModal] = useState(false);

  // Configuración de las pestañas para el bucle
  const TABS = [
    { id: "nutrition", icon: Utensils, label: "Dieta" },
    { id: "training", icon: Dumbbell, label: "Entreno" },
    { id: "mobility", icon: Footprints, label: "GPS" },
    { id: "records", icon: Medal, label: "PRs" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <AIAnalysisModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        data={currentWeek}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* HEADER PRINCIPAL */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              FITNESS ENGINE{" "}
              <span className="text-blue-500 not-italic">PRO</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">
              Sistema de Recomposición Corporal
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-2.5 rounded-xl border border-slate-800 transition-all"
              title="Exportar Backup"
            >
              <Download className="w-5 h-5" />
            </button>
            <label
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-2.5 rounded-xl border border-slate-800 cursor-pointer transition-all"
              title="Importar Datos"
            >
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" /> AI Coach
            </button>
          </div>
        </header>

        {/* 🚀 NUEVA UBICACIÓN: BARRA DE NAVEGACIÓN SUPERIOR */}
        <nav className="mb-8">
          <div className="bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 flex overflow-x-auto no-scrollbar md:justify-center">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 min-w-[100px]
                    ${
                      isActive
                        ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }
                  `}
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

        {/* SELECTOR DE SEMANA */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => setActiveWeek((w) => Math.max(0, w - 1))}
            disabled={activeWeek === 0}
            className="p-2 rounded-lg hover:bg-slate-900 text-slate-500 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <span className="font-mono text-sm font-bold text-blue-400">
              {currentWeek?.weekLabel || "Cargando..."}
            </span>
          </div>

          <button
            onClick={() =>
              setActiveWeek((w) => Math.min(appData.length - 1, w + 1))
            }
            disabled={activeWeek === appData.length - 1}
            className="p-2 rounded-lg hover:bg-slate-900 text-slate-500 disabled:opacity-20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

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
        </main>
      </div>
    </div>
  );
}
