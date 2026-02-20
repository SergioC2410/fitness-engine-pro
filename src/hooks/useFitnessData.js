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

// 1. EXTRAEMOS LA LECTURA INICIAL PARA QUE SEA SEGURA Y SÍNCRONA
function getInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error init LocalStorage:", error);
    return [];
  }
}

// 2. 🔥 NUEVO ALGORITMO: DETECTOR DE SEMANA ACTUAL
function getWeekIndexForToday(data) {
  if (!data || data.length === 0) return 0;

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const todayStr = `${dd}/${mm}`; // Ej: "19/02"

  // Búsqueda 1: ¿Alguien ya registró comida o caminata con la fecha de hoy?
  const exactIndex = data.findIndex(
    (week) =>
      week.nutritionData?.some((d) => d.date === todayStr) ||
      week.mobilityData?.some((d) => d.date === todayStr),
  );
  if (exactIndex !== -1) return exactIndex;

  // Búsqueda 2: ¿Hoy cae dentro del rango de la etiqueta weekLabel? (Ej: "Semana 16/02 - 22/02")
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  for (let i = 0; i < data.length; i++) {
    const match = data[i].weekLabel.match(
      /(\d{2})\/(\d{2}).*?(\d{2})\/(\d{2})/,
    );
    if (match) {
      const startDay = parseInt(match[1], 10);
      const startMonth = parseInt(match[2], 10) - 1;
      const endDay = parseInt(match[3], 10);
      const endMonth = parseInt(match[4], 10) - 1;

      const startDate = new Date(currentYear, startMonth, startDay);
      let endDate = new Date(currentYear, endMonth, endDay);

      // Ajuste automático por si la semana cruza de Diciembre a Enero
      if (endMonth < startMonth) {
        endDate.setFullYear(currentYear + 1);
        if (today.getMonth() === 0) startDate.setFullYear(currentYear - 1);
      }

      if (today >= startDate && today <= endDate) {
        return i;
      }
    }
  }

  // Búsqueda 3: Si todo lo anterior falla, vamos a la semana más reciente
  return data.length - 1;
}

// --- FUNCIONES DE FUSIÓN DE DATOS ---
function mergeNutrition(oldNutri = [], newNutri = []) {
  const mergedMap = new Map();
  oldNutri.forEach((item) => mergedMap.set(item.day, item));
  newNutri.forEach((item) => {
    const existing = mergedMap.get(item.day) || {};
    mergedMap.set(item.day, { ...existing, ...item });
  });
  return Array.from(mergedMap.values()).sort(
    (a, b) => (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99),
  );
}

function mergeMobility(oldMob = [], newMob = []) {
  const uniqueKeys = new Set();
  const result = [];
  const process = (list) => {
    list.forEach((item) => {
      const key = `${item.day}-${item.activity}-${item.distance}`;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push(item);
      }
    });
  };
  process(newMob);
  process(oldMob);
  return result.sort(
    (a, b) => (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99),
  );
}

function mergeWeek(updatedData, incomingWeek) {
  const index = updatedData.findIndex(
    (w) => w.weekLabel === incomingWeek.weekLabel,
  );
  if (index === -1) {
    updatedData.push(incomingWeek);
  } else {
    const existingWeek = updatedData[index];
    updatedData[index] = {
      ...existingWeek,
      ...incomingWeek,
      nutritionData: mergeNutrition(
        existingWeek.nutritionData,
        incomingWeek.nutritionData,
      ),
      trainingData: {
        ...existingWeek.trainingData,
        ...incomingWeek.trainingData,
      },
      mobilityData: mergeMobility(
        existingWeek.mobilityData,
        incomingWeek.mobilityData,
      ),
    };
  }
}

// --- HOOK PRINCIPAL ---
export function useFitnessData() {
  const [appData, setAppData] = useState(getInitialData);

  // 🔥 SOLUCIÓN DEL BUG: Inicializamos activeWeek calculando la fecha de hoy
  // sobre los datos recién extraídos, asegurando que nunca vuelva al índice 0 por error.
  const [activeWeek, setActiveWeek] = useState(() => {
    const initialData = getInitialData();
    return getWeekIndexForToday(initialData);
  });

  useEffect(() => {
    if (appData.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData]);

  const currentWeek = useMemo(
    () => appData[activeWeek] || null,
    [appData, activeWeek],
  );

  // CÁLCULO DE RACHAS (STREAKS)
  const currentStreak = useMemo(() => {
    if (!appData || appData.length === 0) return 0;

    const allDays = [];
    appData.forEach((week) => {
      for (let i = 0; i < 7; i++) {
        const dayName = [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ][i];

        const hasNutrition = week.nutritionData?.some((d) => d.day === dayName);
        const trainingObj = week.trainingData?.[i.toString()];
        const hasTraining = trainingObj?.hasData === true;
        const hasMobility = week.mobilityData?.some((d) => d.day === dayName);

        const hasActivity = !!(hasNutrition || trainingObj || hasMobility);
        const isRest = !hasTraining && !hasMobility;

        allDays.push({ dayName, hasActivity, isRest });
      }
    });

    let lastActiveIndex = allDays.length - 1;
    while (lastActiveIndex >= 0 && !allDays[lastActiveIndex].hasActivity) {
      lastActiveIndex--;
    }

    if (lastActiveIndex < 0) return 0;

    let streak = 0;
    let consecutiveRest = 0;

    for (let i = lastActiveIndex; i >= 0; i--) {
      const day = allDays[i];

      if (!day.hasActivity) break;

      if (day.isRest) {
        consecutiveRest++;
        if (consecutiveRest > 2) break;
      } else {
        consecutiveRest = 0;
      }

      streak++;
    }

    return streak;
  }, [appData]);

  const handleExport = useCallback(
    (targetWeekLabel = null) => {
      if (appData.length === 0) return;

      let dataToExport = appData;
      let fileName = `fitness_backup_completo_${new Date().toISOString().split("T")[0]}.json`;

      if (targetWeekLabel) {
        dataToExport = appData.filter((w) => w.weekLabel === targetWeekLabel);
        const safeLabel = targetWeekLabel.replace(/[\/\s-]/g, "_");
        fileName = `fitness_${safeLabel}.json`;
      }

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    [appData],
  );

  function processImportedFile(text, setAppData) {
    try {
      const imported = JSON.parse(text);
      const incomingWeeks = Array.isArray(imported)
        ? imported
        : [imported.data || imported];
      if (incomingWeeks.length === 0) throw new Error("JSON vacío");

      setAppData((prevData) => {
        let updatedData = [...prevData];
        incomingWeeks.forEach((incomingWeek) => {
          mergeWeek(updatedData, incomingWeek);
        });

        updatedData.sort((a, b) => a.weekLabel.localeCompare(b.weekLabel));

        // Al importar, calculamos cuál es la semana a mostrar basada en los nuevos datos
        setTimeout(() => setActiveWeek(getWeekIndexForToday(updatedData)), 0);

        return updatedData;
      });

      alert(`✅ Datos fusionados correctamente y ordenados cronológicamente.`);
    } catch (err) {
      console.error("Import Error:", err);
      alert("❌ Error: El archivo no es válido o está corrupto.");
    }
  }

  const handleImport = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = null;
    file.text().then((text) => processImportedFile(text, setAppData));
  }, []);

  return {
    appData,
    activeWeek,
    setActiveWeek,
    currentWeek,
    handleImport,
    handleExport,
    currentStreak,
  };
}
