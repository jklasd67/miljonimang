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

function buildTaskSpecificQuestions(task) {
  const taskId = task.id;
  const solutionContent = task.solutionFiles.map(f => f.content).join("\n");

  // Task 001: JavaScript Calculator
  if (taskId === "001") {
    return [
      {
        difficulty: "easy",
        question: "Miks on oluline kasutaja sisend Number() funktsiooniga teisendada?",
        options: [
          "Et teisendada teksti arvuks, et matemaatilised operatsioonid töötaksid",
          "Et muuta arvu tekstiks kuvamisel",
          "Et eemaldada sisendist tühikud",
          "Et valideerida, et sisend on number",
        ],
        correctIndex: 0,
        explanation: "Number() teisendab stringi arvuliseks väärtuseks, mis on liitmiseks vajalik.",
      },
      {
        difficulty: "easy",
        question: "Mida teeb preventDefault() vormi submit-sündmusel?",
        options: [
          "Takistab lehekülje värskendamist ja võimaldab JavaScriptis sisendi töödelda",
          "Peatab JavaScript'i täitamise",
          "Salvestab andmed automaatselt",
          "Peidab vormi",
        ],
        correctIndex: 0,
        explanation: "preventDefault() takistab vaikimisi vormi käitumist, mis lubab AJAX-tüüpi töötlemist.",
      },
      {
        difficulty: "easy",
        question: "Kuidas kuvatakse kalkulaatori tulemus?",
        options: [
          "Tekstikontentina HTML elemendis, ilma lehte värskendamata",
          "Lehekülje automaatne värskendamine",
          "Uuele lehele suunamine",
          "Brauseri konsoolis",
        ],
        correctIndex: 0,
        explanation: "textContent atribuut muudab HTML elemendi sisu, ilma lehte värskendamata.",
      },
      {
        difficulty: "easy",
        question: "Mis juhtub, kui kasutaja sisestab mittearve?",
        options: [
          "Number.isNaN() tuvastab seda ja kuvatakse veateade",
          "Rakendus hangub",
          "Tulemus on juhuslik",
          "Sisend ignoreeritakse",
        ],
        correctIndex: 0,
        explanation: "isNaN() kontrollib, kas Number() konversioon ebaõnnestus.",
      },
      {
        difficulty: "easy",
        question: "Milline HTML element on kalkulaatori tulemuste kuvaamiseks sobiv?",
        options: [
          "Mis tahes element (div, p, span), millele saab textContent kaudu sisu lisada",
          "Ainult HTML-i span element",
          "Ainult HTML-i div element",
          "Vaid form element",
        ],
        correctIndex: 0,
        explanation: "Mis tahes HTML element sobib, kunagi saab selle textContent'i muuta.",
      },
      {
        difficulty: "medium",
        question: "Miks on vea käsitlemise loogika kalkulaatoris oluline?",
        options: [
          "Et kasutaja saaks aru, miks tulemus ei kuvatunud",
          "Et teha koodi kiiremaks",
          "Et salvestada andmeid",
          "Et varjata koodi detaile",
        ],
        correctIndex: 0,
        explanation: "Hea veatöötlus parandab kasutajakogemust ja selgitab probleeme.",
      },
      {
        difficulty: "medium",
        question: "Kuidas muutuks lahendus, kui tehaks kaks operatsiooni (liitmine ja lahutamine)?",
        options: [
          "Lisatakse if/else loogika operatsiooni valimiseks",
          "Kogu kood tuleb uuesti kirjutada",
          "Ei ole võimalik teha",
          "Muudetakse HTML struktuuri",
        ],
        correctIndex: 0,
        explanation: "Algoritm jääks samaks, lisataks valiku loogika.",
      },
      {
        difficulty: "medium",
        question: "Mis on addEventListener'i roll selles lahenduses?",
        options: [
          "Seob form'i submit-sündmuse JavaScript funktsiooniga",
          "Muudab vormi kuvandit",
          "Salvestab vormi andmeid",
          "Valideerib vormi",
        ],
        correctIndex: 0,
        explanation: "addEventListener registreerib funktiooni, mis käivitub sündmuse korral.",
      },
      {
        difficulty: "hard",
        question: "Kuidas käsitletakse nulliga jagamist, kui see oleks lahenduses?",
        options: [
          "Tuleks lisada kontroll operatsiooni eel, et vältida undefined tulemust",
          "JavaScript käsitleb seda automaatselt",
          "Kalkulaator hangub",
          "Tulemus on alati 0",
        ],
        correctIndex: 0,
        explanation: "Edge case'id nagu nulliga jagamine vajaksid eraldi valideerimist.",
      },
      {
        difficulty: "hard",
        question: "Kuidas parandaks lahenduse turvalisust, kui see oleks serveriga ühendatud?",
        options: [
          "Valideerida sisend ka serveripoolel, et vältida vigase andme töötlemist",
          "Saata kõik andmed krüpteerimata",
          "Kustutada validatsioon",
          "Hoida salasõnu JavaScriptis",
        ],
        correctIndex: 0,
        explanation: "Serveripoolne valideerimine on oluline turvalisuse jaoks.",
      },
      {
        difficulty: "hard",
        question: "Milline on selle lahenduse suurim piirang?",
        options: [
          "Ainult ühe operatsiooni toetamine (liitmine)",
          "HTML struktuuri piirangud",
          "Browser'i mälu piirangud",
          "CSS stiilid piiravad funktsioonid",
        ],
        correctIndex: 0,
        explanation: "Lahendus on lihtsustatud, et näidata põhiprintsiipe.",
      },
      {
        difficulty: "hard",
        question: "Kuidas testida, kas kalkulaator töötab õigesti?",
        options: [
          "Testida erinevate sisendite kombinatsioonidega, sealhulgas negatiivid, nullid ja mittearved",
          "Jooksutada koodi ja vaadata tulemusi",
          "Uskuda, et see töötab",
          "Küsida kellelt teiselt",
        ],
        correctIndex: 0,
        explanation: "Süstemaatiline testimine covers edge cases ja erinevad stsenaariumid.",
      },
      {
        difficulty: "hard",
        question: "Mida peaks kalkulaator tegema, kui sisendite mahud on väga suured?",
        options: [
          "Number() ja JavaScript käitlevad suuri numbreid, kuid täpsus võib väheneneda",
          "Rakendus hangub",
          "Tulemus on alati 0",
          "Brauserid ei toeta suuri numbreid",
        ],
        correctIndex: 0,
        explanation: "Numbrite suurusega seotud piirangud on JavaScript'i teema.",
      },
      {
        difficulty: "medium",
        question: "Kuidas võiks kalkulaatorit laiendada, et käsitleda rohkem operatsioone?",
        options: [
          "Lisada nupp/valik iga operatsiooni jaoks ja vastavad if/else harud",
          "Muuta järjekord elementide",
          "Eemaldada kogu JavaScript",
          "Muuta HTML völi teksti",
        ],
        correctIndex: 0,
        explanation: "Disain-muster ei muutu, lisatakse ainult operatsioonide loogika.",
      },
      {
        difficulty: "medium",
        question: "Kas kalkulaatori lahenduses on potentsiaalne viga, kui sisend on tühja?",
        options: [
          "Jah, Number('') tagastab 0, mis võib tuua vea summat",
          "Ei, tühja pole võimalik sisestada",
          "Kalkulaator automaatselt värskendab",
          "Viga tekib alati",
        ],
        correctIndex: 0,
        explanation: "Edge case: tühja sisendi käsitlemise loogika on oluline.",
      },
    ];
  }

  // Task 002: JSON data display
  if (taskId === "002") {
    return [
      {
        difficulty: "easy",
        question: "Miks kasutatakse fetch API-t selles lahenduses?",
        options: [
          "Et laadida andmeid JSON-failist brauseris käivitatavalt",
          "Et muuta JSON faile",
          "Et salvestada andmeid",
          "Et peidata koodi",
        ],
        correctIndex: 0,
        explanation: "Fetch API võimaldab asünkroonselt andmeid laadida ilma lehte värskendamata.",
      },
      {
        difficulty: "easy",
        question: "Kuidas eraldatakse andmete laadimine ja renderdamine?",
        options: [
          "Erinevad funktsioonid (init ja render) käitlevad erinevaid ülesandeid",
          "Ainult üks funktsioon teeb kõike",
          "HTML teeb kõik",
          "Ei ole eraldamist",
        ],
        correctIndex: 0,
        explanation: "Erinevate funktsioonide kasutamine muudab koodi paremini hallataavaks.",
      },
      {
        difficulty: "easy",
        question: "Mida teeb res.json() fetch vastuses?",
        options: [
          "Teisendab JSON teksti JavaScripti objektiks",
          "Salvestab andmeid",
          "Valideerib JSON'i",
          "Saadab andmeid serverile",
        ],
        correctIndex: 0,
        explanation: "json() meetod parsib JSON stringi JavaScripti objektiks.",
      },
      {
        difficulty: "easy",
        question: "Kuidas kuvatakse iga item lahenduses?",
        options: [
          "Eraldi article elemendina, kasutades map() ja innerHTML",
          "Ühe suurena tekstina",
          "Tabelina",
          "Ei kuvata",
        ],
        correctIndex: 0,
        explanation: "map() loob iga item kohta article elemendi.",
      },
      {
        difficulty: "medium",
        question: "Mida teeb try/catch blokk selles lahenduses?",
        options: [
          "Käsitleb fetch või parse'i vigu ja kuvab veateate kasutajale",
          "Kiirendab andmete laadimist",
          "Valideerib JSON-i",
          "Varjab vigu",
        ],
        correctIndex: 0,
        explanation: "Try/catch püüab vigu ja kuvab kasutajale arusaadava sõnumi.",
      },
      {
        difficulty: "medium",
        question: "Milline on probleem, kui üks kirje data.items massiivissa puudub?",
        options: [
          "map() ei käivitu selle kirje jaoks, kuid teised töötavad",
          "Kogu rakendus hangub",
          "Ei midagi",
          "HTML muutub vigaseks",
        ],
        correctIndex: 0,
        explanation: "map() itereerib ainult olemasolevatel elementidel.",
      },
      {
        difficulty: "medium",
        question: "Kuidas muutub lahendus, kui JSON fail ei ole kättesaadav?",
        options: [
          "catch blokk tabab vea ja kuvab 'Andmete laadimine ebaõnnestus'",
          "Ei midagi ei juhtu",
          "Rakendus hangub",
          "Vaikimisi andmed kuvatakse",
        ],
        correctIndex: 0,
        explanation: "Fetch lõpetamisel (404 jne) saadetakse error catch plokki.",
      },
      {
        difficulty: "hard",
        question: "Kuidas käsitletakse suurt andmemassiivi selle lahenduses?",
        options: [
          "Kõik andmed laetakse korraga ja kuvatakse, mis võib olla aeglane",
          "Automaatselt pagineeritakse",
          "Andmeid otsinguks filtreeritakse",
          "Ei kuvataks üldse",
        ],
        correctIndex: 0,
        explanation: "Praegune lahendus ei skaleerita hästi suurte andmete puhul.",
      },
      {
        difficulty: "hard",
        question: "Milline turvalisuse oht võib tekkida, kui innerHTML-i kasutatakse otseselt?",
        options: [
          "XSS riskid, kui item.name sisaldab pahatahtlikku JavaScripti",
          "Ei ole ohtusid",
          "Andmed kustutatakse",
          "Fetch ei tööta",
        ],
        correctIndex: 0,
        explanation: "innerHTML kasutusel peab sisendeid valideerima, et vältida XSS rünnakuid.",
      },
      {
        difficulty: "hard",
        question: "Kuidas parandaks lahenduse andmete käsitlemise loogika suurte failide puhul?",
        options: [
          "Implementeerida laadilehekülgede või virtuaalse keraamise tehnika",
          "Kustutada kogu koodi",
          "Jätta käitamata",
          "Muuta JSON failiformaati",
        ],
        correctIndex: 0,
        explanation: "Suured andmekogumid nõuavad spetsiaalse käsitlemise strateegia.",
      },
      {
        difficulty: "hard",
        question: "Kas lahenduses on potentsiaalne veaotse, mis tekib tühja massiivi puhul?",
        options: [
          "Jah, kui data.items pole massiiv või on tühi, võib map() ebaõnnestuda",
          "Ei, see on alati turvaliselt käsitletud",
          "Kalkulaator hangub",
          "Kõik töötab",
        ],
        correctIndex: 0,
        explanation: "Edge case: valideerimise puudumine tühja andmete puhul.",
      },
      {
        difficulty: "medium",
        question: "Kuidas kontrollida, et fetch sobib asünkroonsel?",
        options: [
          "async/await võimaldab fetch'i kasutada sünkroonse koodi kujul",
          "fetch on alati sünkroonne",
          "Ei ole erinevust",
          "Async ei toimi fetch'iga",
        ],
        correctIndex: 0,
        explanation: "async/await syntaks muudab asünkroonsete operatsioonide käsitlemise lihtsamaks.",
      },
      {
        difficulty: "medium",
        question: "Millised on JSON.parse() võimalikud vead?",
        options: [
          "Vigane JSON süntaks tekitab ParseError",
          "Kõik JSON on alati validt",
          "Parse ei kunagi ebaõnnestub",
          "Parse ei ole vajalik",
        ],
        correctIndex: 0,
        explanation: "res.json() teeb parse'i ja viga saadab catch plokki.",
      },
    ];
  }

  // Task 003: Todo data persistence
  if (taskId === "003") {
    return [
      {
        difficulty: "easy",
        question: "Miks on oluline to-do andmete JSON-failist laadimine rakenduse alguses?",
        options: [
          "Et taastada olemasolevad ülesanded ja neid muuta",
          "Et kustutada kõik andmed",
          "Et valgeks teha kõik",
          "Et peidata andmeid",
        ],
        correctIndex: 0,
        explanation: "Algandmete laadimine tagab, et kasutaja näeb oma varasemate ülesannete andmeid.",
      },
      {
        difficulty: "easy",
        question: "Kuidas käsitletakse olukorda, kus JSON fail ei eksisteeri?",
        options: [
          "Path.exists() kontrollimisega ja tühjade andmetega käitlemisega",
          "Rakendus hangub",
          "Kõik andmed kustutatakse",
          "Vaikefail luuakse automaatselt",
        ],
        correctIndex: 0,
        explanation: "Vigane fail jätmine peab olema planeeritud ja hallatud.",
      },
      {
        difficulty: "easy",
        question: "Mida teeb JSON.loads() Python'is selles lahenduses?",
        options: [
          "Teisendab JSON teksti Python dictionarys",
          "Salvestab JSON faili",
          "Kustutab JSON andmed",
          "Valideerib JSON'i",
        ],
        correctIndex: 0,
        explanation: "json.loads() deserializeerib JSON stringi Python objektiks.",
      },
      {
        difficulty: "easy",
        question: "Kuidas salvestatakse andmeid JSON faili?",
        options: [
          "JSON.dumps() abil, mis konverteerib objekti JSON stringiks",
          "Otse objekti kirjutatakse failisse",
          "Andmeid ei salvestata",
          "Automaatne salvestamine",
        ],
        correctIndex: 0,
        explanation: "json.dumps() serialiseerib Python objekti JSON stringiks.",
      },
      {
        difficulty: "easy",
        question: "Mis on JSON faili otstarve selles lahenduses?",
        options: [
          "Andmete püsiv salvestamine, et rakendus pääseb juurde andmetele käivitamiste vahel",
          "Ajutine salvestamine",
          "Andmete krüpteerimine",
          "Logi kirjutamine",
        ],
        correctIndex: 0,
        explanation: "JSON fail säilitab andmeid ka pärast rakenduse sulgemist.",
      },
      {
        difficulty: "medium",
        question: "Miks peab andmestruktuur jääma samaks laadimisel ja salvestamisel?",
        options: [
          "Et koodi saaks teistel ja et andmete joonus oleks ühtselt hallatud",
          "Andmestruktuur võib muutuda",
          "Strukturuur ei oma tähtsust",
          "Iga operatsioon on iseseisvalt",
        ],
        correctIndex: 0,
        explanation: "Andmestruktuur ühtlus tagab, et andmeid saab eri koodist kasutada.",
      },
      {
        difficulty: "medium",
        question: "Millised on load_data() ja save_data() funktsioonide rollid?",
        options: [
          "Eralda failide operatsioonid, et teha kood paindlikuks ja taaskasutavaks",
          "Ei ole erilised rollid",
          "Üks funktsioon teeb kõike",
          "Funktsioonid ei ole vajalikud",
        ],
        correctIndex: 0,
        explanation: "Eristatut funktsioonid muudavad koodi paindlikumaks.",
      },
      {
        difficulty: "medium",
        question: "Kuidas käsitletakse JSON parse vigu, kui fail on vigane?",
        options: [
          "Try/except plokiga, et püüda viga ja tagastada tühja loend",
          "Ei käsitleta",
          "Rakendus hangub",
          "Andmed kustutatakse",
        ],
        correctIndex: 0,
        explanation: "Vigase JSON käsitlemise peab olema planeeritud.",
      },
      {
        difficulty: "hard",
        question: "Milline on suurim oht, kui mitme kasutaja muudab sama JSON faili?",
        options: [
          "Samaaegne kirjutamine võib viia andmete kaotamisele",
          "Ei ole ohtusid",
          "Andmed dubleeritakse",
          "Failist lugemist pole võimalik",
        ],
        correctIndex: 0,
        explanation: "Concurrency probleem: ilma lukakita võib tekkida race condition.",
      },
      {
        difficulty: "hard",
        question: "Kuidas parandaks lahenduse turvalisust, kui see oleks veebirakendus?",
        options: [
          "Andmeid peaks salvestama turvaliselt, koos autentimine ja valideerimisega",
          "Kõik andmed oleksid avalikud",
          "Turvalisus pole oluline",
          "JSON andmeid ei pea salvestama",
        ],
        correctIndex: 0,
        explanation: "Veebirakenduses tuleb kaaluda turvalisust, et kaitsta kasutaja andmeid.",
      },
      {
        difficulty: "hard",
        question: "Kuidas testimise käigus kontrollib, et andmete salvestus töötab?",
        options: [
          "Lisada, muuta, kustutada andmeid ja kontrollida, et JSON fail uueneb õigesti",
          "Ainult etteantud testid jooksutada",
          "Ei testi midagi",
          "Käsitsi faili kontrollida",
        ],
        correctIndex: 0,
        explanation: "Süstemaatiline testimine tagab, et salvestus töötab õigesti.",
      },
      {
        difficulty: "hard",
        question: "Milline on lahenduse suurim piirang suurte andmekoguste puhul?",
        options: [
          "Kogu fail laetakse mällu, mis võib olla aeglane suurte failide puhul",
          "JSON ei toeta suuri andmekoguseid",
          "Failist lugemine on alati kiire",
          "Piirangud puuduvad",
        ],
        correctIndex: 0,
        explanation: "Failipõhine salvestus ei skaleerita hästi.",
      },
      {
        difficulty: "medium",
        question: "Kuidas andmeid sorteerida, filteerida või otsida laaditud loendes?",
        options: [
          "Python'i list meetodeid kasutades (filter, sort, jne)",
          "Ei ole võimalik",
          "JSON failist otsida",
          "Andmeid ei ole võimalik töödelda",
        ],
        correctIndex: 0,
        explanation: "Andmete manipulatsioon toimub koodi tasandil pärast laadimist.",
      },
    ];
  }

  // Task 004: Form validation and submission
  if (taskId === "004") {
    return [
      {
        difficulty: "easy",
        question: "Miks on form validatsioon kahesuunaline (klient ja server)?",
        options: [
          "Et tagada, et andmed on turvalisel viisil küljestatse, isegi kui klient on blokeeritud",
          "Et muuta rakendust kiiremaks",
          "Et salvestada andmeid kaks korda",
          "Serveripoolne valideerimine ei ole vajalik",
        ],
        correctIndex: 0,
        explanation: "Serveripoolne valideerimine on oluline, kuna kliendi skripte saab bypäss'ida.",
      },
      {
        difficulty: "easy",
        question: "Mida teeb preventDefault() vormi submit'il?",
        options: [
          "Takistab lehekülje värskendamist ja võimaldab JavaScriptis taotluse käsitleda",
          "Peatab JavaScripti täitamise",
          "Saadab vormi otse",
          "Valideerib automaatselt",
        ],
        correctIndex: 0,
        explanation: "preventDefault() võimaldab axios/fetch abil andmete saatmist.",
      },
      {
        difficulty: "easy",
        question: "Kuidas valideerida e-maili vormingut regulaaravaldise abil?",
        options: [
          "Regulaaravaldisega, mis kontrollib @ ja .esinemist",
          "Ei ole võimalik",
          "E-post on alati õige",
          "Serveril on ainus kontrollimine",
        ],
        correctIndex: 0,
        explanation: "Regex kontrollimisega saab põhilise e-maili valideerimise teha.",
      },
      {
        difficulty: "easy",
        question: "Kuidas saadatakse andmeid JSON-kujul POST meetodil?",
        options: [
          "fetch() koos JSON.stringify() ja Content-Type headeriga",
          "GET meetodil andmeid saata",
          "form.submit() otse",
          "Andmeid ei saadeta",
        ],
        correctIndex: 0,
        explanation: "fetch() POST + headers on JSON andmete edastamise standard viis.",
      },
      {
        difficulty: "easy",
        question: "Milleks on vaja vormi form-elementidele name atribuuti?",
        options: [
          "Et saada andmeid document.querySelector abil ja koostada JSON objekt",
          "Et muuta vormi välimuselt",
          "Et salvestada andmeid",
          "Name ei ole oluline",
        ],
        correctIndex: 0,
        explanation: "name atribuut võimaldab JavaScriptis väljade väärtustele juurde pääseda.",
      },
      {
        difficulty: "medium",
        question: "Mida teeb trim() kasutaja sisendis?",
        options: [
          "Eemaldab juhtivad ja tagajärellised tühikud",
          "Konverteerib tekstiks",
          "Valideerib sisu",
          "Krüpteerib andmeid",
        ],
        correctIndex: 0,
        explanation: "trim() puhastab sisendist tühikud, et vältida vigade 'puhas väljad' tõttu.",
      },
      {
        difficulty: "medium",
        question: "Milline on regex /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ eesmärk?",
        options: [
          "Kontrollida, et e-mail sisaldab @ ja . ning ainult mittespetsiaalseid märke",
          "Kõigi märkide lubamine",
          "Ei ole tähtsust",
          "Teisendada e-post",
        ],
        correctIndex: 0,
        explanation: "See regex vastab lihtsa e-maili mustrile, kuigi pole täielik.",
      },
      {
        difficulty: "medium",
        question: "Mida teeb fetch().then((res) => res.json())?",
        options: [
          "Oodab vastust ja teisendab selle JSON objektiks",
          "Saadab andmeid",
          "Valideerib vastust",
          "Suleb ühenduse",
        ],
        correctIndex: 0,
        explanation: "then() chain'iga käsitletakse vastust ja parsed JSON.",
      },
      {
        difficulty: "hard",
        question: "Mida peaks tegema, kui serverist tuleb viga?",
        options: [
          "Catch plokis püüda viga ja kuvada kasutajale arusaadav sõnum",
          "Ignoreerida viga",
          "Rakendus hangub",
          "Andmed kustutatakse",
        ],
        correctIndex: 0,
        explanation: "Vigade käsitlemise user feedback annab kasutajale selge sõnumi.",
      },
      {
        difficulty: "hard",
        question: "Kuidas e-maili validatsioon erineb eri platvormides?",
        options: [
          "Serveripoolne valideerimine peaks olema range, kuna brauser on nõrk",
          "Kõik platvormid on samad",
          "Ei ole erisusi",
          "E-mail pole vajalik",
        ],
        correctIndex: 0,
        explanation: "Serveripoolne valideerimine peab olema range, kuna klient võib bypass'ida.",
      },
      {
        difficulty: "hard",
        question: "Milline turvalisuse oht tekib, kui kasutaja andmeid otse HTML-sse sisestada?",
        options: [
          "XSS risk, kui kasutaja sisestab pahatahtliku JavaScripti",
          "Ei ole ohtusid",
          "Andmed salvestatakse turvalisle",
          "Kõik on turvalisel",
        ],
        correctIndex: 0,
        explanation: "innerHTML kasutamine võib võimaldada XSS rünnakuid.",
      },
      {
        difficulty: "hard",
        question: "Kuidas kontrollida, et POST päringu body on õigesti JSON-formaadis?",
        options: [
          "Serveril Content-Type kontrollimisega ja JSON parse testimisega",
          "Ei ole kontrollid vajalikud",
          "Brauseris on alati õige",
          "Formatil pole tähtsust",
        ],
        correctIndex: 0,
        explanation: "Serveri poolne validatsioon tagab andmete õigsuse.",
      },
      {
        difficulty: "medium",
        question: "Mida tehakse, kui mõlemad väljad on tühjad?",
        options: [
          "Kuvatakse veateade ja andmeid ei saadeta",
          "Andmeid saadatakse niikuinii",
          "Kumbagi välja ei kontrollita",
          "Andmeid filtreeritakse",
        ],
        correctIndex: 0,
        explanation: "Validatsioon peab kontrollima kõiki nõutavaid välju.",
      },
      {
        difficulty: "medium",
        question: "Kuidas parandada UX-i valideerimisel näidates reaalajas vigasid?",
        options: [
          "Lisada event listener'id ja näidata vigu reaalajas, kui kasutaja tipib",
          "Vigasid näidatakse pärast submitimist",
          "Vigu pole näha",
          "UX pole oluline",
        ],
        correctIndex: 0,
        explanation: "Reaalajaline tagasiside parandab kasutaja kogemust.",
      },
    ];
  }

  return [];
}

