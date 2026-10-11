# Breder oefenen met vragen, gidsen en labs

Open `ai-200-practice-exam/dist/index.html`. Onder **Question sets** kies je welke
sets meetellen voor Study mode, een proefexamen, een korte toets of audio-oefening.
De selectie blijft lokaal bewaard. **Select all**, **Clear selection** en
**Original + Microsoft Learn** maken wisselen gemakkelijk.

De verzameling bevat 1.298 vragen in 30 sets:

| Bron | Vragen | Selecteerbare sets |
| --- | ---: | ---: |
| Bestaande eigen vragen | 130 | 1 |
| Microsoft Learn-moduletoetsen | 133 | 1 |
| Docentenset | 174 | 1 |
| QuizPlay set 3 | 36 | 1 |
| Suralmk | 300 | 12 |
| Bouvet | 525 | 14 |

Study mode behandelt alle vragen uit de gekozen sets met directe uitleg. Een
proefexamen kiest maximaal 50 unieke vragen; een korte toets maximaal 20. Bij
minder beschikbare vragen wordt de sessie korter, met twee minuten per vraag.
De selectie probeert de domeinverdeling 12/14/12/12 te benaderen en spreidt vragen
over de gekozen sets. Ontbrekende domeinen worden niet aangevuld uit uitgesloten
sets. De docentenset is niet per domein geclassificeerd; bij beperkte dekking
staat dit vooraf en in de uitslag vermeld. Verwante vragen uit verschillende
bronnen kunnen bewust hetzelfde concept oefenen.

Casusvragen blijven per verhaal gegroepeerd en houden hun achtergrondinformatie.
Een casusdrill werkt alleen als de selectie casussen bevat. Vastgezette Yes/No-
vragen blijven in Study mode vrij navigeerbaar.

## Lees- en labroute

`sources/index.html` is een offline doorzoekbare bibliotheek met 184 documenten,
waaronder de 23 Naytron-labs, Suralmk-studiegidsen en 14 Bouvet-onderwerpgidsen.
Alle vier bronrepositories zijn daarnaast volledig opgenomen in `sources/`.

1. Lees per domein een gids en de bijbehorende controlenotities.
2. Voer het passende lab uit en leg uit waarom de identiteit, netwerkroute,
   schaalregel en foutafhandeling werken.
3. Selecteer de bijbehorende Bouvet- en Suralmk-sets in Study mode.
4. Meng daarna de bronnen in een proefexamen en herhaal je zwakke onderwerpen.
5. Controleer de officiële doelen; extra onderwerpen zoals API Management en
   Event Hubs zijn verbreding en vervangen geen expliciet examendoel.

Officiële studiegids:
https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200

## Controle van 11 oktober 2026

De import controleert alle vraagtypen, antwoordindices, koppelingen, aantallen,
unieke IDs en bronchecksums. De inhoudelijke beoordeling heeft 136 correctie- en
verduidelijkingsrecords opgeleverd, met technische referenties in de app en
`sources/review.html`. Voorbeelden zijn init-containeridentiteiten, Cosmos DB-
RU-kosten, Service Bus-TTL en herlevering, App Configuration-verversing, ACR-
rechten, credentialrotatie en numerieke milliseconden in KQL.

De lezer bevat controlenotities bij verwante onderwerpen en herstelde KQL-
voorbeelden. De oorspronkelijke bestanden blijven ongewijzigd; wijzigingen zijn
reproduceerbaar via de importscripts. Dit is geen garantie dat elke zin in de
brongidsen actueel is. De labs zijn statisch bekeken, maar niet in een Azure-
abonnement uitgevoerd. Controleer bij uitvoering SDK-versie, rechten, regio,
quota en de actuele documentatie.

Versies en checksums staan in `sources/manifest.json`; bronvermeldingen in
`sources/NOTICE.md`. De simulator gebruikt de lokale snapshots en laadt geen
vragen bij van de websites van de auteurs.
