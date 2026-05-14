const fs = require("fs/promises");
const path = require("path");

const PROMPT_FILE = path.join(__dirname, "..", "..", "prompts", "question-generation.md");

const TECH_PATTERNS = [
  { key: "addEventListener", label: "DOM-sündmuste käsitlemine" },
  { key: "innerHTML", label: "DOM-i sisu lisamine innerHTML kaudu" },
  { key: "localStorage", label: "andmete salvestamine brauseri localStorage'is" },
  { key: "fetch(", label: "andmete toomine fetch API-ga" },
  { key: "JSON.parse", label: "JSON-andmete parsimine" },
  { key: "JSON.stringify", label: "JSON-serialiseerimine" },
  { key: "try", label: "veahaldus try/catch abil" },
  { key: "async", label: "asünkroonne loogika" },
  { key: "await", label: "asünkroonsete kutsete ootamine" },
  { key: "querySelector", label: "DOM-elementide valik querySelector-iga" },
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
  return found.length ? found : [{ label: "üldised programmeerimisvõtted", key: "general" }];
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
      question: `Mis on ülesande "${title}" peamine eesmärk?`,
      options: [
        "Veenduda, et lahendus vastab kõigile nõuetele",
        "Kontrollida, kas lahendus kasutab samu failinimesid",
        "Hinnata, kas server käivitub ilma lisaseadeteta",
        "Võrrelda, kas HTML struktuur järgib näidist",
      ],
      correctIndex: 0,
      explanation: "Hindamine keskendub sellele, kas lahendus vastab ülesande nõuetele.",
    },
    {
      difficulty: "easy",
      question: "Miks on assignment.md hindamise jaoks oluline?",
      options: [
        "Selles on kirjas ülesande eesmärk ja nõuded",
        "Selles on kirjas serveri käivitamise käsud",
        "Selles on kirjas kasutajaliidese värvivalik",
        "Selles on kirjas automaattestide oodatud tulemused",
      ],
      correctIndex: 0,
      explanation: "assignment.md annab hindamise aluseks oleva konteksti: nõuded ja kriteeriumid.",
    },
    {
      difficulty: "easy",
      question: "Mis on lahenduse koodi lugemise roll AI hindamises?",
      options: [
        "Näidata, kuidas nõuded on koodi kaudu teostatud",
        "Kuvada, milliseid failinimesid lahendus kasutab",
        "Kontrollida, kas kood järgib sama vormingut",
        "Leida, kus asuvad kommentaarid ja metaandmed",
      ],
      correctIndex: 0,
      explanation: "Koodi analüüs paljastab, kas nõuded said tegelikult implementeeritud.",
    },
    {
      difficulty: "easy",
      question: "Miks tuleks küsimusi iga mängu alguses varieerida?",
      options: [
        "Et vältida olukorda, kus kasutaja õpib vastuseid pähe",
        "Et muuta serveri vastused iga kord pikemaks",
        "Et lühendada hindamise täitmise aega",
        "Et muuta kasutajaliidese stiili iga käigu jaoks",
      ],
      correctIndex: 0,
      explanation: "Variatsioon aitab kontrollida tegelikku arusaamist, mitte meeldejätmist.",
    },
    {
      difficulty: "easy",
      question: "Miks on nelja valikuvõimaluse kasutamine mängu jaoks otstarbekas?",
      options: [
        "See sobib Miljonimängu vormi ja jätab piisavalt valikuid",
        "See tähendab, et õige vastus on alati samal kohal",
        "See on tingitud JSON-formaadi piirangutest",
        "See on vajalik CSS paigutuse tõttu",
      ],
      correctIndex: 0,
      explanation: "Neli valikut on piisav kompromiss raskuse ja juhuslikkuse vahel mängu formaadis.",
    },
    {
      difficulty: "medium",
      question: `Kui lahenduses kasutatakse \"${technologies[0].label}\", mida hindamine prioriteetina kontrollida?`,
      options: [
        "Kas see lahendab ülesande nõuded ja on kasutatud õigesti",
        "Kas programmeerija valis selle nime järgi funktsioonile",
        "Kas HTML leht näitab selle rakendamise tulemusi",
        "Kas serveri seadete fail sisaldab selle viiteid",
      ],
      correctIndex: 0,
      explanation: "Iga tehnoloogia kasutus tuleb valideerida ülesande konteksti vastu.",
    },
    {
      difficulty: "medium",
      question: "Kuidas mõjub hindamise täpsus, kui lugeda ainult assignment.md?",
      options: [
        "Hindamine jääb pealiskaudseks, sest koodi teostust ei kontrollita",
        "Hindamine muutub automaatselt täpsemaks ainult teksti põhjal",
        "Lahenduse serveri osa paraneb iseseisva hindamise kaudu",
        "Õpilase punktid arvutatakse täpsemalt kui koodi põhjal",
      ],
      correctIndex: 0,
      explanation: "Ilma kood analyse ei saa hindamise täielikkust garanteerida.",
    },
    {
      difficulty: "medium",
      question: "Millal on vajalik node_modules ja .git kauste välja jätmine?",
      options: [
        "Et vältida mitteotseselt seotud failide konteksti lisamist",
        "Et kiirendada serveri käivitamist iga hindamise ajal",
        "Et kaitsta kasutaja andmeid failide võrgu ülekande eest",
        "Et vähendada hindamise jaoks kuluvat aega",
      ],
      correctIndex: 0,
      explanation: "Ebaolulised kaustadest lisavad müra ja moonutavad hindamise konteksti.",
    },
    {
      difficulty: "medium",
      question: "Kuidas toetab raskusastmete jaotus õppija arusaamise hindamist?",
      options: [
        "See võimaldab eristada algteadmisi, loogikat ja analüüsi",
        "See määrab, kui kiiresti serveri vastused peaksid jõudma",
        "See tagab, et õpilase punktid kasvavad võrdsete sammudega",
        "See tuleb brauseri funktsioonide standardist",
      ],
      correctIndex: 0,
      explanation: "Järkjärguline raskenemine eraldab erinevaid arusaamise tasemeid.",
    },
    {
      difficulty: "medium",
      question: hasManyFiles
        ? "Mitme failiga lahendused - milleks on oluline kogu kood analüüsida?"
        : "Lihtsa lahendusega - kuidas täielik kontroll tagada?",
      options: hasManyFiles
        ? [
            "Et vältida oluliste osade jäämist analüüsist tähelepanuta",
            "Et serveris jooksvad protsessid saaksid käivitussignaali",
            "Et kogu andmebaas vormistataks standardsel kujul",
            "Et brauseri ajalugu kustuks iga hindamise käigus",
          ]
        : [
            "Kontrollida assignment.md vastavust koodi teostusele",
            "Muutke kõik JavaScripti funktsioonid globaalseks",
            "Eemaldada koodist põhjendavad kommentaarid",
            "Kaardistada kõik HTML elemendid andmebaasi tabelisse",
          ],
      correctIndex: 0,
      explanation: "Terviklik analüüs on vajalik hindamise jaoks.",
    },
    {
      difficulty: "hard",
      question: "Kuidas lahendada skaleeritavuse väljakutse, kui lisada mitut ülesannet?",
      options: [
        "Kasutada dünaamilist failide lugemist eraldi kaustadest",
        "Kirjutada kõik ülesanded hardkodeeritult ühte põhifaili",
        "Salvestada kõik küsimused piltidena serveris",
        "Nõuda kasutajatelt käsitsi küsimuste valimist",
      ],
      correctIndex: 0,
      explanation: "Dünaamiline struktuur võimaldab ülesandeid lisada ilma arhitektuuri muutmiseta.",
    },
    {
      difficulty: "hard",
      question: "Milline turvalisuse risk tekib, kui sisend renderdatakse otse?",
      options: [
        "XSS riskid pahatahtlike skriptide kaudu",
        "CPU kasutamine langeb nulli ja server peatub",
        "JSON failid muutuvad kirjutuskaitseks ilma muudatuseta",
        "Express serveri protsess teisaldatakse teisesse pordisse",
      ],
      correctIndex: 0,
      explanation: "Otse sisendi renderdamine võib XSS rünnakuid võimaldada.",
    },
    {
      difficulty: "hard",
      question: "Kuidas tõsta küsimuste kvaliteeti faktipõhisest kontrollimisest?",
      options: [
        "Lisada põhjenduse, andmevoo ja eriolukordade küsimusi",
        "Küsida ainult faililaiendite ja nimetuste kohta",
        "Eemaldada selgitused korrektse vastuse juurest",
        "Kasutada igal käigul täpselt sama 15 küsimust",
      ],
      correctIndex: 0,
      explanation: "Arusaamist kontrollivad põhjendused ja keerulisemad stsenaariumid.",
    },
    {
      difficulty: "hard",
      question: "Milline komponent annab õpilasele kõige rohkem õppimist?",
      options: [
        "Selgitus, miks vastus oli õige või vale",
        "Ainult arvuline tulemus ilma tagasisideta",
        "Automaatne lehe sulgemine vastuse järel",
        "Juhuslik failide kustutamine serveri seadetes",
      ],
      correctIndex: 0,
      explanation: "Tagasiside selgitused kinnistavad õppimist ja arusaamist.",
    },
    {
      difficulty: "hard",
      question: `Kuidas kombineerida assignment.md ja koodi optimaalselt? (${topLines[0] || "ülesande kirjeldus"})`,
      options: [
        "Koondada mõlemad sisenditeks enne küsimuste genereerimist",
        "Saata AI-le ainult failinimede ja kausta struktuuri",
        "Genereerida küsimused juhuslike andmete järgi",
        "Kasutada vaid eelmiste katsete tulemusi",
      ],
      correctIndex: 0,
      explanation: "Kombineeritud kontekst tagab kvaliteetse küsimuste genereerimise.",
    },
  ];

  return pool;
}

