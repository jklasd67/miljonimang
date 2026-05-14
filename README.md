# Miljonimäng

## Projekti kirjeldus
Miljonimäng on veebirakendus, mis kontrollib, kas õppija saab aru ülesande lahendusest.
Küsimused luuakse assignment.md ja lahendusfailide põhjal ning mäng järgib miljonimängu loogikat.

## Kasutatud tehnoloogiad
- Node.js
- Express
- Vanilla JavaScript (frontend)
- HTML + CSS

## Käivitamise juhend
1. Paigalda sõltuvused:
   - `npm install`
2. Käivita rakendus:
   - `npm start`
3. Ava brauseris:
   - `http://localhost:3000`

Arendusrežiim:
- `npm run dev`

## Input-kausta struktuur
Rakendus loeb ülesandeid kaustast input/.
Iga ülesanne on eraldi numbrilises kaustas.

Näide:

input/
  001/
    assignment.md
    index.html
    script.js
  002/
    assignment.md
    src/
      app.js
      data.json

Nõue:
- Igas ülesandes peab olema assignment.md.
- Ülejäänud failid on vabas vormis.

## AI küsimuste genereerimise loogika
- API endpoint: POST /api/game/questions
- Server loeb valitud ülesande assignment.md + lahendusfailid.
- Küsimuste loomine toimub teenuses src/services/question-service.js.
- Nähtav prompt asub failis prompts/question-generation.md.
- Kui päris AI API ühendus puudub, kasutatakse fallback-generaatorit.
- Küsimused jaotuvad raskusastmete järgi:
  - 1-5 lihtne
  - 6-10 keskmine
  - 11-15 raske

## Mängu reeglid
- Kokku 15 küsimust.
- Igal küsimusel 4 vastusevarianti.
- Ainult üks õige vastus.
- Vale vastuse korral mäng lõpeb.
- Punktitasemed:
  100, 200, 300, 500, 1 000, 2 000, 4 000, 8 000, 16 000, 32 000, 64 000, 125 000, 250 000, 500 000, 1 000 000.
- Turvatasemed:
  1 000, 32 000, 1 000 000.
- Õlekõrred:
  - 50:50
  - Küsi AI-lt vihjet
  - Küsi publikult

## Teadaolevad piirangud
- Päris AI API ühendus on jäetud laienduskohaks.
- Fallback-küsimused ei ole sama paindlikud kui LLM-põhine genereerimine.
- Frontend kasutab hetkel lihtsat local state lahendust.

## Edasiarenduse võimalused
- Päris AI API integreerimine (näiteks OpenAI).
- Küsimuste vahemälu.
- Tulemuste püsiv salvestamine.
- Mänguajalugu ja kasutajakontod.
- Õpetaja vaade ja statistika.

## Arendusprotsessi ülevaade
Projektitöö on jaotatud iteratsioonideks ning kirjeldatud failides docs/:
- backlog kasutajalugudega
- sprinti plaan
- Definition of Done
- vastuvõtutestid
- lõppdemo kirjeldus
- retrospektiiv
