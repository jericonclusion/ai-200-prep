# Lesnotities

## Maandag 5 oktober 2026

- Lesmateriaal staat in de bovenliggende cursusmap.
- Onderwerp: voordelen van containerization.
- Consistente omgeving: dezelfde container werkt lokaal, in test en productie.
- Isolatie van applicaties en afhankelijkheden.
- Snel en herhaalbaar uitrollen, schalen en vervangen.
- Efficiënter en lichter dan volledige virtuele machines.
- Schaalbaar: snel meer of minder instanties inzetten naar behoefte.
- Budget: resources efficiënter gebruiken en kosten beperken door af te schalen.
- AKS = Azure Kubernetes Service: Microsofts beheerde Kubernetes-dienst in Azure.
- Controleer regelmatig de Azure-roadmap om komende functies en wijzigingen vroeg te zien.
- Filter de roadmap via **Products** op relevante Azure-producten.
- Automatisering: controleer de officiële Azure Updates-RSS periodiek en filter zelf op AI-200-producten; productfilters voor RSS zijn niet officieel gedocumenteerd.

### Hybrid en lokaal

- Azure Stack Hub: Azure-services uitvoeren in een eigen datacenter, ook disconnected mogelijk.
- Windows Azure Pack: oudere on-premises cloudlaag voor Windows Server en System Center.
- Azure Local: huidige naam voor Azure Stack HCI; Azure Arc-enabled infrastructuur op eigen hardware.
- Officiële huidige productnaam: **Azure Local**. **Azure Stack Hub** blijft een aparte bestaande naam.
- Windows Azure Pack werd afgekort tot WAP. Volgens de les was dit geen sterk product.
- Azure Stack volgde later als nieuwe productfamilie; dit was geen simpele naamswijziging van WAP. De naam Azure Stack komt nog voor, vooral bij Azure Stack Hub en oudere documentatie.
- Praktijkvoorbeeld uit de les: KPN werkte al langere tijd met Azure Stack.

### Identiteit

