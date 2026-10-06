/**
 * Astrology Database
 * Contains signs, planets, aspects, and interpretive data
 */

export const signs = [
  { id: 1, name: "Aries", symbol: "♈", element: "fire", quality: "cardinal", ruler: "Mars", dates: "Mar 21 - Apr 19" },
  { id: 2, name: "Taurus", symbol: "♉", element: "earth", quality: "fixed", ruler: "Venus", dates: "Apr 20 - May 20" },
  { id: 3, name: "Gemini", symbol: "♊", element: "air", quality: "mutable", ruler: "Mercury", dates: "May 21 - Jun 20" },
  { id: 4, name: "Cancer", symbol: "♋", element: "water", quality: "cardinal", ruler: "Moon", dates: "Jun 21 - Jul 22" },
  { id: 5, name: "Leo", symbol: "♌", element: "fire", quality: "fixed", ruler: "Sun", dates: "Jul 23 - Aug 22" },
  { id: 6, name: "Virgo", symbol: "♍", element: "earth", quality: "mutable", ruler: "Mercury", dates: "Aug 23 - Sep 22" },
  { id: 7, name: "Libra", symbol: "♎", element: "air", quality: "cardinal", ruler: "Venus", dates: "Sep 23 - Oct 22" },
  { id: 8, name: "Scorpio", symbol: "♏", element: "water", quality: "fixed", ruler: "Pluto", dates: "Oct 23 - Nov 21" },
  { id: 9, name: "Sagittarius", symbol: "♐", element: "fire", quality: "mutable", ruler: "Jupiter", dates: "Nov 22 - Dec 21" },
  { id: 10, name: "Capricorn", symbol: "♑", element: "earth", quality: "cardinal", ruler: "Saturn", dates: "Dec 22 - Jan 19" },
  { id: 11, name: "Aquarius", symbol: "♒", element: "air", quality: "fixed", ruler: "Uranus", dates: "Jan 20 - Feb 18" },
  { id: 12, name: "Pisces", symbol: "♓", element: "water", quality: "mutable", ruler: "Neptune", dates: "Feb 19 - Mar 20" }
];

export const planets = [
  { id: "sun", name: "Sun", speed: 1, type: "personal" },
  { id: "moon", name: "Moon", speed: 13, type: "personal" },
  { id: "mercury", name: "Mercury", speed: 1.5, type: "personal" },
  { id: "venus", name: "Venus", speed: 1.2, type: "personal" },
  { id: "mars", name: "Mars", speed: 0.5, type: "personal" },
  { id: "jupiter", name: "Jupiter", speed: 0.08, type: "social" },
  { id: "saturn", name: "Saturn", speed: 0.033, type: "social" },
  { id: "uranus", name: "Uranus", speed: 0.012, type: "social" },
  { id: "neptune", name: "Neptune", speed: 0.006, type: "transpersonal" },
  { id: "pluto", name: "Pluto", speed: 0.004, type: "transpersonal" }
];

export const houses = [
  { id: 1, name: "First House", keywords: ["identity", "appearance", "personality", "self"] },
  { id: 2, name: "Second House", keywords: ["values", " possessions", "money", "self-worth"] },
  { id: 3, name: "Third House", keywords: ["communication", "siblings", "learning", "neighbors"] },
  { id: 4, name: "Fourth House", keywords: ["home", "family", "roots", "emotions"] },
  { id: 5, name: "Fifth House", keywords: ["creativity", "love affairs", "children", "pleasure"] },
  { id: 6, name: "Sixth House", keywords: ["health", "work", "service", "daily routine"] },
  { id: 7, name: "Seventh House", keywords: ["partnerships", "marriage", "open enemies", "contracts"] },
  { id: 8, name: "Eighth House", keywords: ["transformation", "shared resources", "death", "intimacy"] },
  { id: 9, name: "Ninth House", keywords: ["higher education", "travel", "philosophy", "beliefs"] },
  { id: 10, name: "Tenth House", keywords: ["career", "public image", "achievement", "authority"] },
  { id: 11, name: "Eleventh House", keywords: ["friendships", "groups", "hopes", "aspirations"] },
  { id: 12, name: "Twelfth House", keywords: ["secrets", "unconscious", "karma", "self-undoing"] }
];

export const aspects = [
  { id: "conjunction", name: "Conjunction", angle: 0, symbol: "☌", orb: 10, nature: "unify" },
  { id: "sextile", name: "Sextile", angle: 60, symbol: "⚹", orb: 6, nature: "opportunity" },
  { id: "square", name: "Square", angle: 90, symbol: "□", orb: 8, nature: "challenge" },
  { id: "trine", name: "Trine", angle: 120, symbol: "△", orb: 8, nature: "harmony" },
  { id: "opposition", name: "Opposition", angle: 180, symbol: "☍", orb: 10, nature: "tension" }
];

