export interface TrendingTopic {
  id: string;
  title: string;
  category: 'dog' | 'cat' | 'bird' | 'general';
  description: string;
  hookPreset: string;
  viralScore: number;
  tags: string[];
}

export const TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'trend-1',
    title: 'El Corgi que flota como una salchicha',
    category: 'dog',
    description: 'Vídeos de perros que flotan inmóviles en agua, ignorando los llamados divertidos de sus dueños.',
    hookPreset: 'Mi perro no quiere salir del agua y finge ser una boya de playa...',
    viralScore: 94,
    tags: ['#BeachDog', '#CorgiLife', '#LazyPet']
  },
  {
    id: 'trend-2',
    title: 'Gatos asustados con vegetales silenciosos',
    category: 'cat',
    description: 'El clásico y cómico susto felino al encontrar un vegetal inesperado detrás de ellos.',
    hookPreset: 'Sometiendo a Luna al test del pepino silencioso... El salto batió récords olímpicos',
    viralScore: 89,
    tags: ['#ScaredCat', '#CatProblems', '#FunnyPets']
  },
  {
    id: 'trend-3',
    title: 'Doblajes sarcásticos con voz de robot',
    category: 'general',
    description: 'Doblaje humorístico y cínico que traduce los pensamientos internos de tu mascota sobre el costo de la comida para perros.',
    hookPreset: 'Doblaje de lo que piensa mi mascota cuando le doy comida barata vs premium...',
    viralScore: 97,
    tags: ['#PetTranslator', '#PetVoiceover', '#Funny']
  },
  {
    id: 'trend-4',
    title: 'El ataque repentino de Zoomies nocturnos',
    category: 'dog',
    description: 'Ese momento caótico a las 3:00 AM donde la mascota corre por la casa de repente a la velocidad de la luz.',
    hookPreset: 'El motor V8 ultra turbocargado de mi mascota se enciende exactamente a las 3 de la madrugada...',
    viralScore: 92,
    tags: ['#Zoomies', '#NightEnergy', '#CrazyDog']
  },
  {
    id: 'trend-5',
    title: 'Loros discutiendo con el espejo',
    category: 'bird',
    description: 'Aves inteligentes y divertidas que se indignan o se coquetean consigo mismas frente al espejo.',
    hookPreset: 'Mi loro Coco descubrió su propia existencia en el espejo y ahora exige una disculpa formal...',
    viralScore: 85,
    tags: ['#TalkingParrot', '#MirrorMirror', '#PetDrama']
  },
  {
    id: 'trend-6',
    title: 'El juicio de la alfombra rota',
    category: 'general',
    description: 'Interrogatorio a mascotas culpables con caras tiernas que evitan el contacto visual a toda costa.',
    hookPreset: 'Interrogatorio oficial del sospechoso por el destrozo de los cojines. El acusado guarda silencio absoluto...',
    viralScore: 91,
    tags: ['#GuiltyPet', '#DogCrime', '#Aww']
  }
];

export const PRESET_PETS = [
  { name: 'Toby', breed: 'Golden Retriever', personality: 'Extremadamente mimado y glotón', species: 'dog' },
  { name: 'Michi', breed: 'Gato Siamés', personality: 'Juzga silenciosamente todas mis decisiones de vida', species: 'cat' },
  { name: 'Paco', breed: 'Loro Amazonas', personality: 'Grita ópera y duerme boca abajo', species: 'bird' }
];

export const SUGGESTED_CHIPS = [
  { label: '🐶 Perros', text: 'Haz un guión sobre mi perro pidiendo comida con ojos de manipulación profesional' },
  { label: '🐱 Gatos', text: 'Escribe una comedia sobre mi gato que me despierta pisándome la cara' },
  { label: '🦜 Aves', text: 'Crea un corto sobre mi loro interrumpiendo una reunión de trabajo importante' },
  { label: '😂 Sarcasmo', text: 'Un guión irónico sobre cómo entrena mi mascota a sus humanos' }
];