- Microsoft Entra ID: cloudgebaseerde identity- en directoryservice; vroeger Azure AD.
- Directoryservice: bewaart en beheert identiteiten, groepen en toegangsgegevens.
- Domain controller: server die Active Directory Domain Services lokaal uitvoert en authenticatie afhandelt.
- Entra ID is geen klassieke domain controller.
- Entra ID beheert objecten zoals gebruikers, groepen, apparaten en niet-persoonsgebonden accounts (NPA's).
- Gebruikers en apparaten kunnen via groepen gezamenlijk toegang, rollen of beleid krijgen; het is geen strikte hiërarchie.
- Microsoft Entra ID P2 is een licentieniveau met geavanceerde identity security en governance, waaronder Identity Protection en Privileged Identity Management.
- AVD = Azure Virtual Desktop: desktops en applicaties virtueel aanbieden vanuit Azure.
- AVD is een alternatief voor Citrix; Citrix kan ook als beheerlaag met AVD samenwerken.
- Azure DevOps: platform voor repositories, CI/CD-pipelines, werkplanning, testen en artifacts.
- Azure DevOps is een aparte organisatie/service; betaald gebruik wordt aan een gekoppelde Azure-subscription gefactureerd.
- De organisatie kan voor identiteit aan een Microsoft Entra ID-tenant worden gekoppeld.
- Onze omgeving draait volgens de les fysiek in Nederland; Microsoft toont dit publiek als de bredere geografie **Europe**.
- Juridisch aandachtspunt: een geldige Amerikaanse CLOUD Act-vordering kan een Amerikaanse provider verplichten data te verstrekken die onder zijn beheer valt, ongeacht de opslaglocatie.
- Doorslaggevend is vooral Microsofts bezit, beheer of zeggenschap over de data; alleen fysieke opslag in Nederland voorkomt Amerikaanse rechtsmacht niet automatisch.
- Dit is geen vrije, rechtstreekse toegang voor inlichtingendiensten. Microsoft zegt verzoeken juridisch te toetsen, waar mogelijk aan te vechten en klanten te informeren, tenzij dit wettelijk verboden is.
- De uitspraak dat Microsoft deze ontwikkeling vooraf zag aankomen is een bewering uit de les en hier niet geverifieerd.
- Europese constructie: Microsoft Ireland Operations Limited bezit de Europese datacenterentiteiten; sinds 26 juni 2025 houdt een volledig Europees bestuur toezicht.
- Dit is Europese governance binnen de Microsoft-groep, geen volledig onafhankelijke Europese Microsoft-organisatie.
- Terminologie in de les: **Native Azure** = de gewone Azure public-cloudomgeving, tegenover Azure Local/hybride infrastructuur.
- Azure Local draait op gevalideerde eigen hardware met Azure Local OS, Hyper-V, Storage Spaces Direct en Azure Arc.
- Ondersteunt onder meer VM's, AKS, AVD en geselecteerde Arc-enabled services; niet iedere Azure/Arc-service is overal beschikbaar.
- Microsoft 365 Local is inmiddels algemeen beschikbaar op ondersteunde Azure Local Premier Solutions.
- Disconnected operations gebruikt een lokale control plane en vereist kwalificatie; het dienstenaanbod is kleiner dan bij connected Azure Local.
- Onderschat een Kubernetes-farm/cluster niet: het is een groot en complex platform met veel onderdelen, beheer en operationele verantwoordelijkheid.
- Grote organisaties hebben daarom vaak een apart Kubernetes- of platformteam.
- Container registry: vergelijkbaar met een library server; een centrale bibliotheek voor containerimages en versies.
- Vergelijkbaar met een NuGet-feed: NuGet bewaart softwarepackages, een container registry bewaart containerimages.
- Platformonafhankelijk onderdeel van vrijwel iedere containerworkflow; kan beheerd of zelf gehost zijn.
- Staat los van Windows Registry en `regedit`.
- De organisatie bepaalt welke images en versies worden bewaard, bijgewerkt, gescand en uiteindelijk verwijderd.
- Kubernetes Pod: kleinste deploybare eenheid, met één of meer containers die netwerk, opslag en lifecycle delen.
- Netflix-analogie uit de les: kijkers gebruiken dezelfde dienst met eigen streams. Technisch krijgt niet iedere kijker een eigen Pod; meerdere gebruikers kunnen één Pod delen en Kubernetes schaalt met extra Pod-replica's.
- Als een Pod zijn ingestelde capaciteits- of belastingdrempel bereikt, kan autoscaling extra Pod-replica's starten.
- ACR = Azure Container Registry: Microsofts beheerde container registry in Azure.
- ACR en ACR Tasks kunnen worden aangemaakt en beheerd via Azure CLI, PowerShell, Bicep/ARM en Terraform.
- ACR-tagging: geef productie-images een unieke tag, bijvoorbeeld versienummer, build-ID of Git-commit. Gebruik `latest` niet als enige productieversie.
- Lock een uitgerolde productietag door schrijven uit te zetten (`write-enabled=false`); zet ook verwijderen uit (`delete-enabled=false`) als het image bewaard moet blijven.
- Opruimen: een ACR-retentiebeleid kan untagged manifests na een ingesteld aantal dagen automatisch verwijderen. Dit is momenteel preview en alleen beschikbaar in Premium ACR.
- Let op: untaggen verwijdert alleen de tag; manifest en lagen blijven bestaan totdat ze expliciet of via retentie worden verwijderd. Retentie geldt alleen voor manifests die na inschakeling untagged worden.
- Verwijder geen untagged manifest dat nog via zijn digest wordt gebruikt; een volgende pull werkt dan niet meer.
- Nu in de les: Azure App Service.
- Azure App Service kan containerized werken: je kunt een eigen containerimage deployen, bijvoorbeeld vanuit ACR.
- App Service ondersteunt ook deployment van applicatiecode zonder eigen container; Azure beheert dan de runtime en onderliggende infrastructuur.
- App Service deployment slots: naast productie kun je bijvoorbeeld een `staging`-slot maken.
- Met een slot swap wissel je staging en productie. De nieuwe versie kan vooraf opwarmen en testen, waardoor de downtime doorgaans vrijwel nihil is.
- In een `preprod`-slot kun je de nieuwe versie alvast volledig starten en controleren; daarna swap je deze naar het productieslot.
- Instellingen kunnen als *deployment slot setting* worden gemarkeerd; deze blijven bij hun eigen slot en wisselen niet mee.
- Nadeel: alle slots binnen hetzelfde App Service Plan delen dezelfde VM-capaciteit, waaronder CPU en geheugen. Een zwaar preprod-slot of het opwarmen daarvan kan daardoor de productieprestaties beïnvloeden.
- Alternatief: draai productie en preprod op aparte App Service Plans en laat een router/load balancer de productie-URL naar de nieuwe omgeving sturen. Dit geeft betere resource-isolatie, maar kost meer en is complexer.
- Mogelijke Azure-diensten hiervoor zijn Azure Front Door of Application Gateway; Traffic Manager stuurt verkeer via DNS.
- Examenfocus: dit alternatief met aparte omgevingen en verkeersroutering is vooral praktijkkennis en waarschijnlijk geen directe AI-200-examenvraag.
- Identiteit: een App Service kan een niet-persoonsgebonden identiteit gebruiken. De officiële Azure-term is *managed identity* in Microsoft Entra ID.
- Met RBAC geef je deze identiteit toegang tot bijvoorbeeld Key Vault, Storage of ACR, zonder gebruikersaccount of wachtwoord in de applicatiecode.
- Er zijn twee typen managed identities:
  - **System-assigned:** hoort bij precies één Azure-resource en wordt automatisch verwijderd wanneer die resource wordt verwijderd.
  - **User-assigned:** is een losse Azure-resource, kan aan meerdere resources worden gekoppeld en blijft bestaan wanneer een gekoppelde resource wordt verwijderd.
- Een user-assigned identity maak en beheer je zelf: je koppelt hem aan de gewenste Azure-resource(s) en kent afzonderlijk de benodigde RBAC-rollen toe.
- Correctie: user-assigned is niet legacy. Microsoft adviseert user-assigned zelfs voor veel scenario's; system-assigned past goed wanneer iedere resource een eigen identiteit moet hebben en dezelfde lifecycle moet volgen.
- Standpunt docent: system-assigned heeft in de praktijk de voorkeur en wordt tegenwoordig meer gebruikt; user-assigned vraagt handmatig beheer en koppeling.
- Examenbron: de actuele Microsoft-documentatie adviseert user-assigned voor de meeste scenario's. De juiste keuze blijft afhankelijk van de vraag: system-assigned voor één resource met dezelfde lifecycle; user-assigned voor hergebruik, vooraf ingestelde rechten of meerdere resources.
- Keuzeregel managed identity:
  - Gebruik **system-assigned** vaker voor één losse resource met eigen rechten, duidelijke auditlogging en automatische verwijdering van de identiteit met de resource.
  - Gebruik **user-assigned** vaker wanneer meerdere resources dezelfde rechten nodig hebben, de identiteit vooraf moet bestaan of onafhankelijk van resources behouden moet blijven.
- Ezelsbrug:
  - **System-assigned = het systeem regelt hem voor deze resource.** Eén-op-één gekoppeld; resource weg betekent identiteit weg.
  - **User-assigned = jij regelt en verdeelt hem.** Zelf aanmaken en koppelen; herbruikbaar en blijft bestaan als een gekoppelde resource verdwijnt.
- Key Vault en on-premises:
  - **Azure Key Vault draait niet on-premises**; het is een beheerde Azure-dienst.
  - Een on-premises applicatie kan Azure Key Vault wel benaderen, eventueel privé via VPN/ExpressRoute, een VNet en Private Endpoint.
  - **HashiCorp Vault** is een bekend alternatief dat je zelf on-premises, in Kubernetes of in de cloud kunt hosten.
  - Andere alternatieven zijn onder meer CyberArk Secrets Manager/Conjur en Delinea Secret Server; de juiste keuze hangt af van integraties, beheer en compliance.
- Key Vault heeft drie belangrijke objecttypen:
  - **Secret:** een waarde die een applicatie later terugleest, zoals een wachtwoord, API-key, token of connection string.
  - **Key:** cryptografisch sleutelmateriaal voor encrypt/decrypt, wrap/unwrap of sign/verify. De bewerking kan in Key Vault of een HSM plaatsvinden zonder dat de private key de kluis verlaat.
  - **Certificate:** een beheerd X.509-certificaat voor TLS, authenticatie of code signing, inclusief lifecycle en eventuele automatische vernieuwing. Een Key Vault-certificate is opgebouwd bovenop een bijbehorende key en secret.
- Ezelsbrug: **secret bewaar en lees je; key laat je rekenen; certificate bewijst identiteit.**
- Geef een managed identity via Azure RBAC alleen toegang tot het benodigde object en de benodigde bewerking. Een applicatie die alleen een secret leest, heeft geen beheer- of cryptografische sleutelrechten nodig.
- Objecten zijn geversioneerd. Een URI zonder versie verwijst normaal naar de huidige versie; met een versie kun je een specifieke versie opvragen.
- Organisatie en toegangsbeheer:
  - Gebruik bij voorkeur een **aparte vault per applicatie, omgeving en waar nodig regio**, bijvoorbeeld `orders-dev`, `orders-test` en `orders-prod`. Zo geeft een foutieve roltoewijzing of gecompromitteerde identiteit niet direct toegang tot geheimen van andere apps en omgevingen: de **blast radius** blijft kleiner.
  - Ken rollen normaal toe op vaultniveau. Rollen per individueel object zijn mogelijk, maar Microsoft raadt die alleen aan voor uitzonderingen waarin één object apart gedeeld moet worden.
  - Geef de managed identity van een applicatie die alleen secrets hoeft op te halen de rol **Key Vault Secrets User**. Deze kan secretinhoud lezen, maar niet wijzigen.
  - Geef beheerders of operators die secrets moeten maken, wijzigen, herstellen of verwijderen **Key Vault Secrets Officer**. Deze rol mag vrijwel alle secretbewerkingen uitvoeren, maar geen RBAC-permissions beheren.
  - **Key Vault Contributor** beheert de vault als Azure-resource via het control plane, maar geeft op zichzelf geen toegang tot de inhoud van secrets, keys en certificates.
  - Pas least privilege toe: scheid runtime-leestoegang van operationeel beheer en van het beheren van roltoewijzingen.
- Verwijderingsbescherming:
  - **Soft delete** staat voor nieuwe vaults standaard aan en kan daarna niet worden uitgezet. Verwijderde vaults en objecten blijven gedurende een ingestelde bewaartermijn van 7–90 dagen herstelbaar; standaard is dit 90 dagen.
  - **Purge protection** is een aparte instelling en staat niet standaard aan. Na inschakeling kan niemand, ook een administrator of Microsoft niet, een soft-deleted object vóór het einde van de bewaartermijn permanent purgen. Gebruik dit voor productie en zeker bij customer-managed encryption keys.
- Rotatie en dual credentials:
  - **Rotatie** vervangt periodiek een credential door een nieuwe waarde, zodat een gelekte credential maar beperkt bruikbaar blijft.
  - Bij **dual credentials** ondersteunt de achterliggende dienst twee geldige credentials, bijvoorbeeld `key1` en `key2`. De applicatie gebruikt `key1` terwijl `key2` veilig wordt vernieuwd. Daarna haalt de applicatie `key2` op en kan `key1` worden vernieuwd. Daardoor blijft steeds minstens één credential geldig en is rotatie zonder of met minimale downtime mogelijk.

    ```text
    App gebruikt key1 → vernieuw inactieve key2 → sla key2 op als nieuwe secretversie
                    → app schakelt over op key2 → vernieuw daarna key1
    ```

  - Bij Azure Storage kan een `SecretNearExpiry`-event uit Key Vault via Event Grid een Azure Function starten. Die Function regenereert de inactieve Storage-accountkey en schrijft deze als nieuwe versie van het secret naar Key Vault.
  - Key Vault roteert een willekeurig wachtwoord of API-secret niet vanzelf: automatisering moet zowel de credential in het bronsysteem als de secretversie in Key Vault aanpassen. Key Vault-cryptografische keys ondersteunen wel eigen rotation policies.
  - Gebruik waar mogelijk een managed identity. Dan is er geen gedeelde key of wachtwoord dat de applicatie zelf moet ophalen en roteren.
  - **Examenregel:** twee gelijktijdig geldige credentials → wissel de inactieve credential om voor zero/minimal-downtime rotation; slechts één credential → houd rekening met een kort omschakelvenster.
- Bronnen:
  - https://learn.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates
  - https://learn.microsoft.com/en-us/azure/key-vault/general/overview
  - https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide
  - https://learn.microsoft.com/en-us/azure/key-vault/general/key-vault-recovery
  - https://learn.microsoft.com/en-us/security/zero-trust/sfi/safe-secrets-standard
  - https://learn.microsoft.com/en-us/azure/key-vault/secrets/tutorial-rotation-dual
  - https://learn.microsoft.com/en-us/azure/key-vault/general/autorotation
- Azure App Configuration: **sentinel key pattern**:
  - Een sentinel key is een controlewaarde die aangeeft: **de volledige configuratiewijziging is klaar**.
  - Werk eerst alle bij elkaar horende configuratiewaarden bij en wijzig de sentinel pas als laatste, bijvoorbeeld van buildnummer `41` naar `42`.
  - De applicatie controleert alleen de sentinel. Zodra die gewijzigd is, laadt zij alle geselecteerde configuratie opnieuw. Dit voorkomt dat de app tijdelijk een half oude en half nieuwe configuratie gebruikt en beperkt het aantal controles.

    ```text
    Update Database:Host
    Update Database:Name
    Update FeatureX:Enabled
    Update Config:Sentinel als laatste
                         ↓
              applicatie herlaadt alles
    ```

  - De sentinel pusht de configuratie niet vanzelf naar de app. Refresh moet in de provider zijn geconfigureerd en daadwerkelijk worden aangeroepen. Afhankelijk van framework en implementatie gebeurt dat bijvoorbeeld via request-middleware of een expliciete `refresh()`-call, met een minimum refresh-interval.
  - De inhoud van de sentinel is meestal alleen een veranderend versienummer, timestamp of release-id; de wijziging zelf is het signaal.
  - Bij toegang via Entra ID/managed identity heeft de applicatie **App Configuration Data Reader** nodig om key-values, feature flags en de sentinel te lezen. De gewone rollen **Reader** en **App Configuration Reader** geven alleen control-plane-informatie over de Azure-resource en geen toegang tot de configuratiedata.
  - Moet een identiteit configuratiewaarden schrijven of verwijderen, gebruik dan **App Configuration Data Owner**. Pas least privilege toe: een runtime-app heeft meestal alleen Data Reader nodig.
  - Verwijst een App Configuration-waarde naar een Key Vault-secret, dan zijn twee losse rechten nodig: **App Configuration Data Reader** op de configuration store én bijvoorbeeld **Key Vault Secrets User** op de vault.
  - Dit staat los van **Redis Sentinel**, dat over beschikbaarheid en failover van Redis gaat.
  - **Examenregel:** meerdere instellingen atomair-achtig samen vernieuwen → verander alle instellingen en de sentinel als laatste; sentinel gewijzigd → refresh alle configuratie.
  - https://learn.microsoft.com/en-us/azure/azure-app-configuration/reference-dotnet-provider#refresh-on-sentinel-key
  - https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-best-practices
  - https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-enable-rbac
- Monitoring:
  - **Azure Monitor** is het overkoepelende platform voor metrics, logs, alerts en observability.
  - **Application Insights** is de monitoringtool/APM binnen Azure Monitor voor applicaties: requests, prestaties, fouten, traces en afhankelijkheden.
  - SQL-databaseaanroepen kunnen als dependency zichtbaar worden, inclusief duur en fouten. De Application Map toont de applicatie en gekoppelde componenten.
  - Hierdoor kan een DevOps-team tijdens en na een uitrol de werking van de hele applicatieketen volgen.
  - Nuance: Application Insights toont applicatieverkeer naar SQL; voor database-resourcegegevens en diepere SQL-monitoring gebruik je daarnaast Azure Monitor-diagnostiek en database-metrics/logs.
- Drie deploymentpaden voor Azure Container Apps:
  1. `az containerapp up`: snelste route; maakt of gebruikt benodigde resources en kan vanuit broncode, GitHub of een bestaand image deployen. Vooral handig voor een snelle start en standaardinstellingen.
  2. `az containerapp create`: expliciete CLI-deployment waarbij je de opties zelf meegeeft; geeft meer controle.
  3. YAML: declaratieve configuratie in een bestand, uitgevoerd met `az containerapp create --yaml <bestand.yml>`; geschikt voor herhaalbare deployments en versiebeheer.
- Tuning voor AI-services in Container Apps:
  - Geef langzaam ladende modellen voldoende starttijd met `initialDelaySeconds`, `periodSeconds` en een passende `failureThreshold`; voorkom dat liveness tijdens modelwarmup al herstarts veroorzaakt.
  - Probe-endpoints moeten klein en snel zijn. Laat liveness niet afhangen van SQL, Redis of externe API's, anders kan een externe storing gezonde replicas in een restart-loop brengen.
  - CPU en geheugen worden per container ingesteld en gelden in iedere replica. CPU throttling vraagt meestal meer CPU of optimalisatie; OOM-restarts vragen meer geheugen of onderzoek naar een geheugenlek.
  - Denk bij kosten aan resources per replica × aantal replicas × draaitijd. Los eerst de bottleneck per replica op en stel daarna autoscaling af.
  - Vaste beheerregel: houd zowel de Azure-roadmap als het werkelijke performancegebruik in de gaten. Meet CPU, geheugen, latency, foutpercentage, restarts, replica-aantallen en kosten voordat je resources, tiers of schaalregels aanpast.
  - **KEDA = Kubernetes Event-driven Autoscaling.** KEDA meet een eventbron, bijvoorbeeld het aantal Service Bus-berichten, Event Hubs-lag of Kafka-lag, en laat Container Apps het aantal replicas automatisch aanpassen.
  - KEDA kan een event-driven worker van nul naar meerdere replicas schalen en na verwerking weer terug naar nul. KEDA verwerkt de berichten niet zelf; het levert alleen het schaalsignaal.
  - Microsoft heeft geen aparte KEDA-variant: Azure Container Apps gebruikt het open-source KEDA onder water als beheerde functie. Je configureert alleen een scale rule; Microsoft beheert installatie en lifecycle. In AKS is KEDA beschikbaar als managed add-on.
  - Belangrijke Azure KEDA-scalers:
    - **Service Bus:** schaal op het aantal wachtende berichten in een queue of topic/subscription.
    - **Event Hubs:** schaal op consumer lag/achterstand per consumer group.
    - **Storage Queue:** schaal op het geschatte aantal queueberichten.
    - **Blob Storage:** schaal op nieuwe of nog te verwerken blobs.
  - Gebruik waar mogelijk managed identity om de scaler toegang tot de eventbron te geven.
- **Azure Queue Storage** is een queue-service binnen een Storage Account. Het laat applicatiecomponenten asynchroon communiceren en werk bufferen.
- Zie Queue Storage als de lichtere, eenvoudige variant van Service Bus: goedkoop en geschikt voor grote eenvoudige work queues.
- Kies **Service Bus** wanneer je geavanceerde messaging nodig hebt, zoals topics/subscriptions, sessions/FIFO, transactions, duplicate detection of automatische dead-lettering.
- Queue Storage levert berichten *at least once* en garandeert geen strikte volgorde; consumers moeten daarom dubbele verwerking veilig kunnen afhandelen.
- Kostenregel: als de eenvoudige functies van Queue Storage voldoende zijn, is dat doorgaans goedkoper dan Service Bus. Kies Service Bus pas wanneer de extra messagingfuncties nodig zijn; controleer voor een echte oplossing ook volume, transacties en beheerkosten.
- Voorbeeld: bij kritieke bank- of betalingstransacties kan Service Bus gerechtvaardigd zijn voor betrouwbare overdracht naar een back-end of mainframe, vanwege sessions/FIFO, transactions, duplicate detection, retries en dead-lettering.
- Nuance: Service Bus verwerkt de geldtransactie niet zelf; het banksysteem doet dat. De applicatie moet daarnaast idempotent zijn en dubbele boekingen voorkomen.
- Keuzeregel: gebruik de eenvoudigste queue die aan de eisen voldoet. Niet ieder bericht vereist de extra functies en kosten van Service Bus.

### Azure messaging kiezen

| Dienst | Betekenis | Typische toepassing |
|---|---|---|
| **Service Bus** | Betrouwbare opdracht: *voer dit werk uit*. | Orders, betalingen en workflows met queues, retries, dead-lettering, transactions, duplicate detection of geordende sessions. |
| **Event Grid** | Discrete melding: *dit is gebeurd*. | Reageren op `BlobCreated`, resourcewijzigingen en events naar meerdere handlers routeren en filteren. |
| **Event Hubs** | Grote, geordende en tijdelijk bewaarde eventstream. | Telemetrie, logs, clickstreams en IoT-data die consumers vanaf een offset kunnen lezen en opnieuw afspelen. |
| **Queue Storage** | Eenvoudige en goedkope takenwachtrij. | Veel eenvoudige achtergrondtaken waarvoor de geavanceerde functies van Service Bus niet nodig zijn. |

Ezelsbrug: **Service Bus = doe deze taak; Event Grid = dit is gebeurd; Event Hubs = hier komt een datastroom.**

#### Stedenanalogie

- **Event Grid = de alarmcentrale.** Er gebeurt iets in de stad, zoals brand of een geopende deur. De centrale filtert de melding en stuurt haar direct naar de juiste diensten. Kies dit voor snelle reacties, routering en fan-out.
- **Event Hubs = de opslag van alle verkeerscamera's.** Een continue stroom verkeersbewegingen wordt tijdelijk in een gepartitioneerd logboek vastgelegd. Politie, gemeente en een AI-model kunnen ieder via een eigen consumer group in hun eigen tempo lezen en later opnieuw beginnen vanaf een offset. Kies dit voor veel telemetrie, historie en replay.
- **Service Bus = gemeentelijke werkbonnen.** Een concrete opdracht, zoals een betaling verwerken of een lantaarnpaal repareren, blijft wachten totdat een worker haar afhandelt. Kies dit voor betrouwbare bedrijfsopdrachten, acknowledgements, retries, dead-lettering, transactions of geordende sessions.
- **Queue Storage = het eenvoudige nummertjesapparaat.** Taken wachten goedkoop in een rij totdat een worker ze oppakt. Kies dit als een eenvoudige work queue voldoende is.

**Nuance Event Grid versus Event Hubs:** beide verwerken events en kunnen daarom aan de invoerkant op elkaar lijken. Ze zijn niet volledig uitwisselbaar. Event Grid optimaliseert voor het selecteren en bezorgen van afzonderlijke gebeurtenissen aan handlers. Event Hubs bewaart een geordende eventstream per partition, waarna consumers hun eigen positie bijhouden en events opnieuw kunnen lezen. Event Grid kan bovendien Event Hubs als bestemming gebruiken.

Examensignalen:

- *Filter, route, fan-out, resource event of direct reageren* → **Event Grid**.
- *Partitions, offsets, consumer groups, replay of veel telemetrie* → **Event Hubs**.
- *Opdracht, transactie, FIFO/session, retry of dead-letter queue* → **Service Bus**.
- *Goedkope eenvoudige achtergrondtaak* → **Queue Storage**.

#### CNCF CloudEvents

**CloudEvents** is een open CNCF-standaard voor de vorm en metadata van een event. In de stedenanalogie is het het **standaard meldingsformulier**: Event Grid is de alarmcentrale die meldingen routeert, terwijl CloudEvents vastlegt hoe zo'n melding wordt beschreven. CloudEvents is dus geen broker, queue of Azure-dienst.

Een CloudEvent bevat altijd:

- `specversion`: gebruikte CloudEvents-versie, meestal `1.0`;
- `id`: unieke identificatie van de gebeurtenis binnen de bron;
- `source`: waar de gebeurtenis vandaan komt;
- `type`: wat voor gebeurtenis het is.

Veelgebruikte optionele velden zijn `subject`, `time`, `datacontenttype` en `data`.

```json
{
  "specversion": "1.0",
  "id": "evt-123",
  "source": "/city/traffic-camera/42",
  "type": "com.city.vehicle.detected",
  "subject": "truck-789",
  "time": "2026-10-08T10:15:00Z",
  "datacontenttype": "application/json",
  "data": {
    "speed": 82
  }
}
```

Azure Event Grid ondersteunt CloudEvents 1.0 en Microsoft raadt dit schema aan voor interoperabiliteit. Hetzelfde eventformaat kan daardoor ook buiten Azure worden verwerkt. Examenezelbrug: **CloudEvents = formaat van de melding; Event Grid = routering en bezorging van de melding.**

##### `source`, `type` en `subject`

| Attribuut | Vraag die het beantwoordt | Voorbeeld |
|---|---|---|
| `source` | **Waar kwam het event vandaan?** | `/ai/claims-pipeline` |
| `type` | **Wat voor gebeurtenis was het?** | `com.fabrikam.stage.completed` |
| `subject` | **Over welk specifiek onderdeel of object ging het?** | `/stages/embeddings/jobs/batch-42.json` |

`source` en `type` zijn verplicht; `subject` is optioneel. Het subject is juist bedoeld om de interne structuur binnen een source filterbaar te maken zonder dat Event Grid de inhoud van `data` hoeft te begrijpen.

```json
{
  "specversion": "1.0",
  "id": "evt-456",
  "source": "/ai/claims-pipeline",
  "type": "com.fabrikam.stage.completed",
  "subject": "/stages/embeddings/jobs/batch-42.json",
  "data": {
    "durationMs": 840
  }
}
```

Een Event Grid-subscription kan dan bijvoorbeeld gebruiken:

```json
{
  "includedEventTypes": ["com.fabrikam.stage.completed"],
  "subjectBeginsWith": "/stages/embeddings/",
  "subjectEndsWith": ".json"
}
```

- `includedEventTypes` kiest de **soort gebeurtenis** via `type`.
- `subjectBeginsWith` kiest een hiërarchische tak of padprefix.
- `subjectEndsWith` kiest bijvoorbeeld een bestandsextensie of vaste padsuffix.
- Advanced filters kunnen aanvullende metadata of velden onder `data` beoordelen.

Nuance: een producer kan een pipelinefase in de praktijk ook verwerken in `source` of `type`, afhankelijk van het domeinmodel. In een examenvraag wijzen de woorden **path-based**, **prefix** en **suffix** echter op `subject`, omdat Event Grid daarvoor speciale subjectfilters heeft.

Bronnen:

- https://cloudevents.io/
- https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md
- https://learn.microsoft.com/en-us/azure/event-grid/event-schema
- https://learn.microsoft.com/en-us/azure/event-grid/event-filtering
- https://learn.microsoft.com/en-us/azure/event-grid/how-to-filter-events

#### Azure Event Grid: mogelijkheden

Event Grid is een volledig beheerde, schaalbare publish/subscribe-dienst voor event-driven systemen. Een publisher meldt een gebeurtenis en Event Grid routeert die naar één of meer geïnteresseerde subscribers.

```text
Event source → topic → event subscription + filter → handler
```

- **Event source/publisher:** Azure-dienst, eigen applicatie, partner-SaaS of MQTT-client die een event publiceert.
- **Topic:** ingang en logisch kanaal voor events. Een system topic vertegenwoordigt events uit een Azure-resource; een custom topic ontvangt eigen applicatie-events; partner topics ontvangen partner-SaaS-events. Namespace topics ondersteunen flexibele push/pull-consumptie.
- **Event subscription:** bepaalt welke events worden geselecteerd, naar welke bestemming ze gaan en hoe delivery/retry werkt.
- **Handler/subscriber:** bijvoorbeeld Azure Functions, Logic Apps, webhook, Event Hubs of een ondersteunde messagingbestemming, afhankelijk van topic- en deliverytype.

Praktische toepassingen:

- Reageren op `BlobCreated` en een Azure Function starten voor document-, beeld- of AI-verwerking.
- Meerdere systemen tegelijk informeren over één gebeurtenis (**fan-out**), bijvoorbeeld voorraad, facturatie en notificaties na een bestelling.
- Azure-resourcewijzigingen of lifecycle-events verwerken voor automation, auditing en governance.
- Eigen domeinevents publiceren, zoals `CustomerRegistered` of `ModelTrainingCompleted`.
- Partner-events uit SaaS-systemen ontvangen.
- IoT- en apparaatcommunicatie via de MQTT-broker in Event Grid namespaces en MQTT-data doorsturen naar Azure-diensten of webhooks.

Belangrijke mogelijkheden:

- **Filtering:** selecteer op event type, subject en event-data-attributen zodat handlers alleen relevante events ontvangen.
- **Push delivery:** Event Grid stuurt het event direct naar het geconfigureerde endpoint; geschikt voor snel reageren zonder polling.
- **Pull delivery:** een consumer haalt events op zijn eigen tempo op; beschikbaar voor namespace topics en nuttig als de consumer niet altijd actief of stabiel is.
- **CloudEvents 1.0:** gestandaardiseerd eventformaat voor interoperabiliteit.
- **Retries en dead-lettering:** bij tijdelijke deliveryfouten gebruikt push delivery retries met backoff. Configureer een dead-letterbestemming als niet-afgeleverde events bewaard moeten blijven; dit staat niet automatisch aan.
- **Beveiliging:** Entra ID/RBAC, managed identity en netwerkopties zoals private endpoints zijn beschikbaar waar het gebruikte Event Grid-model dit ondersteunt.

Betrouwbaarheidsregels:

- Delivery is in het algemeen **at least once**; een handler moet idempotent zijn omdat hetzelfde event meer dan één keer kan aankomen.
- Eventvolgorde is niet gegarandeerd.
- Stop grote bestanden niet in het event. Stuur compacte metadata en een verwijzing, bijvoorbeeld de URI van een blob; laat de handler de echte data ophalen.
- Event Grid voert de bedrijfsactie niet zelf uit. Het routeert de melding naar code of een andere dienst die de actie uitvoert.

Gebruik Event Grid niet als vervanging voor alles: betrouwbare opdrachten en transactieworkflows passen bij **Service Bus**; grote replayable telemetriestromen bij **Event Hubs**; langdurige dataopslag bij Storage of een database.

Bronnen:

- https://learn.microsoft.com/en-us/azure/event-grid/compare-messaging-services
- https://learn.microsoft.com/en-us/azure/event-grid/overview
- https://learn.microsoft.com/en-us/azure/event-grid/concepts
- https://learn.microsoft.com/en-us/azure/event-grid/namespace-push-delivery-overview
- https://learn.microsoft.com/en-us/azure/event-grid/pull-delivery-overview
- https://learn.microsoft.com/en-us/azure/event-grid/namespace-delivery-retry

### AMQP 1.0

**AMQP = Advanced Message Queuing Protocol.** Het is een open, gestandaardiseerd en binair netwerkprotocol voor asynchrone, veilige en betrouwbare berichtenoverdracht. AMQP is geen queue of Azure-dienst: het beschrijft hoe een client en een messagingdienst berichten en bevestigingen over de netwerkverbinding uitwisselen.

Azure Service Bus en Event Hubs gebruiken AMQP 1.0 als primair protocol. De officiële Azure SDK's verbergen normaal de AMQP-details achter functies zoals `send`, `receive` en `complete`.

```text
Applicatie / Azure SDK
        ↓ AMQP 1.0
Service Bus queue/topic   of   Event Hubs-stream
```

Belangrijkste AMQP-begrippen:

- **Connection:** de beveiligde netwerkverbinding tussen client en Azure.
- **Session:** logisch communicatiekanaal binnen een connection; meerdere paden kunnen een netwerkverbinding delen.
- **Link:** een eenrichtingspad voor een sender of receiver naar een node.
- **Node:** het messagingdoel. In Service Bus kan dit een queue, topic, subscription of dead-letter-subqueue zijn.
- **Frame:** binair protocolblok dat over de verbinding wordt verstuurd.
- **Settlement/disposition:** sender en receiver leggen vast wat er met een transfer is gebeurd, bijvoorbeeld geaccepteerd of geweigerd. De SDK vertaalt dit naar bewerkingen zoals complete, abandon of dead-letter.
- **Link credit:** de receiver geeft aan hoeveel berichten hij kan aannemen. Als het credit op is, stopt de sender tijdelijk; dit levert flow control/backpressure.

Netwerkpoorten bij Azure Service Bus en Event Hubs:

- **TCP 5671:** AMQP waarbij eerst TLS wordt opgezet.
- **TCP 5672:** AMQP met een verplichte upgrade naar TLS; Azure vereist altijd TLS.
- **TCP 443:** AMQP over WebSockets. Handig wanneer een firewall 5671/5672 blokkeert maar HTTPS-verkeer toestaat; dit geeft iets meer handshake- en protocoloverhead.
- Bij Entra-authenticatie en bepaalde SDK-managementbewerkingen kan HTTPS/443 ook naast native AMQP nodig zijn.

Waarom AMQP geschikt is voor messaging:

- De verbinding kan langdurig openblijven, waardoor niet voor ieder bericht een nieuwe HTTP-request nodig is.
- Het binaire protocol is efficiënt voor veel berichten.
- Flow control voorkomt dat een snelle producer een consumer onbeperkt overspoelt.
- Settlement geeft betrouwbare terugkoppeling over de aflevering.
- Het protocol is platform- en taalneutraal.

AMQP verandert het servicemodel niet: Service Bus blijft een broker met queues/topics en Event Hubs blijft een partitioned eventlog waarvan consumers vanaf offsets lezen. Kies eerst de juiste Azure-dienst en bepaal daarna zo nodig de transportmodus.

#### `ServiceBusMessageBatch`

Een `ServiceBusMessageBatch` verzamelt meerdere afzonderlijke Service Bus-berichten en verstuurt ze via één SDK-aanroep. Dit vermindert de netwerkoverhead en verhoogt doorgaans de verzenddoorvoer. De receiver ontvangt daarna nog steeds losse berichten; de batch maakt er geen enkel groot bedrijfsbericht van.

```python
from azure.servicebus import ServiceBusMessage

batch = sender.create_message_batch()
batch.add_message(ServiceBusMessage("Order 1"))
batch.add_message(ServiceBusMessage("Order 2"))
sender.send_messages(batch)
```

- Maak een batch via `sender.create_message_batch()` zodat de SDK de toegestane maximale grootte kent.
- `add_message()` telt body, headers, properties en protocoloverhead mee.
- Als het volgende bericht niet meer past, verstuur je de volle batch en maak je een nieuwe.
- Een individueel bericht dat zelf al te groot is, kan ook niet in een lege batch en moet worden verkleind of extern worden opgeslagen.
- Batchen optimaliseert verzenden; verwerking, locks, retries en settlement blijven per afzonderlijk bericht relevant.

- Bronnen:
  - https://learn.microsoft.com/en-us/azure/event-grid/compare-messaging-services
  - https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-amqp-protocol-guide
  - https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-amqp-overview
  - https://learn.microsoft.com/en-us/azure/event-hubs/troubleshooting-guide
  - https://learn.microsoft.com/en-us/python/api/azure-servicebus/azure.servicebus.servicebusmessagebatch?view=azure-python
  - https://docs.oasis-open.org/amqp/core/v1.0/amqp-core-overview-v1.0.html

- **ADLS = Azure Data Lake Storage.** Tegenwoordig bedoelt men meestal ADLS Gen2: Blob Storage met *hierarchical namespace*.
- Hiermee organiseer je grote hoeveelheden ruwe en verwerkte data in echte mappen/bestanden en gebruik je fijnmazige ACL-rechten.
- Typische toepassing: data lake voor analytics, machine learning en AI met bijvoorbeeld JSON-, CSV-, Parquet-, log-, beeld- en audiobestanden.
- Ezelsbrug: **Blob Storage bewaart objecten; ADLS Gen2 maakt Blob Storage geschikter als bestandshiërarchie voor data-analyse.**
- **Data lake:** centrale opslag waarin je grote hoeveelheden ruwe, half-gestructureerde en gestructureerde data in het oorspronkelijke formaat bewaart, bijvoorbeeld logs, JSON, CSV, Parquet, afbeeldingen en audio.
- De structuur en betekenis worden vaak pas toegepast wanneer de data wordt gelezen en geanalyseerd: *schema-on-read*.
- Verschil: een **data warehouse** bevat vooral vooraf opgeschoonde en gemodelleerde data voor vaste rapportages; een data lake bewaart data flexibeler voor later gebruik.
- Ezelsbrug: **data lake = eerst bewaren, later bepalen hoe je het gebruikt.**
- Deployment verifiëren bij Azure Container Apps: **Logs → Revisions → Replicas**.
  - **Logs:** zoek eerst naar start-, image-, schaal- of applicatiefouten.
  - **Revision:** een onveranderlijke versie/snapshot van de app; controleer status, health en of de juiste versie actief is.
  - **Replica:** een draaiende instance van die revision; controleer welke replica faalt en bekijk daarbinnen de juiste container.
- Hiërarchie: `Container App → Revision → Replica → Container`.
- Logtypen:
  - **Console logs:** uitvoer van de applicatie/container via stdout en stderr.
  - **System logs:** platformgebeurtenissen, zoals image pulls, provisioning, starten en schalen.
  - **Log stream:** live meekijken met console- of system logs; dit is een weergavemethode en geen apart logtype.
- Region pairs bij calamiteiten/BCDR:
  - Een **region pair** is een door Microsoft gekoppeld paar Azure-regio's, meestal binnen dezelfde geografie. Voorbeeld: West Europe ↔ North Europe.
  - Een region pair bestaat altijd uit **twee regio's**. De onderlinge afstand kan groot zijn; Microsoft noemt doorgaans minimaal circa 300 mijl/483 km waar de geografie dit mogelijk maakt. Er is geen vaste maximale afstandsgarantie.
  - Doel: herstel bij een grote regionale calamiteit ondersteunen, geplande platformupdates zoveel mogelijk na elkaar uitvoeren en meestal dezelfde dataresidentie-geografie behouden.
  - Bij een grootschalige storing krijgt één regio per paar prioriteit bij herstel.
  - **Geen automatische bescherming:** resources, datareplicatie en failover moet je per Azure-dienst zelf ontwerpen en configureren.
  - **Availability Zone:** bescherming tegen uitval van een datacenter binnen één regio. **Region pair/multiregion:** bescherming tegen uitval van een hele regio.
  - Niet iedere nieuwe Azure-regio heeft nog een vast paar; veel diensten kunnen ook naar zelfgekozen regio's repliceren.
  - Bepaal vooraf **RTO** (hoe snel moet herstel plaatsvinden?) en **RPO** (hoeveel dataverlies is acceptabel?). Deze bepalen de DR-oplossing.
- Nu in de les: **Azure Cosmos DB for NoSQL**.
  - Volledig beheerde NoSQL-database voor JSON-documenten/items, met flexibel schema en horizontale schaal.
  - Hiërarchie: `Cosmos DB-account → database → container → item`.
  - Een **container** is vergelijkbaar met een tabel/collectie, maar bevat JSON-items die niet allemaal exact dezelfde velden hoeven te hebben.
  - De **partition key** bepaalt hoe items logisch worden verdeeld. Een goede keuze verdeelt data en belasting gelijkmatig en past bij veelgebruikte queries.
  - Bewerkingen kosten **Request Units (RU)**; ingestelde capaciteit wordt uitgedrukt in `RU/s`.
  - Een point read met zowel `id` als partition key is doorgaans het efficiëntst. Cross-partition queries kosten meestal meer RU en tijd.
- Azure Quickstart Templates: officiële GitHub-repository met community-samples voor ARM/Bicep. Op 5 oktober 2026 bevat de map `quickstarts` 1.275 template-ingangen.
- Azure Blueprints bundelde ARM-templates, resourcegroepen, Azure Policy en RBAC voor herhaalbare governance en compliance.
- Blueprints bevatte niet zelf de wetgeving; organisaties vertaalden wettelijke eisen naar policies, rollen en configuratie.
- Voorbeeld AVG: beleid voor datalocatie, minimale toegang, encryptie, logging, bewaartermijnen en verwijdering technisch afdwingen en controleren.
- Governance-tools ondersteunen AVG-naleving, maar maken een omgeving niet automatisch juridisch compliant.
- Azure Blueprints wordt gefaseerd uitgefaseerd. Het is nog zichtbaar en bestaande onderdelen kunnen beperkt blijven werken, maar nieuwe definities/versies zijn sinds 31 juli 2026 geblokkeerd. Volledige beëindiging: 31 januari 2027.
- Nieuwe aanpak: Template Specs + Deployment Stacks + Azure Policy + RBAC.

### Azure Policy

- Azure Policy controleert resources tegen vastgelegde regels voor governance en compliance.
- Een policy definition beschrijft de voorwaarde en het effect, bijvoorbeeld `audit`, `deny`, `modify` of `deployIfNotExists`.
- Een assignment koppelt de policy aan een scope, zoals management group, subscription of resource group.
- Een initiative groepeert meerdere policies tot één compliancepakket.
- Azure-scopehiërarchie: tenant root group → management groups → subscriptions → resource groups → resources.
- Subscriptions hangen onder de tenant root management group of onder een aangemaakte child management group.
- Management groups kunnen bijvoorbeeld per land, bedrijfsonderdeel, omgeving of complianceprofiel worden ingericht; het ontwerp verschilt per klant.
- Maximumdiepte: tenant root plus zes management-groupniveaus. Subscriptions tellen niet mee in deze limiet.
- OTAP = Ontwikkeling, Test, Acceptatie en Productie.
- Deze omgevingen kunnen elk een eigen subscription krijgen voor isolatie van toegang, policies, kosten, quota en risico's.
- Een policy of initiative kan ook rechtstreeks aan een subscription worden toegewezen en geldt dan voor de onderliggende resource groups en resources.
- Binnen een subscription maak je resource groups om bij elkaar horende Azure-resources logisch te groeperen en gezamenlijk te beheren.
- Governance erft top-down: assignments op management group of subscription werken door naar onderliggende scopes.
- Vooral Azure Policy en RBAC erven automatisch; resourceconfiguraties en tags doen dat niet vanzelf.
- Policy-assignments op een hoger niveau worden normaal geërfd door de onderliggende scopes.
- Op management-groupniveau kan Cost Management de kosten van onderliggende subscriptions gezamenlijk tonen, mits dit voor het accounttype wordt ondersteund en je voldoende rechten hebt.
- Een management group is een governance-scope; het billing account blijft de formele facturatiescope.
- Belangrijke functies op management-groupniveau: 1) kosten over onderliggende subscriptions bekijken en 2) policies centraal toewijzen.
- Meerdere policy definitions kunnen als één initiative worden gebundeld en gezamenlijk worden toegewezen.
- Voorbeeld: de built-in policy **Allowed locations** kan deployments beperken tot `West Europe` en andere regio's weigeren.
- Policies kunnen ongewenste open poorten, NSG-regels of publieke toegang controleren, weigeren of rapporteren.
- NSG's en firewalls filteren het netwerkverkeer zelf; Azure Policy controleert of hun configuratie aan de regels voldoet.
- Een organisatie kan met **Allowed resource types** of **Not allowed resource types** productkeuzes afdwingen.
- Voorbeeld: alleen goedgekeurde Kubernetes/AKS-oplossingen toestaan en ongewenste Azure-platformdiensten blokkeren.
- Policies kunnen ook toegestane SKU's, configuraties en deploymentmethoden beperken.
- Dit geldt binnen de toegewezen Azure-scope; gebruik buiten Azure vraagt om aanvullende governance.