export const signInterpretations = {
  aries: {
    strengths: ["courage", "initiative", "enthusiasm", "pioneering spirit"],
    challenges: ["impatience", "impulsiveness", "aggressiveness", "self-centeredness"],
    traits: ["Aries is a fire sign ruled by Mars, the planet of action and desire. Those with prominent Aries are natural leaders who embrace challenges with vigor and determination."]
  },
  taurus: {
    strengths: ["reliability", "patience", "steadfastness", "practicality"],
    challenges: ["stubbornness", "materialism", "resistance to change", "possessiveness"],
    traits: ["Taurus is an earth sign ruled by Venus, the planet of love and beauty. Taurus individuals value stability, comfort, and the finer things in life."]
  },
  gemini: {
    strengths: ["versatility", "adaptability", "communication skills", "curiosity"],
    challenges: ["inconsistency", "nervousness", "superficiality", "indecisiveness"],
    traits: ["Gemini is an air sign ruled by Mercury, the planet of communication. Geminis are intellectual, curious, and skilled at connecting with others through words."]
  },
  cancer: {
    strengths: ["emotional intelligence", "nurturing", "intuition", "loyalty"],
    challenges: ["moodiness", "oversensitivity", "clinginess", "pessimism"],
    traits: ["Cancer is a water sign ruled by the Moon, the planet of emotions. Cancerians are deeply feeling individuals who prioritize home, family, and emotional security."]
  },
  leo: {
    strengths: ["confidence", "creativity", "generosity", "warmth"],
    challenges: ["pride", "dramatic tendencies", "stubbornness", "attention-seeking"],
    traits: ["Leo is a fire sign ruled by the Sun, the center of the solar system. Leos shine brightly, drawing attention with their charisma, creativity, and big-hearted nature."]
  },
  virgo: {
    strengths: ["analytical", "practical", "reliable", "modest"],
    challenges: ["overcritical", "perfectionism", "worry", "shyness"],
    traits: ["Virgo is an earth sign ruled by Mercury. Virgos possess keen analytical minds, a talent for organization, and a genuine desire to be of service to others."]
  },
  libra: {
    strengths: ["diplomacy", "fairness", "social grace", "partnership-oriented"],
    challenges: ["indecisiveness", "avoidance of conflict", "people-pleasing", "superficiality"],
    traits: ["Libra is an air sign ruled by Venus. Librans seek harmony, balance, and beauty in all things. They excel at partnerships and bringing people together."]
  },
  scorpio: {
    strengths: ["intensity", "passion", "determination", "resourcefulness"],
    challenges: ["secretiveness", "jealousy", "manipulativeness", "intensity"],
    traits: ["Scorpio is a water sign traditionally ruled by Mars, now associated with Pluto. Scorpios possess profound emotional depth, transformative power, and unwavering loyalty."]
  },
  sagittarius: {
    strengths: ["optimism", "adventure-seeking", "honesty", "philosophical nature"],
    challenges: ["restlessness", "bluntness", "irresponsibility", "impatience"],
    traits: ["Sagittarius is a fire sign ruled by Jupiter, the planet of expansion. Sagittarians are eternal optimists who seek truth, adventure, and meaning in life."]
  },
  capricorn: {
    strengths: ["discipline", "ambition", "responsibility", "patience"],
    challenges: ["pessimism", "coldness", "rigidity", "workaholism"],
    traits: ["Capricorn is an earth sign ruled by Saturn, the planet of limitation and structure. Capricorns are disciplined achievers who value responsibility and long-term success."]
  },
  aquarius: {
    strengths: ["originality", "independence", "humanitarianism", "intellectualism"],
    challenges: ["unpredictability", "detachment", "rebelliousness", "aloofness"],
    traits: ["Aquarius is an air sign traditionally ruled by Saturn, now associated with Uranus. Aquarians are visionaries who march to the beat of their own drum while caring deeply for humanity."]
  },
  pisces: {
    strengths: ["compassion", "intuition", "artistic talent", "spirituality"],
    challenges: ["escapism", "vulnerability", "confusion", "self-sacrifice"],
    traits: ["Pisces is a water sign traditionally ruled by Jupiter, now associated with Neptune. Pisceans are dreamers who swim between worlds, possessing profound empathy and artistic sensitivity."]
  }
};

export const planetInterpretations = {
  sun: {
    meaning: "The Sun represents your core essence, vitality, and life purpose. It symbolizes your conscious will and the central force of your being.",
    questions: ["Who am I at my core?", "What is my life purpose?", "Where do I shine brightest?"]
  },
  moon: {
    meaning: "The Moon represents your emotional nature, instincts, and subconscious. It shows how you process feelings and what makes you feel secure.",
    questions: ["What do I need to feel emotionally secure?", "How do I nurture myself and others?", "What are my instinctive reactions?"]
  },
  mercury: {
    meaning: "Mercury represents communication, thinking, and learning. It shows how you express ideas and process information.",
    questions: ["How do I communicate?", "What topics interest me?", "How do I make decisions?"]
  },
  venus: {
    meaning: "Venus represents love, beauty, and values. It shows how you give and receive affection, and what you find beautiful.",
    questions: ["How do I express love?", "What do I value in relationships?", "What brings me pleasure?"]
  },
  mars: {
    meaning: "Mars represents action, drive, and desire. It shows how you pursue goals and express assertiveness.",
    questions: ["What drives me?", "How do I take action?", "What do I desire?"]
  },
  jupiter: {
    meaning: "Jupiter represents expansion, growth, and optimism. It shows where you find abundance and how you seek meaning.",
    questions: ["Where do I find abundance?", "What is my philosophy of life?", "Where can I grow?"]
  },
  saturn: {
    meaning: "Saturn represents structure, responsibility, and limitations. It shows where you face challenges and must develop discipline.",
    questions: ["What limits me?", "Where must I develop responsibility?", "What structures do I need?"]
  },
  uranus: {
    meaning: "Uranus represents innovation, freedom, and sudden change. It shows where you seek liberation and originality.",
    questions: ["Where do I break free?", "What makes me unique?", "Where do I experience sudden changes?"]
  },
  neptune: {
    meaning: "Neptune represents dreams, intuition, and transcendence. It shows where you are most inspired and where you may be deluded.",
    questions: ["What inspires me?", "Where do I need faith?", "What are my dreams?"]
  },
  pluto: {
    meaning: "Pluto represents transformation, power, and rebirth. It shows where you experience profound change and where you wield hidden influence.",
    questions: ["Where do I transform?", "What is my power?", "What must I let go?"]
  }
};

