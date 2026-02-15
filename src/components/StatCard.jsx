import React from "react";
import PropTypes from "prop-types";
import { Info } from "lucide-react";

/**
 * Sub-componente para el estado de carga (Skeleton).
 * Extraerlo reduce la Complejidad Cognitiva del componente principal.
 */
const StatCardSkeleton = () => (
  <div
    className="bg-slate-800 p-5 rounded-2xl border border-slate-700 animate-pulse"
    aria-label="Cargando estadísticas"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-slate-700 rounded-lg" />
      <div className="w-4 h-4 bg-slate-700 rounded-full" />
    </div>
    <div className="h-8 bg-slate-700 rounded-md w-3/4 mb-2" />
    <div className="h-4 bg-slate-700 rounded-md w-1/2" />
    <span className="sr-only">Cargando...</span>
  </div>
);

/**
 * StatCard: Visualización profesional de KPIs con validación estricta.
 */
const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  color,
  isLoading,
  tooltip,
}) => {
  // 1. Guard Clause: Si está cargando, retornamos el Skeleton inmediatamente.
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  // 2. Construcción segura de clases para evitar inyecciones o errores de linting
  // Nota: Tailwind necesita nombres de clases completos para purgarlos correctamente,
  // pero esta interpolación funciona si los colores están safelisted o usados en otro lado.
  const bgClass = `bg-${color}-500/10`;
  const textClass = `text-${color}-400`;
  const hoverBgClass = `group-hover:bg-${color}-500/20`;

  return (
    <div className="relative bg-slate-800 p-5 rounded-2xl border border-slate-700 transition-all duration-300 ease-out hover:border-slate-500 hover:shadow-xl hover:-translate-y-1 group cursor-default">
      {/* Tooltip con renderizado condicional limpio */}
      {tooltip && (
        <div className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-help peer">
          <Info className="w-4 h-4" aria-hidden="true" />
          <div
            role="tooltip"
            className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-slate-200 text-[10px] font-medium rounded-lg border border-slate-700 shadow-2xl opacity-0 pointer-events-none transition-opacity duration-200 peer-hover:opacity-100 group-hover:peer-hover:opacity-100 z-50"
          >
            {tooltip}
            <div className="absolute top-full right-1.5 border-8 border-transparent border-t-slate-900" />
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2.5 rounded-xl transition-colors duration-300 ${bgClass} ${textClass} ${hoverBgClass}`}
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
          {value}
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          {title}
        </div>
      </div>

      {subtext && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <p className="text-[10px] font-medium text-slate-500 italic leading-relaxed">
            {subtext}
          </p>
        </div>
      )}
    </div>
  );
};

// 3. Validación de Props para SonarQube (Regla: react/prop-types)
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subtext: PropTypes.string,
  // Valida que 'icon' sea un componente de React (como los de Lucide)
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
  tooltip: PropTypes.string,
};

// 4. Valores por defecto explícitos
StatCard.defaultProps = {
  value: 0,
  subtext: null,
  color: "blue",
  isLoading: false,
  tooltip: "",
};

export default StatCard;
