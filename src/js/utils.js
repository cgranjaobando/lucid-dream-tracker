/**
 * Utility functions for the Lucid Dreams App
 */

// Global dictionaries for dream activities data

// Activity summaries - shown by default in the day popup
const activities = {
  "Diario": "Al despertar, anota los detalles de tus sueños. Ayuda a mejorar la memoria onírica.",
  "RealityCheck": "Haz 5 verificaciones de realidad durante el día (manos, nariz, textos).",
  "Afirmación": "Antes de dormir, repite: \"Esta noche me daré cuenta de que estoy soñando.\"",
  "Marcadores": "Identifica en tu diario elementos recurrentes que te avisen de que estás soñando.",
  "MILD": "Usa tu memoria prospectiva para darte cuenta de que estás soñando (repetición mental).",
  "WBTB": "Despierta tras 4-6 horas, permanece 10–30 min y vuelve a dormir con intención lúcida.",
  "Ancla": "Configura una alarma suave tras 5h de sueño para generar microdespertar y lucidez.",
  "Girar": "Gira sobre ti mismo dentro del sueño para estabilizar la lucidez.",
  "Táctil": "Toca objetos o tus manos para reforzar la conciencia dentro del sueño.",
  "DiarioLúcido": "Lleva un cuaderno aparte para registrar solo los sueños lúcidos.",
  "Escenarios": "Visualiza un lugar deseado antes de dormir para explorarlo lúcido.",
  "Instrucción": "En el sueño, da órdenes suaves a tu subconsciente para cambiar la experiencia.",
  "WILD": "Mantente consciente mientras tu cuerpo se duerme, observando imágenes hipnagógicas."
};

// Practical instructions - shown when clicking "Ver más"
const activityInstructions = {
  "Diario": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Ten libreta o app junto a la cama.<br>
    2. Al despertar, anota enseguida todo lo que recuerdes (imágenes, emociones).<br>
    3. Revisa tu diario periódicamente para detectar patrones.
  `,
  "RealityCheck": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Mira tus manos y pregúntate: "¿Estoy soñando?"<br>
    2. Tapa tu nariz y trata de respirar.<br>
    3. Observa un texto, aparta la vista y vuelve a mirar (¿cambia?).<br>
    4. Realízalo con duda real, varias veces al día.
  `,
  "Afirmación": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Antes de dormir, siéntate o recuéstate cómodamente.<br>
    2. Cierra los ojos y repite tu frase de afirmación por 2-5 minutos.<br>
    3. Visualiza cómo te das cuenta de que estás soñando.
  `,
  "Marcadores": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Revisa tu diario y anota elementos recurrentes.<br>
    2. Recuérdalos antes de dormir para que activen un Reality Check.
  `,
  "MILD": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Despiértate tras 4-6 horas de sueño.<br>
    2. Al volver a la cama, repite: "La próxima vez que sueñe, sabré que estoy soñando."<br>
    3. Visualiza un sueño reciente y cómo te vuelves consciente.
  `,
  "WBTB": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Duerme 4-6 horas y despierta (usa alarma suave).<br>
    2. Permanece despierto 10-30 min leyendo sobre sueños lúcidos o tu diario.<br>
    3. Regresa a dormir aplicando MILD u otra técnica.
  `,
  "Ancla": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Configura una alarma o vibración suave tras 5h de sueño.<br>
    2. Asegúrate de que no te despierte completamente.<br>
    3. Usa el microdespertar para recordar tu intención.
  `,
  "Girar": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Cuando te des cuenta de que estás soñando, gira sobre ti mismo.<br>
    2. Mantén la intención de estabilizar el sueño.
  `,
  "Táctil": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Dentro del sueño, toca objetos o tus manos.<br>
    2. Concéntrate en las sensaciones para reforzar la realidad.
  `,
  "DiarioLúcido": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Usa un cuaderno separado del diario normal.<br>
    2. Registra solo los sueños en los que fuiste consciente.
  `,
  "Escenarios": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Antes de dormir, visualiza un lugar deseado (playa, bosque, etc.).<br>
    2. Incluye detalles sensoriales: sonidos, olores, temperaturas.
  `,
  "Instrucción": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Dentro del sueño, mantén la calma.<br>
    2. Da órdenes suaves a tu subconsciente (por ejemplo, "hazme volar").<br>
    3. Confía en la respuesta del sueño.
  `,
  "WILD": `
    <strong>Instrucciones prácticas:</strong><br>
    1. Si te despiertas en la madrugada, mantén los ojos cerrados y no te muevas.<br>
    2. Observa las imágenes o sonidos hipnagógicos sin reaccionar.<br>
    3. Permite que tu cuerpo se duerma mientras tu mente permanece alerta.
  `
};

