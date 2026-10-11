# Topic review: 59 uitgewerkte scenario's

Selecteer **Topic review · 59 scenarios** onder **Question sets** in de simulator.
De set werkt in Study mode, proefexamens, korte toetsen, casusdrills en audio.
Een proefexamen met alleen deze set heeft 50 vragen en 100 minuten; Study mode
bevat alle 59 vragen. De twee nieuwe casussen heten Fabrikam maintenance library
en Proseware partner policy assistant.

De nummers TOPIC001–TOPIC059 volgen de aangeleverde lijst. De vragen, ontbrekende
code, scenario's en antwoordopties zijn nieuw geformuleerd. Ze worden niet
gepresenteerd als letterlijke examenvragen of als gereconstrueerde bronopgaven.
Yes/No-reeksen staan als selectierasters binnen hun oorspronkelijke nummer.
De technische domeinindeling volgt de inhoud, ook wanneer een onderwerp in de
aangeleverde lijst onder een andere kop stond.

Controle: 11 oktober 2026. De juiste antwoorden én de afleiders zijn beoordeeld
tegen primaire documentatie. De uitleg maakt onderscheid tussen technisch
ongeldige opties en opties die alleen door de concrete eisen afvallen. Waar
uitspraken uit de lijst onjuist of onvolledig waren, is de inhoud aangepast.
Elke vraag toont haar technische bronnen na het nakijken.

De set heeft 15 containervragen, 16 datavragen, 14 integratievragen en 14 vragen
over beveiliging/monitoring. Daardoor kan een proefexamen uit uitsluitend deze
set de domeinverdeling 12/14/12/12 halen. AI Search, modelinstellingen, agents en
documentextractie bieden daarnaast inhoudelijke verbreding; de officiële
studiegids blijft leidend voor de examenafbakening.

De brondata staat in ai-200-practice-exam/data/topic-review.json. De browserdata
en dit overzicht worden opgebouwd met node scripts/build-topic-review.cjs
vanuit ai-200-practice-exam. Azure-deployments zijn niet live uitgevoerd.

## Controle per oorspronkelijk nummer

| Nr. | Onderwerp | Vraagtype | Verduidelijking of correctie |
| ---: | --- | --- | --- |
| 1 | ACR commit builds | multi | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 2 | ACA Key Vault reference | drag | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 3 | Event Grid filtering and dead-lettering | matrix | A subject filter alone cannot enforce fileType=pdf; the supplied outline omitted the advanced filter. |
| 4 | Committed API key | yesno | The No answer is about an already leaked key that remains valid, not a blanket rejection of GitHub secrets. |
| 5 | Runtime configuration | yesno | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 6 | App Service secret reference | yesno | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 7 | Storage queue scaler | matrix | The original two-field summary is valid only when the other required scaler settings are supplied. |
| 8 | ACA SDK secret retrieval | multi | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 9 | Revision canary | matrix | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 10 | ACR pull role | single | Corrected the incomplete role name: Container Registry Repository Reader, with registry permission mode made explicit. |
| 11 | App Service settings | matrix | A Key Vault reference for non-secret data is unnecessary here, not technically impossible. |
| 12 | Live App Service logs | drag | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 13 | Image digest pinning | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 14 | Pod restart investigation | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 15 | ACR rebuild triggers | multi | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 16 | Probe-induced restart | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 17 | ACA managed certificate | drag | Corrected the supplied order: managed certificate → binding → DNS → validation was reversed. Ingress is a prerequisite, not a distractor. |
| 18 | Functions declarative deployment | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 19 | Blob event routing | single | All four technologies can participate in workflows; the new stem specifies native Blob events to make Event Grid uniquely appropriate. |
| 20 | pgvector setup | drag | The setup order is an implementation dependency, not a claim that filtered HNSW always returns the exact nearest neighbors. |
| 21 | Redis ANN schema | matrix | FLAT and FLOAT64 are supported choices in other designs; they are wrong here because ANN and float32 input are explicit. |
| 22 | Response and embedding cache | matrix | Added version/race handling: an asynchronous invalidation event alone cannot guarantee that embeddings are always current. |
| 23 | Credential rotation | multi | Corrected the supplied answer: a key rotation policy is not a general API-secret rotation mechanism. The 30-day interval is a workload requirement, not a Key Vault default. |
| 24 | PostgreSQL vector and date types | multi | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 25 | Cosmos numeric validation | matrix | Corrected the supplied answer: an index cannot enforce that tip is present and numeric. |
| 26 | Cosmos Python query sequence | drag | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 27 | Cosmos .NET client hierarchy | drag | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 28 | Cosmos Python object hierarchy | drag | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 29 | Cosmos container in PowerShell | yesno | The original item had no complete command or answer; this is a new, fully specified PowerShell scenario. |
| 30 | Semantic retrieval configuration | matrix | The source exposed only a topic. This authored question supplies model compatibility, authorization and missing-evidence requirements. |
| 31 | Cosmos vector query cost | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 32 | Cosmos composite ordering | single | Clarified that all-opposite sort directions can also be supported; descending is not the only possible valid index. |
| 33 | Parameterized PostgreSQL query | drag | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 34 | Managed PDF vectorization | single | The corpus size alone does not guarantee capacity; the stem specifies the ingestion capability and optimization goal. |
| 35 | Long-document chunking | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 36 | Service Bus scale to zero | single | Zero replicas does not imply zero total Azure cost. |
| 37 | Spreadsheet numerical answers | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 38 | Event Grid tenant scale | yesno | Scope and resource type are explicit because Event Grid quota tables differ across delivery models. |
| 39 | Event Grid HTTP 400 | single | Corrected the retry assumption: HTTP 400 does not first exhaust ordinary retries for this webhook case. |
| 40 | Function identity deployment order | order | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 41 | Function plan and Key Vault access | multi | Removed the unsupported Premium requirement and the assumption that access policies or only system-assigned identities are mandatory. |
| 42 | Agent internal API tool | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 43 | Grounded answers with abstention | single | Grounding reduces unsupported answers; it is not a guarantee of zero hallucinations. |
| 44 | Service Bus settlement review | matrix | The supplied Yes/No answers had no code. These concrete statements define what is being judged. |
| 45 | Partner assistant architecture | matching | The original case text was unavailable; this is a new Proseware scenario with explicit requirements. |
| 46 | Redis vector index diagnosis | single | Added an explicit missing-index error and ANN requirement; zero results by itself does not prove that HNSW is missing. |
| 47 | API key storage review | matrix | The No/No/Yes series now has a concrete common goal; GitHub secrets are not universally an incorrect choice. |
| 48 | Multi-environment configuration | matrix | Portal app settings are not inherently wrong. Central sharing, labels and provider-based secret resolution make this series unambiguous. |
| 49 | Python span context | matrix | Replaced answer-only hints with assessable API statements. |
| 50 | App Configuration SDK authentication | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 51 | Azure Monitor trace export | matrix | The Yes/No series now specifies an actual export configuration rather than implying automatic telemetry delivery. |
| 52 | KQL failure aggregation | matrix | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 53 | Manual OpenTelemetry pipeline | order | Corrected the supplied ordering by making provider creation precede processor attachment; this is an explicit dependency sequence. |
| 54 | Incomplete tracing configuration | yesno | No source code was supplied in the outline; the new snippet makes the missing exporter observable. |
| 55 | Key Vault Python identity access | matrix | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 56 | GPT-4o output variability | matrix | Corrected the premise: temperature=0 does not make GPT-4o guaranteed deterministic. |
| 57 | Invoice extraction without training | single | Volledige nieuwe opgave; antwoord en afleiders gecontroleerd voor de genoemde voorwaarden. |
| 58 | Enforced content moderation | single | Replaced absolute prevention with a testable moderation control; filtering cannot guarantee that every bypass or harmful output is caught. |
| 59 | Bursty model consumption | single | The original service was unspecified; the new question explicitly concerns model deployment billing and bounded bursts. |

