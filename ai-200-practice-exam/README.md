# AI-200 Exam Simulator

English-language practice application for AI-200. Open `dist/index.html` in a browser to run it locally.

## Included

- 263 verified practice questions mapped to the current AI-200 skills outline
- 133 questions from Microsoft Learn module assessments across all 27 AI-200 modules, including technical adaptations with original module and technical reference URLs
- Free preview questions from external practice providers are reworded and checked against technical documentation
- Full simulation: 50 questions in 100 minutes
- Quick assessment: 20 questions in 40 minutes
- Case study drill with scenario tabs and section review
- Study mode with immediate explanations
- Case-study questions retain their named scenario and readable context when randomized in Study mode
- Automatic local session saving with a resume-or-start-over prompt after reopening or refreshing the app
- Persistent green/red question-number status in Study mode after an answer is checked or left with Next
- Built-in full-screen supplied-scenario viewer with a persistent case-study name, readable structured text, and a cropped original-image view
- Source-verified case membership: only the 19 instructor questions that show the VCE Overview control are attached to Fabrikam or Proseware
- Single choice, multiple response, ordering, and locked Yes/No problem-solution items
- Review flags, question comments, section review, timed-session breaks, and Microsoft Learn links
- Estimated 0-1000 practice score and performance by domain
- Local attempt history stored in the browser

## Important

This is an independent study tool, not an official Microsoft product. Microsoft Learn assessment items remain attributed to their source; the other questions are original or source-based adaptations. The exact real-exam question count, order, case studies, and presence of labs can vary.

Microsoft currently states that an official AI-200 Practice Assessment is not available. The Microsoft-sourced questions come from public module assessments in the official AI-200 course. Items marked as adapted contain technical corrections or clarified scenarios; they are not verbatim Microsoft questions or live exam questions.

The 100-minute full simulation models Microsoft's associate/expert role-based exam profile without a lab. Microsoft says these exams usually contain 40–60 questions. Exams that may contain labs use a 120-minute exam profile. Check the real exam's introduction screen for its actual sections. For the official interface and question-type demonstration, use https://aka.ms/examdemo.

## Question-bank validation

Single-choice and multiple-response options are shuffled once per session, with correct-answer indexes remapped. Yes/No options retain their familiar order. Full simulations include case-study and locked items in the domain totals: 12 container, 14 data, 12 services, and 12 operations questions (24%, 28%, 24%, and 24%). The practice score is the percentage correct scaled to 1000, not Microsoft's scoring formula.

After changing the question bank or inline runtime, run `node scripts/build-inline.cjs` to update both embedded HTML versions, then `node scripts/check-questions.cjs` to check answer mappings, domain selection, and embedded-content consistency. Run `node scripts/check-runtime.cjs` to test session startup, case-study grouping, feedback, partial and perfect scores, and answer review in both app versions. Run `node scripts/check-browser.cjs` for a full headless browser walkthrough of a 20-question quick assessment and its result screen. The browser test requires Microsoft Edge, Chrome, or an `AI200_BROWSER` path.

Technical review clarified Service Bus redelivery versus duplicate sends, ACR RBAC versus ABAC roles, App Service sidecar port configuration, Key Vault refresh and secret rotation, Cosmos DB consistency and vector-index limits, Python pagination, and SDK credentials versus Functions binding configuration. Question C13 now tests a concrete diagnostic action instead of requiring an arbitrary troubleshooting order.

## Primary references

The module-question review corrected or clarified 34 items: MS001, MS014, MS028, MS035, MS036, MS037, MS052, MS054, MS055, MS056, MS058, MS059, MS060, MS063, MS069, MS070, MS071, MS073, MS075, MS076, MS077, MS082, MS085, MS088, MS089, MS090, MS096, MS098, MS111, MS116, MS118, MS124, MS128, and MS130. Original module URLs are retained separately from technical references and shown in answer feedback. Corrections cover Redis recovery and expiry, Cosmos DB consistency and query semantics, secret version selection, vector-model migration, Kubernetes configuration, Functions concurrency, and telemetry interpretation.

- https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200
- https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/
- https://learn.microsoft.com/en-us/training/courses/ai-200t00
- https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience
- https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions
- https://learn.microsoft.com/en-us/shows/exam-readiness-zone/what-to-expect-on-your-microsoft-exam
