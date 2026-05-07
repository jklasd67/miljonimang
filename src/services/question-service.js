const fs = require("fs/promises");
const path = require("path");

const PROMPT_FILE = path.join(__dirname, "..", "..", "prompts", "question-generation.md");

const TECH_PATTERNS = [
  { key: "addEventListener", label: "DOM sundmuste kasitlemine" },
  { key: "innerHTML", label: "DOM-i sisestamine innerHTML kaudu" },
  { key: "localStorage", label: "andmete salvestus brauseri localStorage-s" },
  { key: "fetch(", label: "andmete toomine fetch API-ga" },
  { key: "JSON.parse", label: "JSON andmete parsimine" },
  { key: "JSON.stringify", label: "JSON serialiseerimine" },
  { key: "try", label: "veahaldus try/catch abil" },
  { key: "async", label: "asunkroonne loogika" },
  { key: "await", label: "asunkroonsete kutsete ootamine" },
  { key: "querySelector", label: "DOM elementide valik querySelector-iga" },
];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function collectText(task) {
  const fileConcat = task.solutionFiles
    .map((file) => `FILE: ${file.path}\n${file.content}`)
    .join("\n\n");
  return `${task.assignment}\n\n${fileConcat}`.toLowerCase();
}

function detectTechnologies(task) {
  const fullText = collectText(task);
  const found = TECH_PATTERNS.filter((pattern) => fullText.includes(pattern.key.toLowerCase()));
  return found.length ? found : [{ label: "uldised programmeerimisvood", key: "general" }];
}

function firstLines(markdown, count = 8) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, count);
}