function buildFallbackQuestions(task) {
  const technologies = detectTechnologies(task);
  const topLines = firstLines(task.assignment, 10);
  const title = task.title;
  const fileNames = task.solutionFiles.map((f) => f.path);
  const taskSpecificPool = buildTaskSpecificQuestions(task);
  if (taskSpecificPool.length > 0) {
    return taskSpecificPool;
  }

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

function findProvidedQuestions(task) {
  if (!task || !Array.isArray(task.solutionFiles)) return null;

  const qFile = task.solutionFiles.find((f) => f.path.toLowerCase().endsWith("questions.json"));
  if (!qFile) return null;

  try {
    const parsed = JSON.parse(qFile.content);
    if (!Array.isArray(parsed) || parsed.length !== 15) return null;

    // basic validation: each question should have 4 options and a correctIndex
    for (const q of parsed) {
      if (!Array.isArray(q.options) || q.options.length !== 4) return null;
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) return null;
      // ensure textual fields exist
      if (typeof q.question !== "string" || typeof q.explanation !== "string") return null;
    }

    return parsed.map((q, idx) => ({
      level: q.level || idx + 1,
      difficulty: q.difficulty || (idx < 5 ? "easy" : idx < 10 ? "medium" : "hard"),
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));
  } catch (e) {
    return null;
  }
}

async function generateQuestionSet(task) {
  // Kui ülesande kaustas on pakutud questions.json, kasutame seda eelistatult
  const provided = findProvidedQuestions(task);
  if (provided) {
    ensureDistribution(provided);
    console.log(`Using provided questions.json for task ${task?.id || '<unknown>'}`);
    const shuffled = provided.map(shuffleOptions);
    return shuffled.map(normalizeQuestion);
  }

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
