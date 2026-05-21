import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Trash2, PawPrint, TrendingUp, AlertCircle, RefreshCw, Star, Info, Moon } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ChatMessageBubble from "./components/ChatMessageBubble";
import PetProfilesTab from "./components/PetProfilesTab";
import ViralTrendsTab from "./components/ViralTrendsTab";
import RecentScriptsTab from "./components/RecentScriptsTab";
import SettingsTab from "./components/SettingsTab";
import { ChatMessage, PetProfile, ScriptHistory, ActiveTab } from "./types";
import { TRENDING_TOPICS, SUGGESTED_CHIPS, PRESET_PETS } from "./data";

// Initial defaults to populate preview beautifully and demonstrate the capabilities
const DEFAULT_PETS: PetProfile[] = [
  { id: "pet-1", name: "Rusty", species: "dog", breed: "Corgi Pembroke", personality: "No responde si no hay tocino de por medio. Finge flotar en la playa como una salchicha para evitar caminar." },
  { id: "pet-2", name: "Michi", species: "cat", breed: "Persian Cat", personality: "Juzga silenciosamente todas mis decisiones de presupuesto y me despierta tirando vasos de agua." }
];

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "model",
    text: "¡Hola! 🐾 Bienvenido/a a **PetViral AI Studio**. Soy tu consultor de guiones para redes sociales de mascotas.\n\nPor favor, ingresa tu idea para un vídeo vertical o haz clic en cualquiera de las sugerencias rápidas abajo. Personalizaré el contenido según la **mascota activa** y los parámetros de **duración, plataforma y tono** seleccionados.",
    timestamp: "08:17 AM"
  },
  {
    id: "msg-2",
    role: "user",
    text: "Genera un guión para un TikTok de 30 segundos sobre mi Corgi que no quiere salir del agua en la playa. Usa un tono divertido y sarcástico.",
    timestamp: "08:18 AM",
    metadata: {
      petName: "Rusty",
      tone: "Sarcástico y Cínico",
      platform: "TikTok",
      estimatedDuration: "28 seconds"
    }
  },
  {
    id: "msg-3",
    role: "model",
    text: `### 🎬 Título de Video & Formato
**El Corgi Boya de Playa** | Plataforma: TikTok | Duración estimada: 28 segundos

### 📌 Gancho Inicial (Hook) [0:00 - 0:03]
**Primer plano de un Corgi flotando inmóvil en el agua como una salchicha esponjada. Las olas lo mueven lentamente.**
*Voz en off cómica/sarcástica:* "A veces me pregunto si compré un perro o una boya decorativa para el océano de imitación..."

### 🐾 Desarrollo del Guion (Estructura por segundos)
- **[0:03 - 0:10]** *Cámara retrocede y te muestra silbando con una toalla en la mano. El Corgi ni se inmuta, solo bosteza con los ojos semicerrados.*
  *Texto en pantalla:* "Día 3. Ha aceptado que este es su nuevo hogar."
  *Voz en off:* "Le ofrezco paseos, amor condicional... y él decide que prefiere absorber agua de sal de por vida."

- **[0:10 - 0:18]** *Punto de vista cerca del perro. Su colita corta flota debajo del agua. El Corgi flota plácidamente.*
  *Voz en off:* "Míralo. Ni un solo pensamiento detrás de esos ojitos tiernos. Cero remordimientos de hipoteca."

- **[0:18 - 0:25]** *Tratas de llamarlo con comida, el Corgi sale de repente corriendo súper rápido, muerde tu toalla y se vuelve a meter al agua de espaldas.*
  *Sonido sugerido:* Risas enlatadas o el audio viral "Oh No, Don't go yet!"

### 💥 Punchline / Cierre Memorable
**El perro vuelve a flotar felizmente a lo lejos en el mar.**
*Voz en off:* "¿Alguien sabe si el agua de mar deshace la garantía de reembolso del creador?"

### 📣 Descripción & Hashtags Virales
"A Rusty el agua no le asusta, le obsesiona. Alguien que le explique que las patitas cortas no tienen timón propio 😂🌊 #BeachCorgi #FunnyPets #HumorMascotas #DogMoments #PlayaCorgi #PerrosGraciosos"

### ⚡ Estrategia de Virilidad
- 🎵 **Música/Sonido de fondo**: Audio viral cómico con risas de fondo o música tipo "Cute/Funny Instrumental Ukulele".
- 📈 **Score de Virilidad**: 95% (El contraste de la forma redondeada del Corgi flotando es un disparador visual potente de retención instantánea).
- 💡 **Tip de Grabación**: Graba desde un plano muy bajo (a nivel del agua) usando funda contra agua para que el Corgi parezca un barco flotando sobre el horizonte.`,
    timestamp: "08:18 AM",
    metadata: {
      petName: "Rusty",
      tone: "Sarcástico y Cínico",
      platform: "TikTok",
      estimatedDuration: "28 seconds"
    }
  }
];

