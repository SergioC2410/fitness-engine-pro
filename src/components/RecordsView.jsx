import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Trophy, Medal, TrendingUp, Crown, Star, History } from "lucide-react";

// --- SUB-COMPONENTE: Tarjeta de Récord (Hero Card) ---
const RecordCard = ({ title, value, date, subtext, isGold }) => (
  <div
    className={`
    relative p-6 rounded-2xl border overflow-hidden group transition-all duration-300 hover:-translate-y-1
    ${
      isGold
        ? "bg-linear-to-br from-yellow-900/40 to-slate-900 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]"
        : "bg-slate-800 border-slate-700 hover:border-slate-500"
    }
  `}
  >
    {/* Decoración de Fondo (Brillo) */}
    {isGold && (
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none group-hover:bg-yellow-500/30 transition-all" />
    )}

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`
          p-3 rounded-xl 
          ${isGold ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50" : "bg-slate-700 text-slate-300"}
        `}
        >
          {isGold ? (
            <Crown className="w-6 h-6" />
          ) : (
            <TrendingUp className="w-6 h-6" />
          )}
        </div>
        {isGold && (
          <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[10px] font-black uppercase tracking-wider rounded">
            Récord Personal
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <div className="text-3xl font-black tracking-tight text-white mb-2">
        {value}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-700/50 pt-3 mt-3">
        <History className="w-3 h-3" />
        <span>{date}</span>
        {subtext && (
          <>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-slate-500">{subtext}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

RecordCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  date: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  isGold: PropTypes.bool,
};

// --- COMPONENTE PRINCIPAL ---
const RecordsView = ({ history = [] }) => {
  // 1. Minería de Datos: Extraer PRs de todo el historial
  const records = useMemo(() => {
    const foundRecords = [];

    // Recorremos cada semana
    history.forEach((week) => {
      if (!week.trainingData) return;

      // Recorremos cada sesión de entrenamiento
      Object.values(week.trainingData).forEach((session) => {
        if (!session.exercises) return;

        session.exercises.forEach((ex) => {
          // Si la nota tiene un trofeo o dice "PR"
          if (ex.note && (ex.note.includes("🏆") || ex.note.includes("PR"))) {
            // Buscamos el set más pesado o representativo
            const bestSet = ex.sets.reduce((prev, current) => {
              const prevW = parseFloat(prev.weight) || 0;
              const currW = parseFloat(current.weight) || 0;
              return currW > prevW ? current : prev;
            }, ex.sets[0]);

            foundRecords.push({
              id: `${week.weekLabel}-${ex.name}`,
              title: ex.name,
              value: `${bestSet.weight} x ${bestSet.reps}`,
              date: week.weekLabel.split(" - ")[0], // "Semana 09/02"
              subtext: ex.note, // "🏆 PR 45kg x 10"
              isGold: true,
            });
          }
        });
      });
    });

    // Añadimos algunos récords calculados/ficticios si no hay suficientes datos
    // para que el portafolio se vea bien lleno
    if (foundRecords.length === 0) {
      return [
        {
          id: "demo-1",
          title: "Jalón al Pecho",
          value: "45 kg x 10",
          date: "Viernes 13/02",
          subtext: "Mejor serie histórica",
          isGold: true,
        },
        {
          id: "demo-2",
          title: "Volumen Semanal",
          value: "5,107 kg",
          date: "Acumulado Actual",
          subtext: "Mayor densidad de trabajo",
          isGold: false,
        },
      ];
    }

    return foundRecords;
  }, [history]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header del Salón de la Fama */}
      <div className="bg-linear-to-r from-yellow-900/40 via-slate-900 to-slate-900 p-8 rounded-3xl border border-yellow-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-10 -translate-y-10">
          <Trophy className="w-64 h-64 text-yellow-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Medal className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-black text-white italic tracking-tight">
              SALÓN DE LA FAMA
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Aquí se inmortalizan tus mejores marcas. Cada repetición cuenta,
            pero estas son las que definen tu legado.
          </p>
        </div>
      </div>

      {/* Grid de Récords */}
      <div className="grid md:grid-cols-2 gap-4">
        {records.map((rec) => (
          <RecordCard
            key={rec.id}
            title={rec.title}
            value={rec.value}
            date={rec.date}
            subtext={rec.subtext}
            isGold={rec.isGold}
          />
        ))}

        {/* Tarjeta de Relleno Motivacional (Statica) */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 border-dashed flex flex-col items-center justify-center text-center group hover:bg-slate-800 transition-colors">
          <div className="p-4 bg-slate-900 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 text-slate-600 group-hover:text-yellow-500 transition-colors" />
          </div>
          <h4 className="text-white font-bold text-sm">Próximo Objetivo</h4>
          <p className="text-xs text-slate-500 mt-1">
            Supera tus marcas para desbloquear nueva tarjeta
          </p>
        </div>
      </div>
    </div>
  );
};

RecordsView.propTypes = {
  history: PropTypes.array,
};

export default RecordsView;
