import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "sergio_fitness_data";
const DAY_ORDER = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
  Domingo: 7,
};

/**
 * Función auxiliar para fusionar arrays de Nutrición sin perder datos.
 * Si el día existe en el nuevo, lo actualiza. Si no, mantiene el viejo.
 */
function mergeNutrition(oldNutri = [], newNutri = []) {
  const mergedMap = new Map();

  // 1. Ponemos los datos viejos en el mapa primero
  oldNutri.forEach((item) => mergedMap.set(item.day, item));

  // 2. Sobrescribimos o añadimos los datos nuevos
  newNutri.forEach((item) => {
    // Si ya existe el día, fusionamos las propiedades (ej. mantiene notas viejas si no hay nuevas)
    const existing = mergedMap.get(item.day) || {};
    mergedMap.set(item.day, { ...existing, ...item });
  });

  // 3. Convertimos a array y ordenamos
  return Array.from(mergedMap.values()).sort(
    (a, b) => (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99),
  );
}

/**
 * Función auxiliar para fusionar Movilidad (evitando duplicados exactos)
 */
function mergeMobility(oldMob = [], newMob = []) {
  // Usamos un Set para identificar entradas únicas basadas en Día + Actividad
  const uniqueKeys = new Set();
  const result = [];

  // Función interna para procesar items
  const process = (list) => {
    list.forEach((item) => {
      const key = `${item.day}-${item.activity}-${item.distance}`; // Clave única
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push(item);
      }
    });
  };

  // Procesamos nuevos primero (prioridad) y luego viejos
  process(newMob);
  process(oldMob);

  return result.sort(
    (a, b) => (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99),
  );
}

// Helper function to merge a single week (moved out to reduce nesting)
function mergeWeek(updatedData, incomingWeek) {
  // Buscamos si ya tenemos esta semana (por etiqueta)
  const index = updatedData.findIndex(
    (w) => w.weekLabel === incomingWeek.weekLabel,
  );

  if (index === -1) {
    // ESCENARIO 1: Semana Nueva -> La agregamos tal cual
    updatedData.push(incomingWeek);
  } else {
    // ESCENARIO 2: Semana Existente -> FUSIÓN INTELIGENTE
    const existingWeek = updatedData[index];

    updatedData[index] = {
      ...existingWeek, // Mantener propiedades base viejas
      ...incomingWeek, // Sobrescribir propiedades base nuevas (ej. metadata)

      // Fusión específica por módulos
      nutritionData: mergeNutrition(
        existingWeek.nutritionData,
        incomingWeek.nutritionData,
      ),

      // Training: Fusionamos objetos (las claves nuevas sobrescriben las viejas)
      trainingData: {
        ...existingWeek.trainingData,
        ...incomingWeek.trainingData,
      },

      // Mobility: Fusionamos arrays evitando duplicados
      mobilityData: mergeMobility(
        existingWeek.mobilityData,
        incomingWeek.mobilityData,
      ),
    };
  }
}

export function useFitnessData() {
  const [appData, setAppData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error init LocalStorage:", error);
      return [];
    }
  });

  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    if (appData.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData]);

  const currentWeek = useMemo(
    () => appData[activeWeek] || null,
    [appData, activeWeek],
  );

  const handleExport = useCallback(() => {
    if (appData.length === 0) return;
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fitness_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [appData]);

  // Helper function to process imported file text and update state
  function processImportedFile(text, setAppData) {
    try {
      const imported = JSON.parse(text);
      // Normalizar: siempre trabajar con array de semanas
      const incomingWeeks = Array.isArray(imported)
        ? imported
        : [imported.data || imported];

      if (incomingWeeks.length === 0) throw new Error("JSON vacío");

      setAppData((prevData) => {
        let updatedData = [...prevData];

        incomingWeeks.forEach((incomingWeek) => {
          mergeWeek(updatedData, incomingWeek);
        });

        return updatedData;
      });

      alert(
        `✅ Datos fusionados correctamente. Se actualizaron ${incomingWeeks.length} semana(s).`,
      );
    } catch (err) {
      console.error("Import Error:", err);
      alert("❌ Error: El archivo no es válido o está corrupto.");
    }
  }

  // --- LÓGICA DE IMPORTACIÓN MEJORADA ---
  const handleImport = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resetear el input para permitir importar el mismo archivo dos veces si es necesario
    e.target.value = null;

    file.text().then((text) => {
      processImportedFile(text, setAppData);
    });
  }, []);

  return {
    appData,
    activeWeek,
    setActiveWeek,
    currentWeek,
    handleImport,
    handleExport,
  };
}
