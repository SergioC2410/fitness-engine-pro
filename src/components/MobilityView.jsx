import React from "react";
import PropTypes from "prop-types";
import {
  MapPin,
  Navigation,
  Clock,
  Footprints,
  Map as MapIcon,
} from "lucide-react";

// --- SUB-COMPONENTE: Tarjeta de Movilidad (Timeline Item) ---
const MobilityCard = ({ day, date, activity, distance, duration, notes }) => {
  return (
    <div className="relative pl-8 pb-8 last:pb-0 group">
      {/* 1. La Línea de Tiempo (Vertical) */}
      <div
        className="absolute top-0 left-2.75 h-full w-0.5 bg-slate-800 group-last:bg-transparent"
        aria-hidden="true"
      />

      {/* 2. El "Nodo" o Punto en el mapa */}
      <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
      </div>

      {/* 3. La Tarjeta de Contenido */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-4 transition-all hover:border-orange-500/30 hover:bg-slate-800/80">
        {/* Cabecera: Día y Actividad */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded">
                {day}
              </span>
              <span className="text-xs text-slate-500 font-mono">{date}</span>
            </div>
            <h4 className="text-white font-bold text-base mt-1 flex items-center gap-2">
              {activity}
            </h4>
          </div>

          <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Detalles: Distancia y Tiempo */}
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-sm font-bold text-slate-200">{distance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-sm font-bold text-slate-200">{duration}</span>
          </div>
        </div>

        {/* Notas / Ruta */}
        {notes && (
          <div className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex gap-2 items-start">
            <Footprints className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
            <span className="italic leading-relaxed">{notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

MobilityCard.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string,
  activity: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  notes: PropTypes.string,
};

// --- COMPONENTE PRINCIPAL ---
const MobilityView = ({ data }) => {
  // Ordenar cronológicamente (Lunes -> Domingo) si no viene ordenado
  const dayOrder = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
  };
  const sortedData = [...(data || [])].sort(
    (a, b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header de la Sección */}
      <div className="bg-linear-to-r from-orange-900/20 to-slate-900 p-6 rounded-2xl border border-orange-500/20 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-orange-500" /> Registro GPS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Historial de rutas y actividad urbana
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white">
            {sortedData.length}
          </div>
          <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
            Sesiones
          </div>
        </div>
      </div>

      {/* 2. Timeline de Actividades */}
      <div className="bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-800">
        {sortedData.length > 0 ? (
          <div className="mt-2">
            {sortedData.map((item, idx) => (
              <MobilityCard
                key={`${item.day}-${idx}`}
                day={item.day}
                date={item.date}
                activity={item.activity}
                distance={item.distance}
                duration={item.duration}
                notes={item.notes}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 flex flex-col items-center">
            <div className="bg-slate-800 p-4 rounded-full mb-3">
              <Footprints className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-slate-300 font-medium">
              Sin registros esta semana
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-50">
              Tus caminatas y rutas de GPS aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

MobilityView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      date: PropTypes.string,
      activity: PropTypes.string,
      distance: PropTypes.string,
      duration: PropTypes.string,
      notes: PropTypes.string,
    }),
  ),
};

export default MobilityView;