const DEFAULT_SCRIPTS: ScriptHistory[] = [
  {
    id: "script-1",
    title: "El Corgi Boya de Playa",
    petName: "Rusty",
    content: `Guión: El Corgi Boya de Playa\n\nGancho Inicial: Salchicha flotando inmóvil en el agua.\nVoz en off: "A veces me pregunto si compré un perro o una boya decorativa para el océano..."\n\nDesarrollo:\n0:05: El Corgi bosteza flotando.\n0:15: Sale, roba la toalla, vuelve a correr al agua.\n\nDescripción: A Rusty el agua no le asusta, le obsesiona. 😂🌊 #BeachCorgi #HumorMascotas\n\nVirality Score: 95%`,
    tone: "Sarcástico y Cínico",
    platform: "TikTok",
    date: "2026-05-21",
    favorite: true
  }
];

// Fun loading text variations
const LOADING_THOUGHTS = [
  "Masticando croquetas de inspiración...",
  "Entrenando algoritmos con ruidos de juguetes...",
  "Buscando el mejor gancho del internet felino...",
  "Traduciendo ladridos y maullidos a texto...",
  "Inyectando comedia de mascotas de alto impacto...",
  "Prediciendo el algoritmo de TikTok para tu perro..."
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [scripts, setScripts] = useState<ScriptHistory[]>([]);
  
  const [activePetId, setActivePetId] = useState<string | null>(null);
  const [tokensUsed, setTokensUsed] = useState(500);
  const [totalTokens] = useState(5000);

  // Output generator preferences
  const [platform, setPlatform] = useState("TikTok");
  const [tone, setTone] = useState("Sarcástico y Cínico");
  const [duration, setDuration] = useState("30 segundos");

  // Interaction values
  const [promptInput, setPromptInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load from LocalStorage
  useEffect(() => {
    const localPets = localStorage.getItem("petviral_saved_pets");
    if (localPets) {
      try { setPets(JSON.parse(localPets)); } catch (_) {}
    } else {
      setPets(DEFAULT_PETS);
      localStorage.setItem("petviral_saved_pets", JSON.stringify(DEFAULT_PETS));
    }

    const localMessages = localStorage.getItem("petviral_chat_messages");
    if (localMessages) {
      try { setMessages(JSON.parse(localMessages)); } catch (_) {}
    } else {
      setMessages(DEFAULT_MESSAGES);
      localStorage.setItem("petviral_chat_messages", JSON.stringify(DEFAULT_MESSAGES));
    }

    const localScripts = localStorage.getItem("petviral_saved_scripts");
    if (localScripts) {
      try { setScripts(JSON.parse(localScripts)); } catch (_) {}
    } else {
      setScripts(DEFAULT_SCRIPTS);
      localStorage.setItem("petviral_saved_scripts", JSON.stringify(DEFAULT_SCRIPTS));
    }

    const localActivePet = localStorage.getItem("petviral_active_pet_id");
    if (localActivePet) {
      setActivePetId(localActivePet);
    } else {
      setActivePetId("pet-1"); // Defaults to Rusty PEMBROKE Corgy
    }

    const localTokens = localStorage.getItem("petviral_tokens_count");
    if (localTokens) {
      setTokensUsed(parseInt(localTokens, 10));
    }
  }, []);

  // Save states modifications automatically
  useEffect(() => {
    if (pets.length > 0) {
      localStorage.setItem("petviral_saved_pets", JSON.stringify(pets));
    }
  }, [pets]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("petviral_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scripts.length > 0) {
      localStorage.setItem("petviral_saved_scripts", JSON.stringify(scripts));
    }
  }, [scripts]);

  useEffect(() => {
    if (activePetId) {
      localStorage.setItem("petviral_active_pet_id", activePetId);
    } else {
      localStorage.removeItem("petviral_active_pet_id");
    }
  }, [activePetId]);

  useEffect(() => {
    localStorage.setItem("petviral_tokens_count", tokensUsed.toString());
  }, [tokensUsed]);

  // Handle scroll to bottom on new chat message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  // Loading text cycler
  useEffect(() => {
    let interval: any;
    if (generating) {
      interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1) % LOADING_THOUGHTS.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [generating]);

  const activePet = pets.find(p => p.id === activePetId) || null;

  // Add pet profile
  const handleAddPet = (newPet: Omit<PetProfile, 'id'>) => {
    const id = `pet-${Date.now()}`;
    const created: PetProfile = { id, ...newPet };
    const updated = [...pets, created];
    setPets(updated);
    setActivePetId(id); // automatically set as active
  };

  // Delete pet profile
  const handleDeletePet = (id: string) => {
    const updated = pets.filter(p => p.id !== id);
    setPets(updated);
    if (activePetId === id) {
      setActivePetId(updated[0]?.id || null);
    }
  };

  // Delete script
  const handleDeleteScript = (id: string) => {
    const updated = scripts.filter(s => s.id !== id);
    setScripts(updated);
  };

  // Toggle favorite script
  const handleToggleFavorite = (id: string) => {
    const updated = scripts.map(s => {
      if (s.id === id) {
        return { ...s, favorite: !s.favorite };
      }
      return s;
    });
    setScripts(updated);
  };

  // Clean chat logs
  const handleClearChatHistory = () => {
    if (window.confirm("¿Seguro que deseas reiniciar el chat? Esto borrará tus conversaciones actuales.")) {
      setMessages([DEFAULT_MESSAGES[0]]);
      localStorage.setItem("petviral_chat_messages", JSON.stringify([DEFAULT_MESSAGES[0]]));
    }
  };

  // Triggered when a trend card button "Crear con esto" is pressed
  const handleSelectTrend = (trend: any) => {
    setPromptInput(`Haz un guión basado en la tendencia: "${trend.title}". Temática: ${trend.hookPreset}`);
    // Switch platform/tone tags to fit the selected category
    if (trend.category === 'cat') {
      setPlatform('TikTok');
      setTone('Sarcástico y Cínico');
    } else if (trend.category === 'dog') {
      setPlatform('Instagram Reels');
      setTone('Extremadamente Divertido');
    }
    setActiveTab('chat');
  };

  // Submitting chat prompt
  const handleSendPrompt = async (e?: React.FormEvent, customPromptText?: string) => {
    if (e) e.preventDefault();
    const targetText = (customPromptText || promptInput).trim();
    if (!targetText) return;
    if (generating) return;

    // Build unique ID
    const userMessageId = `msg-user-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + " " + (new Date().getHours() >= 12 ? 'PM' : 'AM');
    
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: targetText,
      timestamp,
      metadata: {
        petName: activePet?.name,
        tone: tone,
        platform: platform,
        estimatedDuration: duration
      }
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptInput("");
    setGenerating(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: targetText,
          pet: activePet ? {
            name: activePet.name,
            species: activePet.species,
            breed: activePet.breed,
            personality: activePet.personality
          } : undefined,
          tone,
          platform,
          duration,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upps. Algo salió mal conectando con el generador.");
      }

      const rawScriptText = data.script;

      // Extract title suggestion if possible
      let parsedTitle = "Guión de Mascota Viral";
      const titleMatch = rawScriptText.match(/### 🎬 Título de Video[^*#\n]*\n\s*\*?\*?([^\n\*\#]+)/i);
      if (titleMatch && titleMatch[1]) {
        parsedTitle = titleMatch[1].trim();
      } else {
        const platformMatch = rawScriptText.match(/Title:[^*#\n]+/i);
        if (platformMatch) parsedTitle = platformMatch[0].replace("Title:", "").trim();
      }

      // Add Model message response
      const modelMsgId = `msg-model-${Date.now()}`;
      const modelMsg: ChatMessage = {
        id: modelMsgId,
        role: 'model',
        text: rawScriptText,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + " " + (new Date().getHours() >= 12 ? 'PM' : 'AM'),
        metadata: {
          petName: activePet?.name,
          tone: tone,
          platform: platform,
          estimatedDuration: duration
        }
      };

      setMessages((prev) => [...prev, modelMsg]);

      // Automatically add to script histories list
      const newScript: ScriptHistory = {
        id: `script-${Date.now()}`,
        title: parsedTitle || `Guión de ${activePet?.name || 'Mascota'}`,
        content: rawScriptText,
        petName: activePet?.name,
        tone: tone,
        platform: platform,
        date: new Date().toISOString().split('T')[0],
        favorite: false
      };

      setScripts((prev) => [newScript, ...prev]);

      // Increment tokens used
      const generatedTokensCount = Math.floor(Math.random() * 200) + 150;
      setTokensUsed((prev) => Math.min(prev + generatedTokensCount, totalTokens));

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Error al generar tu guión. Asegúrate de configurar la clave API en la barra superior de AI Studio.");
      
      // Inject error helper bubble directly into the chat logs
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: "model",
        text: `⚠️ **Error de Generación:**\n\nNo pudimos procesar la sugerencia debido a:\n> *${err.message || "Error de red o Servidor no disponible"}*\n\n💡 **Solución rápida:** Verifica que la clave API esté configurada adecuadamente en el panel de **Secrets** de AI Studio e inténtalo de nuevo.`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0B0D] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tokensUsed={tokensUsed}
        totalTokens={totalTokens}
        scriptCount={scripts.length}
        petCount={pets.length}
      />

      {/* Central Content Area Container */}
      <main id="app-main-viewport" className="flex-1 flex flex-col relative h-full bg-[#0A0B0D]">
        
        {/* Header Ribbon */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0A0B0D]/80 backdrop-blur-md z-10 select-none shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
              {activeTab === 'chat' && <>💬 Chat Generator</>}
              {activeTab === 'history' && <>📁 Recent Scripts History</>}
              {activeTab === 'trends' && <>📈 Trending Pet Challenges</>}
              {activeTab === 'pets' && <>🐾 Pet Profiles Creator</>}
              {activeTab === 'settings' && <>⚙️ Output Settings</>}
            </h2>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            
            {activePet ? (
              <span className="text-[10px] bg-orange-600/10 text-orange-400 border border-orange-500/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                Mascota: {activePet.name} ({activePet.species === 'dog' ? 'Perro' : activePet.species === 'cat' ? 'Gato' : 'Ave'})
              </span>
            ) : (
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                Sin filtro de mascota activo
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'chat' && messages.length > 1 && (
              <button
                onClick={handleClearChatHistory}
                className="text-xs text-slate-500 hover:text-red-400 font-medium transition-colors cursor-pointer"
              >
                Limpiar Chat
              </button>
            )}
            
            <a 
              href="https://ai.studio/build" 
              target="_blank" 
              className="text-xs text-slate-400 hover:text-white font-medium hover:underline flex items-center gap-1 bg-slate-800/40 border border-slate-700/50 px-3 py-1.5 rounded-xl transition-all"
            >
              <Sparkles className="h-3 w-3 text-orange-400" /> Web Creator Studio
            </a>
          </div>
        </header>

        {/* Core Tab Dynamic Views */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col scroll-smooth">
                {messages.map((item) => (
                  <ChatMessageBubble key={item.id} message={item} />
                ))}

                {/* Loading prompt answer block */}
                {generating && (
                  <div className="flex gap-4 max-w-4xl self-start">
                    <div className="w-9 h-9 rounded-xl bg-orange-600 flex-shrink-0 flex items-center justify-center animate-spin">
                      <RefreshCw className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-orange-400 font-bold uppercase tracking-widest animate-pulse">
                          PetViral AI está redactando el guión...
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono italic">
                          {LOADING_THOUGHTS[loadingTextIdx]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Lower Input Area Container */}
              <div className="p-6 border-t border-slate-800/50 bg-[#0A0B0D]/90 select-none">
                <div className="max-w-3xl mx-auto relative">
                  
                  {/* Preset Quick Chips */}
                  <div className="flex gap-2 justify-center flex-wrap mb-4 overflow-x-auto py-1 scrollbar-none">
                    {SUGGESTED_CHIPS.map((ch, idx) => (
                      <button
                        id={`quick-chip-${idx}`}
                        key={idx}
                        onClick={() => handleSendPrompt(undefined, ch.text)}
                        disabled={generating}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-slate-400 hover:text-white hover:border-orange-500/40 transition-all select-none cursor-pointer text-center whitespace-nowrap"
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>

                  {/* Ultimate Input Form */}
                  <form onSubmit={handleSendPrompt} className="relative">
                    <textarea
                      placeholder={
                        activePet 
                          ? `Escribe aquí tu ocurrencia para ${activePet.name} (ej: robando comida, asustado de la aspiradora)...`
                          : "Escribe aquí la idea para el video de tu mascota..."
                      }
                      rows={2}
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendPrompt();
                        }
                      }}
                      className="w-full bg-[#161a20] border border-slate-700/60 rounded-2xl p-4 pr-16 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 shadow-2xl resize-none max-h-28"
                    />
                    <button
                      type="submit"
                      disabled={generating || !promptInput.trim()}
                      className={`absolute right-3.5 bottom-3.5 p-2 bg-orange-600 hover:bg-orange-500 rounded-xl transition-all cursor-pointer ${
                        generating || !promptInput.trim() ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      <Send className="h-4 w-4 text-white" />
                    </button>
                  </form>
                  <p className="text-center mt-3 text-[10px] text-slate-600">
                    Sintonizado por PetViral IA (Gemini 3.5 Flash) • Generación instantánea para Reels y TikTok
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <RecentScriptsTab
              scripts={scripts}
              onDeleteScript={handleDeleteScript}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'trends' && (
            <ViralTrendsTab
              onSelectTrend={handleSelectTrend}
            />
          )}

          {activeTab === 'pets' && (
            <PetProfilesTab
              pets={pets}
              activePetId={activePetId}
              onAddPet={handleAddPet}
              onDeletePet={handleDeletePet}
              onSetActivePet={setActivePetId}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              platform={platform}
              setPlatform={setPlatform}
              tone={tone}
              setTone={setTone}
              duration={duration}
              setDuration={setDuration}
            />
          )}
        </div>
      </main>
    </div>
  );
}
