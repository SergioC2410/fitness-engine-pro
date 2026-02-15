import React from "react";
import PropTypes from "prop-types";
// S1128: Se eliminó 'Repeat' que no se usaba
import {
  Dumbbell,
  Timer,
  ClipboardList,
  Trophy,
  Moon,
  Zap,
  TrendingUp,
} from "lucide-react";
import StatCard from "./StatCard";

// --- SUB-COMPONENTE: Tarjeta de Ejercicio ---
const ExerciseCard = ({ name, sets, notes }) => {
  const isPR = notes && (notes.includes("🏆") || notes.includes("PR"));

  return (
    <div
      className={`
      relative p-4 rounded-xl border transition-all duration-300 group
      ${
        isPR
          ? "bg-yellow-900/10 border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
          : "bg-slate-800 border-slate-700/50 hover:border-slate-600"
      }
    `}
    >
      {isPR && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg animate-bounce-slow">
          PR!
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <h4
          className={`font-bold text-sm ${isPR ? "text-yellow-400" : "text-slate-200"}`}
        >
          {name}
        </h4>
        {notes && !isPR && (
          <span className="text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded border border-slate-600">
            {notes}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {sets.map((set, idx) => (
          // S6479: Usamos una clave compuesta en lugar de solo el índice
          <div
            key={`${idx}-${set.weight}`}
            className="bg-slate-900/60 p-2 rounded text-center border border-slate-700/50"
          >
            <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">
              Set {idx + 1}
            </div>
            <div className="text-xs font-bold text-white">{set.weight}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              x {set.reps}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ExerciseCard.propTypes = {
  name: PropTypes.string.isRequired,
  sets: PropTypes.arrayOf(
    PropTypes.shape({
      weight: PropTypes.string,
      reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  notes: PropTypes.string,
};

// --- COMPONENTE PRINCIPAL ---
const TrainingView = ({ data, activeDay, onDayChange }) => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // S6582: Uso de Optional Chaining (?.) para acceso más limpio
  const session = data?.[activeDay];
  const hasSession = session?.hasData;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Selector de Días */}
      <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
        {days.map((day, idx) => (
          <button
            // S6479: Usamos el nombre del día como key (es único en la lista)
            key={day}
            onClick={() => onDayChange(idx)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap
              ${
                activeDay === idx
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {hasSession ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              title="Volumen"
              value={session.volume}
              icon={TrendingUp}
              color="blue"
              subtext="Carga total movida"
            />
            <StatCard
              title="Tiempo"
              value={session.duration}
              icon={Timer}
              color="emerald"
            />
            <StatCard
              title="Series"
              value={session.sets}
              icon={ClipboardList}
              color="purple"
            />
            <StatCard
              title="Récords"
              value={
                session.exercises?.filter(
                  (e) => e.note?.includes("🏆") || e.note?.includes("PR"),
                ).length || 0
              }
              icon={Trophy}
              color="yellow"
              tooltip="Récords Personales rotos hoy"
            />
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {session.title}
                  </h3>
                  <p className="text-blue-400 text-sm font-medium mt-1">
                    {session.focus}
                  </p>
                </div>
                <div className="bg-blue-900/20 p-2 rounded-lg border border-blue-500/20">
                  <Dumbbell className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              {session.notes && (
                <div className="mt-4 flex gap-2 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 italic">
                    {session.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 grid gap-3 bg-slate-900/30">
              {session.exercises?.map((ex, idx) => (
                <ExerciseCard
                  // S6479: Clave combinada para máxima seguridad
                  key={`${ex.name}-${idx}`}
                  name={ex.name}
                  sets={ex.sets}
                  notes={ex.note}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed text-center">
          <div className="p-4 bg-slate-800 rounded-full mb-4 animate-pulse">
            <Moon className="w-12 h-12 text-blue-400 opacity-80" />
          </div>
          <h3 className="text-xl font-bold text-white">Día de Recuperación</h3>
          <p className="text-slate-400 mt-2 max-w-xs text-sm">
            El músculo crece cuando descansas. Aprovecha para hidratarte y comer
            bien.
          </p>
        </div>
      )}
    </div>
  );
};

TrainingView.propTypes = {
  data: PropTypes.object,
  activeDay: PropTypes.number.isRequired,
  onDayChange: PropTypes.func.isRequired,
};

export default TrainingView;