function buildFallbackQuestions(task) {
  const technologies = detectTechnologies(task);
  const topLines = firstLines(task.assignment, 10);
  const title = task.title;
  const fileNames = task.solutionFiles.map((f) => f.path);
  const hasManyFiles = fileNames.length > 2;

  const pool = [
    {
      difficulty: "easy",
      question: `Mis on ulesande \"${title}\" peamine eesmärk?`,
      options: [
        "Ainult failide olemasolu kontrollimine",
        "Lahenduse funktsionaalsuse ja nouete taitmise kinnitamine",
        "Serveri operatsioonisusteemi uuendamine",
        "CSS failide minimeerimine",
      ],
      correctIndex: 1,
      explanation: "assignment.md kirjeldab eesmarki ja nouete taitmist, mitte ainult failide olemasolu.",
    },
    {
      difficulty: "easy",
      question: "Miks on assignment.md selle rakenduse jaoks oluline?",
      options: [
        "Selles on ainult juhuslikud markmed",
        "Selles on ulesande nouded ja hindamiskriteeriumid, mille jargi hinnata",
        "See asendab koiki lahendusfaile",
        "See on vajalik ainult deploy jaoks",
      ],
      correctIndex: 1,
      explanation: "assignment.md annab AI-le ja hindamisloogikale peamise hindamiskonteksti.",
    },
    {
      difficulty: "easy",
      question: "Mida annab lahendusfailide kaasamine AI-le?",
      options: [
        "Voimaluse koostada kontseptuaalseid kusimusi reaalse loogika pohjal",
        "Ainult failinimede meeldejattmise kontrolli",
        "Voimaluse muuta assignment.md automaatselt",
        "Vajaduse eemaldada valikvastused",
      ],
      correctIndex: 0,
      explanation: "Lahendusfailid annavad tegeliku implementeeringu, mille pealt saab kontrollida arusaamist.",
    },
    {
      difficulty: "easy",
      question: "Miks peaks AI iga mangu alguses kusimused uuesti looma?",
      options: [
        "Et kasutaja ei saaks ainult vastuseid pahe oppida",
        "Et server kaivituks kiiremini",
        "Et assignment.md kustuks",
        "Et valikvastuseid oleks ainult kaks",
      ],
      correctIndex: 0,
      explanation: "Uute variantide loomine aitab kontrollida sisulist arusaamist, mitte paheoppimist.",
    },
    {
      difficulty: "easy",
      question: "Miks on igal kusimusel tapselt 4 vastusevarianti?",
      options: [
        "See toetab miljonimangu formaati ja uhest loogikat",
        "Sest JavaScript toetab ainult nelja stringi",
        "Et backend ei peaks JSON-i kasutama",
        "Et oige vastus oleks alati D",
      ],
      correctIndex: 0,
      explanation: "Nelja variandiga valikvastus on mangu pohnoue.",
    },
    {
      difficulty: "medium",
      question: `Kui lahenduses kasutatakse tehnoloogiat \"${technologies[0].label}\", mida tasub kindlasti kontrollida?`,
      options: [
        "Kas seda kasutatakse ulesande nouetest lahtuvalt oiges kohas",
        "Kas faili nimi algab tahega Z",
        "Kas kommentaarid on alati inglise keeles",
        "Kas brauseri zoom on 100%",
      ],
      correctIndex: 0,
      explanation: "Tehnoloogia kasutus peab olema pohjendatud ulesande eesmargiga.",
    },
    {
      difficulty: "medium",
      question: "Mis juhtub hindamise kvaliteediga, kui loetakse ainult assignment.md ja mitte lahendusfaile?",
      options: [
        "Hindamine paraneb alati",
        "Hindamine jaab pealiskaudseks, sest tegelik loogika puudub",
        "Mangu pikkus kahekordistub automaatselt",
        "Oiged vastused kaovad JSON-ist",
      ],
      correctIndex: 1,
      explanation: "Ilma lahenduseta ei saa kontrollida, kuidas nouded tegelikult teostati.",
    },
    {
      difficulty: "medium",
      question: "Miks on kasulik failide lugemisel ignoreerida kaustu nagu node_modules voi .git?",
      options: [
        "Et valtimata mitteseotud ja liiga mahukad failid kontekstist",
        "Et JavaScript tootaks ainult frontendis",
        "Et kustutada kasutaja punktid",
        "Et muuta koik kusimused raskeks",
      ],
      correctIndex: 0,
      explanation: "Mitteseotud kaustad lisavad mra ja voivad konteksti liiga suureks muuta.",
    },
    {
      difficulty: "medium",
      question: "Kuidas aitab raskusastmete jaotus (1-5, 6-10, 11-15) hinnata arusaamist?",
      options: [
        "Liigutakse jarjest sugavama kontseptuaalse moistmise suunas",
        "Koik kusimused muutuvad juhuslikuks",
        "Vastused muutuvad automaatselt oigeks",
        "JSON formaat pole enam vajalik",
      ],
      correctIndex: 0,
      explanation: "Jaotus voimaldab eristada algteadmisi, loogika moistmist ja susteemset analuusi.",
    },
    {
      difficulty: "medium",
      question: hasManyFiles
        ? "Lahendus on mitmes failis. Milline risk tekib, kui AI analuusib ainult uhte faili?"
        : "Lahendus on pigem koondatud. Milline samm aitab siiski tervikpilti kontrollida?",
      options: hasManyFiles
        ? [
            "Oluline osa loogikast voib kahe silma vahele jaada",
            "Server jookseb alati kokku",
            "HTML muutub automaatselt PDF-iks",
            "Mangu reeglid ei luba enam 4 valikut",
          ]
        : [
            "Kontrollida ka assignment.md nouete vastavust reaalsele loogikale",
            "Muutke koik funktsioonid globaalseks",
            "Eemaldada koik veatootlused",
            "Asendada JSON binaarfailiga",
          ],
      correctIndex: 0,
      explanation: "Hindamine peab katma kogu lahenduse, mitte ainult osa sellest.",
    },
    {
      difficulty: "hard",
      question: "Milline praktika parandab mangu skaleeritavust mitme ulesande korral?",
      options: [
        "Ulesannete hoidmine eraldi numbrikaustades ja failide dünaamiline lugemine",
        "Koigi ulesannete hardcode uhesse faili",
        "Kusimuste hoidmine ainult pildina",
        "Ainult manualne valik ilma API-ta",
      ],
      correctIndex: 0,
      explanation: "Dunaamiline struktuur voimaldab uusi ulesandeid lisada ilma arhitektuuri umberkirjutuseta.",
    },
    {
      difficulty: "hard",
      question: "Milline turvarisk tekib, kui kasutaja sisend renderdatakse otse innerHTML kaudu?",
      options: [
        "XSS risk pahatahtliku skripti sisestuse kaudu",
        "CPU kasutus langeb nulli",
        "JSON failid muutuvad ainult-loetavaks",
        "Express lakkab tootamast",
      ],
      correctIndex: 0,
      explanation: "Otse innerHTML kasutus sisendiga voib lubada skripti sustimist.",
    },
    {
      difficulty: "hard",
      question: "Kuidas parandada kusimuste kvaliteeti, et need ei kontrolliks ainult malupohiseid fakte?",
      options: [
        "Lisada pohjenduspohised ja veaolukorra kusimused konkreetse loogika kohta",
        "Kusida ainult faililaiendite kohta",
        "Eemaldada selgitused vastustelt",
        "Kasutada alati sama 15 kusimust",
      ],
      correctIndex: 0,
      explanation: "Arusaamist kontrollivad pohjenduse, andmevoo ja erijuhtude teemad.",
    },
    {
      difficulty: "hard",
      question: "Mis annab opilasele koige rohkem oppimisvaartust peale vastamist?",
      options: [
        "Luhike selgitus, miks vastus oli oige voi vale",
        "Ainult punktisumma ilma tagasisideta",
        "Lehe automaatne sulgemine",
        "Juhusliku faili kustutamine",
      ],
      correctIndex: 0,
      explanation: "Selgitus aitab kinnistada kontseptsioone ja parandada arusaamist.",
    },
    {
      difficulty: "hard",
      question: `Milline allolev lahenemine vastab koige paremini noudele, et kontekst peab tulema assignment.md ja lahendusfailidest? (${topLines[0] || "ulesande pealkiri"})`,
      options: [
        "Koondada assignment.md + failide sisu uhtseks prompti sisendiks enne genereerimist",
        "Saata AI-le ainult faili nimed",
        "Genereerida kusimused ilma sisendita",
        "Kasutada ainult eelmise mangu tulemusi",
      ],
      correctIndex: 0,
      explanation: "Sisuline genereerimine eeldab nii nouete kui ka implementeeringu konteksti.",
    },
  ];

  return pool;
}

