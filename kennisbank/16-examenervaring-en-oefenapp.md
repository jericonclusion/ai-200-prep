# Examenervaring en oefenapp

## Wat Microsoft officieel aangeeft

- Een associate-examen zonder lab heeft doorgaans **100 minuten examentijd** en **120 minuten totale zittijd**.
- Met mogelijke labs is dit doorgaans **120 minuten examentijd** en **140 minuten totale zittijd**.
- Het aantal vragen varieert. Microsoft noemt meestal **40-60 vragen**. Ga daarom niet uit van een vast aantal.
- Op het introductiescherm staat of er case studies en labs zijn. De volgorde en precieze indeling zijn niet vooraf gegarandeerd.
- Case studies hebben geen eigen timer. Tijdens de case kun je de casusinformatie opnieuw bekijken en de vragen binnen die case reviewen. Na het verlaten van de case kun je niet terug.
- Problem/solution-vragen zijn Yes/No-vragen met dezelfde probleemsituatie en een andere voorgestelde oplossing. Na `Next` kun je niet terug en verschijnen ze niet in de review.
- Bij veel gewone vragen kun je markeren voor review en later terugkeren binnen het beschikbare deel.
- Een break laat de klok doorlopen. Na de break kun je niet terug naar vragen die je ervoor al hebt gezien.
- Microsoft heeft vijf minuten voor pauzes in de examentijd verwerkt, maar de klok loopt tijdens iedere pauze gewoon door.
- Bij associate- en expert-examens kan Microsoft Learn in een gesplitst scherm beschikbaar zijn. De klok blijft lopen en externe domeinen zijn geblokkeerd.
- Verkeerde antwoorden leveren geen strafpunten op; beantwoord daarom iedere vraag.
- De score loopt van 0 tot 1000 en 700 is de grens om te slagen. Dit is geen eenvoudig percentage juiste antwoorden.
- Afname kan fysiek via een Pearson VUE-testcentrum of online met OnVUE-proctoring. Bij online afname horen onder andere identiteitscontrole, foto's/room scan en toezicht.

## Oefenapp

Map: `ai-200-practice-exam`

Lokale start: open `ai-200-practice-exam/dist/index.html`.

De Engelstalige applicatie bevat 1.298 vragen in 30 selecteerbare sets: 263 bestaande vragen, 174 docentvragen en 861 communityvragen. Daarvan komen 133 vragen uit de openbare moduletoetsen van alle 27 modules in de officiële AI-200-cursus. Kies de gewenste bronnen onder **Question sets**. Zie `18-community-bronnen-en-controle.md` voor de uitbreiding en controle.

1. **Official exam flow:** maximaal 50 vragen, twee minuten per vraag, uitsluitend uit de gekozen sets. Casussen en vastgezette vragen hangen van de selectie af.
2. **Quick assessment:** maximaal 20 vragen, twee minuten per vraag.
3. **Case study drill:** één beschikbare casus uit de gekozen sets, zonder timer; het aantal vragen hangt van de casus af.
4. **Study mode:** alle vragen uit de gekozen sets, geen timer en directe uitleg.
5. **Instructor sample:** alle 174 aangeleverde voorbeeldvragen als aparte set.

Alle 174 docentvragen worden in de eigen huisstijl weergegeven en kunnen automatisch worden nagekeken. Keuzevragen, multiple response, matching, build lists en drag-and-drop gebruiken native bediening. De 48 oorspronkelijke hot-area- en configuratievragen gebruiken native selectierasters; code staat in kopieerbare codeblokken. De laatste antwoordschermen zijn visueel dubbelgecontroleerd en daarna vervangen door native antwoordopties.

### Hoe de casus werkt

- Een casus bevat veel achtergrondtekst verdeeld over onderdelen zoals **Overview**, **Current environment** en **Requirements**.
- Open eerst de vraag en zoek daarna gericht in de casustabs naar de informatie die nodig is.
- Je mag binnen de casus teruggaan en antwoorden reviewen totdat je de casus afsluit.
- Na het verlaten van de casus kun je niet terug.
- Een casus gebruikt dezelfde algemene examencountdown en heeft geen eigen timer.

De app bevat de bestaande casussen **Northwind Research** en **Fabrikam Claims**, de twee docentcasussen en vier QuizPlay-casussen. Gebruik `Case study drill` om direct met dit vraagtype te oefenen.

### Overeenkomst en beperkingen

- In de volledige simulatie volgen gegroepeerde casussen op de algemene vragen. Eventuele vastgezette Yes/No-vragen komen als laatste.
- De simulator ondersteunt single choice, multiple response, matching, build list, drag-and-drop, case studies en niet-terugkeerbare Yes/No-vragen.
- Microsoft kan daarnaast hot-area-vragen, meerdere casussen en mogelijk een praktijklab aanbieden. De exacte samenstelling wordt pas op het introductiescherm van het echte examen getoond.
- De visuele vorm is een benadering van de Microsoft/Pearson-interface. De officiële sandbox is de beste bron voor het exacte bedieningsmodel: https://aka.ms/examdemo

De volledige simulatie gebruikt de officiële domeinwegingen als benadering voor zover de geselecteerde sets dat toelaten. Beperkte selecties en de niet per domein geclassificeerde docentenset kunnen daarvan afwijken. De score van 0-1000 is een oefenindicatie, omdat Microsoft de echte omzetting van ruwe punten naar schaalscore niet publiceert.

## Gebruikte officiële bronnen

- https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200
- https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience
- https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions
- https://learn.microsoft.com/en-us/shows/exam-readiness-zone/what-to-expect-on-your-microsoft-exam
- https://aka.ms/examdemo
- https://www.pearsonvue.com/us/en/microsoft.html

Microsoft vermeldt op 6 oktober 2026 dat voor AI-200 nog geen officiële Practice Assessment beschikbaar is. De officiële Microsoft-vragen in de app zijn daarom moduletoetsvragen, geen vragen uit het echte certificeringsexamen. Online oefenvragensites zijn daarnaast gebruikt om veelvoorkomende vraagpatronen te herkennen. Hun betaalde inhoud wordt niet overgenomen.

- https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/
- https://learn.microsoft.com/en-us/training/courses/ai-200t00