### Data-, caching- en monitoringbegrippen

- **Apache Kafka:** gedistribueerd platform voor continue eventstromen. Producers schrijven events naar **topics**; topics zijn verdeeld in **partitions** voor schaal en parallelle verwerking.
- Consumers lezen met een **consumer group** en bewaren hun positie als **offset**. Lezen verwijdert het event niet; binnen de retentieperiode kan het opnieuw worden afgespeeld.
- Kafka garandeert volgorde binnen één partition, niet automatisch over alle partitions heen.
- **Azure Event Hubs** heeft een Kafka-compatibele endpoint, zodat veel Kafka-clients met aangepaste configuratie Event Hubs kunnen gebruiken.
- **Azure Databricks:** beheerd data- en AI-analyseplatform in Azure, gebaseerd op onder meer Apache Spark. Het gebruikt notebooks, jobs en SQL voor ETL, analytics, streaming en machine learning.
- **ADLS bewaart de data; Databricks verwerkt en analyseert de data.** Databricks is dus niet simpelweg de data lake-opslag.
- **Delta Lake** voegt betrouwbare tabellen met ACID-transacties en schemahandhaving toe boven cloudopslag. **Unity Catalog** regelt centrale toegang, governance, auditing en lineage.
- Ezelsbrug: **ADLS = magazijn; Databricks = fabriek en laboratorium.**
- **Redis:** snelle in-memory datastore, vaak gebruikt als cache, session store en voor tijdelijke status. De actuele beheerde Azure-dienst is **Azure Managed Redis**.
- Let op: Azure Cache for Redis wordt uitgefaseerd; Microsoft adviseert migratie naar Azure Managed Redis. Controleer actuele deadlines voordat je een ontwerp maakt.

### Azure Managed Redis: cachingstrategieën en tiers

**Veelvoorkomende toepassingen:**
- **Data cache:** veelgebruikte database- of API-resultaten tijdelijk bewaren om latency en belasting op de brondienst te verlagen.
- **Content cache:** gegenereerde of veel opgevraagde content bewaren, zoals paginafragmenten en API-responses.
- **Session store:** gebruikerssessies centraal bewaren, zodat meerdere app-instances dezelfde sessiestatus kunnen gebruiken.

**Tierkeuze:**
- **Memory Optimized (8:1):** veel geheugen per vCPU; geschikt voor grote caches waarbij maximale throughput minder belangrijk is.
- **Balanced (4:1):** evenwicht tussen geheugen en compute; standaardkeuze voor algemene caching en session stores.
- **Compute Optimized (2:1):** meer rekenkracht en shards per GB; voor hoge requestvolumes, zware Redis-commando's en maximale throughput.
- **Flash Optimized:** RAM gecombineerd met NVMe voor zeer grote datasets met een duidelijke hot/cold-verdeling. Goedkoper per GB, maar cold data kan meer latency geven.

**Examenkeuze:** geheugen is de bottleneck → Memory Optimized; algemene workload → Balanced; CPU/throughput is de bottleneck → Compute Optimized; honderden GB's tot TB's met vooral een hete subset → Flash Optimized.

Let op: Flash Optimized ondersteunt onder andere geen RediSearch/vector search en geen active geo-replication. Schalen tussen Flash Optimized en een in-memory tier kan niet rechtstreeks.

Bron: https://learn.microsoft.com/en-us/azure/redis/plan-tiers-and-capacity

**Client library en clustering:**
- **`redis-py`** is de gebruikelijke Python-client (`pip install redis`). Gebruik connection pooling in plaats van voor iedere opdracht een nieuwe TCP/TLS-verbinding te openen.
- Iedere Azure Managed Redis-instance gebruikt intern clustering en kan data over meerdere **shards** verdelen.
- Bij **Enterprise clustering** maakt een proxy de cache voor de client grotendeels zichtbaar als één niet-geclusterde endpoint. De client hoeft daardoor niet zelf het Redis Cluster-protocol en de shardroutering af te handelen.
- Enterprise clustering is vereist voor **RediSearch**, en daarmee voor Redis-vector search. Er blijven beperkingen bestaan voor bepaalde multi-key-opdrachten.
- Bij **OSS clustering** maakt een cluster-aware client rechtstreeks verbinding met shards. Dit levert doorgaans de beste latency en throughput, maar de clientbibliotheek moet de Redis Cluster API ondersteunen.
- De clustering policy wordt tijdens het aanmaken gekozen en kan daarna doorgaans niet worden gewijzigd.

Bron: https://learn.microsoft.com/en-us/azure/redis/architecture

**Poorten:**
- **Azure Managed Redis:** verbind met het endpoint op poort **10000**. Deze poort wordt voor TLS en, indien ingeschakeld, niet-TLS gebruikt.
- Bij **OSS clustering** begint de verbinding op 10000. De client ontdekt daarna automatisch shardpoorten in de **85xx-reeks**; deze niet hardcoderen.
- **6379** is de standaardpoort van gewone/community Redis.
- Bij de oudere **Azure Cache for Redis** waren **6380 voor TLS** en **6379 voor niet-TLS** gebruikelijk. Verwar deze dienst niet met Azure Managed Redis.

**Azure Managed Redis versus Azure Cache for Redis:**

| Onderdeel | Azure Managed Redis | Azure Cache for Redis |
|---|---|---|
| Rol | Actuele dienst en standaardkeuze voor nieuwe ontwerpen | Voorganger die wordt uitgefaseerd |
| Basis | Redis Enterprise-stack, beheerd door Microsoft | Basic/Standard/Premium gebruiken community Redis; de oude Enterprise-tiers gebruiken Redis Enterprise |
| Redis-versie | **7.4** | **6** voor Basic/Standard/Premium |
| Publieke DNS | Eindigt op `<regio>.redis.azure.net` | Eindigt op `.redis.cache.windows.net` |
| Clientpoort | **10000** voor TLS en eventueel niet-TLS | **6380** voor TLS; **6379** zonder TLS |
| Shardpoorten | Bij OSS-clustering ontdekt de client dynamische **85xx**-poorten | Bij clustering gebruikte de client afzonderlijke 13xxx/15xxx-poorten |
| Architectuur | Alle instances gebruiken intern shards; meerdere Redis-processen kunnen parallel over nodes draaien | Basic/Standard/Premium gebruiken traditioneel één Redis-proces per node; clustering was afhankelijk van tier/configuratie |
| Cluster policy | **OSS**, **Enterprise** of beperkt **Non-clustered** | Vooral OSS-clustering bij Basic/Standard/Premium; de oude Enterprise-tiers boden OSS en Enterprise |
| Tiers | Memory Optimized, Balanced, Compute Optimized en Flash Optimized | Basic, Standard, Premium, Enterprise en Enterprise Flash |
| Vector search | RediSearch inschakelen bij creatie; vereist Enterprise clustering en een in-memory tier | Alleen ondersteund binnen geschikte oude Enterprise-configuraties |
| Authenticatie | Microsoft Entra ID wordt aanbevolen; access keys zijn ook mogelijk | Access keys waren gebruikelijk; Entra-ondersteuning verschilde per tier en configuratie |
| Migratie | Doelplatform | Hostnaam, poort en mogelijk clustering/clientconfiguratie aanpassen; applicatiecommando's blijven meestal compatibel |

**Lifecycle (stand oktober 2026):**
- Nieuwe klanten kunnen sinds **1 april 2026** geen Basic-, Standard- of Premium-cache meer maken. Bestaande klanten kunnen dat voorlopig nog wel.
- De oude Enterprise- en Enterprise Flash-instances worden uiterlijk **31 maart 2027** naar Azure Managed Redis gemigreerd.
- Basic, Standard en Premium worden op **30 september 2028** beëindigd. Controleer deze data opnieuw wanneer je ze praktisch nodig hebt.

**Examenherkenning:**
- Een **nieuwe** beheerde Redis-oplossing → normaal **Azure Managed Redis**.
- Poort **10000**, Redis 7.4 of DNS met `.redis.azure.net` → Azure Managed Redis.
- Poort **6380**, Basic/Standard/Premium, Redis 6 of `.redis.cache.windows.net` → oude Azure Cache for Redis.
- Vector search → RediSearch tijdens provisioning inschakelen, **Enterprise clustering** kiezen en geen Flash Optimized gebruiken.
- Maximale Redis-throughput en de client ondersteunt Redis Cluster → meestal **OSS clustering**.
- Eenvoudige clientcompatibiliteit, multi-key-gedrag of RediSearch nodig → **Enterprise clustering** beoordelen.

Bronnen:
- https://learn.microsoft.com/en-us/azure/redis/overview
- https://learn.microsoft.com/en-us/azure/redis/architecture
- https://learn.microsoft.com/azure/redis/migrate/migrate-basic-standard-premium-understand
- https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-whats-new

**Development best practices:**
- Houd values klein en verdeel grote objecten zo nodig over meerdere gerelateerde keys. Grote requests en responses verhogen latency en kunnen time-outs voor andere opdrachten veroorzaken.
- Gebruik **pipelining** voor begrensde batches: stuur meerdere opdrachten zonder na iedere opdracht op het antwoord te wachten. Dit vermindert netwerk-roundtrips en verhoogt throughput.
- Vermijd het blokkerende commando **`KEYS`** in productie. Het scant de volledige keyspace en kan andere opdrachten ophouden.
- Gebruik **`SCAN`** voor incrementele, niet-blokkerende iteratie. `SCAN` kan tijdens wijzigingen dubbele resultaten opleveren; de applicatie moet daarmee kunnen omgaan.
- Plaats Redis en de applicatie in dezelfde Azure-regio om netwerk-latency te beperken en betrouwbaarheid te verhogen.
- Gebruik de servicehostname in plaats van een vast IP-adres, omdat het IP-adres kan veranderen na schalen of platformonderhoud.
- Monitor **Used Memory Percentage**, CPU en connected clients. Stel alerts in en overweeg opschalen wanneer deze metrics langdurig boven ongeveer **75%** blijven.
- Schaal vóór de cache volledig belast is; een zwaar belaste cache heeft minder ruimte om data tijdens de schaalactie te herverdelen.

Bron: https://learn.microsoft.com/en-us/azure/redis/best-practices-development
- **Cron:** tijdschema voor terugkerende taken. In Kubernetes start een **CronJob** volgens zo'n schema Jobs/pods, bijvoorbeeld iedere nacht een batchtaak. Cron is geen monitoringtool.
- **Prometheus:** verzamelt numerieke tijdreeksmetrics door endpoints periodiek te scrapen. Veel gebruikt voor Kubernetes/AKS; Azure Monitor biedt hiervoor Managed Prometheus.
- **PromQL:** querytaal om Prometheus-metrics te selecteren, combineren en aggregeren voor dashboards en alerts.
- PromQL kan ook **businessmetrics** tonen, maar alleen als de applicatie die metrics publiceert, bijvoorbeeld `orders_total`, `payments_failed_total` of `checkout_value_euros_total`.
- Voorbeeld ordertempo per minuut: `sum(rate(orders_total[5m])) * 60`.
- Voorbeeld foutpercentage: `sum(rate(payments_failed_total[5m])) / sum(rate(payments_total[5m])) * 100`.
- Houd labels beperkt tot vaste categorieën zoals `service`, `region` en `status`. Gebruik geen ordernummer of klant-ID als label; dat veroorzaakt te veel unieke time series en hogere kosten.

### RediSearch: vector database in Azure Managed Redis

**RediSearch** is een optionele Redis-module voor indexering en zoeken. Hiermee kan Azure Managed Redis naast gewone key-valueopslag ook full-text-, metadata- en vectorzoekopdrachten uitvoeren. De vectors worden dus in Redis bewaard en door RediSearch geïndexeerd.

**Basisflow voor RAG of semantic search:**

```text
document → chunks → embeddingmodel → vector + tekst + metadata in Redis
vraag → embeddingmodel → queryvector → RediSearch → meest vergelijkbare chunks
```

Een record kan bijvoorbeeld de tekst, embedding, document-ID, tenant, categorie, datum en toegangsrechten bevatten. Die metadata maakt filtering mogelijk voordat of tijdens de vectorvergelijking.

**Vectors ingesten:** ingestie betekent dat brondata wordt verwerkt, omgezet en in de vectoropslag geladen. Voor documenten bestaat de flow meestal uit:

1. Lees de documenten uit de bron, bijvoorbeeld Blob Storage, ADLS of een Delta Lake-tabel.
2. Splits lange tekst in kleinere **chunks**.
3. Laat een embeddingmodel iedere chunk omzetten in een vector.
4. Bewaar per chunk de vector, oorspronkelijke tekst en metadata zoals document-ID, pagina, tenant en toegangsrechten.
5. RediSearch neemt passende records op in de vectorindex.

```text
brondata → chunks → embeddingmodel → vectors + metadata → RediSearch-index
```

**Ingestie** stopt data in de opslag en index. **Retrieval** maakt van een zoekvraag een vector en haalt de meest vergelijkbare records uit de index. Gebruik binnen één index hetzelfde embeddingmodel, datatype en aantal dimensies. Verander je het embeddingmodel of de dimensie, dan moet je de bestaande data doorgaans opnieuw embedden en indexeren.

Voor grotere ladingen kun je records in begrensde batches en met Redis-pipelining schrijven. Houd ook updates en verwijderingen uit het bronsysteem bij, zodat de vectorindex geen verouderde chunks teruggeeft.

**Delta Lake en Parquet als bron:**

- **Parquet** is een kolomgebaseerd bestandsformaat. Het bewaart een schema en comprimeert kolomwaarden efficiënt. Analytische systemen hoeven alleen de benodigde kolommen te lezen, waardoor het meestal sneller en compacter is dan CSV voor grote datasets.
- **Delta Lake** is een tabel- en transactielaag boven doorgaans Parquet-bestanden. Het voegt onder andere ACID-transacties, schemahandhaving, updates/deletes/merges en versiegeschiedenis met time travel toe.
- Delta Lake is geen vectordatabase. Het kan de duurzame bron met documenten en metadata zijn; een ingestiepipeline maakt daaruit embeddings en schrijft die naar RediSearch.

```text
Delta Lake/Parquet → nieuwe of gewijzigde rijen → chunks/embeddings
                   → Azure Managed Redis + RediSearch
```

Ezelsbrug: **Parquet = efficiënt bestand; Delta Lake = betrouwbare tabellaag; RediSearch = snelle zoekindex.**

#### Delta Lake-architectuur

Delta Lake is een open **table format** boven objectopslag zoals ADLS Gen2. Het is geen afzonderlijke databaseserver. Een Delta-tabel bestaat hoofdzakelijk uit:

```text
sales/
├── part-00001.parquet       # kolomgebaseerde tabeldata
├── part-00002.parquet
└── _delta_log/
    ├── 00000000000000000000.json
    ├── 00000000000000000001.json
    └── ...checkpoint.parquet
```

- De **Parquet-bestanden** bevatten de werkelijke tabeldata.
- `_delta_log` bevat geordende commits met onder meer toegevoegde/verwijderde databestanden, schema en tabelmetadata.
- Een **checkpoint** vat een reeks logcommits samen, zodat een engine niet bij iedere query de volledige historie hoeft af te spelen.
- Een reader reconstrueert uit de log welke Parquet-bestanden bij de gevraagde tabelversie horen en leest alleen die actieve bestanden.
- Updates en deletes wijzigen Parquet-bestanden normaal niet ter plaatse. Delta schrijft nieuwe bestanden en markeert oude bestanden in een nieuwe logversie als verwijderd.
- Een writer maakt eerst de nieuwe data en commit daarna atomisch een nieuwe logversie. Optimistic concurrency control detecteert conflicterende gelijktijdige writes.
- Hierdoor ontstaan **ACID-transacties**, schema enforcement/evolution, `MERGE`/upserts, consistente batch- en streamingverwerking en **time travel**.
- Oude bestanden maken time travel mogelijk totdat onderhoud zoals `VACUUM` ze definitief verwijdert. Verwijder of wijzig Delta-Parquetbestanden niet handmatig buiten Delta om, want dan klopt de transactielog niet meer.

**ACID** beschrijft vier garanties voor betrouwbare transacties:

- **Atomicity:** alle stappen slagen samen of worden allemaal teruggedraaid. Bij €100 overboeken moeten zowel *€100 van rekening A af* als *€100 bij rekening B erbij* slagen.
- **Consistency:** de transactie brengt de data van één geldige toestand naar een andere geldige toestand en respecteert ingestelde regels en constraints.
- **Isolation:** gelijktijdige transacties zien of veroorzaken geen half uitgevoerde tussenstand; het resultaat gedraagt zich alsof transacties voldoende van elkaar gescheiden zijn uitgevoerd.
- **Durability:** na een succesvolle commit blijft het resultaat bewaard, ook na een proces- of systeemstoring.

Ezelsbrug: **Alles, Correct, Individueel, Duurzaam.** Bij Delta Lake zorgt de transactielog ervoor dat readers een complete oude of complete nieuwe tabelversie zien en geen gedeeltelijk gecommitteerde wijziging.

De vaak genoemde **medallion architecture** is een aanbevolen datapatroon boven Delta Lake en geen verplicht onderdeel van het Delta-bestandsformaat:

```text
Bronnen → Bronze → Silver → Gold → BI / ML / AI
```

- **Bronze:** ruwe, zo volledig mogelijk bewaarde brondata voor audit en opnieuw verwerken.
- **Silver:** opgeschoonde, gevalideerde en gededupliceerde detaildata.
- **Gold:** businessklare, vaak samengevoegde of vooraf geaggregeerde data voor rapportages en modellen.
- **Unity Catalog** kan governance, toegangsbeheer, discovery en lineage over deze tabellen verzorgen.

Examenkeuze: alleen efficiënt analytisch bestandsformaat nodig → **Parquet**; daarnaast transacties, schemahandhaving, `MERGE`, versiehistorie of time travel nodig → **Delta Lake**.

Bronnen:

- https://learn.microsoft.com/en-us/fabric/fundamentals/delta-lake-overview
- https://learn.microsoft.com/en-us/azure/databricks/lakehouse/medallion
- https://learn.microsoft.com/en-us/azure/databricks/delta/best-practices

**HASH-opslag versus JSON-opslag versus vector querying:**

Dit zijn geen drie alternatieve zoekmethodes. **HASH en JSON bepalen hoe een record wordt opgeslagen; vector querying bepaalt hoe RediSearch de geïndexeerde vectors doorzoekt.** Een RediSearch-index wordt daarom aangemaakt als `ON HASH` of `ON JSON`.

