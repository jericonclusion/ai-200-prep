"""Build the local question catalog from pinned, offline source snapshots.

No upstream code is executed. Corrections are applied to the normalized questions,
leaving the source snapshots and their license notices intact.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT.parent / 'sources'
LEARN = 'https://learn.microsoft.com/en-us/'
REFERENCES = {
    'acr': LEARN + 'azure/container-registry/container-registry-intro',
    'app-service-containers': LEARN + 'azure/app-service/configure-custom-container',
    'container-apps-keda': LEARN + 'azure/container-apps/scale-app',
    'aks': LEARN + 'azure/aks/concepts-clusters-workloads',
    'cosmos-db-nosql': LEARN + 'azure/cosmos-db/nosql/',
    'postgresql-pgvector': 'https://github.com/pgvector/pgvector',
    'azure-managed-redis': LEARN + 'azure/redis/',
    'service-bus': LEARN + 'azure/service-bus-messaging/service-bus-messaging-overview',
    'event-grid': LEARN + 'azure/event-grid/overview',
    'azure-functions': LEARN + 'azure/azure-functions/functions-overview',
    'key-vault': LEARN + 'azure/key-vault/general/overview',
    'app-configuration': LEARN + 'azure/azure-app-configuration/overview',
    'opentelemetry': LEARN + 'azure/azure-monitor/app/opentelemetry-overview',
    'kql': LEARN + 'kusto/query/',
}
DOMAINS = {'containers': 'containers', 'data-management': 'data', 'azure-services': 'services', 'secure-monitor': 'operations',
           '01-containers': 'containers', '02-data-services': 'data', '03-connect-consume': 'services', '04-secure-monitor': 'operations'}
TOPIC_DOMAINS = dict(zip(REFERENCES, ['containers'] * 4 + ['data'] * 3 + ['services'] * 3 + ['operations'] * 4))
manifest = {s['id']: s for s in json.loads((SOURCES / 'manifest.json').read_text())}
corrections = json.loads((ROOT / 'data/community-corrections.json').read_text())
sets, questions = [], []


def title(slug):
    value = slug.replace('-160', ' · extended').replace('-', ' ').title()
    for word, label in {'Acr': 'ACR', 'Aks': 'AKS', 'Kql': 'KQL', 'Keda': 'KEDA', 'Sdk': 'SDK', 'Cli': 'CLI',
                        'Db': 'DB', 'Nosql': 'NoSQL', 'Postgresql': 'PostgreSQL', 'Pgvector': 'pgvector',
                        'Opentelemetry': 'OpenTelemetry', 'Ai200': 'AI-200', 'Part1': 'Part 1', 'Part2': 'Part 2'}.items():
        value = re.sub(r'\b' + word + r'\b', label, value)
    return value


def infer_topic(q):
    text = (q.get('relatedService', '') + ' ' + q['question'] + ' ' + q.get('explanation', '')).lower()
    for terms, topic in [(['kql', 'summarize ', 'query language'], 'kql'), (['app configuration', 'appconfig'], 'app-configuration'),
                        (['key vault', 'keyvault'], 'key-vault'), (['opentelemetry', 'application insights', 'telemetry', 'log analytics', 'az monitor'], 'opentelemetry'),
                        (['service bus', 'servicebus', 'service-bus'], 'service-bus'), (['event grid', 'eventgrid'], 'event-grid'),
                        (['function'], 'azure-functions'), (['cosmos'], 'cosmos-db-nosql'), (['postgres', 'pgvector'], 'postgresql-pgvector'),
                        (['redis'], 'azure-managed-redis'), (['container app', 'containerapp', 'keda'], 'container-apps-keda'),
                        (['aks', 'kubernetes', 'kubectl'], 'aks'), (['app service', 'webapp'], 'app-service-containers'), (['acr', 'container registry', 'docker'], 'acr')]:
        if any(term in text for term in terms):
            return topic
    return None


def add_set(id, name, group, path, normalized):
    source = manifest[group]
    url = source['repository'] + '/blob/' + source['revision'] + '/' + path
    sets.append({'id': id, 'name': name, 'group': group, 'source': url})
    for q in normalized:
        q.update(setId=id, practiceSource=q.get('practiceSource', url), reviewDate='2026-10-11')
        patch = corrections.get(q['id'])
        if patch:
            q.update(patch['changes'])
            q['reviewNote'] = patch['reason']
        # Feedback must not refer to the pre-shuffle option letters.
        q['explanation'] = re.sub(r'Why [A-Z] is correct:', 'Correct choice:', q['explanation'])
        q['explanation'] = re.sub(r'Why [A-Z] is (?:wrong|incorrect):', 'Other choice:', q['explanation'])
        if any(re.search(r'all of the above|none of the above|both [A-F] and [A-F]', str(o), re.I) for o in q['options']):
            q['preserveOrder'] = True
        questions.append(q)


for group, pattern in [('suralmk', 'content/questions/*.json'), ('bouvet', 'quiz/src/questions/*/*.json')]:
    for file in sorted((SOURCES / group).glob(pattern)):
        result = []
        for original in json.loads(file.read_text()):
            topic = original.get('topic') or infer_topic(original)
            q = {'id': group + ':' + original['id'], 'prompt': original['question'], 'explanation': original['explanation'],
                 'domain': DOMAINS.get(original['domain'], TOPIC_DOMAINS.get(topic, 'operations')),
                 'source': REFERENCES.get(topic, LEARN + 'cli/azure/reference-index'), 'topic': topic or 'azure-cli'}
            if group == 'suralmk':
                q.update(type='single', options=original['options'], answer=original['answer'])
            elif original['type'] == 'build-list':
                choices = {c['id']: c['text'] for c in original['choices']}
                q.update(type='drag' if len(original['answer']) < len(choices) else 'order', options=list(choices.values()), answer=[choices[a] for a in original['answer']])
            else:
                multi = original['type'] == 'multi'
                q.update(type='multi' if multi else 'single', options=original['choices'], answer=original['answer'] if multi else original['answer'][0])
                if multi:
                    q['choose'] = len(q['answer'])
            result.append(q)
        add_set(group + ':' + file.stem, title(file.stem), group, file.relative_to(SOURCES / group).as_posix(), result)

quiz = SOURCES / 'quizplay-set-3'
result = []
for file in sorted((quiz / 'questions').glob('*.json')):
    original = json.loads(file.read_text())
    category = original['category'].lower()
    domain = 'containers' if 'container' in category else 'data' if 'data management' in category else 'services' if category.startswith('connect') else 'operations'
    q = {'id': original['id'], 'prompt': original['question'], 'explanation': original['explanation'], 'domain': domain,
         'source': LEARN + 'credentials/certifications/resources/study-guides/ai-200',
         'practiceSource': manifest['quizplay-set-3']['repository'] + '/blob/' + manifest['quizplay-set-3']['revision'] + '/questions/' + file.name}
    if original.get('type') == 'ordering':
        q.update(type='order', options=original['items'], answer=original['correctOrder'])
    elif original.get('type') == 'matching':
        # Upstream maps target slots to source items, with an extra source decoy.
        q.update(type='matching', rows=original['targetSlots'], options=original['sourceItems'], answer=[original['sourceItems'][i] for i in original['correctMapping']])
    else:
        answer = [i for i, o in enumerate(original['options']) if o['correct']]
        q.update(type='multi' if len(answer) > 1 else 'single', options=[o['text'] for o in original['options']], answer=answer if len(answer) > 1 else answer[0])
        if len(answer) > 1:
            q['choose'] = len(answer)
    if original.get('caseStudy'):
        scenario = json.loads((quiz / original['caseStudy']).read_text())
        q.update(caseId='quizplay:' + scenario['id'], caseTitle=title(scenario['id'].removeprefix('case_study_').replace('_', '-')),
                 caseData={tab['title']: tab['content'] for tab in scenario['tabs']})
    result.append(q)
add_set('quizplay-set-3', 'Question set 3', 'quizplay-set-3', 'README.md', result)

ids = {q['id'] for q in questions}
assert len(ids) == len(questions), 'Duplicate community IDs'
assert not set(corrections) - ids, 'Correction refers to an unknown question'
catalog = {'sets': sets, 'questions': questions}
output = '// Generated by scripts/import-community.py. Source notices: ../../sources/NOTICE.md\n'
output += '// QuizPlay adaptations retain AGPL-3.0; corresponding source and corrections are included.\n'
output += 'window.AI200_COMMUNITY = ' + json.dumps(catalog, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + ';\n'
(ROOT / 'dist/community-questions.js').write_text(output)
print(f'Imported {len(questions)} questions in {len(sets)} sets; {len(corrections)} corrections.')
