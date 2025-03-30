// Diccionario con el RESUMEN de cada actividad (mostrado por defecto en el popup del día)
const activities = {
    "Diario": "Al despertar, anota los detalles de tus sueños. Ayuda a mejorar la memoria onírica.",
    "RealityCheck": "Haz 5 verificaciones de realidad durante el día (manos, nariz, textos).",
    "Afirmación": "Antes de dormir, repite: “Esta noche me daré cuenta de que estoy soñando.”",
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
  
  // Diccionario con las INSTRUCCIONES PRÁCTICAS (se muestran al pulsar "Ver más")
  const activityInstructions = {
    "Diario": `
      <strong>Instrucciones prácticas:</strong><br>
      1. Ten libreta o app junto a la cama.<br>
      2. Al despertar, anota enseguida todo lo que recuerdes (imágenes, emociones).<br>
      3. Revisa tu diario periódicamente para detectar patrones.
    `,
    "RealityCheck": `
      <strong>Instrucciones prácticas:</strong><br>
      1. Mira tus manos y pregúntate: “¿Estoy soñando?”<br>
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
      2. Al volver a la cama, repite: “La próxima vez que sueñe, sabré que estoy soñando.”<br>
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
      2. Da órdenes suaves a tu subconsciente (por ejemplo, “hazme volar”).<br>
      3. Confía en la respuesta del sueño.
    `,
    "WILD": `
      <strong>Instrucciones prácticas:</strong><br>
      1. Si te despiertas en la madrugada, mantén los ojos cerrados y no te muevas.<br>
      2. Observa las imágenes o sonidos hipnagógicos sin reaccionar.<br>
      3. Permite que tu cuerpo se duerma mientras tu mente permanece alerta.
    `
  };
  
  // Diccionario con la DESCRIPCIÓN EXTENDIDA para el popup secundario
  const activityDetailsExtended = {
    "MILD": `
      <strong>MILD (Mnemonic Induction of Lucid Dreams)</strong><br>
      Técnica basada en la memoria prospectiva: “recordar algo en el futuro”.<br><br>
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
      - Ayuda a identificar “marcadores” que pueden activar la lucidez.
    `,
    "WBTB": `
      <strong>WBTB (Wake Back To Bed)</strong><br>
      Técnica que consiste en interrumpir el sueño en una fase REM tardía y volver a dormir con una intención lúcida.<br><br>
      <em>Cómo ayuda:</em><br>
      - Al despertar en un ciclo REM, tu mente se mantiene más alerta y es más propensa a reconocer el estado onírico.
    `,
    "Afirmación": `
      <strong>Afirmaciones nocturnas</strong><br>
      Utiliza frases positivas antes de dormir para “programar” tu mente y aumentar la probabilidad de lucidez.<br><br>
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
      - Usa un tono seguro y tranquilo para pedir, por ejemplo, “Muéstrame una puerta secreta”.
    `,
    "WILD": `
      <strong>WILD (Wake Initiated Lucid Dream)</strong><br>
      Técnica avanzada para entrar directamente en un sueño lúcido desde la vigilia, manteniendo la conciencia.<br><br>
      <em>Proceso:</em><br>
      - Permanece inmóvil y observa las imágenes hipnagógicas mientras tu cuerpo se duerme.
    `
  };
  
  // Plan de 30 días (dividido en 4 fases)
  const plan = [
    // Fase 1 (Días 1–7)
    ["Diario", "RealityCheck"],
    ["Diario", "RealityCheck"],
    ["Diario", "RealityCheck", "Afirmación"],
    ["Diario", "RealityCheck", "Afirmación"],
    ["Diario", "RealityCheck", "Afirmación", "Marcadores"],
    ["Diario", "RealityCheck", "Afirmación", "Marcadores"],
    ["Diario", "RealityCheck", "Afirmación", "Marcadores"],
    // Fase 2 (Días 8–14)
    ["Diario", "MILD", "WBTB"],
    ["Diario", "MILD"],
    ["Diario", "MILD", "Ancla"],
    ["Diario", "MILD", "WBTB", "Ancla"],
    ["Diario", "MILD", "Ancla"],
    ["Diario", "MILD", "Ancla"],
    ["Diario", "MILD", "WBTB", "Ancla"],
    // Fase 3 (Días 15–21)
    ["Diario", "Girar", "Táctil"],
    ["Diario", "Girar", "Táctil"],
    ["Diario", "Girar", "Táctil"],
    ["Diario", "Girar", "Táctil"],
    ["Diario", "Girar", "Táctil"],
    ["Diario", "Girar", "Táctil"],
    ["DiarioLúcido", "Girar", "Táctil"],
    // Fase 4 (Días 22–30)
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
  
  // Mostrar popup del día
  function showPopup(dayBox) {
    selectedDayBox = dayBox;
    const popup = document.getElementById("popup");
    const title = document.getElementById("popupTitle");
    const desc = document.getElementById("popupDesc");
    const activityKeys = JSON.parse(dayBox.dataset.activities);
  
    title.innerHTML = `Día ${dayBox.dataset.day}`;
    desc.innerHTML = activityKeys
      .map(
        (key, index) => `
        <div style="margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center;">
            <input type="checkbox" class="task-checkbox" data-task="${key}" onchange="updateTaskProgress()">
            <strong class="activity-name" onclick="openActivityPopup('${key}')">${key}</strong>
          </div>
          <small>${activities[key]}</small>
          <span class="instruction-toggle" onclick="toggleInstructionDetail('${key}', ${index})">Ver más</span>
          <div id="instructionDetail_${key}_${index}" class="instruction-detail" style="display: none;"></div>
        </div>
      `
      )
      .join("");
  
    updateTaskProgress(); // Inicializar barra de progreso de tareas
    popup.classList.add("active");
  }
  
  // Alternar la visualización de las instrucciones prácticas en el popup del día
  function toggleInstructionDetail(key, index) {
    const detailDiv = document.getElementById(`instructionDetail_${key}_${index}`);
    if (detailDiv.style.display === "none") {
      detailDiv.style.display = "block";
      detailDiv.innerHTML = activityInstructions[key] || "<em>Instrucciones no disponibles.</em>";
    } else {
      detailDiv.style.display = "none";
    }
  }
  
  // Abrir popup secundario con la descripción extendida
  function openActivityPopup(key) {
    const popup = document.getElementById("activityPopup");
    const popupTitle = document.getElementById("activityPopupTitle");
    const popupContent = document.getElementById("activityPopupContent");
    
    popupTitle.innerHTML = key;
    popupContent.innerHTML = activityDetailsExtended[key] || "<em>Descripción no disponible.</em>";
    popup.classList.add("active");
  }
  
  function closeActivityPopup() {
    const popup = document.getElementById("activityPopup");
    popup.classList.remove("active");
  }
  
  // Cerrar popup del día
  function closePopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("active");
  }
  
  // Actualizar barra de progreso de tareas
  function updateTaskProgress() {
    const checkboxes = document.querySelectorAll(".task-checkbox");
    const totalTasks = checkboxes.length;
    const completedTasks = Array.from(checkboxes).filter((cb) => cb.checked).length;
    const percent = (completedTasks / totalTasks) * 100;
  
    document.getElementById("taskProgressFill").style.width = `${percent}%`;
  
    // Marcar el día como completado si todas las tareas están hechas
    if (completedTasks === totalTasks) {
      selectedDayBox.classList.add("completed");
    } else {
      selectedDayBox.classList.remove("completed");
    }
  
    updateProgress(); // Actualizar progreso general
  }
  
  // Actualizar barra de progreso general
  function updateProgress() {
    const totalDays = plan.length;
    const completedDays = document.querySelectorAll(".day.completed").length;
    const percent = (completedDays / totalDays) * 100;
  
    document.getElementById("progressFill").style.width = `${percent}%`;
  }
  
  // Inicializar el calendario
  function initializeCalendar() {
    const calendar = document.getElementById("calendar");
    plan.forEach((activities, i) => {
      const dayBox = document.createElement("div");
      dayBox.classList.add("day");
      dayBox.dataset.day = i + 1;
      dayBox.dataset.activities = JSON.stringify(activities);
      dayBox.innerHTML = `<strong>Día ${i + 1}</strong><br><small>${activities.join(", ")}</small>`;
      dayBox.addEventListener("click", () => showPopup(dayBox));
      calendar.appendChild(dayBox);
    });
  }
  
  // Llamar a la inicialización
  initializeCalendar();

  // Popup secundario para actividades
  const activityPopupHTML = `
    <div id="activityPopup" class="activity-popup" onclick="closeActivityPopup()">
      <div class="activity-popup-content" onclick="event.stopPropagation()">
        <button class="close-btn" onclick="closeActivityPopup()">Cerrar</button>
        <h2 id="activityPopupTitle"></h2>
        <div id="activityPopupContent"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", activityPopupHTML);
