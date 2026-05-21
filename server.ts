import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Falta la API Key de Gemini. Por favor configurarla en 'Settings > Secrets' en la interfaz de AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Prompt Generation API Endpoint
app.post("/api/generate-script", async (req, res) => {
  try {
    const { prompt, pet, tone, platform, duration, category } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "El prompt o la idea de video es obligatoria." });
      return;
    }

    const ai = getGeminiAI();

    // Construct precise instruction block injecting all variable context inputs
    let contextString = `PROMPT DEL USUARIO: "${prompt}"\n`;
    if (pet) {
      contextString += `MASCOTA: Se trata de un ${pet.species} de raza ${pet.breed || "desconocida"}. Se llama ${pet.name || "la mascota"} y su personalidad es ${pet.personality || "juguetona o normal"}.\n`;
    }
    if (tone) {
      contextString += `TONO DEL GUION: ${tone} (ej: divertido, sarcástico, dramático, simpático, épico)\n`;
    }
    if (platform) {
      contextString += `PLATAFORMA DESTINO: ${platform}\n`;
    }
    if (duration) {
      contextString += `DURACIÓN RECOMENDADA: ${duration}\n`;
    }
    if (category) {
      contextString += `TEMÁTICA / CATEGORÍA RECOMENDADA: ${category}\n`;
    }

    const systemInstruction = `
Eres la IA de PetViral, una redactora de guiones estrella y consultora de contenido en vídeo de mascotas (TikTok, Instagram Reels, YouTube Shorts).
Tu objetivo es transformar prompts sobre mascotas en guiones listos para grabar, interactivos, de alto enganche y diseñados para retener la atención desde el principio (Hooks con 70%+ de tasa de retención).

Debes organizar tu respuesta en un formato de Markdown estructurado e impecable con estas secciones:

### 🎬 Título de Video & Formato
(Escribe un título con gancho de click, la plataforma recomendada y la duración exacta en segundos)

### 📌 Gancho Inicial (Hook) [0:00 - 0:03]
(Instrucción visual en negrita, más el texto/audio de inmediato en pantalla para retener al usuario)

### 🐾 Desarrollo del Guion (Estructura por segundos)
(Divide el vídeo en partes breves de 3 a 5 segundos con:
- **[Tiempo]** *Acción visual*: "Diálogo o voz en off")

### 💥 Punchline / Cierre Memorable
(El final inolvidable o gracioso del vídeo)

### 📣 Descripción & Hashtags Virales
(Título descriptivo, llamada a la acción irresistible para comentarios e interacción y hashtags seleccionados de mayor tráfico para mascotas)

### ⚡ Estrategia de Virilidad
- 🎵 **Música/Sonido de fondo**: (Recomendación de tipo de sonido o melodía que encaje)
- 📈 **Score de Virilidad**: (Calificación de 1% a 100% con un breve por qué en una línea)
- 💡 **Tip de Grabación**: (Un truco directo sobre cómo capturar la mejor reacción de tu mascota)

IMPORTANTE:
- Sé creativo, divertido y emplea un tono fiel al solicitado.
- No uses rodeos introductorios como "Aquí tienes el guión...". Empieza directamente con el Markdown.
- Responde siempre en español.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextString,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
      },
    });

    const scriptText = response.text || "No se pudo generar el guión. Inténtalo de nuevo.";
    res.json({ script: scriptText });
  } catch (error: any) {
    console.error("Gemini API Error in Server:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor al conectar con Gemini AI." });
  }
});

// Configure Vite middleware for development or serve dist directories for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PetViral Run] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