// Extended descriptions - shown in the secondary popup
const activityDetailsExtended = {
  "MILD": `
    <strong>MILD (Mnemonic Induction of Lucid Dreams)</strong><br>
    Técnica basada en la memoria prospectiva: "recordar algo en el futuro".<br><br>
    <em>En qué consiste:</em><br>
    - Te despiertas tras 4-6 horas de sueño y, antes de volver a dormir, repites tu intención de darte cuenta de que estás soñando.<br>
    - Visualizas un sueño reciente, imaginando el momento en que te vuelves lúcido.<br><br>
    <em>Por qué funciona:</em><br>
    - Al activar tu lóbulo prefrontal y la memoria prospectiva, aumentas la probabilidad de reconocer el estado de sueño.
  `,
  "RealityCheck": `
    <strong>Reality Checks (Verificaciones de realidad)</strong><br>
    Es un entrenamiento para cuestionar la realidad tanto en vigilia como en sueños.<br><br>
    <em>Principio:</em><br>
    - Revisar constantemente tu entorno (manos, textos, respiración) te ayuda a dudar de la realidad y a aplicar esa duda en el sueño.<br><br>
    <em>Beneficio:</em><br>
    - Con la práctica, los Reality Checks se vuelven automáticos y pueden desencadenar la lucidez.
  `,
  "Diario": `
    <strong>Diario de sueños</strong><br>
    Anotar tus sueños de forma sistemática mejora la memoria onírica y te permite identificar patrones recurrentes.<br><br>
    <em>Ventajas:</em><br>
    - Incrementa la capacidad de recordar detalles.<br>
    - Ayuda a identificar "marcadores" que pueden activar la lucidez.
  `,
  "WBTB": `
    <strong>WBTB (Wake Back To Bed)</strong><br>
    Técnica que consiste en interrumpir el sueño en una fase REM tardía y volver a dormir con una intención lúcida.<br><br>
    <em>Cómo ayuda:</em><br>
    - Al despertar en un ciclo REM, tu mente se mantiene más alerta y es más propensa a reconocer el estado onírico.
  `,
  "Afirmación": `
    <strong>Afirmaciones nocturnas</strong><br>
    Utiliza frases positivas antes de dormir para "programar" tu mente y aumentar la probabilidad de lucidez.<br><br>
    <em>Cómo funcionan:</em><br>
    - Repetir afirmaciones en estado de relajación ayuda a crear un ancla mental para reconocer el sueño.
  `,
  "Marcadores": `
    <strong>Marcadores oníricos</strong><br>
    Son elementos recurrentes en tus sueños que pueden servir como disparadores para darte cuenta de que estás soñando.<br><br>
    <em>Por qué son útiles:</em><br>
    - Al detectarlos conscientemente, aumentas las posibilidades de activar un Reality Check.
  `,
  "Ancla": `
    <strong>Ancla fisiológica</strong><br>
    Consiste en utilizar un microdespertar (con alarma o vibración suave) para recordar tu intención de lucidez.<br><br>
    <em>Detalles:</em><br>
    - Debe ser lo suficientemente suave para no romper el sueño, pero efectivo para activar tu mente.
  `,
  "Girar": `
    <strong>Técnica de giro</strong><br>
    Gira sobre tu eje dentro del sueño para estabilizar la experiencia onírica.<br><br>
    <em>Razón:</em><br>
    - El movimiento estimula la conexión sensorial, anclando tu conciencia en el sueño.
  `,
  "Táctil": `
    <strong>Estímulo táctil</strong><br>
    Tocar objetos o tus manos en el sueño intensifica la sensación de realidad y ayuda a mantener la lucidez.<br><br>
    <em>Uso:</em><br>
    - Focaliza en las sensaciones táctiles para prolongar el sueño lúcido.
  `,
  "DiarioLúcido": `
    <strong>Diario de sueños lúcidos</strong><br>
    Separa y registra exclusivamente los sueños en los que fuiste consciente para mejorar tu práctica y análisis.<br><br>
    <em>Beneficio:</em><br>
    - Permite identificar patrones y técnicas que potencian la lucidez.
  `,
  "Escenarios": `
    <strong>Escenarios prediseñados</strong><br>
    La visualización previa de un entorno deseado prepara el contenido onírico y facilita la exploración lúcida.<br><br>
    <em>Ejemplo:</em><br>
    - Imagina una playa, un bosque o una ciudad, incluyendo detalles sensoriales para lograr una experiencia inmersiva.
  `,
  "Instrucción": `
    <strong>Instrucción al sueño</strong><br>
    Dentro del sueño, emite órdenes suaves a tu subconsciente para modificar o enriquecer la experiencia onírica.<br><br>
    <em>Consejo:</em><br>
    - Usa un tono seguro y tranquilo para pedir, por ejemplo, "Muéstrame una puerta secreta".
  `,
  "WILD": `
    <strong>WILD (Wake Initiated Lucid Dream)</strong><br>
    Técnica avanzada para entrar directamente en un sueño lúcido desde la vigilia, manteniendo la conciencia.<br><br>
    <em>Proceso:</em><br>
    - Permanece inmóvil y observa las imágenes hipnagógicas mientras tu cuerpo se duerme.
  `
};