| Onderdeel | Redis HASH | Redis JSON |
|---|---|---|
| Model | Platte map van veld naar waarde | Hiërarchisch document met objecten en arrays |
| Schrijven | `HSET` | `JSON.SET` |
| Vectoropslag | Binaire bytes, bijvoorbeeld een `FLOAT32`-buffer | JSON-array met getallen |
| Metadata | Eenvoudige losse velden | Rijke, geneste structuren en arrays via JSONPath |
| Sterk punt | Eenvoudig, compact en geschikt voor vaste records | Flexibel documentmodel en meerdere/geneste waarden |
| Keuze | Prompt, antwoord, tenant en één embedding per key | Complex product/document met geneste metadata of meerdere embeddings |

Voorbeeld van dezelfde roos als HASH:

```text
HSET rose:42 species "Red Naomi" greenhouse "Amsterdam" embedding <binary FLOAT32>
```

Als JSON:

```json
{
  "species": "Red Naomi",
  "location": { "greenhouse": "Amsterdam" },
  "embedding": [0.12, -0.31, 0.84]
}
```

RediSearch onderhoudt boven de gekozen records een **secundaire index**. Records met het ingestelde key-prefix worden na `HSET` of `JSON.SET` automatisch geïndexeerd. Daarna kunnen beide opslagvormen met `FT.SEARCH` worden bevraagd via KNN, range en metadatafilters. De zoekvector wordt bij een query doorgaans als binaire vectorparameter aangeleverd, ook wanneer opgeslagen JSON-records hun vector als array bevatten.

**Keuzeregel:** gebruik HASH voor eenvoudige, vaste en compacte records. Gebruik JSON wanneer geneste objecten, arrays, gedeeltelijke updates of meerdere vectorvelden per document nodig zijn. JSON-vectoropslag vereist naast RediSearch ook de RedisJSON-module; plan de benodigde modules tijdens provisioning van Azure Managed Redis.

**Architectuurkeuzes met praktijkvoorbeelden:**

1. **Semantic cache voor een chatbot**
   - Bewaar per eerder gestelde vraag: prompt, antwoord, tenant, modelversie en één embedding.
   - Kies **HASH**, omdat het record plat en voorspelbaar is.
   - Gebruik **HNSW + COSINE + hybrid KNN**: filter eerst op tenant en modelversie en zoek daarna het meest vergelijkbare eerdere verzoek.
   - Gebruik een similarity/distance-drempel voordat je een antwoord hergebruikt; bij onvoldoende overeenkomst laat je het LLM een nieuw antwoord maken.

2. **Productcatalogus met aanbevelingen**
   - Een product bevat categorieën, varianten, kenmerken, voorraadlocaties en mogelijk meerdere afbeeldingen.
   - Kies **JSON** voor de geneste gegevens en arrays.
   - Gebruik **HNSW** voor een grote catalogus en hybrid KNN om bijvoorbeeld eerst op `inStock`, land en categorie te filteren.
   - Redis geeft snel vergelijkbare producten; een afzonderlijk bronsysteem blijft verantwoordelijk voor de definitieve product- en voorraaddata.

3. **Ziekteherkenning bij rozen**
   - Een visionmodel maakt een vector van de gescande roos.
   - Kies HASH voor één foto en eenvoudige kenmerken; kies JSON als één plant meerdere foto-embeddings, metingen en geneste kasinformatie heeft.
   - Gebruik **range search** wanneer alleen diagnoses boven een geteste kwaliteitsgrens mogen worden getoond.
   - Gebruik hybrid filtering op cultivar, groeifase of kas voordat de vectors worden vergeleken.

4. **RAG over bedrijfsdocumenten**
   - Bewaar originele bestanden duurzaam in Blob Storage/ADLS en eventueel verwerkte tabellen in Delta Lake.
   - Laat een pipeline documenten chunken, embeddings maken en alleen de zoekbare chunks plus metadata in Redis zetten.
   - Kies HASH voor één vast chunkrecord; kies JSON wanneer chunks, broninformatie en meerdere vectorvelden als één documentstructuur moeten worden beheerd.
   - Gebruik hybrid KNN met verplichte filters op `tenantId`, classificatie en toegangsrechten. Autorisatie mag niet alleen achteraf in de applicatie plaatsvinden.

5. **Kleine, exacte referentiedataset**
   - Bijvoorbeeld enkele duizenden gecertificeerde onderdelen of ziektebeelden.
   - Kies **FLAT** wanneer iedere vector exact moet worden vergeleken en de dataset klein genoeg is.
   - Kies range search als een onbekend object ook echt als *geen match* moet kunnen eindigen.

6. **Grote, latencygevoelige zoekdienst**
   - Bijvoorbeeld miljoenen producten, afbeeldingen of kennisfragmenten.
   - Kies **HNSW** voor lage querylatency en accepteer dat de zoekactie approximate is.
   - Reserveer extra geheugen voor de HNSW-graaf en benchmark recall, latency en kosten met representatieve data.

**Infrastructuurkeuzes voor alle RediSearch-scenario's:**

- **Enterprise clustering**, omdat RediSearch dit vereist; accepteer dat de proxy eerder een throughputgrens kan vormen dan bij OSS-clustering.
- **NoEviction** beschermt de samenhang tussen data en index, maar writes kunnen mislukken wanneer het geheugen vol is. Gebruik capaciteitsmarges en alerts.
- Kies Memory Optimized bij vooral veel vector-/indexdata, Compute Optimized bij zware queryvolumes en Balanced als startpunt voor gemengde belasting.
- Schakel RediSearch en eventueel RedisJSON bij provisioning in; wijziging achteraf vraagt doorgaans een nieuwe instance en migratie.
- Houd de duurzame bron buiten Redis wanneer data opnieuw opgebouwd moet kunnen worden. Redis is dan de snelle serving/indexlaag.
- Test altijd met echte aantallen, dimensies, filters en gelijktijdige queries; vectorindexen kunnen aanzienlijk meer geheugen gebruiken dan alleen de ruwe vectors.

**Beslisvolgorde:**

```text
Plat record?                 → HASH
Geneste data/arrays?         → JSON
Kleine dataset/exact nodig?  → FLAT
Groot en lage latency?       → HNSW
Altijd top K nodig?          → KNN
Kwaliteitsgrens nodig?       → RANGE
Tenant/categorie/ACL vereist?→ HYBRID FILTER + KNN/RANGE
```

**Vectorfuncties:**

- Opslag in Redis **HASH**- of **JSON**-records.
- Afstandsmetingen: **COSINE**, **L2** (Euclidische afstand) en **IP** (inner product).
- **KNN:** retourneert de `K` meest vergelijkbare vectors.
- **Vector range query:** retourneert alle vectors binnen een gekozen afstand.
- Metadatafilters op onder andere tags, tekst, numerieke waarden en geografische velden.
- Full-text search en vector search kunnen samen met filters worden gebruikt. Azure Managed Redis heeft geen ingebouwde semantische reranker; eventuele scorefusie of reranking moet de applicatie verzorgen.

**KNN, hybrid en range vergelijken:**

| Queryvorm | Betekenis | Resultaataantal | Praktijkvoorbeeld |
|---|---|---|---|
| **KNN** | Zoek de `K` dichtstbijzijnde vectors | Vast maximum, bijvoorbeeld top 5 | Geef altijd de vijf meest vergelijkbare productbeschrijvingen |
| **Hybrid/filter + KNN** | Filter eerst op metadata/tekst en voer binnen die geldige kandidaten KNN uit | Maximaal `K` | Zoek top 5 documenten, maar alleen voor `tenant=contoso` en `category=legal` |
| **Vector range** | Geef alle vectors terug die binnen een afstandsdrempel vallen | Variabel: nul, één of veel | Geef alleen resultaten die voldoende op de vraag lijken |

Vereenvoudigde RediSearch-vormen:

```text
KNN:     *=>[KNN 5 @embedding $query_vec]
Hybrid:  (@tenant:{contoso})=>[KNN 5 @embedding $query_vec]
Range:   @embedding:[VECTOR_RANGE 0.20 $query_vec]
```

Bij een distance score geldt doorgaans: **lager = dichterbij/beter**. KNN retourneert ook resultaten wanneer de beste matches nog steeds slecht zijn; een range query kan daarom nul resultaten teruggeven. Een hybrid query beschermt bijvoorbeeld tenant- en toegangsgrenzen en verkleint de kandidaatset. Dit Redis-gebruik van *hybrid* betekent vector search gecombineerd met filters of tekstvoorwaarden; het is niet automatisch dezelfde ingebouwde RRF/semantic-rankerflow als bij Azure AI Search.

**Voorbeeld: rozen scannen**

Een camera fotografeert een roos en een visionmodel maakt daarvan een embedding. In RediSearch staan embeddings en metadata van bekende rozen en ziektebeelden.

- **KNN:** geef de vijf referentiebeelden die het meest op de gescande roos lijken. Ook bij slechte overeenkomsten worden de beste beschikbare kandidaten teruggegeven.
- **Hybrid KNN:** filter eerst op bijvoorbeeld `kas=Amsterdam` en `soort=Red Naomi`, en zoek daarna de vijf meest vergelijkbare ziektebeelden binnen die selectie.
- **Range:** geef alleen ziektebeelden terug waarvan de vectorafstand maximaal `0.20` is.

Voorbeeldafstanden:

| Kandidaat | Afstand | Binnen range 0.20? |
|---|---:|---|
| Meeldauw A | 0.05 | Ja |
| Meeldauw B | 0.12 | Ja |
| Schimmel C | 0.18 | Ja |
| Bladluis D | 0.34 | Nee |

Een range query gebruikt dus een **kwaliteitsgrens**, geen vast resultaataantal. `0.00` betekent bij een afstandsmaat een identieke vector; hoe lager de score, hoe dichter de match. Een te strenge grens kan nul resultaten geven en een te ruime grens kan irrelevante matches toelaten. Bepaal de grens daarom met representatieve, gelabelde testdata en meet hoeveel juiste matches worden gevonden en hoeveel onjuiste matches worden toegelaten.

**Vectorindextypen:**

| Index | Werking | Wanneer gebruiken? |
|---|---|---|
| **FLAT** | Vergelijkt de query exact met alle vectors | Kleine datasets of wanneer exacte resultaten belangrijker zijn dan snelheid |
| **HNSW** | Benadert de nearest neighbors via een graaf | Grotere datasets en lage latency; sneller, maar gebruikt extra geheugen en kan een klein deel van de beste matches missen |

**Verplichte ontwerpkeuzes in Azure Managed Redis:**

- Activeer de **RediSearch-module tijdens het aanmaken**; een module kan niet later aan dezelfde instance worden toegevoegd.
- Kies **Enterprise clustering**. OSS clustering ondersteunt RediSearch niet.
- Kies de eviction policy **NoEviction**. Bij vol geheugen worden nieuwe writes geweigerd in plaats van bestaande geïndexeerde data ongemerkt te verwijderen.
- Gebruik Memory Optimized, Balanced of Compute Optimized. **Flash Optimized ondersteunt RediSearch niet.**
- Reserveer geheugen voor zowel vectors, metadata als de zoekindex; vooral HNSW heeft indexoverhead.
- De queryvector moet hetzelfde embeddingmodel, datatype en hetzelfde aantal dimensies gebruiken als het geïndexeerde vectorveld.

**Sterke toepassingen:** zeer snelle semantic caching, agent memory, aanbevelingen en RAG waarbij vectors dicht bij sessie- of cachedata moeten staan. Kies eerder **Azure AI Search** wanneer documentindexering, zoekbeheer en ingebouwde semantic ranking de kern van de oplossing vormen; kies Redis wanneer zeer lage latency en integratie met operationele cachedata centraal staan.

**Examenvallen:**

- RediSearch ≠ het embeddingmodel: Azure OpenAI of een ander model maakt de vectors; RediSearch bewaart, indexeert en vergelijkt ze.
- `DIM` moet exact overeenkomen met de dimensie van het embeddingmodel.
- **HNSW = snel en approximate**; **FLAT = exact en brute force**.
- `DIALECT 2` aan het einde van `FT.SEARCH` kiest versie 2 van de RediSearch-queryparser. Vector search en queryparameters zoals `$query_vec` vereisen dialect 2 of hoger. Het is geen SQL-dialect en verandert de opgeslagen data of index niet.
- RediSearch gevraagd → **Enterprise clustering + NoEviction + module bij provisioning + geen Flash Optimized**.
- Metadata zoals `tenantId` of access-controlvelden gebruiken om resultaten tot de juiste gebruiker of tenant te beperken.

Bronnen:

- https://learn.microsoft.com/en-us/azure/redis/overview-vector-similarity
- https://learn.microsoft.com/en-us/azure/redis/redis-modules
- https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/vector-search

### Redis Pub/Sub versus Redis Streams

Beide verspreiden berichten, maar hun betrouwbaarheid en gebruiksdoel verschillen sterk.

| Onderdeel | Redis Pub/Sub | Redis Streams |
|---|---|---|
| Model | Live kanaal met publishers en subscribers | Blijvend, geordend logboek van berichten |
| Schrijven/lezen | `PUBLISH` en `SUBSCRIBE`/`PSUBSCRIBE` | `XADD`, `XREAD` of `XREADGROUP` |
| Opslag | Berichten worden niet bewaard | Berichten blijven staan tot verwijdering of retentie |
| Ontvangers | Iedere actieve subscriber op het kanaal krijgt een kopie | Zonder group kunnen lezers onafhankelijk lezen; binnen één consumer group wordt werk verdeeld |
| Offline consumer | Mist berichten die tijdens de uitval zijn gepubliceerd | Kan later vanaf een stream-ID verder lezen |
| Acknowledgement | Geen | `XACK` binnen consumer groups |
| Pending/retry | Geen ingebouwde pendinglijst of recovery | Pending Entries List, `XPENDING`, `XCLAIM` en `XAUTOCLAIM` |
| Leveringskarakter | **At-most-once**: snel, maar een gemist bericht is weg | Met consumer groups gewoonlijk **at-least-once**; duplicaten zijn mogelijk |
| Goede toepassing | Live notificaties, invalidaties en vluchtige statusupdates | Jobs, events, audit trail, retries en herstel na een crash |

**Pub/Sub-flow:**

```text
publisher --PUBLISH--> kanaal --> actieve subscriber A
                             --> actieve subscriber B
```

De publisher wacht niet op verwerking en Redis bewaart het bericht niet. Een subscriber die niet verbonden is, ontvangt het bericht dus niet wanneer hij later terugkomt.

**Streams-flow:**

```text
producer --XADD--> opgeslagen stream --> consumers lezen en verwerken
                                      --> consumer group houdt pending bij
                                      --> na succes XACK
```

**Examenkeuze:**
- Alle nu verbonden clients moeten onmiddellijk dezelfde tijdelijke melding krijgen → **Pub/Sub**.
- Berichten mogen niet verdwijnen bij een disconnect, moeten opnieuw gelezen kunnen worden of vragen om retries/acknowledgements → **Streams**.
- Meerdere workers moeten ieder een deel van dezelfde werklast verwerken → **Streams met een consumer group**.

**Praktijkkeuze:**

- Gebruik **Pub/Sub** voor live dashboards, een typindicator in chat, cache invalidation en actuele koers- of sensordata waarbij een oude update na reconnect geen waarde meer heeft.
- Gebruik **Streams** voor bestellingen, betalingen, AI-documentverwerking, achtergrondtaken en andere processen waarbij ieder bericht verwerkt, bevestigd, opnieuw geprobeerd of later teruggelezen moet kunnen worden.
- Een echt chatbericht alleen via Pub/Sub versturen is riskant: een offline ontvanger mist het. Bewaar het bericht daarom in een database of Stream; gebruik Pub/Sub eventueel daarnaast voor de onmiddellijke live melding.
- Beide combineren kan nuttig zijn: **Streams voor betrouwbare opslag en verwerking; Pub/Sub voor snelle live verspreiding**.

| Praktijkvraag | Kies |
|---|---|
| Mag een bericht verloren gaan? | Pub/Sub |
| Moet een offline consumer later verder kunnen? | Streams |
| Moeten alle actieve ontvangers dezelfde live melding krijgen? | Pub/Sub |
| Moeten workers de berichten binnen één groep onderling verdelen? | Streams met consumer group |
| Zijn acknowledgements, retries of crash recovery nodig? | Streams |

**Nuance bij instabiele verbindingen:** Pub/Sub kan praktisch zijn wanneer alleen de actuele live-status telt en oude meldingen na reconnect waardeloos zijn. Er ontstaat dan geen achterstand die nog verwerkt moet worden. Het is echter niet betrouwbaarder: tijdens een verbroken verbinding gaan berichten verloren. Moet de client gemiste berichten alsnog ontvangen, gebruik dan Streams en hervat vanaf de laatst verwerkte stream-ID. Instabiel internet is op zichzelf dus geen reden om Pub/Sub te kiezen; de vraag is of gemiste berichten belangrijk zijn.

Ezelsbrug: **Pub/Sub is een live radio-uitzending; Streams is een logboek dat je later kunt teruglezen.**

Bron: https://redis.io/docs/latest/develop/interact/pubsub/

### Redis Streams: consumer groups, retries en crash recovery

Een **Redis Stream** is een geordend logboek van berichten. Ieder bericht krijgt een unieke ID. Anders dan bij Redis Pub/Sub blijven streamberichten opgeslagen totdat retentie of verwijdering ze opruimt.

| Commando | Functie |
|---|---|
| `XADD` | Voegt een bericht toe, bijvoorbeeld `XADD jobs * documentId 42`. Met `*` maakt Redis de ID. |
| `XREAD` | Leest berichten zonder consumer group. De client bewaart zelf vanaf welke ID hij verder leest; er is geen Pending Entries List of acknowledgment. |
| `XREADGROUP` | Levert berichten aan een consumer binnen een group. Met ID `>` vraag je nieuwe, nog niet aan de group geleverde berichten op. Geleverde berichten komen in de **Pending Entries List (PEL)**. |
| `XPENDING` | Toont niet-bevestigde berichten, hun eigenaar, idle time en delivery count. Dit gebruik je voor monitoring en retrybeslissingen. |
| `XACK` | Bevestigt succesvolle verwerking en verwijdert de referentie uit de PEL. Het streambericht zelf blijft bestaan. |
| `XCLAIM` | Draagt opgegeven pending message-ID's na een minimale idle time over aan een andere consumer. |
| `XAUTOCLAIM` | Zoekt en claimt automatisch een batch te lang idle pending berichten. Dit lijkt op `XPENDING` gevolgd door `XCLAIM`, maar scant met een cursor. |

**Normale consumer-groupflow:**

```text
Producer --XADD--> stream
                    |
              XREADGROUP GROUP workers worker-1 >
                    |
              bericht staat pending in de PEL
                    |
             verwerken is succesvol
                    |
                   XACK
                    |
              weg uit de PEL
```

1. Maak een group, bijvoorbeeld met `XGROUP CREATE jobs workers 0 MKSTREAM`.
2. Workers gebruiken ieder een unieke consumernaam en delen het werk binnen dezelfde group.
3. `XREADGROUP ... >` levert ieder nieuw bericht aan één consumer binnen die group.
4. Tijdens verwerking blijft het bericht pending.
5. Bevestig pas **na succesvolle verwerking** met `XACK`.

**Crash en recovery:**

1. `worker-1` ontvangt een bericht en crasht vóór `XACK`.
2. Het bericht blijft in de PEL staan en wordt niet vanzelf als nieuw bericht aan een andere consumer geleverd.
3. Start dezelfde consumer opnieuw, dan kan hij met `XREADGROUP` en een ID zoals `0` zijn eigen pending historie opnieuw lezen.
4. Komt die consumer niet terug, controleer dan met `XPENDING` welke berichten lang idle zijn en hoe vaak ze zijn aangeboden.
5. Laat een gezonde consumer de berichten overnemen met `XCLAIM`, of gebruik `XAUTOCLAIM` om idle berichten automatisch in batches over te nemen.
6. Verwerk opnieuw en voer daarna `XACK` uit.

**Belangrijke gevolgen:**

- Consumer groups leveren normaal **at-least-once**. Een crash kan dus tot dubbele verwerking leiden.
- Maak verwerking **idempotent**, bijvoorbeeld met message-ID's of een verwerkte-status.
- Gebruik idle time voordat je claimt; anders kunnen twee workers tegelijk aan hetzelfde langlopende werk zitten.
- Stel een maximaal aantal retries in op basis van de delivery count uit `XPENDING`. Verplaats een blijvend fout bericht eventueel met `XADD` naar een aparte dead-letter stream en bevestig daarna het origineel.
- Meerdere consumer groups kunnen dezelfde stream onafhankelijk verwerken. Binnen één group verdelen consumers de berichten.

**Ezelsbrug:** lezen → **pending** → verwerken → **ack**. Bij een crash: **pending bekijken → claimen → opnieuw verwerken → ack**.

Bronnen:

- https://redis.io/docs/latest/develop/data-types/streams/
- https://redis.io/docs/latest/commands/xadd/
- https://redis.io/docs/latest/commands/xread/
- https://redis.io/docs/latest/commands/xreadgroup/
- https://redis.io/docs/latest/commands/xpending/
- https://redis.io/docs/latest/commands/xack/
- https://redis.io/docs/latest/commands/xclaim/
- https://redis.io/docs/latest/commands/xautoclaim/


### Resource allocation, performance en kosten

- Stel per container/replica de benodigde **CPU en memory** in. Te laag geeft throttling, trage responses of OOM-restarts; te hoog betekent betaalde capaciteit die vaak ongebruikt blijft.
- Kijk samen naar: CPU- en geheugengebruik, requestlatency, foutpercentage, queue-lengte, restarts, actieve replicas en replica-uren.
- Kosten worden grofweg bepaald door **resources per replica × aantal actieve replicas × draaitijd**, plus onder meer requests, logging, netwerk en achterliggende diensten.
- Controleer daarom ook `minReplicas`, `maxReplicas` en de KEDA-drempel. Een hoog minimum kost continu geld; een te lage of te late schaalgrens kan performanceproblemen geven.
- Gebruik Azure Cost Management voor kosten en budgets, en Azure Monitor/Managed Prometheus met Grafana voor werkelijk resource- en applicatiegebruik. Koppel technische metrics waar nuttig aan businessmetrics, bijvoorbeeld kosten per 1.000 verwerkte orders.
- Optimalisatieroutine: meet representatief verkeer → vind de bottleneck → pas CPU/memory of code aan → stel autoscaling af → controleer performance én kosten opnieuw.

