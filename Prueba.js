const startButton = document.getElementById("startButton");
const outputDiv = document.getElementById("output");
const outputGpt = document.getElementById("output2");
const key = document.getElementById("inputKey");
// Verifica si el navegador admite el reconocimiento de voz
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Configura la configuración de reconocimiento
  recognition.continuous = true; // Escuchar continuamente
  recognition.interimResults = false; // Resultados intermedios

  // Evento que se activa cuando se detecta habla
  recognition.onresult = async (event) => {
    const transcript = await event.results[event.results.length - 1][0]
      .transcript;
    outputDiv.textContent = transcript;

    obtenerRespuesta(transcript);
  };

  // Manejo del botón para iniciar y detener el reconocimiento
  let isListening = false;
  startButton.addEventListener("click", () => {
    if (isListening) {
      recognition.stop();
      startButton.textContent = "Comenzar a hablar";
    } else {
      recognition.start();

      startButton.textContent = "Detener";
    }
    isListening = !isListening;
  });
} else {
  outputDiv.textContent =
    "El reconocimiento de voz no es compatible con este navegador.";
}

// function hablar(a) {
//   obtenerRespuesta(a);
// }
// const API_KEY = "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"; // Reemplaza con tu propia API
async function obtenerRespuesta(prompt) {
  if (!key.value) {
    leerTexto("falta la llave");
  } else {
    //console.log(key.value);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key.value,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    // Crear un objeto de síntesis de voz
    
    // Ejemplo de uso
    const textoParaLeer = data.choices[0].message.content;
    
    leerTexto(textoParaLeer);
  }
  
  // Función para leer el texto
  function leerTexto(texto) {
    const synthesis = window.speechSynthesis;
    // Crear un objeto de síntesis de voz
    const mensaje = new SpeechSynthesisUtterance(texto);

    // Reproducir el mensaje de voz
    outputGpt.textContent = texto;
    synthesis.speak(mensaje);
  }
}