// 30-day plan divided into 4 phases
const plan = [
  // Phase 1 (Days 1–7)
  ["Diario", "RealityCheck"],
  ["Diario", "RealityCheck"],
  ["Diario", "RealityCheck", "Afirmación"],
  ["Diario", "RealityCheck", "Afirmación"],
  ["Diario", "RealityCheck", "Afirmación", "Marcadores"],
  ["Diario", "RealityCheck", "Afirmación", "Marcadores"],
  ["Diario", "RealityCheck", "Afirmación", "Marcadores"],
  // Phase 2 (Days 8–14)
  ["Diario", "MILD", "WBTB"],
  ["Diario", "MILD"],
  ["Diario", "MILD", "Ancla"],
  ["Diario", "MILD", "WBTB", "Ancla"],
  ["Diario", "MILD", "Ancla"],
  ["Diario", "MILD", "Ancla"],
  ["Diario", "MILD", "WBTB", "Ancla"],
  // Phase 3 (Days 15–21)
  ["Diario", "Girar", "Táctil"],
  ["Diario", "Girar", "Táctil"],
  ["Diario", "Girar", "Táctil"],
  ["Diario", "Girar", "Táctil"],
  ["Diario", "Girar", "Táctil"],
  ["Diario", "Girar", "Táctil"],
  ["DiarioLúcido", "Girar", "Táctil"],
  // Phase 4 (Days 22–30)
  ["Diario", "Escenarios", "Instrucción"],
  ["Diario", "Escenarios", "Instrucción"],
  ["Diario", "WILD", "Escenarios", "Instrucción"],
  ["Diario", "Escenarios", "Instrucción"],
  ["Diario", "Escenarios", "Instrucción"],
  ["Diario", "WILD", "Escenarios", "Instrucción"],
  ["Diario", "Escenarios", "Instrucción"],
  ["Diario", "WILD", "Escenarios", "Instrucción"],
  ["Diario", "Escenarios", "Instrucción"]
];

// Variable to track the selected day
window.selectedDayCard = null;

// Toggle the visibility of instruction details within the popup
function toggleInstructionDetail(key, index) {
  const detailDiv = document.getElementById(`instructionDetail_${key}_${index}`);
  if (detailDiv.style.display === "none") {
    detailDiv.style.display = "block";
    detailDiv.innerHTML = activityInstructions[key] || "<em>Instrucciones no disponibles.</em>";
  } else {
    detailDiv.style.display = "none";
  }
}

// Show the secondary popup with extended description
function openActivityPopup(key) {
  const popup = document.getElementById("activityPopup");
  const popupTitle = document.getElementById("activityPopupTitle");
  const popupContent = document.getElementById("activityPopupContent");

  popupTitle.innerHTML = key;
  popupContent.innerHTML = activityDetailsExtended[key] || "<em>Descripción no disponible.</em>";
  popup.classList.add("active");
}

// Close the secondary popup
function closeActivityPopup() {
  document.getElementById("activityPopup").classList.remove("active");
}

// Close the main day popup
function closePopup() {
  document.getElementById("popup").classList.remove("active");
}

// Update progress for a specific day
function updateTaskProgress() {
  const checkboxes = document.querySelectorAll(".task-checkbox");
  if (checkboxes.length === 0) return;
  
  const totalTasks = checkboxes.length;
  const completedTasks = Array.from(checkboxes).filter(cb => cb.checked).length;
  const percent = (completedTasks / totalTasks) * 100;
  
  const taskProgressFill = document.getElementById("taskProgressFill");
  if (taskProgressFill) {
    taskProgressFill.style.width = `${percent}%`;
  }
  
  // Save state if a day is selected
  if (window.selectedDayCard) {
    const day = window.selectedDayCard.dataset.day;
    const checkboxStates = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem(`day-${day}-tasks`, JSON.stringify(checkboxStates));
    
    // Find and mark all day representations as completed or not
    const daySelector = `.day[data-day="${day}"]`;
    const carouselCardSelector = `.carousel-card[data-day="${day}"]`;
    const smallCardSelector = `.small-card[data-day="${day}"]`;
    
    document.querySelectorAll(`${daySelector}, ${carouselCardSelector}, ${smallCardSelector}`).forEach(element => {
      if (completedTasks === totalTasks) {
        element.classList.add("completed");
      } else {
        element.classList.remove("completed");
      }
    });
  }
  
  // Update overall progress bar
  updateOverallProgress();
}

// Update the overall progress bar
function updateOverallProgress() {
  const totalDays = plan.length;
  let completedDays = 0;
  
  // Count completed days based on localStorage data
  for (let i = 1; i <= totalDays; i++) {
    const savedStates = JSON.parse(localStorage.getItem(`day-${i}-tasks`)) || [];
    if (savedStates.length > 0 && savedStates.every(state => state === true)) {
      completedDays++;
    }
  }
  
  // Calculate percentage
  const percent = (completedDays / totalDays) * 100;
  
  const progressFill = document.getElementById("progressFill");
  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }
}

// Expose functions to global scope for HTML event handlers
window.toggleInstructionDetail = toggleInstructionDetail;
window.openActivityPopup = openActivityPopup;
window.closeActivityPopup = closeActivityPopup;
window.closePopup = closePopup;
window.updateTaskProgress = updateTaskProgress;
window.updateOverallProgress = updateOverallProgress;