### Revisions en verkeersverdeling

- Een **revision** in Azure Container Apps is een onveranderlijke snapshot/versie van de container-app.
- **Single revision mode** is standaard: één revision is actief. De oude revision houdt 100% verkeer totdat de nieuwe revision gereed is en de startup- en readiness-probes zijn geslaagd; daarna schakelt Azure over.
- **Multiple revision mode:** meerdere revisions kunnen tegelijk actief zijn. Je verdeelt het verkeer met percentages die samen 100% zijn, bijvoorbeeld oud 90% en nieuw 10%.
- Gebruik multiple mode voor een canary release, blue-green deployment, gecontroleerde rollback of **A/B-test**. Voor een echte A/B-test moet je naast verkeer ook een meetbaar resultaat vastleggen, bijvoorbeeld conversie of foutpercentage.
- Een **revision label** is een vaste, leesbare naam zoals `staging` of `green` met een eigen URL die rechtstreeks naar één revision wijst. Je kunt het label later naar een andere revision verplaatsen terwijl de label-URL gelijk blijft.
- Labels en percentages werken los van elkaar: de normale app-URL volgt de traffic weights; de label-URL gaat rechtstreeks naar de gelabelde revision.
- In Container Apps stel je dit in onder **Revision management** en de kolom **Traffic**. CLI-voorbeeld: `az containerapp ingress traffic set --name <app> --resource-group <rg> --label-weight stable=90 candidate=10`.
- **App Service** gebruikt deployment slots in plaats van Container Apps-revisions. Onder **Deployment → Deployment slots** kun je in de kolom **Traffic %** een deel van het productieverkeer naar bijvoorbeeld de staging-slot sturen voor een gefaseerde test.
- Dit ingebouwde slotverkeer heet traffic routing. **Azure Traffic Manager** is een aparte DNS-dienst voor routering tussen publieke endpoints, vaak over regio's heen; het zit niet in het App Service Plan en is niet nodig voor een eenvoudige verdeling tussen App Service-slots.

### Lab 01 - ACR Tasks: examenfocus

- **ACR** bewaart en beheert containerimages; **ACR Tasks** bouwt, test en onderhoudt images in Azure.
- `az acr build` is een on-demand **quick task**: broncontext uploaden, image in Azure bouwen en bij succes naar ACR pushen. Lokale Docker is niet nodig.
- `az acr task create` maakt een blijvende taskdefinitie die handmatig of via een commit-, base-image- of tijdtrigger kan draaien.
- `az acr run --cmd ...` voert een containercommando als quick run in Azure uit; in het lab controleert dit of de Flask-app kan worden geïmporteerd.
- Structuur: **registry → repository → image manifest → tag(s)**.
- Een **tag** zoals `v1.0.0` is een leesbare, verplaatsbare verwijzing. Een **digest** zoals `sha256:...` identificeert exact dezelfde image-inhoud en is geschikt voor reproduceerbare deployments.
- Versietags zoals `v1.0.0` en `v1.1.0` kunnen naast elkaar naar verschillende manifests verwijzen. Vermijd `latest` voor productie als exacte reproduceerbaarheid nodig is.
- `az acr repository list` toont repositories; `show-tags` toont tags; `az acr manifest list-metadata` toont manifests en digests; `az acr task list-runs` toont buildhistorie en status.
- Een productietag locken met `--write-enabled false` beschermt tegen onbedoeld bijwerken en volgens ACR-lockgedrag ook tegen normale verwijdering. Voor alleen verwijderbeveiliging bestaat `--delete-enabled false`.
- Examenkeuze: cloudbuild zonder lokale Docker → **ACR Tasks / `az acr build`**; automatische herhaalbare build na Git- of base-imagewijziging → blijvende **ACR task met trigger**.
- **AcrPull** is een ingebouwde Azure RBAC-rol met alleen data-plane leesrechten op ACR: images/artifacts pullen en bijbehorende repository- en taginformatie lezen. De rol kan geen images pushen en kan de registry niet beheren.
- In lab 02 krijgt de system-assigned managed identity van de Web App `AcrPull` op de ACR-resource. App Service vraagt daarmee een Entra-token aan en haalt de private image op zonder opgeslagen registrywachtwoord.
- Least privilege: ken `AcrPull` toe op de ACR-scope en geen brede rol zoals Contributor op de hele resource group.
- Bij de klassieke modus **RBAC Registry Permissions** gebruik je `AcrPull`. Bij **RBAC Registry + ABAC Repository Permissions** gebruik je de ABAC-compatibele rol **Container Registry Repository Reader**, eventueel beperkt tot één repository.
- Een nieuwe role assignment kan enkele minuten nodig hebben om door te werken; een directe 401/403 of image-pullfout kan daardoor tijdelijk zijn.

## Dinsdag 6 oktober 2026

### Persistente opslag in Kubernetes/AKS

- Containers en pods zijn vervangbaar; hun lokale bestandssysteem is in beginsel tijdelijk. Gebruik een persistent volume als data een pod-restart of verplaatsing naar een andere node moet overleven.
- Keten: **Pod → volumeMount → PVC → PV → echte Azure-opslag**.
- **PV (PersistentVolume):** het daadwerkelijke storagevolume dat Kubernetes beheert; een cluster-resource.
- **PVC (PersistentVolumeClaim):** de aanvraag van een workload voor opslag. De claim noemt onder meer grootte, `StorageClass` en access mode; een PVC is namespace-gebonden.
- Een PV wordt exclusief aan één PVC gebonden: normaal een 1-op-1-binding. Meerdere pods kunnen diezelfde claim gebruiken als het opslagtype en de access mode dat toelaten.
- **StorageClass:** opslagprofiel met de CSI-provisioner en eigenschappen zoals schijftype/prestatieniveau, `reclaimPolicy`, `volumeBindingMode` en of uitbreiding is toegestaan.
- Bij **dynamic provisioning** maakt Kubernetes via de StorageClass automatisch een PV en de onderliggende Azure Disk of Azure Files-share aan zodra een passende PVC wordt aangevraagd.
- Zonder opgegeven `storageClassName` gebruikt Kubernetes de default StorageClass, als die aanwezig is.
- Access modes:
  - **RWO – ReadWriteOnce:** read/write gemount door één **node** tegelijk. Meerdere pods op diezelfde node kunnen de claim technisch nog delen; RWO betekent dus niet strikt één pod.
  - **RWX – ReadWriteMany:** read/write door meerdere nodes tegelijk; geschikt voor gedeelde bestanden.
  - **ROX – ReadOnlyMany:** read-only door meerdere nodes.
  - **RWOP – ReadWriteOncePod:** read/write door precies één pod in het hele cluster; beschikbaar voor ondersteunde CSI-volumes.
- In AKS: **Azure Disk** is normaal RWO en past bij snelle, node-gebonden block storage. **Azure Files** ondersteunt RWX via SMB/NFS en past bij gedeelde bestanden tussen meerdere nodes/pods.
- `reclaimPolicy: Delete` verwijdert normaal het dynamisch gemaakte volume nadat de claim wordt vrijgegeven; `Retain` bewaart het volume voor handmatige terugwinning. Controleer dit om dataverlies te voorkomen.
- `allowVolumeExpansion: true` maakt vergroten via de PVC mogelijk als de driver dit ondersteunt; volumes verkleinen wordt niet ondersteund.
- Examenkeuze: één node, lage latency of databasevolume → vaak Azure Disk/RWO. Meerdere replicas op verschillende nodes moeten dezelfde bestanden schrijven → Azure Files/RWX.
- StatefulSets gebruiken vaak `volumeClaimTemplates`, zodat iedere replica een eigen stabiele PVC krijgt.

#### `storageClassName: managed-csi` in AKS

`managed-csi` is een ingebouwde AKS StorageClass voor dynamisch aangemaakte **Azure Managed Disks**. `managed` verwijst naar Azure Managed Disk; `csi` staat voor **Container Storage Interface**, de standaard waarmee Kubernetes een opslagdriver aanroept.

```text
Pod -> PVC -> StorageClass managed-csi -> Azure Disk CSI-driver -> Azure Managed Disk/PV
```

Voorbeeld van een opslagaanvraag:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: api-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: managed-csi
  resources:
    requests:
      storage: 10Gi
```

AKS maakt hierdoor automatisch een passende Azure Managed Disk en een PV, en bindt die aan de PVC. Een pod verwijst vervolgens naar `claimName: api-data` en mount het volume bijvoorbeeld op `/data`. De gegevens blijven bestaan wanneer alleen de pod opnieuw wordt gestart of vervangen.

- `managed-csi`: Standard SSD Azure Disk; in veel configuraties LRS. Op AKS 1.29 en hoger gebruikt de ingebouwde klasse bij clusters over meerdere availability zones Standard SSD ZRS.
- `managed-csi-premium`: Premium SSD Azure Disk voor hogere prestaties en lagere latency.
- `managed-csi-premium-v2`: Premium SSD v2 op ondersteunde recente AKS-versies.
- `azurefile-csi`: Azure Files; meestal de betere keuze wanneer pods op meerdere nodes dezelfde bestanden via RWX moeten delen.
- De ingebouwde `managed-csi` ondersteunt volume-uitbreiding en gebruikt standaard een `Delete` reclaim policy: wanneer het bijbehorende PV wordt verwijderd, wordt de dynamisch gemaakte Azure Disk ook verwijderd.
- Azure Disk wordt meestal met `ReadWriteOnce` gebruikt: beschrijfbaar gekoppeld aan één node tegelijk. Voor gedeelde opslag over meerdere nodes is Azure Files/RWX gebruikelijker.
- Zonder expliciete `storageClassName` gebruikt AKS de default StorageClass; in AKS verwijst `default` naar dezelfde opslagklasse als `managed-csi`.

Ezelsbrug: **de PVC zegt hoeveel opslag nodig is; de StorageClass zegt welk soort opslag AKS moet maken.**

- Bronnen:
  - https://kubernetes.io/docs/concepts/storage/persistent-volumes/
  - https://kubernetes.io/docs/concepts/storage/storage-classes/
  - https://learn.microsoft.com/en-us/azure/aks/concepts-storage
  - https://learn.microsoft.com/en-us/azure/aks/azure-disk-volume

### Azure Storage-redundantie

- Waarschijnlijk wordt met **2RS** eigenlijk **ZRS** bedoeld; `2RS` is geen standaard Azure Storage-redundantieoptie.
- **LRS – Locally Redundant Storage:** drie synchrone kopieën binnen één fysiek datacenter in de primaire regio. Goedkoopst; beschermt tegen disk-, server- en rackuitval, maar niet tegen verlies van het hele datacenter.
- **ZRS – Zone-Redundant Storage:** synchrone kopieën verdeeld over drie of meer availability zones binnen dezelfde regio. Beschermt tegen uitval van een volledig datacenter/zone; lage latency en geen tweede regio.
- **GRS – Geo-Redundant Storage:** LRS in de primaire regio plus asynchrone replicatie naar een tweede, gekoppelde regio, waar opnieuw LRS wordt gebruikt. Beschermt de data tegen regionale uitval, maar vereist failover voordat de secundaire kopie normaal toegankelijk wordt.
- **RA-GRS – Read-Access GRS:** GRS met daarnaast permanente read-only toegang tot het secundaire endpoint. Het primaire endpoint blijft read/write; naar de secundaire regio kan niet worden geschreven.
- Voor Blob Storage heeft het secundaire endpoint bijvoorbeeld de vorm `https://<account>-secondary.blob.core.windows.net`. De applicatie of SDK moet dit endpoint bewust gebruiken of voor secundaire reads configureren; RA stuurt requests niet automatisch naar de tweede regio.
- Omdat geo-replicatie asynchroon is, kan een read uit het secundaire endpoint iets oudere data teruggeven. Read access verhoogt de leesbeschikbaarheid, maar garandeert geen actuele kopie of automatische failover.
- **GZRS – Geo-Zone-Redundant Storage:** ZRS in de primaire regio plus asynchrone geo-replicatie naar LRS in een tweede regio. Beschermt zowel tegen zone- als regio-uitval.
- **RA-GZRS:** GZRS met read-only toegang tot de secundaire regio; hoogste beschikbaarheids-/duurzaamheidsoptie, maar doorgaans ook het duurst.
- Geo-replicatie is asynchroon. Bij een plotselinge regionale ramp kan de laatste nog niet gerepliceerde data verloren gaan; redundantie betekent dus niet automatisch RPO = 0.
- Redundantie kopieert ook fouten zoals overschrijven of verwijderen. Gebruik versiebeheer, soft delete en backups voor bescherming tegen menselijke fouten/ransomware.
- Examenkeuze:
  - laagste kosten en uitval van één datacenter acceptabel → **LRS**;
  - datacenter/zone-uitval opvangen binnen dezelfde regio → **ZRS**;
  - bescherming tegen hele regio-uitval → **GRS**;
  - daarnaast lezen uit secundaire regio vóór failover → **RA-GRS**;
  - zonebescherming én regiobescherming → **GZRS/RA-GZRS**.
- Voor AKS gedeelde opslag via Azure Files is ZRS vaak logisch voor hoge beschikbaarheid binnen de regio. Ondersteuning en prijs verschillen per opslagdienst, tier en regio.
- Bron: https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy

### Block Blob, Append Blob en Page Blob

- Azure Blob Storage is object storage voor ongestructureerde data. Hiërarchie: **storage account → blob container → blob**. Een blob container is een opslagmap/namespace en heeft niets te maken met een Docker-container.
- **Block Blob:** opgebouwd uit afzonderlijke blokken die parallel kunnen worden geüpload en daarna als één blob worden vastgelegd. Beste algemene keuze voor documenten, afbeeldingen, video, backups, JSON/CSV/Parquet en data-lakebestanden.
- Block blobs zijn geoptimaliseerd voor grote uploads, downloads en streaming, niet voor veel kleine wijzigingen midden in hetzelfde bestand. Maximumgrootte is momenteel ongeveer 190,7 TiB, afhankelijk van serviceversie en uploadmethode.
- **Append Blob:** gebruikt ook blokken, maar nieuwe blokken kunnen alleen aan het **einde** worden toegevoegd. Geschikt voor append-only logging, auditregels en telemetry die chronologisch groeit.
- Conceptueel groeit een log bijvoorbeeld van `08:00 gestart` naar `08:00 gestart → 08:01 ingelogd → 08:03 bestand geüpload`; eerder geschreven inhoud blijft staan en iedere nieuwe entry komt achteraan.
- Ezelsbrug: **een Append Blob is een schrift waarin je alleen op de volgende lege regel mag schrijven.**
- Append Blob is geen message queue: entries worden niet afzonderlijk bevestigd of verwijderd en er zijn geen ingebouwde retries of dead-letter queue. Gebruik Service Bus of Queue Storage wanneer afzonderlijke work items betrouwbaar moeten worden verwerkt.
- Append Blob is geen goede keuze als bestaande inhoud willekeurig moet worden gewijzigd. Voor gelijktijdige writers zijn append-position conditions of andere coördinatie nodig om volgorde en conflicten te beheersen.
- **Page Blob:** bestaat uit pagina's van 512 bytes en ondersteunt snelle random read/write van byte-ranges. Geschikt voor sparse bestanden, VHD's en disk-/databaseachtige workloads.
- **VHD = Virtual Hard Disk:** bestand dat zich voor een virtuele machine gedraagt als een fysieke harde schijf. Het kan een besturingssysteem, partities, bestandssysteem en gewone bestanden bevatten.
- Een VM leest en schrijft verspreid over de virtuele disk. Daarom past een VHD bij Page Blob met random read/write en niet bij Append Blob.
- **VHDX:** uitgebreidere opvolger van VHD, geïntroduceerd met Windows Server 2012. Microsoft geeft de `X` geen formele losse betekenis; onthoud hem als de extended variant. VHDX ondersteunt onder meer maximaal 64 TB, 4-KB-sectoren, betere uitlijning, metadata en herstelbescherming bij stroomuitval. Klassieke VHD ondersteunt maximaal 2 TB.
- Voor lokale Hyper-V heeft VHDX meestal de voorkeur. Voor Azure-upload gelden disk- en VM-eisen; controleer altijd de actuele doeldiskvereisten.
- Bij Azure Managed Disks beheert Azure de onderliggende opslag; je beheert niet zelf het Page Blob-bestand of storage account.
- Page blobs zijn de basis voor Azure IaaS-schijven en kunnen maximaal 8 TiB groot zijn. Ze ondersteunen alleen de Hot access tier.
- Het blobtype wordt bij creatie gekozen en kan niet rechtstreeks worden gewijzigd; voor conversie kopieer je de data naar een nieuwe blob van het gewenste type.
- Examenkeuze:
  - normaal bestand/object of data lake → **Block Blob**;
  - alleen regels achteraan toevoegen → **Append Blob**;
  - willekeurige blokken/pagina's in een virtuele disk wijzigen → **Page Blob**.
- Bronnen:
  - https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction
  - https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-pageblob-overview

### Storage tiering

- **Storage tiering** plaatst Block Blob-data in een access tier die past bij hoe vaak de data wordt gelezen. Koudere tiers verlagen opslagkosten maar verhogen lees-, transactie- en eventuele herstelkosten.
- **Hot:** online, milliseconden; vaak gelezen/gewijzigd; hoogste opslagprijs en laagste toegangskosten.
- **Cool:** online, milliseconden; weinig gebruikt; aanbevolen minimale bewaartijd 30 dagen.
- **Cold:** online, milliseconden; zelden gebruikt maar direct beschikbaar; aanbevolen minimale bewaartijd 90 dagen.
- **Archive:** offline en goedkoopste opslag; eerst **rehydrateren** naar een online tier voordat de inhoud leesbaar is. Dit kan uren duren; aanbevolen minimale bewaartijd 180 dagen.
- **Smart tier** verplaatst data automatisch tussen Hot, Cool en Cold op basis van gebruikspatronen; Archive valt daar niet automatisch onder.
- Met **Lifecycle Management** kun je regels maken, bijvoorbeeld: na 30 dagen naar Cool, na 90 dagen naar Cold, na 180 dagen naar Archive en na 7 jaar verwijderen.
- Access tiering geldt voor **Block Blobs**, niet voor Append Blobs en Page Blobs.
- Archive wordt alleen ondersteund bij LRS, GRS en RA-GRS, niet bij ZRS, GZRS of RA-GZRS.
- Examenval: goedkoopste opslag is niet automatisch goedkoopste totaaloplossing. Houd rekening met leesfrequentie, retrieval, transacties, rehydrationtijd en early-deletionkosten.
- Bron: https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview

### Data lake, snelle analyse en fraudedetectie

- Een **data lake** is primair goedkope, schaalbare opslag voor grote hoeveelheden ruwe en verwerkte data. Het is niet automatisch een database voor milliseconde-lookups.
- Snelle analyse ontstaat door de combinatie van opslag en compute/querytechniek: Parquet/Delta, goede partitionering, grotere bestanden, metadata/indexen, caching en engines zoals Databricks/Spark, Synapse, Fabric of Azure Data Explorer.
- **Parquet** is kolomgeoriënteerd: een query hoeft alleen relevante kolommen en datablokken te lezen. **Partition pruning** slaat mappen/partities over die niet aan het filter voldoen.
- Veel kleine bestanden veroorzaken listing- en metadata-overhead; compaction naar grotere bestanden verbetert doorgaans analytics-performance en verlaagt transactiekosten.
- Voor zeer snelle operationele lookups of transacties wordt data meestal vanuit het lake naar een geschikte serving-laag gebracht, bijvoorbeeld Cosmos DB, Redis, Azure Data Explorer, een zoekindex, relationele database of graph database.
- Analysepatronen die vroeger vooral bij inlichtingen- en opsporingsdiensten voorkwamen zijn nu breed commercieel beschikbaar. Denk aan **entity resolution**, link-/netwerkanalyse, graph analytics, anomaliedetectie en patroonherkenning. Het is niet precies vast te stellen dat al deze technieken daar oorspronkelijk vandaan komen.
- Voorbeeld witwasdetectie: combineer transacties, rekeningen, klanten, apparaten, IP-adressen en bedrijfsrelaties; koppel identiteiten; zoek circulaire geldstromen, snelle doorboekingen, ongebruikelijke bedragen, gedeelde apparaten en verborgen netwerken; geef risicosignalen aan menselijke onderzoekers.
- Typische keten: **bronnen → ingestie/streaming → data lake → opschonen en entity resolution → graph/ML/rules → alerts/cases → menselijke beoordeling**.
- Een model of regel levert een risicosignaal, geen bewijs. Privacy, toegangsbeheer, lineage, uitlegbaarheid, bias/false positives en menselijke controle zijn essentieel.
- Examenpunt: scheid **storage** van **compute**. ADLS bewaart; een analytics- of database-engine verwerkt, indexeert en serveert de data.
- Bronnen:
  - https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-best-practices
  - https://learn.microsoft.com/en-us/azure/data-explorer/external-azure-storage-tables-query

### ADLS, HDFS, NTFS en POSIX

