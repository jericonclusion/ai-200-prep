"""Create an offline reader; upstream markdown and Python data are never executed."""
from pathlib import Path
import ast
import html
import json
import re

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'sources'
entries = []
for source, pattern in [('suralmk', 'content/study/**/*.md'), ('bouvet', '0*/*/README.md')]:
    for file in sorted((SOURCES / source).glob(pattern)):
        text = file.read_text()
        heading = re.search(r'^#\s+(.+)', text, re.M)
        entries.append({'id': source + ':' + file.relative_to(SOURCES / source).as_posix(), 'group': source.title(),
                        'title': heading[1] if heading else file.stem.replace('-', ' ').title(),
                        'path': file.relative_to(SOURCES).as_posix(), 'text': text})

def plain(value):
    return html.unescape(re.sub(r'<[^>]+>', '', str(value)))

lab_notes = {
    '1.1': ('Zone redundancy is now available in Basic, Standard and Premium in supported regions. Geo-replication and Private Link remain Premium features.', 'https://learn.microsoft.com/en-us/azure/container-registry/zone-redundancy'),
    '1.3': ('Key Vault references avoid literal secret values in persisted App Service settings, but the resolved secret is present in the application environment/memory. Versionless references can take up to 24 hours to refresh unless refreshed explicitly.', 'https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references'),
    '2.1': ('Check the installed Python SDK version for cross-partition defaults. Use an explicit partition_key for scoped queries; enable_cross_partition_query=True makes cross-partition intent explicit where supported. A high-cardinality key is useful only if request volume is also distributed.', 'https://learn.microsoft.com/en-us/python/api/azure-cosmos/azure.cosmos.containerproxy?view=azure-python'),
    '2.2': ('Strong and bounded-staleness reads have higher RU charges than session, consistent-prefix and eventual reads. Scalar index exclusions reduce write maintenance; vector indexes and metadata filter indexes still need their own configuration.', 'https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels'),
    '2.4': ('All-versions-and-deletes change feed is limited to supported continuous-backup retention, not unlimited history. A lease/checkpoint system still delivers at least once.', 'https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/change-feed-modes'),
    '2.5': ('For server identity validation, use sslmode=verify-full with a current trusted root certificate. sslmode=require alone does not ensure hostname verification. An additional index does not necessarily make a read faster; confirm its actual plan.', 'https://www.postgresql.org/docs/current/libpq-ssl.html'),
    '2.6': ('Tenant predicates must come from trusted authorization context. Approximate vector indexes can filter after candidate retrieval; use iterative scans, candidate tuning or exact search when needed to reach the required recall.', 'https://github.com/pgvector/pgvector'),
    '3.2': ('Competing consumers receive one copy per delivery, but a failed or lost settlement can cause another delivery. Make the business operation idempotent. Correlation filters can match multiple equality properties.', 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-transfers-locks-settlement'),
    '4.1': ('Complete secret rotation updates the credential at the issuing service and then coordinates Key Vault versions and consumer refresh. A near-expiry event or a new vault version alone does not rotate that credential.', 'https://learn.microsoft.com/en-us/azure/key-vault/secrets/tutorial-rotation'),
    '4.3': ('DefaultAzureCredential is a credential chain; it does not always choose managed identity just because code runs in Azure. Constrain the production credential and grant data-plane access separately.', 'https://learn.microsoft.com/en-us/azure/developer/python/sdk/authentication/credential-chains'),
    '4.5': ('Put bin(timestamp, 1h) in the summarize by grouping (or compute a bucket before it). In Application Insights queries, request duration is numeric milliseconds; use duration > 1000 for one second. For workspace queries, use DurationMs and PascalCase columns.', 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/metrics-overview'),
}
for file in sorted((SOURCES / 'naytron-labs/src/domains').glob('*.py')):
    tree = ast.parse(file.read_text())
    node = next(n for n in tree.body if isinstance(n, ast.Assign) and getattr(n.targets[0], 'id', None) == 'LABS')
    for lab in ast.literal_eval(node.value):
        parts = ['# ' + lab['title'], plain(lab['objective']), '## Prerequisites', plain(lab['prereq'])]
        for key, title in [('exam', 'Exam concepts'), ('portal', 'Portal steps'), ('cli', 'Azure CLI'), ('code', 'Code'), ('traps', 'Common mistakes'), ('cleanup', 'Cleanup')]:
            value = lab[key]
            if isinstance(value, list):
                body = '\n'.join(('### ' + plain(v[2:])) if v.startswith('##') else '- ' + plain(v) for v in value)
            elif key in ('cli', 'code'):
                body = '```\n' + value.strip() + '\n```'
            else:
                body = plain(value)
            parts.extend(['## ' + title, body])
        note = lab_notes.get(lab['id'])
        entries.append({'id': 'naytron:' + lab['id'], 'group': 'Naytron', 'title': lab['id'] + ' · ' + lab['title'],
                        'path': file.relative_to(SOURCES).as_posix(), 'text': '\n\n'.join(parts),
                        'notes': [{'text': note[0], 'source': note[1]}] if note else []})
aid = SOURCES / 'naytron-labs/src/study-aids/identity-governance-monitoring.md'
entries.append({'id': 'naytron:study-aid', 'group': 'Naytron', 'title': 'Identity, governance and monitoring', 'path': aid.relative_to(SOURCES).as_posix(), 'text': aid.read_text()})
review = (ROOT / 'ai-200-practice-exam/data/community-corrections.json')
corrections = json.loads(review.read_text())
catalog = json.loads((ROOT / 'ai-200-practice-exam/dist/community-questions.js').read_text().split('window.AI200_COMMUNITY = ', 1)[1].rstrip(';\n'))
questions = {q['id']: q for q in catalog['questions']}
for entry in entries:
    # Correct numeric-millisecond examples in the derived reader, including labs.
    entry['text'] = re.sub(r'duration\s*>\s*1s\b', 'duration > 1000', entry['text'])
    entry['text'] = re.sub(r'(percentile\(duration,\s*95\))\s*/\s*1ms', r'\1', entry['text'])
    entry['text'] = entry['text'].replace('timespan-valued `duration`', 'numeric millisecond `duration`')
    if entry['group'] not in ('Bouvet', 'Suralmk'):
        continue
    words = entry['path'].lower()
    topics = [topic for topic, hints in {
        'acr': ['acr', 'registry'], 'aks': ['aks', 'kubernetes'], 'container-apps-keda': ['container-apps'],
        'app-service-containers': ['app-service'], 'cosmos-db-nosql': ['cosmos'], 'postgresql-pgvector': ['postgres', 'pgvector'],
        'azure-managed-redis': ['redis'], 'service-bus': ['service-bus'], 'event-grid': ['event-grid'],
        'azure-functions': ['function'], 'key-vault': ['key-vault', 'keyvault', 'security'],
        'app-configuration': ['app-configuration'], 'opentelemetry': ['opentelemetry', 'monitoring'], 'kql': ['kql']
    }.items() if any(hint in words for hint in hints)]
    entry['notes'] = [{'text': questions[id]['explanation'], 'source': questions[id]['source']} for id in corrections
                      if id.startswith(entry['group'].lower() + ':') and questions[id].get('topic') in topics]
    # Repair the shared, documented unit error in the reader's derived copy.
    entry['text'] = re.sub(r'duration\s*>\s*1s\b', 'duration > 1000', entry['text'])

serialized = json.dumps(entries, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
(SOURCES / 'library-data.js').write_text('// Generated offline learning material; see NOTICE.md for source notices.\nwindow.AI200_LIBRARY=' + serialized + ';\n')
print(f'Built offline library with {len(entries)} guides, including 23 Naytron labs.')

esc = html.escape
records = []
for id, patch in corrections.items():
    question = questions[id]
    records.append(f'<details class="guide"><summary>{esc(id)}</summary><div class="guide-body">'
                   f'<p>{esc(patch["reason"])}</p><p><strong>Current question:</strong> {esc(question["prompt"])}</p>'
                   f'<p>{esc(question["explanation"])}</p><p><a href="{esc(question["source"])}">Technical reference</a> · '
                   f'<a href="{esc(question["practiceSource"])}">Original source</a></p></div></details>')
report = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI-200 content review</title><link rel="stylesheet" href="../ai-200-practice-exam/dist/styles.css"><link rel="stylesheet" href="library.css"></head>
<body><main class="library"><a href="index.html">Back to the study library</a><h1>Content review · 11 October 2026</h1>
<p>The four repositories are preserved at pinned revisions. The simulator imports 861 additional questions. All imported answer structures, choice mappings, identifiers and case-study associations are checked automatically. Technical review produced 136 correction and clarification records, listed below with primary references.</p>
<p>Review focuses on the answer logic, ambiguous assumptions, changing service features and documented SDK/CLI usage. It is not a guarantee that every sentence in the upstream guides is current. The reader includes topic review notes and corrects the identified KQL duration-unit examples. The original snapshots remain unchanged for comparison.</p>
<p>The 23 Naytron labs are available with prerequisites, CLI, code, cleanup and topic notes. Their deployments have not been executed in Azure. Subscription permissions, region availability, quotas and installed SDK versions must match the exercise.</p>
<p>Use the official study guide to prioritize the exam objectives. Blob lifecycle, Event Hubs, Durable Functions and API Management exercises provide additional breadth beyond its explicitly named services.</p>
<p><a href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200">Official AI-200 study guide</a> · <a href="manifest.json">Source revisions and checksums</a></p>
'''
(SOURCES / 'review.html').write_text(report + '\n'.join(records) + '</main></body></html>\n')