## Primaire technische bronnen

- https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview
- https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets
- https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide
- https://learn.microsoft.com/en-us/azure/event-grid/event-filtering
- https://learn.microsoft.com/en-us/azure/event-grid/delivery-and-retry
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- https://docs.docker.com/build/building/secrets/
- https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container
- https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references
- https://learn.microsoft.com/en-us/azure/container-apps/scale-app
- https://learn.microsoft.com/en-us/azure/container-apps/revisions
- https://learn.microsoft.com/en-us/azure/container-registry/container-registry-rbac-abac-repository-permissions
- https://learn.microsoft.com/en-us/cli/azure/webapp/log?view=azure-cli-latest
- https://docs.docker.com/dhi/core-concepts/digests/
- https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- https://learn.microsoft.com/en-us/azure/container-apps/custom-domains-managed-certificates
- https://learn.microsoft.com/en-us/azure/azure-functions/functions-infrastructure-as-code
- https://learn.microsoft.com/en-us/azure/event-grid/overview
- https://github.com/pgvector/pgvector
- https://redis.io/docs/latest/develop/ai/search-and-query/vectors/
- https://redis.io/docs/latest/commands/expire/
- https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside
- https://learn.microsoft.com/en-us/azure/key-vault/secrets/tutorial-rotation
- https://learn.microsoft.com/en-us/azure/key-vault/keys/how-to-configure-key-rotation
- https://learn.microsoft.com/en-us/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python
- https://www.postgresql.org/docs/current/datatype-datetime.html
- https://learn.microsoft.com/en-us/cosmos-db/query/is-number
- https://learn.microsoft.com/en-us/azure/cosmos-db/index-policy
- https://learn.microsoft.com/en-us/python/api/overview/azure/cosmos-readme?view=azure-python
- https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-dotnet
- https://learn.microsoft.com/en-us/powershell/module/az.cosmosdb/new-azcosmosdbsqlcontainer?view=azps-16.0.0
- https://learn.microsoft.com/en-us/azure/search/vector-search-integrated-vectorization
- https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview
- https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search
- https://www.psycopg.org/psycopg3/docs/basic/params.html
- https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents
- https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/function-calling
- https://learn.microsoft.com/en-us/azure/event-grid/quotas-limits
- https://learn.microsoft.com/en-us/azure/event-grid/event-domains
- https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity
- https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-transfers-locks-settlement
- https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-best-practices
- https://learn.microsoft.com/en-us/azure/azure-app-configuration/quickstart-python
- https://opentelemetry.io/docs/languages/python/instrumentation/
- https://learn.microsoft.com/en-us/python/api/overview/azure/monitor-opentelemetry-exporter-readme?view=azure-python
- https://learn.microsoft.com/en-us/kusto/query/summarize-operator
- https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=python
- https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/reproducible-output
- https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/invoice?view=doc-intel-4.0.0
- https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview
- https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter
- https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/deployment-types