- **ADLS Gen2** is geen afzonderlijk opslagsysteem: het zijn data-lakefuncties boven Azure Blob Storage, geactiveerd met **Hierarchical Namespace (HNS)**.
- HNS geeft echte directory- en bestandshiërarchie. Een map hernoemen of verwijderen wordt een efficiënte, atomische metadataoperatie in plaats van alle blobs met hetzelfde padprefix één voor één te verwerken.
- **HDFS – Hadoop Distributed File System:** gedistribueerd bestandssysteem voor big-data-clusters. De NameNode beheert metadata en paden; DataNodes bewaren gerepliceerde datablokken en leveren de werkelijke I/O.
- **HDFS en Parquet zijn verschillende lagen:** HDFS bepaalt waar de bytes van een bestand verdeeld en gerepliceerd worden opgeslagen; Parquet bepaalt hoe rijen en kolommen binnen dat bestand zijn gecodeerd.
- Een groot `verkopen.parquet`-bestand kan door HDFS in blokken over meerdere DataNodes worden verdeeld. Binnen het bestand organiseert Parquet de data in row groups en column chunks. Spark kan daardoor alleen relevante Parquet-kolommen/-groepen opvragen, terwijl HDFS de benodigde bestandsblokken levert.
- Ezelsbrug: **HDFS = magazijn; Parquet = manier waarop de dozen zijn ingepakt; Spark = medewerker die de data verwerkt.**
- Traditioneel: `Spark → HDFS → Parquet-bestanden`. In Azure vaak: `Databricks/Spark → ADLS Gen2 → Parquet-bestanden`.
- Voorbeeldpad in HDFS: `hdfs:///data/verkopen.parquet`. Voorbeeldpad in ADLS Gen2: `abfss://data@mijnaccount.dfs.core.windows.net/verkopen.parquet`.
- ADLS is **Hadoop-compatible**, maar is geen HDFS-cluster. Hadoop/Spark gebruikt de **ABFS-driver** om ADLS via de `dfs.core.windows.net` REST-interface te benaderen.
- Veilige URI-vorm: `abfss://<container>@<account>.dfs.core.windows.net/<pad>/<bestand>`; `abfss` gebruikt TLS.
- **NTFS – New Technology File System:** lokaal Windows-bestandssysteem voor disks/volumes, met Windows-eigenschappen en ACL's. NTFS is niet ontworpen als cloudobjectopslag of Hadoop-distributed filesystem.
- **POSIX – Portable Operating System Interface:** verzameling Unix-achtige standaarden voor onder meer bestandsoperaties en permissies. Relevante rechten zijn `r` (read), `w` (write) en `x` (execute/traverse).
- ADLS ondersteunt **POSIX-achtige ACL's** op directories en bestanden voor Entra-gebruikers, groepen, service principals en managed identities. Het ondersteunt daarnaast Azure RBAC.
- Azure RBAC geeft doorgaans bredere toegang op subscription/resource group/storage account/container; ACL's regelen fijnmazige toegang tot specifieke paden. Een toepasselijke RBAC-data-rol kan ACL-controle overstijgen, dus ontwerp beide samen.
- Bij directories betekent `x` dat een identiteit het pad mag doorlopen. Zonder execute-permissie op een bovenliggende directory is een onderliggend bestand niet bereikbaar, ook als het bestand zelf leesrechten heeft.
- **Access ACL** geldt voor het bestaande item. **Default ACL** op een directory wordt als uitgangspunt geërfd door nieuwe onderliggende bestanden en mappen; bestaande kinderen veranderen niet automatisch.
- Examen-ezelsbrug: **Blob + HNS + ACL's + ABFS = ADLS Gen2**.
- Bronnen:
  - https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction
  - https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-abfs-driver
  - https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control
  - https://hadoop.apache.org/docs/r3.3.4/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html
  - https://parquet.apache.org/docs/overview/

### Cosmos DB: wereldwijde regio's

- Bij **provisioned throughput** heeft Cosmos DB geen vaste limiet op het aantal regio's: je kunt alle ondersteunde Azure-regio's toevoegen.
- Het is dus praktisch niet letterlijk eindeloos, maar wel: **zoveel als er geschikte Azure-regio's beschikbaar zijn**.
- Uitzondering: een **serverless** Cosmos DB-account ondersteunt maar **één regio**.
- Iedere extra regio krijgt een volledige kopie van de data en kan lokale reads afhandelen.
- **Single-region write:** één schrijfregio; andere regio's zijn leesregio's en kunnen bij failover worden ingezet.
- **Multi-region writes:** iedere ingestelde regio kan schrijven; sneller voor wereldwijde apps, maar duurder en conflict resolution wordt belangrijk.
- Kostenwaarschuwing: bij provisioned throughput geldt grofweg `ingestelde RU/s × aantal regio's`; opslag wordt eveneens per regio gerepliceerd.
- Met `PreferredRegions`/`PreferredLocations` laat je de SDK de dichtstbijzijnde beschikbare regio gebruiken.

**Examenvalkuil:** “Cosmos DB ondersteunt maar één regio” is alleen waar voor **serverless**. Bij provisioned throughput is wereldwijde distributie juist een kernfunctie.

### Cosmos DB-consistentieniveaus

Van sterk naar zwak:

| Niveau | Wat garandeert het? | Wanneer passend? |
|---|---|---|
| **Strong** | Iedere read ziet de laatst bevestigde write. | Absolute actualiteit en globale volgorde zijn belangrijker dan latency en beschikbaarheid. |
| **Bounded staleness** | Reads mogen hoogstens een ingesteld aantal versies of tijdseenheid achterlopen. | Voorspelbare maximale achterstand met behoud van volgorde. |
| **Session** | Binnen dezelfde clientsessie gelden read-your-writes en geordende reads. | Meeste gebruikersgerichte apps; dit is standaard voor nieuwe accounts. |
| **Consistent prefix** | Writes verschijnen altijd in de juiste volgorde, maar mogelijk met achterstand. | Volgorde is belangrijk, directe actualiteit niet. |
| **Eventual** | Replica's worden uiteindelijk gelijk; tussentijds kunnen reads ouder en ongeordend zijn. | Maximale beschikbaarheid en lage latency bij weinig eisen aan actualiteit. |

**Ezelsbrug:** **S**trong → **B**ounded staleness → **S**ession → Consistent **P**refix → **E**ventual.

- Strong en bounded staleness kosten voor reads doorgaans ongeveer tweemaal zoveel RU als session, consistent prefix en eventual.
- Een **session token** draagt de voortgang van een sessie over. Geef het token mee wanneer read-your-writes over verschillende SDK-instanties of processen behouden moet blijven.
- De sentinel van Azure App Configuration staat hier los van: een Cosmos DB-session token gaat over databaseconsistentie.

**Examentip:** kies het zwakste niveau dat nog aan de zakelijke eis voldoet. Dat geeft meestal betere latency, beschikbaarheid en lagere RU-kosten.

Bron: https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels

### Cosmos DB-smaken (API's)

De API bepaalt welk datamodel, welke drivers en welke querytaal je gebruikt:

| API | Model / taal | Wanneer kiezen? |
|---|---|---|
| **Cosmos DB for NoSQL** | JSON-documenten, Cosmos SQL | Standaard voor nieuwe Cosmos DB- en AI/RAG-apps; snelste toegang tot nieuwe Cosmos-functies. |
| **Cosmos DB for MongoDB** | Documenten, BSON, MongoDB-drivers | Bestaande MongoDB-app migreren of MongoDB-tools blijven gebruiken. |
| **Cosmos DB for Apache Cassandra** | Wide-column, CQL | Bestaande Cassandra-workload migreren. |
| **Cosmos DB for Apache Gremlin** | Graph: vertices en edges, Gremlin | Relaties en paden onderzoeken, zoals sociale netwerken of fraudeverbanden. |
| **Cosmos DB for Table** | Key-value/tabellen, Table API | Eenvoudige en snelle lookups met `PartitionKey` en `RowKey`; compatibel met Azure Table Storage. |

- **Examentip:** voor een nieuwe AI/RAG-oplossing zonder bestaande database-eis is **API for NoSQL** meestal het beste antwoord.
- Kies een compatibiliteits-API vooral als bestaande code, drivers of een bestaand datamodel dat vereisen.
- **Azure Cosmos DB for PostgreSQL** kan nog in ouder materiaal staan, maar zit op een retirementpad en wordt niet aanbevolen voor nieuwe projecten.

### Capaciteitseenheden: DTU, RU en SU

| Eenheid | Azure-dienst | Betekenis | Gebruik en kosten |
|---|---|---|---|
| **DTU** | Azure SQL Database | **Database Transaction Unit** | Bundel van CPU, geheugen, reads en writes. Je kiest een DTU-tier en betaalt voor die gereserveerde capaciteit. |
| **RU** | Azure Cosmos DB | **Request Unit** | Meet het werk van databaseacties. Een point read van een item van circa 1 KB kost ongeveer 1 RU; grotere documenten, writes en complexe queries kosten meer. |
| **SU** | Azure Stream Analytics | **Streaming Unit** | Rekencapaciteit voor een streaming job: CPU en geheugen voor het verwerken van continue eventstromen. Meer SUs geven meer capaciteit en hogere kosten. |

**RU-kostenmodellen:**
- **Provisioned throughput:** een vast aantal `RU/s`; betaling voor de ingestelde capaciteit, ook wanneer je die niet volledig gebruikt.
- **Autoscale:** Azure schaalt RU/s automatisch tot het ingestelde maximum.
- **Serverless:** betaling voor werkelijk verbruikte RUs en opslag; geschikt voor onregelmatige of lage belasting.
- Bij onvoldoende RU/s krijg je throttling: HTTP-status **429 Too Many Requests**. De SDK kan opnieuw proberen.

**SU-signalen:**
- Monitor `SU % Utilization`, input backlog en watermark delay.
- Rond of boven **80% SU-gebruik**: onderzoek de query/partitionering of schaal op.
- **SU V2** is de aanbevolen structuur; SU V1 wordt uitgefaseerd.
- Extra SUs helpen alleen goed als de input en query parallel verwerkt kunnen worden, bijvoorbeeld met partities en `PARTITION BY`.

**Ezelsbrug:** **D**TU = SQL-**D**atabase, **R**U = database-**R**equests, **S**U = **S**treamverwerking.

### Andere Azure-capaciteitseenheden

| Eenheid | Dienst | Wat schaalt ermee? |
|---|---|---|
| **vCore** | Azure SQL/PostgreSQL e.a. | Expliciet aantal virtuele CPU-cores; transparanter dan het gebundelde DTU-model. |
| **TU** | Event Hubs Standard | **Throughput Unit** voor ingress en egress. Eén TU: maximaal circa 1 MB/s of 1.000 events/s ingress en 2 MB/s egress. |
| **PU** | Event Hubs Premium | **Processing Unit** met geïsoleerde CPU- en geheugenresources. |
| **CU** | Event Hubs Dedicated | **Capacity Unit** voor capaciteit van een dedicated cluster. |
| **SU** | Azure AI Search | Hier betekent SU **Search Unit**, dus iets anders dan Streaming Unit. `Search Units = replicas × partitions`. |
| **DWU** | Synapse dedicated SQL pool | **Data Warehouse Unit**: gebundelde compute-, geheugen- en I/O-capaciteit. |

**Azure AI Search-examentip:**
- **Replicas** verhogen querycapaciteit en beschikbaarheid.
- **Partitions** verhogen opslag en indexeringscapaciteit.
- Voorbeeld: 3 replicas × 2 partitions = **6 Search Units** en dus meer kosten.

**Let op de context:** `SU` kan **Streaming Unit** in Stream Analytics of **Search Unit** in Azure AI Search betekenen.

### PostgreSQL pgvector: dimensies en HNSW-instellingen

De extensie **pgvector** voegt een vectortype en vector search toe aan PostgreSQL. In deze tabel betekent `vector(330)` dat iedere opgeslagen embedding exact **330 getallen/dimensies** moet bevatten:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    price NUMERIC(10, 2),
    embedding vector(330)
);
```

Het getal `330` wordt bepaald door het gebruikte embeddingmodel of door de ingestelde outputdimensie; het is geen algemene PostgreSQL-standaard. Controleer de lengte bijvoorbeeld in Python met `len(embedding)` of in PostgreSQL met `vector_dims(embedding)`. De opgeslagen productvectoren en de queryvector moeten hetzelfde model en dezelfde dimensie gebruiken. **ELI5:** `vector(330)` is een kast met precies 330 vakjes; iedere embedding moet alle 330 vakjes vullen.

**HNSW** staat voor **Hierarchical Navigable Small World**. Het is een approximate-nearest-neighbor-index die vectors in meerdere lagen als een graaf met verbindingen organiseert. De bovenste, grove lagen brengen de zoekactie snel naar het juiste gebied; de onderste laag zoekt daar nauwkeuriger naar nabije vectors. Een HNSW-index voor cosine distance kan er zo uitzien:

```sql
CREATE INDEX products_embedding_idx
ON products USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

- `vector_cosine_ops`: bouw de index voor cosine distance; zoek ermee via de operator `<=>`.
- `m`: ongeveer hoeveel verbindingen iedere vector in de HNSW-graaf krijgt. Hoger geeft doorgaans betere recall, maar gebruikt meer geheugen, maakt de index groter en maakt bouwen/inserts duurder.
- `ef_construction`: hoeveel kandidaatburen HNSW tijdens het bouwen onderzoekt om goede verbindingen te kiezen. Hoger geeft doorgaans een betere graaf, maar een tragere indexbouw en duurdere inserts.
- `ef_search`: aparte query-instelling voor hoeveel kandidaten tijdens het zoeken worden onderzocht. Hoger geeft doorgaans betere recall, maar tragere queries.

```sql
SET hnsw.ef_search = 100;

SELECT *
FROM products
ORDER BY embedding <=> :query_embedding
LIMIT 10;
```

**ELI5:** `m` is hoeveel **maatjes** een product in het netwerk mag hebben. `ef_construction` is uit hoeveel kandidaten die maatjes bij het **construeren** worden gekozen. `ef_search` is hoe uitgebreid je later **zoekt**.

| Instelling | Moment | Gevolg van hoger instellen |
|---|---|---|
| `m` | Structuur van de index | Meer verbindingen en meestal betere recall; meer geheugen en opslag |
| `ef_construction` | Indexbouw en inserts | Betere graaf; langzamere bouw en inserts |
| `ef_search` | Zoekquery | Meestal betere recall; hogere querylatency |

**Afstandsmaat kiezen:** volg eerst de documentatie van het embeddingmodel. De operator in de query en de operator class van de index moeten bij dezelfde afstandsmaat horen.

| Methode | Queryoperator | Index operator class | Wanneer gebruiken? |
|---|---|---|---|
| **Cosine distance** | `<=>` | `vector_cosine_ops` | Meestal voor semantische tekstsearch en RAG; vergelijkt vooral de richting/betekenis |
| **L2 / Euclidean distance** | `<->` | `vector_l2_ops` | Wanneer het model voor Euclidische afstand is ontworpen; meet de rechte afstand tussen vectorpunten |
| **Negative inner product** | `<#>` | `vector_ip_ops` | Vaak bij recommendationmodellen; richting en vectorgrootte tellen mee |
| **L1 / Manhattan distance** | `<+>` | `vector_l1_ops` | Specialistische numerieke toepassingen; telt de absolute verschillen per dimensie op |
| **Hamming distance** | `<~>` | `bit_hamming_ops` | Binaire vectors of hashes; telt hoeveel bits verschillen |
| **Jaccard distance** | `<%>` | `bit_jaccard_ops` | Binaire vectors; vergelijkt de overlap tussen verzamelingen actieve bits |

Bij afstandsoperators geldt **lager = dichterbij/betere match**. pgvector geeft bij `<#>` expres de negatieve inner product terug, zodat PostgreSQL de index oplopend kan doorzoeken. Cosine similarity kan worden berekend als `1 - cosine distance`.

Wanneer vectors allemaal naar dezelfde lengte zijn genormaliseerd, geven cosine, inner product en L2 vaak dezelfde rangorde, maar andere scorewaarden. Wissel de methoden daarom niet willekeurig om en bouw de index voor de methode die de applicatie werkelijk gebruikt.

**Examenregel:** dimensies moeten overeenkomen. `m` bepaalt de verbindingen, `ef_construction` de grondigheid tijdens de bouw en `ef_search` de grondigheid tijdens de zoekopdracht.

Bron:

- https://github.com/pgvector/pgvector/blob/master/README.md

### Cosmos DB-scripts en bestandsextensie

Bij **Cosmos DB for NoSQL** zijn er drie soorten server-side scripts:

| Script | Functie |
|---|---|
| **Stored procedure** | Voert meerdere databasehandelingen transactioneel uit. |
| **Trigger** | Draait vóór of na een opgegeven schrijfhandeling: pre-trigger of post-trigger. |
| **UDF** | User-defined function voor eigen berekeningen binnen een query. |

- Deze scripts worden geschreven in **JavaScript**; lokaal gebruik je normaal de extensie **`.js`**.
- De documenten/data in Cosmos DB zijn **JSON** en kunnen lokaal als **`.json`** worden opgeslagen. **JSON bevat data; JavaScript bevat uitvoerbare logica.**
- Ook een ARM-template kan een `.json`-bestand zijn, maar dat beschrijft infrastructuur en is geen Cosmos DB server-side script.
- In Cosmos DB wordt het script geregistreerd met een **ID en JavaScript-body**. De portal vereist daardoor niet letterlijk een bestandsnaam of extensie.
- Stored procedures en triggers zijn transactioneel, maar altijd begrensd tot **één logische partitie**. Bij uitvoering moet je de partition key meegeven.
- Cosmos DB-triggers starten niet vanzelf: de applicatie moet bij de databaseoperatie aangeven welke trigger moet worden uitgevoerd.
- Een UDF gebruik je alleen binnen een query, bijvoorbeeld `udf.BerekenWaarde(c.prijs)`.
- Server-side scripts verbruiken **RUs** en ondersteunen geen imports van externe JavaScript-modules.

**Kort antwoord:** bestand op schijf = meestal `.js`; in Cosmos DB = geregistreerd scriptobject.

### Single-partition en cross-partition

- Een **logische partitie** bevat alle items met dezelfde partition-keywaarde.
- **Single-partition query:** bevat een exacte gelijkheidsfilter op de partition key. Cosmos DB weet direct waar de data staat; meestal sneller, goedkoper en voorspelbaarder.
- **Cross-partition query:** bevat geen exacte partition-keywaarde en wordt over meerdere of alle fysieke partities uitgevoerd (**fan-out**); meestal meer latency en meer RU-verbruik.

Voorbeeld met `/customerId` als partition key:

```sql
-- Single partition
SELECT * FROM c WHERE c.customerId = "C100"

-- Cross partition
SELECT * FROM c WHERE c.status = "Open"
```

- Een range-filter zoals `c.customerId > "C100"` is ook cross-partition.
- Een **point read** met zowel `id` als partition key is doorgaans de goedkoopste en snelste leesactie.
- Stored procedures en triggers kunnen alleen transactioneel werken binnen **één logische partitie**; geen cross-partition transactie.
- Cross-partition queries zijn toegestaan en soms onvermijdelijk, maar worden bij grote containers duurder doordat iedere betrokken partitie haar eigen index doorzoekt.
- Kies daarom een partition key die data en verkeer gelijkmatig verdeelt én aansluit op veelgebruikte queryfilters. Vermijd een **hot partition**.
- Limiet per logische partitie: normaal maximaal **20 GB** en maximaal **10.000 RU/s**. Hierarchical partition keys kunnen helpen bij grotere tenant- of klantworkloads.

**Examenregel:** staat de partition key met een exacte waarde in de query, denk aan **single partition**. Ontbreekt die, denk aan **cross partition, fan-out en extra RUs**.

### Embeddings opslaan en ophalen met Cosmos DB

Een **embedding** is een array met getallen die de betekenis van tekst, een afbeelding of andere content weergeeft. Teksten met ongeveer dezelfde betekenis krijgen vectoren die dicht bij elkaar liggen.

**Ingestie, eenmalig of bij gewijzigde content:**
1. Splits een document in kleinere **chunks**.
2. Stuur iedere chunk naar een embeddingmodel, bijvoorbeeld Azure OpenAI.
3. Het model retourneert een vector met een vast aantal dimensies.
4. Sla in hetzelfde Cosmos DB-document de chunk, metadata en vector op.
5. Cosmos DB neemt de vector op in de ingestelde vectorindex.

Voorbeeld:

```json
{
  "id": "chunk-42",
  "documentId": "handleiding-1",
  "tenantId": "klant-a",
  "content": "Een managed identity voorkomt opgeslagen wachtwoorden.",
  "embedding": [0.014, -0.223, 0.781]
}
```

**Retrieval bij iedere gebruikersvraag:**
1. Maak met **hetzelfde embeddingmodel** een embedding van de gebruikersvraag.
2. Zoek met `VectorDistance` naar de dichtstbijzijnde documentvectoren.
3. Beperk de resultaten met `TOP N` en eventueel metadatafilters, zoals tenant, taal of product.
4. Haal de oorspronkelijke tekst van de beste chunks op.
5. Voeg deze chunks als context toe aan de prompt voor het taalmodel.
6. Het taalmodel genereert een antwoord op basis van de opgehaalde context. Dit is **RAG**.

```sql
SELECT TOP 5
    c.content,
    c.documentId,
    VectorDistance(c.embedding, @queryVector) AS score
FROM c
WHERE c.tenantId = @tenantId
ORDER BY VectorDistance(c.embedding, @queryVector)
```

**Belangrijke instellingen:**
- De documentvector en queryvector moeten afkomstig zijn van hetzelfde model en exact hetzelfde aantal **dimensions** hebben.
- De **vector embedding policy** beschrijft onder andere path, datatype, dimensions en distance function.
- De **vector indexing policy** bepaalt het indextype.
- `cosine` is gebruikelijk voor tekst; daarnaast bestaan `dot product` en `euclidean`.

**Vectorindextypen:**
- `flat`: exacte brute-force zoekactie; 100% recall, maximaal 505 dimensies, vooral voor kleine datasets.
- `quantizedFlat`: gecomprimeerde vectoren; lager RU-verbruik en sneller, met mogelijk klein nauwkeurigheidsverlies; maximaal 4.096 dimensies.
- `DiskANN`: approximate nearest-neighbor index voor grote datasets; lage latency en RU-kosten met hoge, maar niet gegarandeerd 100%, recall; maximaal 4.096 dimensies.
- Bij minder dan 1.000 vectoren gebruiken `quantizedFlat` en `DiskANN` nog een full scan.

**Performance en examenpunten:**
- Gebruik altijd `TOP N`; zonder limiet stijgen latency en RU-verbruik.
- Zonder geschikte vectorindex volgt een full scan, wat duurder is.
- Een metadatafilter op de partition key kan vector retrieval tot relevante partities beperken.
- Vector search zoekt op **betekenis**; full-text search zoekt vooral op **woorden**. Hybrid search combineert beide.
- Retrieval haalt relevante broninformatie op; het embeddingmodel formuleert zelf geen antwoord.
- Bij RAG wordt de gevonden tekst als grounding/context naar het generatieve model gestuurd om hallucinaties te verminderen.