function shuffleOptions(question) {
  // Loome indeksite massiivi [0, 1, 2, 3]
  const indices = [0, 1, 2, 3];
  
  // Segame indeksite järjestust
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // Uus correctIndex vastab segatud vastuste asukohaele
  const newCorrectIndex = indices.indexOf(question.correctIndex);
  
  // Segame vastused vastavalt uutele indeksitele
  const shuffledOptions = indices.map(i => question.options[i]);
  
  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
  };
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
    throw new Error("Küsimuste raskusastmete jaotus on vigane");
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

  // Koht päris AI-integratsiooni jaoks. Kui API võti on olemas,
  // võib siin teha valiku mudeli kutse promptTemplate + task sisendiga.
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

  // Segame iga küsimuse vastuseid
  const allQuestions = [...easy, ...medium, ...hard].map(shuffleOptions);
  
  return allQuestions.map(normalizeQuestion);
}

async function generateHint(question) {
  const hints = [
    "Mõtle, milline variant kirjeldab põhjust, mitte pealiskaudset fakti.",
    "Seosta vastus assignment.md nõuetega ja reaalse loogikaga.",
    "Vaata, milline vastus selgitab kasutaja tegevuse või andmevoo põhjust.",
    "Õige vastus on tavaliselt see, mis parandab arusaadavust või turvalisust.",
  ];

  if (question?.difficulty === "hard") {
    return "Mõtle skaleeritavuse, turvalisuse või arhitektuuri vaatenurgast.";
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
