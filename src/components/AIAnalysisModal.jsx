import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Sparkles, Copy, Check, Bot } from "lucide-react";

/**
 * AIAnalysisModal: Puente de Inteligencia Artificial.
 * Genera un prompt estructurado basado en los datos de la semana para ser analizado externamente.
 */
const AIAnalysisModal = ({ isOpen, onClose, data }) => {
  const [isCopied, setIsCopied] = useState(false);

  // 1. Efecto para cerrar con la tecla ESC (Accesibilidad)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Si no está abierto o no hay datos, no renderizar nada
  if (!isOpen) return null;

  // 2. Ingeniería del Prompt (El "Cerebro" del componente)
  const generatePrompt = () => {
    if (!data) return "No hay datos disponibles para esta semana.";

    const { nutritionData, trainingData, mobilityData } = data;

    // Convertimos los datos a un formato legible por humanos/IA
    const nutritionSummary =
      nutritionData
        ?.map(
          (d) =>
            `- ${d.day}: ${d.totalKcal} kcal (${d.summary || "Sin notas"})`,
        )
        .join("\n") || "Sin registros";

    // Extraemos solo los ejercicios clave y PRs
    const trainingSummary =
      Object.values(trainingData || {})
        .map(
          (session) =>
            `- ${session.title}: ${session.volume} vol, ${session.focus}. Notas: ${session.notes}`,
        )
        .join("\n") || "Sin registros";

    return `
ACTÚA COMO UN ENTRENADOR DE ÉLITE EXPERTO EN BIOMECÁNICA Y NUTRICIÓN DEPORTIVA.

CONTEXTO DEL ATLETA:
- Nombre: Sergio
- Meta Actual: Recomposición Corporal (Bajar de 86kg a 75kg manteniendo fuerza).
- Enfoque: Hipertrofia + Rendimiento en Baloncesto.

DATOS DE LA SEMANA (${data.weekLabel}):

[NUTRICIÓN]
${nutritionSummary}

[ENTRENAMIENTO]
${trainingSummary}

[MOVILIDAD/GPS]
${mobilityData?.map((m) => `- ${m.day}: ${m.activity} (${m.distance})`).join("\n") || "Sin registros"}

INSTRUCCIONES PARA TU RESPUESTA:
1. Analiza si el balance calórico del sábado fue adecuado para el partido del domingo.
2. Evalúa la progresión de cargas en el día de Torso/Pierna.
3. Identifica 1 victoria clave y 1 punto de mejora urgente.
4. Dame una frase motivadora corta basada en el desempeño.

RESPONDE EN FORMATO CORTO Y DIRECTO.
    `.trim();
  };

  const promptText = generatePrompt();

  // 3. Manejador de Copia con Feedback
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Resetear después de 2s
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };
  return (
    // Overlay con Backdrop Blur (Fondo oscuro)
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Contenedor del Modal (CAMBIADO DE <dialog> A <div> para corregir centrado) */}
      <dialog
        open
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 relative"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 id="modal-title" className="text-lg font-bold text-white">
                AI Coach Bridge
              </h3>
              <p className="text-xs text-slate-400">
                Generador de Contexto Inteligente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-xl flex gap-3">
            <Bot className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
            <p className="text-sm text-blue-200">
              He preparado un análisis detallado de tu semana. Copia el
              siguiente mensaje y pégalo en{" "}
              <strong>ChatGPT, Gemini o Claude</strong> para obtener tu feedback
              profesional.
            </p>
          </div>

          <div className="relative group">
            <textarea
              readOnly
              value={promptText}
              className="w-full h-64 bg-slate-950 text-slate-300 p-4 rounded-xl border border-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                Solo lectura
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCopy}
            disabled={isCopied}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95
              ${
                isCopied
                  ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25"
              }
            `}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" /> ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar Prompt
              </>
            )}
          </button>
        </div>
      </dialog>
    </div>
  );
};

AIAnalysisModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default AIAnalysisModal;