### Metadata filtering, ranking en RRF

**Metadata filtering** beperkt welke documenten kandidaat mogen zijn voordat de beste resultaten worden gekozen. Voorbeelden zijn:
- `tenantId`: voorkom dat informatie van een andere klant wordt opgehaald.
- taal, product, categorie, documenttype, autorisatiegroep of datum.
- Een filter op de partition key kan tegelijk de beveiliging, snelheid en RU-efficiëntie verbeteren.

```sql
WHERE c.tenantId = @tenantId AND c.language = "nl"
```

**Ranking** sorteert de toegestane kandidaten op relevantie:
- **Vector ranking:** `VectorDistance` rangschikt op semantische betekenis.
- **Keyword ranking:** `FullTextScore` gebruikt **BM25** en kijkt onder andere naar woordfrequentie, zeldzaamheid van termen en documentlengte.
- **Hybrid ranking:** gebruikt beide signalen tegelijk.

**RRF = Reciprocal Rank Fusion**:
- Vector search en full-text search leveren elk een eigen ranglijst.
- De ruwe scores zijn niet goed rechtstreeks vergelijkbaar.
- RRF kijkt daarom vooral naar de **positie/rank** van een document in iedere lijst en voegt die ranglijsten samen.
- Een document dat in beide lijsten hoog staat, komt doorgaans bovenaan de gezamenlijke lijst.
- Met gewichten kun je één signaal zwaarder laten meetellen, bijvoorbeeld `[2,1]` voor vector search tweemaal zo belangrijk als keyword search.

```sql
SELECT TOP 10 *
FROM c
WHERE c.tenantId = @tenantId
ORDER BY RANK RRF(
    VectorDistance(c.embedding, @queryVector),
    FullTextScore(c.content, @term1, @term2)
)
```

**Voorwaarden:** hybrid search vereist zowel een vector policy/index als een full-text policy/index. `RRF` wordt gebruikt in `ORDER BY RANK` en niet als gewone kolom in `SELECT`.

**Examenregel:**
- Exacte beperking of beveiliging → **metadata filter**.
- Betekenis → **vector search**.
- Exacte termen → **full-text/BM25**.
- Beide ranglijsten combineren → **hybrid search met RRF**.

### Azure Functions

**Azure Functions** is Microsofts event-driven serverless compute-dienst en is grofweg de Azure-tegenhanger van **AWS Lambda**. Je schrijft een kleine functie; Azure verzorgt de runtime, infrastructuur en schaalvergroting.

Een functie wordt uitgevoerd wanneer een **trigger** afgaat:
- HTTP-request: kleine API of webhook.
- Timer: periodieke taak, vergelijkbaar met cron.
- Service Bus- of Storage Queue-bericht: bericht verwerken.
- Event Hubs-event: datastroom verwerken.
- Blob-trigger: reageren op een nieuw of gewijzigd bestand.
- Cosmos DB change feed: reageren op gewijzigde documenten.

**Trigger en bindings:**
- Iedere functie heeft precies één **trigger**: waardoor de functie start.
- **Input bindings** lezen gegevens zonder veel verbindingscode.
- **Output bindings** schrijven resultaten naar bijvoorbeeld Storage, Service Bus of Cosmos DB.

```text
Queuebericht → trigger → function-code → output binding → Cosmos DB
```

- Functies zijn standaard het prettigst als **stateless** en kortdurend werk.
- Een trigger kan een bericht opnieuw aanbieden na een fout. Ontwerp verwerking daarom **idempotent**: dezelfde uitvoering tweemaal mag geen ongewenst dubbel resultaat veroorzaken.
- Voor stateful workflows, retries, wachttijden en meerdere stappen gebruik je **Durable Functions**.
- Meerdere functies worden samen gedeployed in een **Function App** en delen configuratie en hostingresources.
- Gebruik bij toegang tot Azure-diensten bij voorkeur een **managed identity** met minimale RBAC-rechten; bewaar geen secrets in code.

**Hosting:**
- **Flex Consumption:** aanbevolen serverless optie voor nieuwe apps; event-driven schalen en betalen naar gebruik.
- **Premium:** prewarmed/always-ready instances, minder cold starts, meer capaciteit en netwerkopties.
- **Dedicated:** draait in een App Service Plan; betalen voor de gereserveerde instances.
- **Container Apps:** Functions-runtime in containers naast andere containerworkloads.
- Schalen naar nul bespaart kosten, maar kan een **cold start** bij de volgende aanvraag veroorzaken.

**AI-200-toepassingen:** een MCP-tool aanbieden, documenten verwerken, een queue consumer bouwen, AI- of databaseacties orkestreren en op events reageren.

#### Durable activities: at-least-once en idempotency

Een Durable Functions-**activity** heeft een **at-least-once** uitvoeringsgarantie. De activity kan haar externe actie al hebben voltooid, terwijl de host crasht voordat Durable Functions het resultaat in de orchestration history vastlegt. De runtime ziet dan geen bevestigde voltooiing en kan dezelfde activity opnieuw uitvoeren.

```text
Activity schrijft resultaten/claim-123.json
→ host crasht vóór registratie van "klaar"
→ Durable Functions probeert opnieuw
→ activity probeert dezelfde blob opnieuw te schrijven
```

Maak zulke activities **idempotent**: één of meerdere identieke uitvoeringen leveren hetzelfde zakelijke eindresultaat op.

- Geef de operatie een **stabiele operation ID**, bijvoorbeeld `claim-123`.
- Gebruik die ID als unieke blobnaam of databasesleutel.
- Maak het object met een conditionele write: alleen als het nog niet bestaat, bijvoorbeeld Blob Storage `If-None-Match: *` of zonder overwrite.
- Bestaat het resultaat al, lees dat resultaat en retourneer het alsof deze poging het zelf heeft gemaakt.

Een nieuwe UUID per retry is juist fout: iedere poging krijgt dan een andere naam en maakt een extra resultaat. **Orchestrator replay** voorkomt evenmin dubbele externe writes; replay reconstrueert de workflowstatus, maar kan een niet-geregistreerde activity-uitvoering niet bewijzen of terugdraaien.

**Examenregel:** zie je *activity succeeded, host crashed before completion was recorded*? Denk **at-least-once → stable operation ID → conditional write/deduplication → idempotent activity**.

Bronnen:

- https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-types-features-overview
- https://learn.microsoft.com/en-us/azure/azure-functions/functions-idempotent

#### HTTP-trigger: authorization level en access keys

Het `auth_level` van een **HTTP-trigger** bepaalt welke Functions-key de caller moet meesturen. Dit geldt niet voor bijvoorbeeld een Timer-, Queue- of Service Bus-trigger; die gebruiken hun eigen verbinding en identiteit.

| Authorization level | Vereiste |
|---|---|
| `anonymous` | Geen Functions-key nodig. |
| `function` | Een key met toegang tot de function: een function key of host key. |
| `admin` | De speciale master key `_master`; alleen voor beheerdoeleinden. |

Key scopes:

- **Function key:** werkt voor één specifieke function.
- **Host key:** werkt voor alle functions in dezelfde Function App.
- **Master key (`_master`):** werkt voor alle functions en geeft toegang tot administratieve runtime-API's; niet delen met gewone clients.
- **System key:** door bepaalde extensions beheerde key voor hun interne webhook-endpoints.

Een key gaat mee als queryparameter `?code=<key>` of als HTTP-header `x-functions-key: <key>`. Gebruik voor API-calls bij voorkeur de header, zodat de key minder snel in URL-logs en browserhistorie verschijnt.

```http
GET /api/Analyze HTTP/1.1
Host: example.azurewebsites.net
x-functions-key: <function-key>
```

Een Functions-key is een **gedeeld geheim**, geen gebruikersidentiteit. Voor echte gebruikersauthenticatie en autorisatie gebruik je bijvoorbeeld Microsoft Entra ID/App Service Authentication, eventueel samen met API Management. Pas in Azure wordt `auth_level` normaal afgedwongen; lokaal is key-authenticatie standaard uitgeschakeld, behalve bij lokale containerhosting.

**Examenregel:** publiek endpoint → `anonymous`; één endpoint met eenvoudige gedeelde key → `function` + function key; alle functions benaderen → host key; beheerruntime → `admin` + `_master`. Geef altijd de kleinst mogelijke key-scope.

Bronnen:

- https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger
- https://learn.microsoft.com/en-us/azure/azure-functions/function-keys-how-to
- https://learn.microsoft.com/en-us/azure/azure-functions/security-concepts

#### Waar draait Azure Functions onder water op?

De meeste Azure Functions-hosting gebruikt onderliggend de **Azure App Service-infrastructuur** op door Microsoft beheerde Windows- of Linux-VM's.

```text
Azure VM / App Service-infrastructuur
└── Azure Functions host/runtime
    └── Language worker: Python, Node.js, Java, .NET, PowerShell, enz.
        └── Eigen function-code
```

- De **Functions host** ontvangt triggers, regelt bindings, retries, logging en aanroepen van de functie.
- Een **language worker** voert de code uit in de gekozen runtime. Bij moderne .NET Functions wordt het isolated worker-model aanbevolen.
- Bij **Flex Consumption** kiest, start en schaalt Azure de workers automatisch; ze kunnen bij geen gebruik naar nul schalen.
- Bij **Premium** houdt Azure minimaal warme compute beschikbaar om cold starts te beperken.
- Bij **Dedicated** draaien Functions op VM-capaciteit van het gekozen App Service Plan.
- Bij hosting op **Azure Container Apps** draait de Functions-runtime in een Linux-container en schaalt Container Apps de replicas.

Je beheert normaal geen VM of besturingssysteem. **Serverless betekent dat de servers voor jou verborgen en beheerd zijn, niet dat er geen servers bestaan.**

### Azure Architecture Center

Het **Azure Architecture Center** is een handige Microsoft-bron voor het ontwerpen van Azure-oplossingen op veel verschillende gebieden:
- Reference architectures en duidelijke architectuurdiagrammen.
- Praktijkvoorbeelden en solution ideas.
- Vergelijkingen en decision guides voor compute, containers, databases, storage, messaging, networking en AI.
- Cloud design patterns met hun voordelen en trade-offs.
- Service-specifieke best practices.
- Ontwerpcontrole volgens de vijf pijlers van het **Well-Architected Framework**: reliability, security, cost optimization, operational excellence en performance efficiency.

Gebruik bij het zoeken de productfilters, bijvoorbeeld Cosmos DB, Azure Functions, Container Apps, AKS of Azure AI Search. De voorbeelden zijn een goed startpunt, maar moeten altijd worden aangepast aan de eisen van de eigen workload.

- Startpagina: https://learn.microsoft.com/en-us/azure/architecture/
- Architecturen zoeken en op product filteren: https://learn.microsoft.com/en-us/azure/architecture/browse/
- Technology decision guides: https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/technology-choices-overview

### Cosmos DB: range- en composite indexes

Een index voorkomt dat Cosmos DB voor iedere query alle documenten volledig moet scannen. Nieuwe Cosmos DB for NoSQL-containers indexeren standaard alle properties en gebruiken voor strings en getallen een **range index**.

#### Range index

Een range index is vooral geschikt voor bewerkingen op **één property**:
- gelijkheid: `=`, `IN`;
- bereik: `>`, `<`, `>=`, `<=`, `!=`;
- `ORDER BY` op één property.

```sql
SELECT * FROM c
WHERE c.price >= 100
ORDER BY c.price
```

#### Composite index

Een composite index combineert twee of meer properties. Gebruik hem voor:
- `ORDER BY` op meerdere properties;
- meerdere filters, vooral equality plus range;
- een filter op de ene property en sortering op een andere property;
- soms `SUM`/`AVG` in combinatie met filters.

```json
"compositeIndexes": [
  [
    { "path": "/category", "order": "ascending" },
    { "path": "/price", "order": "ascending" }
  ]
]
```

Deze index past goed bij:

```sql
SELECT * FROM c
WHERE c.category = "Laptop" AND c.price > 500
ORDER BY c.category, c.price
```

#### Volgorderegels

- Zet **equality filters eerst** en een **range-filter als laatste**: `(category, price)` voor `category = ... AND price > ...`.
- Bij `ORDER BY` op meerdere properties moeten propertyvolgorde en sorteerrichting overeenkomen met de composite index.
- Een index `(category ASC, price ASC)` ondersteunt ook de volledig omgekeerde volgorde `(category DESC, price DESC)`.
- Hij ondersteunt niet automatisch een gemengde richting zoals `(category ASC, price DESC)`.
- Eén composite index kan maximaal één range-filter optimaal afhandelen. Voor twee range-filters kunnen twee composite indexes nuttig zijn.

#### Filter plus sortering optimaliseren

Deze query werkt met gewone range indexes, maar kan relatief veel RUs kosten:

```sql
SELECT * FROM c
WHERE c.category = "Laptop"
ORDER BY c.price
```

Om de composite index `(category, price)` te benutten, neem je de equality-property ook vooraan op in `ORDER BY`:

```sql
SELECT * FROM c
WHERE c.category = "Laptop"
ORDER BY c.category, c.price
```

#### Kostenafweging

- Meer indexes kunnen reads versnellen en query-RUs verlagen.
- Iedere write moet de indexes bijwerken; onnodige indexes verhogen write-RUs en indexopslag.
- Sluit grote properties uit die nooit normaal worden doorzocht, zoals een embeddingpad dat al een aparte vectorindex heeft.
- Gebruik query metrics/index utilization om te controleren of de verwachte index werkelijk wordt gebruikt.

**Examenregel:** één veld → meestal range index. Meerdere sorteervelden of equality-filter plus range/sort → denk aan composite index en controleer de veldvolgorde.

#### Vier belangrijke Cosmos DB-indextypen

| Index | Waarvoor? | Voorbeeld |
|---|---|---|
| **Range** | Vergelijken, filteren en sorteren op één string- of getalproperty | `price >= 100`, `name = "Jan"`, `ORDER BY price` |
| **Composite** | Meerdere properties samen optimaliseren | `category = "Laptop" AND price > 500`, of `ORDER BY category, price` |
| **Spatial** | Locaties en vormen in GeoJSON doorzoeken | afstand, punt binnen gebied, intersectie van gebieden |
| **Vector** | Embeddings vergelijken op semantische overeenkomst | `VectorDistance(c.embedding, @queryVector)` |

**Ezelsbrug:**
- **Range** = bereik op één veld.
- **Composite** = combinatie van velden.
- **Spatial** = plaats en geometrie.
- **Vector** = betekenis en gelijkenis.

Een spatial index werkt met GeoJSON zoals `Point`, `LineString`, `Polygon` en `MultiPolygon`. Een vector index gebruikt bijvoorbeeld `flat`, `quantizedFlat` of `DiskANN`. Daarnaast kent modern Cosmos DB ook gespecialiseerde **full-text indexes** voor keyword/BM25-search, maar de vier hierboven vormen de kern van dit lesonderdeel.

### Internationale voertuigbewaking met streams

Voorbeeld: een vrachtwagen in de Verenigde Staten stuurt continu positie, snelheid en tijd door. Wanneer hij buiten een geplande locatie te lang vrijwel stilstaat, moet de Europese meldkamer direct een waarschuwing ontvangen.

```text
Truck/sensor in VS
→ IoT Hub of Event Hubs in VS
→ Azure Stream Analytics
→ tijdvenster + positie/snelheid per truck analyseren
→ alleen afwijking als event doorsturen
→ Service Bus/Event Hubs/Azure Function in EU
→ melding, workflow of operationele database
```

- **IoT Hub** is geschikt voor beheerde communicatie met apparaten; **Event Hubs** voor grote hoeveelheden eventstreams.
- **Azure Stream Analytics** verwerkt de telemetrie in near real time met SQL-achtige queries.
- Verwerk per `truckId`/`deviceId`, zodat gebeurtenissen van hetzelfde voertuig samen worden beoordeeld en parallelisatie mogelijk blijft.
- Gebruik een **sliding** of **hopping window** om steeds de laatste bijvoorbeeld 10–15 minuten te beoordelen.
- Met `LAG` vergelijk je een meting met een eerdere meting van dezelfde truck.
- Met `ST_DISTANCE` bereken je de verplaatsing tussen GeoJSON-posities of de afstand tot een locatie/geofence.
- Een truck die weinig afstand aflegt gedurende het venster kan een alert-event opleveren. Dit is een expliciete businessregel; de ingebouwde functies `AnomalyDetection_SpikeAndDip` en `AnomalyDetection_ChangePoint` zijn meer bedoeld voor statistische tijdreeksafwijkingen.
- Stuur alleen het relevante alarm naar Europa als alle ruwe telemetrie daar niet nodig is. Dat bespaart bandbreedte, opslag en verwerking.
- **Event Hubs** is geschikt als de EU-kant opnieuw een hoge-volumestream verwerkt. **Service Bus** past beter bij een betrouwbare operationele opdracht of workflow. Een **Azure Function** kan de waarschuwing omzetten in een API-aanroep, ticket of notificatie.
- Een output mag technisch naar een resource in een andere Azure-regio wijzen. Controleer daarbij latency, netwerk-/egresskosten, privacy, dataresidentie en toegangsbeheer.

**Examenregel:** veel continue sensordata → Event Hubs/IoT Hub; realtime regels en tijdvensters → Stream Analytics; betrouwbare bedrijfsactie → Service Bus; uitvoerbare reactie → Azure Functions.

### Praktische exameninformatie

- Volgens de klassikale uitleg kan het examen worden ervaren als drie onderdelen: een case study, traditionele vragen en een probleem/oplossing-reeks met ja/nee-antwoorden. **Microsoft garandeert geen vaste indeling of vaste volgorde vooraf**; lees daarom altijd het introductiescherm van de echte examenzitting.
- Het traditionele gedeelte kan antwoordopties zoals **A, B, C, D en soms E** bevatten, maar dit is niet één vast formaat. Mogelijke vraagtypen zijn onder andere multiple choice, selecteer meerdere antwoorden, drag-and-drop, build list, hot area en active screen.
- Het ja/nee-gedeelte is een reeks probleem/oplossing-vragen. Na het beantwoorden kun je bij dit vraagtype **niet terug** om het antwoord te wijzigen.
- Binnen een case study kun je de vragen nog bekijken en aanpassen zolang je die case/sectie niet verlaat. Na het verlaten kun je niet terug.
- Het introductiescherm vermeldt hoeveel vragen, case studies en eventuele labs die specifieke examenzitting bevat. Gebruik dat direct voor je tijdsplanning.
- Het officiële examen moet vooraf worden geboekt.
- Het examen kan fysiek op een testlocatie worden afgelegd.
- Genoemde Nederlandse plaatsen met testlocaties: **Amsterdam, Eindhoven en Utrecht**.
- De daadwerkelijk beschikbare locaties en tijdstippen kunnen tijdens het boeken veranderen; controleer dit in het officiële boekingsportaal.
- Eén examengedeelte is een **case study** met relatief veel tekst en is daardoor vaak het meest tijdrovend.
- Het is prettig als de case study vroeg verschijnt, omdat je dan nog ruim tijd hebt; de volgorde heb je normaal niet zelf in de hand.

**Aanpak case study:**
1. **Beginnersfout:** alle casustekst woord voor woord lezen. Dit kost te veel tijd en veel tekst is niet relevant voor de huidige vraag.
2. Scan de tabbladen eerst globaal, zoals **Overview**, **Existing environment/bestaande situatie**, **Requirements** en eventuele probleem- of technische secties.
3. Onthoud alleen waar elk soort informatie staat; probeer nog niet alle details te leren.
4. Ga na deze korte scan **meteen naar vraag 1** en lees de vraag en antwoordopties.
5. Ga terug naar het relevante tabblad en zoek gericht naar requirements, bestaande situatie en beperkingen.
6. Let extra op woorden als *must*, *minimize cost*, *lowest latency*, *managed*, *without changing code* en *least privilege*.
7. Scheid harde eisen van achtergrondinformatie; niet ieder detail is nodig voor iedere vraag.
8. Gebruik uitsluiting: verwijder antwoorden die één expliciete eis schenden.
9. Bewaak de tijd en blijf niet vastzitten in één lange vraag.

**Ezelsbrug:** eerst de kaart bekijken, dan de vraag lezen, daarna alleen het juiste stukje opzoeken.

**Tijdsrisico:** de case study kan ook pas aan het einde verschijnen. Wie alle tijd aan eerdere vragen besteedt, kan daardoor in paniek raken of tijd tekortkomen.

**Tijdsstrategie:**
- Ga er vanaf de start vanuit dat er nog een case study kan volgen.
- Reserveer bewust een tijdsbuffer voor het laatste examengedeelte.
- Beantwoord gewone vragen vlot: markeer twijfelgevallen en ga door als terugkeren binnen dat gedeelte mogelijk is.
- Zodra de case study verschijnt: kort de tabs scannen, meteen naar vraag 1 en alleen gericht lezen.
- Houd enkele minuten over voor onverwachte vertraging; gebruik niet automatisch alle beschikbare tijd vóór het laatste gedeelte.

**Aanpak ja/nee-vragen:** beoordeel uitsluitend of de voorgestelde oplossing **alle eisen** uit de vraag haalt. Eén geschonden harde eis betekent **nee**, ook als de oplossing technisch grotendeels werkt.