function normalizeQuestion(question, index) {
  return {
    level: index + 1,
    difficulty: question.difficulty,
    question: question.question,
    options: question.options,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };
}

function ensureDistribution(questions) {
  const easy = questions.filter((q) => q.difficulty === "easy");
  const medium = questions.filter((q) => q.difficulty === "medium");
  const hard = questions.filter((q) => q.difficulty === "hard");

  if (easy.length < 5 || medium.length < 5 || hard.length < 5) {
    throw new Error("Kusimuste raskusastmete jaotus on vigane");
  }
}

async function buildPromptPayload(task) {
  const promptTemplate = await fs.readFile(PROMPT_FILE, "utf8");
  return {
    promptTemplate,
    task,
  };
}

async function maybeGenerateWithAI(task) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  // Koht paris AI integratsiooni jaoks. Kui API voti on olemas,
  // voib siin teha valise mudeli kutse promptTemplate + task sisendiga.
  await buildPromptPayload(task);
  return null;
}

async function generateQuestionSet(task) {
  const aiQuestions = await maybeGenerateWithAI(task);
  const sourceQuestions = aiQuestions || buildFallbackQuestions(task);

  ensureDistribution(sourceQuestions);

  const easy = shuffle(sourceQuestions.filter((q) => q.difficulty === "easy")).slice(0, 5);
  const medium = shuffle(sourceQuestions.filter((q) => q.difficulty === "medium")).slice(0, 5);
  const hard = shuffle(sourceQuestions.filter((q) => q.difficulty === "hard")).slice(0, 5);

  return [...easy, ...medium, ...hard].map(normalizeQuestion);
}

async function generateHint(question) {
  const hints = [
    "Motle, milline variant kirjeldab pohjust, mitte pealiskaudset fakti.",
    "Seosta vastus assignment.md nouetega ja reaalse loogikaga.",
    "Vaata, milline vastus selgitab kasutaja tegevuse voi andmevoo pohjust.",
    "Oige vastus on tavaliselt see, mis parandab arusaadavust voi turvalisust.",
  ];

  if (question?.difficulty === "hard") {
    return "Motle skaleeritavuse, turvalisuse voi arhitektuuri vaatenurgast.";
  }

  return hints[Math.floor(Math.random() * hints.length)];
}

function normalizePoll(values) {
  const total = values.reduce((sum, val) => sum + val, 0);
  const rounded = values.map((val) => Math.round((val / total) * 100));
  const diff = 100 - rounded.reduce((sum, val) => sum + val, 0);
  rounded[0] += diff;
  return rounded;
}

function generateAudiencePoll(question) {
  const base = [18, 24, 28, 30].map((num) => num + Math.floor(Math.random() * 8));
  const correct = question.correctIndex;
  const boost = question.level <= 5 ? 20 : question.level <= 10 ? 12 : 6;

  base[correct] += boost;

  return normalizePoll(base).map((percent, index) => ({
    option: String.fromCharCode(65 + index),
    percent,
  }));
}

module.exports = {
  generateQuestionSet,
  generateHint,
  generateAudiencePoll,
};