export const getSignById = (id) => signs.find(s => s.id === id);

export const getSignByName = (name) => signs.find(s => s.name.toLowerCase() === name.toLowerCase());

export const getPlanetById = (id) => planets.find(p => p.id === id);

export const getHouseById = (id) => houses.find(h => h.id === id);

export const getSignForDate = (month, day) => {
  const signMap = [
    { end: [1, 19], sign: 10 },
    { end: [2, 18], sign: 11 },
    { end: [3, 20], sign: 12 },
    { end: [4, 19], sign: 1 },
    { end: [5, 20], sign: 2 },
    { end: [6, 20], sign: 3 },
    { end: [7, 22], sign: 4 },
    { end: [8, 22], sign: 5 },
    { end: [9, 22], sign: 6 },
    { end: [10, 22], sign: 7 },
    { end: [11, 21], sign: 8 },
    { end: [12, 21], sign: 9 },
    { end: [12, 31], sign: 10 } // Dec 22-31 is Capricorn (was 9 = Sagittarius)
  ];
  
  for (const entry of signMap) {
    if (month < entry.end[0] || (month === entry.end[0] && day <= entry.end[1])) {
      return getSignById(entry.sign);
    }
  }
  return getSignById(1);
};

export const calculateSimplifiedChart = (birthDate, birthTime, location) => {
  // Parse "YYYY-MM-DD" as calendar parts. new Date("YYYY-MM-DD") is UTC midnight,
  // so getDate() in any timezone west of UTC returned the previous day.
  const [year, month, day] = String(birthDate).split('-').map(Number);
  
  const sunSign = getSignForDate(month, day);
  
  const seed = (year * 10000 + month * 100 + day) + (birthTime ? birthTime.replace(':', '') : 1200);
  
  const moonPhase = ((seed % 30) + 30) % 30;
  const moonSign = signs[Math.floor(seed / 100) % 12];
  
  const mercuryPhase = ((seed * 3) % 12) + 1;
  const mercurySign = getSignById(mercuryPhase);
  
  const venusPhase = ((seed * 7) % 12) + 1;
  const venusSign = getSignById(venusPhase);
  
  const marsPhase = ((seed * 5) % 12) + 1;
  const marsSign = getSignById(marsPhase);
  
  const risingPhase = ((seed * 11) % 12) + 1;
  const risingSign = getSignById(risingPhase);
  
  return {
    sun: { sign: sunSign, degree: Math.floor(seed % 30) },
    moon: { sign: moonSign, degree: moonPhase },
    mercury: { sign: mercurySign, degree: Math.floor((seed * 3) % 30) },
    venus: { sign: venusSign, degree: Math.floor((seed * 7) % 30) },
    mars: { sign: marsSign, degree: Math.floor((seed * 5) % 30) },
    rising: { sign: risingSign, degree: Math.floor((seed * 11) % 30) },
    birthDate,
    birthTime,
    location
  };
};

export const getChartInterpretation = (chart) => {
  const sunInterpretation = signInterpretations[chart.sun.sign.name.toLowerCase()];
  const moonInterpretation = signInterpretations[chart.moon.sign.name.toLowerCase()];
  
  return {
    summary: `${chart.sun.sign.name} Sun / ${chart.moon.sign.name} Moon / ${chart.rising.sign.name} Rising`,
    sun: {
      sign: chart.sun.sign,
      interpretation: sunInterpretation
    },
    moon: {
      sign: chart.moon.sign,
      interpretation: moonInterpretation
    },
    rising: {
      sign: chart.rising.sign,
      interpretation: signInterpretations[chart.rising.sign.name.toLowerCase()]
    },
    personality: `As a ${chart.sun.sign.name} with a ${chart.moon.sign.name} Moon and ${chart.rising.sign.name} Rising, you embody the ${chart.sun.sign.element} energy of ${chart.sun.sign.name} with the emotional depth of ${chart.moon.sign.name} and the face you show the world shaped by ${chart.rising.sign.name}.`
  };
};