Bronnen:
- https://learn.microsoft.com/en-us/azure/cosmos-db/concepts-limits
- https://learn.microsoft.com/en-us/azure/cosmos-db/optimize-cost-regions
- https://learn.microsoft.com/en-us/azure/cosmos-db/tutorial-global-distribution
- https://learn.microsoft.com/en-us/azure/cosmos-db/account-overview
- https://learn.microsoft.com/en-us/azure/cosmos-db/postgresql/introduction/
- https://learn.microsoft.com/en-us/azure/azure-sql/database/dtu-benchmark
- https://learn.microsoft.com/en-us/azure/cosmos-db/request-units
- https://learn.microsoft.com/en-us/azure/stream-analytics/stream-analytics-streaming-unit-consumption
- https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-scalability
- https://learn.microsoft.com/en-us/azure/search/search-capacity-planning
- https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/what-is-a-data-warehouse-unit-dwu-cdwu
- https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-write-stored-procedures-triggers-udfs
- https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-query-container
- https://learn.microsoft.com/en-us/azure/cosmos-db/partitioning-overview
- https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search
- https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/rag
- https://learn.microsoft.com/en-us/cosmos-db/index-vector-data
- https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/hybrid-search
- https://learn.microsoft.com/cosmos-db/query/rrf
- https://learn.microsoft.com/en-us/cosmos-db/full-text-indexing
- https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview
- https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale
- https://learn.microsoft.com/en-us/azure/azure-functions/security-concepts
- https://learn.microsoft.com/en-us/azure/architecture/
- https://learn.microsoft.com/en-us/cosmos-db/indexing-policies
- https://learn.microsoft.com/en-us/azure/cosmos-db/index-overview
- https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven
- https://learn.microsoft.com/en-us/azure/stream-analytics/stream-analytics-window-functions
- https://learn.microsoft.com/en-us/azure/stream-analytics/stream-analytics-machine-learning-anomaly-detection
- https://learn.microsoft.com/en-us/azure/architecture/solution-ideas/articles/iot-azure-data-explorer

## Woensdag 7 oktober 2026

### Azure-netwerken: VNets, subnetten en peering

Een **Azure Virtual Network (VNet)** is een regionale, logische netwerkgrens met één of meer CIDR-adresblokken. Een **subnet** verdeelt die adresruimte in kleinere, niet-overlappende segmenten waarin resources worden geplaatst.

Voorbeeld van één geldig ontwerp:

```text
VNet A — 172.24.0.0/14 — Subscription A — West Europe
├─ Subnet A: 172.24.0.0/16
├─ Subnet B: 172.26.0.0/16
└─ Subnet C: 172.27.0.0/16

VNet B — 10.20.0.0/16 — Subscription B — North Europe
├─ Subnet D: 10.20.1.0/24
└─ Subnet E: 10.20.2.0/24
```

- Een subnetprefix moet binnen de adresruimte van zijn VNet vallen.
- Subnetten binnen hetzelfde VNet mogen elkaar niet overlappen.
- Azure reserveert in ieder subnet vijf adressen: de eerste vier en het laatste adres. Naast het normale netwerk- en broadcastadres gebruikt Azure dus **drie extra adressen** voor de default gateway en DNS-mapping; niet voor billing of Defender for Cloud.
- Resources in subnetten van hetzelfde VNet kunnen elkaar standaard via system routes bereiken. Een NSG, UDR, Azure Firewall of NVA kan verkeer beperken of omleiden.

Voor `192.168.1.0/24` zijn dit:

| Adres | Betekenis |
|---|---|
| `192.168.1.0` | Netwerkidentifier |
| `192.168.1.1` | Door Azure gereserveerd voor de default gateway |
| `192.168.1.2` | Azure DNS-mapping |
| `192.168.1.3` | Azure DNS-mapping |
| `192.168.1.255` | Broadcastadres |

Een `/24` bevat daarom 256 adressen, waarvan **251 bruikbaar** zijn. Het kleinste ondersteunde IPv4-subnet is `/29`: 8 adressen minus 5 reserveringen geeft slechts 3 bruikbare adressen.

**Subscriptions, tenants en regio's:**

- VNet A en VNet B mogen in verschillende resource groups en **verschillende subscriptions** staan.
- Die subscriptions mogen zelfs aan verschillende **Microsoft Entra-tenants** gekoppeld zijn.
- Een VNet hoort bij precies één Azure-regio. VNets uit verschillende regio's kunnen via **Global VNet Peering** worden verbonden.
- Subscription en tenant bepalen vooral eigenaarschap, facturering, identiteit en rechten; ze maken netwerkconnectiviteit niet automatisch onmogelijk.
- Voor cross-tenant peering zijn passende rechten nodig, doorgaans **Network Contributor** of een custom role op beide VNets. Microsoft beschrijft hiervoor ook gastgebruikers tussen de tenants.

**Cruciaal: adresruimtes mogen bij peering niet overlappen.** Als VNet A bijvoorbeeld `172.26.0.0/16` en `172.27.0.0/16` gebruikt, kan VNet B niet dezelfde bereiken gebruiken wanneer de VNets rechtstreeks moeten worden gepeerd. Azure weigert de peering dan, ongeacht of de VNets in andere subscriptions, tenants of regio's staan.

```text
VNet A: 172.24.0.0/14   ─┐
                          ├─ overlap met 172.26/16 en 172.27/16 → geen peering
VNet B: 172.26.0.0/15   ─┘
```

Plan adressen daarom centraal voordat teams VNets aanmaken. Houd ook rekening met on-premises netwerken die later via VPN of ExpressRoute worden verbonden.

**VNet peering:**

- **Regional VNet Peering:** VNets in dezelfde regio.
- **Global VNet Peering:** VNets in verschillende ondersteunde regio's.
- Peering gebruikt het Microsoft-backbone; resources communiceren via private IP-adressen.
- Voor een werkende verbinding worden peeringlinks aan beide kanten geconfigureerd. De status wordt daarna **Connected**.
- Peering is standaard **niet transitief**: A↔B en B↔C betekent niet automatisch A↔C. Gebruik expliciete peering of routing via bijvoorbeeld een hub met Azure Firewall/NVA.
- Verkeer over peering kan kosten veroorzaken, vooral tussen regio's; controleer actuele tarieven.

**Examenherkenning:**

- Zelfde VNet, verschillende subnetten → routing bestaat standaard; controleer daarna NSG's en UDR's.
- Twee niet-overlappende VNets rechtstreeks verbinden → VNet peering.
- Verschillende regio's → Global VNet Peering.
- Verschillende subscriptions of tenants → mogelijk, mits beide kanten de juiste rechten/configuratie hebben.
- Overlappende CIDR-blokken → peering kan niet worden aangemaakt; hernummer of ontwerp een andere verbindingsoplossing.
- Hub-spoke met A↔Hub en B↔Hub → de spokes hebben zonder aanvullende routering geen automatische onderlinge verbinding.

**Hybride verbindingen met Azure:**

| Optie | Verbindt | Pad | Wanneer kiezen? |
|---|---|---|---|
| **Point-to-Site (P2S) VPN** | Eén laptop/client ↔ Azure VNet | Versleuteld over publiek internet | Thuiswerker, beheerder of enkele individuele clients. Geen on-premises VPN-apparaat of publiek IP-adres nodig. Ondersteunt onder andere OpenVPN, IKEv2 en SSTP, afhankelijk van client en gateway. |
| **Site-to-Site (S2S) VPN** | Heel on-premises netwerk/vestiging ↔ Azure VNet | IPsec/IKE-tunnel over publiek internet | Permanente hybride verbinding voor een kantoor, datacenter, dev/test of middelgrote productieomgeving. Vereist een compatibel on-premises VPN-apparaat met een publiek IP-adres. |
| **ExpressRoute** | On-premises/WAN ↔ Microsoft-cloud | Private verbinding via connectivity provider; niet over publiek internet | Voorspelbare latency, hogere bandbreedte, betrouwbaarheid en private enterprise-connectiviteit. Meestal duurder en complexer dan een VPN. |

- Zowel P2S als S2S gebruikt een Azure **VPN Gateway** in een `GatewaySubnet`.
- P2S wordt gestart vanaf de individuele client. Authenticatie kan onder andere met Microsoft Entra ID, certificaten of RADIUS.
- S2S verbindt netwerken en gebruikt IPsec/IKE; routing kan statisch of dynamisch met BGP zijn, afhankelijk van de configuratie.
- ExpressRoute gebruikt een **ExpressRoute-circuit**, peering via BGP en voor VNet-toegang een ExpressRoute virtual network gateway.
- ExpressRoute versleutelt verkeer niet automatisch op dezelfde manier als een VPN. Private transport en encryptie zijn verschillende eisen; indien nodig zijn aanvullende encryptieopties mogelijk.
- Een S2S VPN kan naast ExpressRoute bestaan als failoverpad. Daarvoor gebruikt het VNet afzonderlijke gateways van het type `Vpn` en `ExpressRoute`.

**Ezelsbrug:** **Point** = één apparaat; **Site** = één netwerk/locatie; **ExpressRoute** = private providerroute met voorspelbaardere enterprise-connectiviteit.

**Examenkeuze:** individuele remote gebruiker → P2S. Kantoor of datacenter snel en relatief goedkoop koppelen → S2S. Publiek internet vermijden of voorspelbare hoge capaciteit eisen → ExpressRoute. VPN als backup voor ExpressRoute → coexisting gateways.

**Microsoft Defender for Cloud:**

- Defender for Cloud is een **CNAPP** voor security posture en workload protection; het reserveert zelf geen subnetadressen.
- **CSPM** beoordeelt continu configuraties en geeft recommendations, regulatory-compliance-inzicht en een **Secure Score**.
- **CWPP/Defender-plannen** voegen bescherming en threat detection toe voor workloads zoals servers, containers, storage, databases, App Service, Key Vault en serverless functies.
- Voor netwerken kan Defender for Cloud bijvoorbeeld te ruime NSG-regels, internet exposure en ontbrekende beschermingsmaatregelen signaleren.
- Defender for Cloud **detecteert en adviseert**; NSG's, Azure Firewall, route tables en Private Endpoints voeren de daadwerkelijke netwerkbeveiliging en routing uit.
- Foundational CSPM biedt basisposturefuncties; Defender CSPM en workload-specifieke Defender-plannen zijn betaalde uitbreidingen. Controleer steeds welke subscription en resources binnen de gekozen plannen vallen.

**Examenregel:** security posture, recommendations, Secure Score of threat alerts → Defender for Cloud. Pakketten toestaan/blokkeren → NSG of firewall. Verkeer naar een volgend hop sturen → route table/UDR.

Bronnen:

- https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering
- https://learn.microsoft.com/en-us/azure/virtual-network/create-peering-different-subscriptions
- https://learn.microsoft.com/en-us/azure/virtual-network/manage-virtual-network
- https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-subnet
- https://learn.microsoft.com/en-us/azure/networking/design-guide/ip-planning
- https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways
- https://learn.microsoft.com/en-us/azure/vpn-gateway/design
- https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-about
- https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction
- https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction

## Donderdag 8 oktober 2026

## Vrijdag 9 oktober 2026

### Monitoring: OpenTelemetry

**OpenTelemetry (OTel)** is een open standaard voor het instrumenteren, verzamelen en exporteren van telemetry. De belangrijkste signalen zijn **traces**, **metrics** en **logs**.

- Een **trace** volgt één request door meerdere componenten.
- Een **span** is één stap binnen die trace, bijvoorbeeld een API-call, databasequery of modelaanroep.
- Trace context, waaronder trace ID en span ID, laat een observability-backend de stappen aan elkaar koppelen.
- **Metrics** zijn numerieke tijdreeksen, zoals latency, request count, CPU en error rate.
- **Logs** zijn afzonderlijke tekstuele of gestructureerde gebeurtenissen.

Een **distro** is een door een leverancier samengestelde OpenTelemetry-distributie. De **Azure Monitor OpenTelemetry Distro** bundelt de OpenTelemetry SDK, gangbare automatische instrumentation, Azure resource detectors, processors, sampling, configuratie en de Azure Monitor-exporter. Voor nieuwe Application Insights-projecten is dit doorgaans de eenvoudigste aanbevolen route.

```text
Applicatie → instrumentation/SDK of Azure Monitor OTel Distro
           → exporter of optionele OTel Collector
           → Application Insights / Azure Monitor / Log Analytics
```

OpenTelemetry maakt en transporteert telemetry. De gekozen backend, zoals Azure Monitor, bepaalt opslag, querymogelijkheden en retentie.

#### Granularity en retention

- **Granularity** of **time grain** is de grootte van ieder tijdvak waarin meetwaarden worden samengevat. Bij één minuut krijg je één datapunt per minuut; bij één uur één datapunt per uur.
- Binnen ieder tijdvak gebruikt Azure een aggregatie zoals **Average**, **Minimum**, **Maximum**, **Sum** of **Count**.
- Kleine time grain geeft meer detail en maakt korte pieken zichtbaar, maar levert meer datapunten en ruis op. Grote time grain geeft een rustiger langetermijnbeeld, maar kan een korte storing verbergen.
- **Retention** is hoe lang telemetry wordt bewaard voordat die wordt verwijderd of naar goedkopere langetermijnopslag overgaat.
- Fijn meten en lang bewaren zijn afzonderlijke keuzes. Een metric kan bijvoorbeeld per minuut worden verzameld en 93 dagen worden bewaard.

Voorbeeld: CPU is gedurende één minuut 100% en de overige 59 minuten 10%. Met een uurgranularity en alleen `Average` lijkt dat ongeveer 11,5%; met `Maximum` zie je 100%. Kies dus ook de juiste aggregatie.

Actuele Azure-hoofdlijnen:

- Azure Monitor platform- en custom metrics worden normaal **93 dagen** bewaard. In Metrics Explorer kan één grafiek maximaal een tijdvenster van 30 dagen tegelijk opvragen; je kunt binnen de retentieperiode verder schuiven.
- Log Analytics-tabellen hebben standaard meestal **30 dagen analytics retention**; sommige tabellen hebben standaard 90 dagen.
- Voor Analytics-tabellen kan interactieve/analytics-retentie tot **twee jaar** worden ingesteld.
- Totale retentie inclusief goedkopere long-term retention kan tot **12 jaar** worden ingesteld; oudere data vraagt afhankelijk van het table plan bijvoorbeeld een search job.
- Langere retentie en grotere hoeveelheden ingested telemetry kunnen extra kosten veroorzaken. Beperk daarom onnodige attributes/logs, gebruik passende sampling en stel retentie per tabel af op troubleshooting-, audit- en compliance-eisen.

**ELI5:** granularity bepaalt hoeveel vakjes je op de tijdlijn tekent; retention bepaalt hoe lang je de tijdlijn bewaart.

**Examenregel:** korte piek onderzoeken → kleine granularity en controleer `Maximum`; langetermijntrend → grotere granularity. Historische logs langer beschikbaar houden → retention van de Log Analytics-workspace of tabel aanpassen. OpenTelemetry zelf is niet de opslaglocatie.

Bronnen:

- https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable
- https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration
- https://learn.microsoft.com/en-us/azure/azure-monitor/metrics/metrics-aggregation-explained
- https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/data-platform-metrics
- https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure

### KQL: Microsofts querytaal voor telemetry

**KQL = Kusto Query Language**. Azure Monitor Logs en Log Analytics zijn gebaseerd op Azure Data Explorer en gebruiken KQL om logs en telemetry te filteren, analyseren en aggregeren. KQL wordt ook gebruikt in onder andere Application Insights, Microsoft Sentinel en Microsoft Fabric.

Een query begint meestal met een tabel. Iedere pipe `|` geeft het tussenresultaat door aan de volgende bewerking:

```kusto
AppRequests
| where TimeGenerated > ago(1h)
| where Success == false
| summarize Failures = count() by bin(TimeGenerated, 5m)
| order by TimeGenerated desc
```

Dit betekent: neem requests van het afgelopen uur, houd mislukte requests over, tel ze per vijf minuten en toon de nieuwste tijdvakken eerst.

| Operator | Functie |
|---|---|
| `where` | Filter rijen |
| `project` | Kies of hernoem kolommen |
| `extend` | Voeg een berekende kolom toe |
| `summarize` | Groepeer en bereken bijvoorbeeld `count()`, `avg()` of `max()` |
| `bin(TimeGenerated, 5m)` | Deel tijd op in intervallen van vijf minuten |
| `order by` / `sort by` | Sorteer resultaten |
| `take 20` | Geef een willekeurige beperkte set rijen terug |
| `top 20 by DurationMs desc` | Geef de twintig hoogste geordende waarden terug |
| `join` | Combineer rijen uit verschillende tabellen |

Voorbeeld uit Container Apps:

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "ai-api"
| where Log_s contains "error"
| project TimeGenerated, RevisionName_s, Log_s
| order by TimeGenerated desc
| take 20
```

**ELI5:** de tabel is een bak LEGO. Met iedere `|` geef je de overgebleven steentjes door aan de volgende zeef of sorteeractie.

**Examenregel:** historische logs doorzoeken, tellen of groeperen → **KQL in Log Analytics**. `take` beperkt zonder gegarandeerde volgorde; gebruik `top ... by` of `order by` wanneer de volgorde telt.

Bronnen:

- https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview
- https://learn.microsoft.com/en-us/azure/azure-monitor/logs/get-started-queries
- https://learn.microsoft.com/kusto/query

### Azure Monitor-landschap

**Azure Monitor** is de overkoepelende observabilitydienst. Het verzamelt, bewaart, analyseert, visualiseert en gebruikt metrics, logs, traces en events van applicaties en infrastructuur.

```text
Applicaties en Azure-resources
  ├─ OpenTelemetry / Application Insights → applicatietraces en dependencies
  ├─ Azure Monitor Agent + DCR            → OS- en machinegegevens
  ├─ Diagnostic settings                 → resource- en platformlogs
  └─ Managed Prometheus                  → Kubernetes/Prometheus-metrics
                    ↓
        Metrics-store / workspaces
          ├─ Azure Monitor Metrics       → platformmetrics
          ├─ Log Analytics workspace     → logs en traces
          └─ Azure Monitor workspace     → Prometheus-metrics
                    ↓
 Metrics Explorer · Log Analytics · Application Insights · Workbooks · Grafana
                    ↓
              Alerts + action groups
```

| Naam | Wat is het? | Waarvoor gebruik je het? |
|---|---|---|
| **Azure Monitor** | Overkoepelende dienst | Alle observability: verzamelen, analyseren, visualiseren, alerts en autoscale |
| **Azure Monitor Metrics** | Time-series store voor numerieke meetwaarden | Snelle grafieken en alerts op CPU, geheugen, latency, request count en andere metrics |
| **Azure Monitor Logs** | Logdataplatform binnen Azure Monitor | Timestamped records verzamelen, bewaren en doorzoeken |
| **Log Analytics workspace** | Azure-resource en datastore voor logs en traces | Tabellen, retentie, toegangsbeheer en kosten configureren |
| **Log Analytics** | Querytool/interface | KQL-query's uitvoeren op een Log Analytics workspace |
| **Application Insights** | Application Performance Monitoring-ervaring binnen Azure Monitor | Requests, dependencies, exceptions, distributed traces, availability en application map onderzoeken |
| **Azure Monitor workspace** | Apart workspace-type | Momenteel vooral Managed Prometheus-metrics opslaan; niet verwarren met een Log Analytics workspace |
| **Metrics Explorer** | Interactieve metrictool | Time-series grafieken maken, time grain en aggregatie kiezen |
| **Workbooks** | Interactieve rapportagecanvas | KQL, metrics, tekst en parameters combineren in deelbare rapporten |
| **Managed Grafana** | Dashboard- en visualisatieplatform | Vooral Prometheus- en andere metricdata visualiseren |
| **Alerts** | Regels die condities bewaken | Activeren op metrics, KQL-logquery's, Activity Log-events of Prometheus-regels |
| **Action group** | Herbruikbare verzameling acties | Bij een alert e-mail, sms, webhook, Function, Logic App of andere actie starten |

**Databronnen en routing:**

- **Platform metrics:** Azure-resources publiceren automatisch numerieke metingen naar Azure Monitor Metrics.
- **Activity Log:** subscriptionniveau; registreert control-plane-acties zoals resource create, update en delete en service-health-events. Dit is niet hetzelfde als applicatielogging.
- **Resource logs:** operationele details van één Azure-resource. Ze worden pas naar een Log Analytics workspace, Storage Account of Event Hub gestuurd wanneer je daarvoor een **diagnostic setting** configureert.
- **Azure Monitor Agent (AMA):** agent op VM's en ondersteunde machines voor gast-OS-data, zoals Windows Event Logs, Syslog en performancegegevens.
- **Data Collection Rule (DCR):** bepaalt welke data AMA of een andere ondersteunde bron verzamelt, eventuele transformaties en de bestemming.
- **OpenTelemetry:** instrumenteert applicatiecode en maakt traces, spans, metrics en logs. De Azure Monitor OpenTelemetry Distro kan dit naar Application Insights sturen.

**Metrics tegenover logs:**

- Metrics zijn kleine numerieke tijdreeksen en zijn geschikt voor snelle detectie en alerts: *is de CPU nu te hoog?*
- Logs en traces bevatten meer context en zijn geschikt voor root-cause-analyse met KQL: *welke request, revision en dependency veroorzaakten de fout?*
- In de praktijk detecteer je vaak met een metric alert en onderzoek je daarna de bijbehorende logs en trace.

**Application Insights en Log Analytics:** Application Insights is de APM-ervaring voor de applicatie. De workspace-based variant bewaart de onderliggende applicatielogs en traces in een gekoppelde Log Analytics workspace. Je bekijkt dezelfde data daardoor via gespecialiseerde Application Insights-schermen of rechtstreeks via KQL.

**ELI5:** Azure Monitor is het ziekenhuis. Metrics zijn de hartslagmeter, logs zijn het patiëntendossier, Application Insights is de applicatiespecialist, Log Analytics is de onderzoekstafel met KQL, een alert is het alarm en de action group bepaalt wie wordt gebeld.

**Examenkeuzes:**

- Applicatierequests, dependencies, exceptions of distributed tracing → **Application Insights**.
- Historische logs ad hoc onderzoeken → **Log Analytics + KQL**.
- CPU/latency snel tekenen of bewaken → **Azure Monitor Metrics / Metrics Explorer / metric alert**.
- Resource logs naar een workspace routeren → **diagnostic setting**.
- VM-gastlogs verzamelen → **Azure Monitor Agent + DCR**.
- Samengesteld interactief rapport → **Workbook**.
- Melding of automatisering uitvoeren na een alert → **action group**.
- Prometheus-metrics van AKS → **Azure Monitor workspace / Managed Prometheus**, vaak visualiseren in Grafana.

Bronnen:

- https://learn.microsoft.com/en-us/azure/azure-monitor/overview
- https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/data-platform
- https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs
- https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview
- https://learn.microsoft.com/en-us/azure/azure-monitor/metrics/azure-monitor-workspace-overview
