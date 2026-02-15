import React, { useState } from "react";
// Importamos los componentes que creaste
import NutritionView from "./components/NutritionView";
import TrainingView from "./components/TrainingView";
import MobilityView from "./components/MobilityView";
import RecordsView from "./components/RecordsView";
import AIAnalysisModal from "./components/AIAnalysisModal";
// Importamos el hook que manejará los datos (lo llenaremos luego)
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
  // Usamos el hook para obtener los datos y funciones
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-20 sm:pb-8">
      {/* El Modal vive aquí porque es un elemento global */}
      <AIAnalysisModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        data={currentWeek}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <h1 className="text-3xl font-black text-white italic">
            FITNESS ENGINE{" "}
            <span className="text-blue-500 text-sm not-italic font-mono">
              PRO
            </span>
          </h1>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <Download className="w-5 h-5" />
            </button>
            <label className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-700 transition-all">
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
              className="bg-blue-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/40"
            >
              <Sparkles className="w-4 h-4" /> AI Coach
            </button>
          </div>
        </header>

        {/* NAVEGACIÓN DE SEMANAS (SUB-HEADER) */}
        <div className="flex justify-center items-center gap-4 mb-8 bg-slate-800/40 p-2 rounded-2xl border border-slate-800 w-fit mx-auto">
          <button
            onClick={() => setActiveWeek((w) => w - 1)}
            disabled={activeWeek === 0}
            className="disabled:opacity-20"
          >
            <ChevronLeft />
          </button>
          <span className="font-mono text-sm font-bold text-blue-400">
            {currentWeek?.weekLabel}
          </span>
          <button
            onClick={() => setActiveWeek((w) => w + 1)}
            disabled={activeWeek === appData.length - 1}
            className="disabled:opacity-20"
          >
            <ChevronRight />
          </button>
        </div>

        {/* GESTIÓN DE RUTAS (TABS) */}
        <main className="min-h-125 mb-20">
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

        {/* BARRA DE NAVEGACIÓN MOBILE (DETERMINA LA RUTA ACTIVA) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 flex justify-around items-center z-50 md:relative md:bg-transparent md:border-none md:p-0">
          {[
            { id: "nutrition", icon: Utensils, label: "Dieta" },
            { id: "training", icon: Dumbbell, label: "Entreno" },
            { id: "mobility", icon: Footprints, label: "GPS" },
            { id: "records", icon: Medal, label: "PRs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? "text-blue-400 scale-110" : "text-slate-500"}`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
