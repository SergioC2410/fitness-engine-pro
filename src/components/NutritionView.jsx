import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flame, Droplets, Wheat, Zap, Utensils } from "lucide-react";

// 1. DICCIONARIO DE COLORES
const COLOR_MAP = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-400",
    shadow: "shadow-blue-500/50",
    icon: "text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-400",
    shadow: "shadow-emerald-500/50",
    icon: "text-emerald-400",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-400",
    shadow: "shadow-orange-500/50",
    icon: "text-orange-400",
  },
};

// --- SUB-COMPONENTE: Barra de Progreso Animada ---
const MacroBar = ({ label, value, target, unit, color, icon: Icon }) => {
  const [width, setWidth] = useState(0);
  const theme = COLOR_MAP[color] || COLOR_MAP.blue;

  useEffect(() => {
    const timer = setTimeout(() => {
      const percentage = Math.min((value / target) * 100, 100);
      setWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, target]);

  const isGoalMet = value >= target;

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
        <span className="flex items-center gap-1.5">
          <Icon
            className={`w-3 h-3 transition-transform group-hover:scale-110 ${theme.icon}`}
            aria-hidden="true"
          />
          {label}
        </span>
        <span
          className={`transition-colors duration-500 ${isGoalMet ? theme.text : "text-slate-500"}`}
        >
          {value} / {target} {unit}
        </span>
      </div>

      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        {/* CORRECCIÓN S6819: Se mantienen atributos ARIA completos para accesibilidad */}
        <div
          className={`
            h-full rounded-full
            transition-all duration-1000 ease-out 
            ${theme.bg}
            ${isGoalMet ? `shadow-lg ${theme.shadow} brightness-110` : "opacity-80"}
          `}
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={target}
          aria-label={`Progreso de ${label}`}
        />
      </div>
    </div>
  );
};

MacroBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  target: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["blue", "emerald", "orange"]).isRequired,
  icon: PropTypes.elementType.isRequired,
};

// --- SUB-COMPONENTE: Tarjeta de Comida ---
const MealCard = ({ type, item, kcal }) => {
  const getStyle = (mealType) => {
    const t = mealType?.toLowerCase() || "";
    if (t.includes("desayuno")) return "border-l-orange-500 bg-orange-500/5";
    if (t.includes("almuerzo")) return "border-l-blue-500 bg-blue-500/5";
    if (t.includes("cena")) return "border-l-indigo-500 bg-indigo-500/5";
    if (t.includes("snack") || t.includes("suplemento"))
      return "border-l-emerald-500 bg-emerald-500/5";
    return "border-l-slate-500 bg-slate-800";
  };

  return (
    <div
      className={`p-4 rounded-xl border border-slate-700/50 border-l-4 hover:border-slate-500 transition-all shadow-sm ${getStyle(type)}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-black uppercase tracking-wider opacity-70 bg-black/20 px-2 py-0.5 rounded">
          {type}
        </span>
        <div className="text-white font-mono font-bold text-lg leading-none">
          {kcal}
          <span className="text-[10px] font-sans text-slate-400 font-normal ml-1">
            kcal
          </span>
        </div>
      </div>
      <h4 className="text-slate-200 font-medium text-sm leading-snug">
        {item}
      </h4>
    </div>
  );
};

MealCard.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired,
  kcal: PropTypes.number.isRequired,
};

// --- COMPONENTE PRINCIPAL ---
const NutritionView = ({ data, activeDay, onDayChange }) => {
  const dayOrder = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
  };

  const sortedWeek = [...(data || [])].sort(
    (a, b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99),
  );

  const daysArray = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const activeDayName = daysArray[activeDay];

  const currentDay = sortedWeek.find((d) => d.day === activeDayName) || {
    day: activeDayName || "Selecciona día",
    totalKcal: 0,
    meals: [],
  };

  const TARGETS = { kcal: 2600, protein: 185, carbs: 300, fats: 70 };

  const estimatedProtein = currentDay.totalKcal
    ? Math.round((currentDay.totalKcal * 0.3) / 4)
    : 0;
  const estimatedCarbs = currentDay.totalKcal
    ? Math.round((currentDay.totalKcal * 0.45) / 4)
    : 0;
  const estimatedFats = currentDay.totalKcal
    ? Math.round((currentDay.totalKcal * 0.25) / 9)
    : 0;

  // Etiquetas cortas para la gráfica
  const shortDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="space-y-6">
      {/* Gráfica Semanal */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm shadow-xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Balance Semanal
          </h2>
          <div className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700">
            Meta: {TARGETS.kcal} kcal
          </div>
        </div>

        <div className="w-full h-32 flex items-end justify-between gap-2">
          {shortDays.map((label, idx) => {
            const fullDayName = daysArray[idx];
            const dayData = sortedWeek.find((d) => d.day === fullDayName);
            const kcal = dayData ? dayData.totalKcal : 0;
            const heightPercent = Math.min((kcal / 3500) * 100, 100);
            const isActive = activeDay === idx;

            return (
              <button
                // CORRECCIÓN S6479: Usamos 'label' como key porque es única (Lun, Mar...)
                key={label}
                onClick={() => onDayChange(idx)}
                className="flex-1 flex flex-col items-center group h-full justify-end relative focus:outline-none"
              >
                <div
                  // CORRECCIÓN TAILWIND: max-w-[40px] -> max-w-10
                  className={`
                      w-full max-w-10 rounded-t-md transition-all duration-500 relative
                      ${isActive ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-slate-700 hover:bg-slate-600"}
                    `}
                  style={{ height: `${heightPercent || 5}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] py-1 px-2 rounded border border-slate-700 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {kcal} kcal
                  </div>
                </div>
                <span
                  className={`mt-2 text-[10px] font-bold uppercase ${isActive ? "text-blue-400" : "text-slate-500"}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle del Día */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-700 bg-slate-800/80">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {currentDay.day}
              </h3>
              <p className="text-blue-300 text-sm mt-1 font-medium">
                {currentDay.summary || "Sin registro detallado"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white tracking-tighter">
                {currentDay.totalKcal}
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">
                Kcal Totales
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
            <MacroBar
              label="Proteína"
              value={estimatedProtein}
              target={TARGETS.protein}
              unit="g"
              color="blue"
              icon={Zap}
            />
            <MacroBar
              label="Carbos"
              value={estimatedCarbs}
              target={TARGETS.carbs}
              unit="g"
              color="emerald"
              icon={Wheat}
            />
            <MacroBar
              label="Grasas"
              value={estimatedFats}
              target={TARGETS.fats}
              unit="g"
              color="orange"
              icon={Droplets}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-900/30">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Utensils className="w-3 h-3" /> Registro Diario
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentDay.meals && currentDay.meals.length > 0 ? (
              currentDay.meals.map((meal, i) => (
                <MealCard
                  // CORRECCIÓN S6479: Key compuesta más robusta
                  key={`${meal.type}-${meal.item}-${i}`}
                  type={meal.type}
                  item={meal.item}
                  kcal={meal.kcal}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                <Utensils className="w-8 h-8 mb-2 opacity-20 mx-auto" />
                <span>No hay comidas registradas</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

NutritionView.propTypes = {
  data: PropTypes.array,
  activeDay: PropTypes.number.isRequired,
  onDayChange: PropTypes.func.isRequired,
};

export default NutritionView;
