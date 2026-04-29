## Shadow Creator OS Phase-1 Workflow Deployment Map (Locked)

Generated: 2026-04-29

Policy: `WF-900` must stay active. `WF-901` stays inactive except controlled validation window. Ingress workflows must be active. Internal subflows are invocation-only and may remain active or inactive.

| Workflow ID | Source File | Expected Policy | Live Workflow Name | Live Active | Status |
|---|---|---|---|---|---|
| WF-000 | n8n/workflows/WF-000.json | ACTIVE_REQUIRED | WF-000 Health Check Canonical | YES | OK |
| WF-900 | n8n/workflows/WF-900.json | ACTIVE_REQUIRED | WF-900 Error Handler Canonical | YES | OK |
| WF-001 | n8n/workflows/WF-001.json | ACTIVE_REQUIRED | WF-001 Dossier Create Canonical | YES | OK |
| WF-010 | n8n/workflows/WF-010.json | ACTIVE_REQUIRED | WF-010 Parent Orchestrator Canonical | YES | OK |
| WF-100 | n8n/workflows/WF-100.json | INTERNAL_OPTIONAL | WF-100 Topic Intelligence Pack Canonical | YES | OK |
| WF-200 | n8n/workflows/WF-200.json | INTERNAL_OPTIONAL | WF-200 Script Intelligence Pack Canonical | YES | OK |
| WF-020 | n8n/workflows/WF-020.json | ACTIVE_REQUIRED | WF-020 Final Approval Canonical | YES | OK |
| WF-021 | n8n/workflows/WF-021.json | ACTIVE_REQUIRED | WF-021 Replay Remodify Canonical | YES | OK |
| WF-022 | n8n/workflows/WF-022.json | INTERNAL_OPTIONAL | WF-022 Provider Packet Bridge Canonical | NO | OK |
| WF-023 | n8n/workflows/WF-023.json | INTERNAL_OPTIONAL | WF-023 Downstream Resource Preparation Canonical | NO | OK |
| WF-300 | n8n/workflows/WF-300.json | INTERNAL_OPTIONAL | WF-300 Context Engineering Pack Canonical | YES | OK |
| WF-400 | n8n/workflows/WF-400.json | INTERNAL_OPTIONAL | WF-400 Media Production Pack Canonical | YES | OK |
| WF-500 | n8n/workflows/WF-500.json | ACTIVE_REQUIRED | WF-500 Publishing Distribution Pack Canonical | YES | OK |
| WF-600 | n8n/workflows/WF-600.json | INTERNAL_OPTIONAL | WF-600 Analytics Evolution Pack Canonical | YES | OK |
| WF-901 | n8n/workflows/WF-901.json | INACTIVE_CONTROLLED_ONLY | WF-901 Error Recovery Canonical | NO | OK |
| CWF-110 | n8n/workflows/CWF-110.json | INTERNAL_OPTIONAL | CWF-110 Topic Discovery Canonical | YES | OK |
| CWF-120 | n8n/workflows/CWF-120.json | INTERNAL_OPTIONAL | CWF-120 Topic Qualification Canonical | YES | OK |
| CWF-130 | n8n/workflows/CWF-130.json | INTERNAL_OPTIONAL | CWF-130 Topic Scoring Canonical | YES | OK |
| CWF-140 | n8n/workflows/CWF-140.json | INTERNAL_OPTIONAL | CWF-140 Research Synthesis Canonical | YES | OK |
| CWF-210 | n8n/workflows/CWF-210.json | INTERNAL_OPTIONAL | CWF-210 Script Generation Canonical | YES | OK |
| CWF-220 | n8n/workflows/CWF-220.json | INTERNAL_OPTIONAL | CWF-220 Script Debate Canonical | YES | OK |
| CWF-230 | n8n/workflows/CWF-230.json | INTERNAL_OPTIONAL | CWF-230 Script Refinement Canonical | YES | OK |
| CWF-240 | n8n/workflows/CWF-240.json | INTERNAL_OPTIONAL | CWF-240 Final Script Shaping Canonical | YES | OK |
| CWF-310 | n8n/workflows/CWF-310.json | INTERNAL_OPTIONAL | CWF-310 Execution Context Builder Canonical | YES | OK |
| CWF-320 | n8n/workflows/CWF-320.json | INTERNAL_OPTIONAL | CWF-320 Platform Packager Canonical | YES | OK |
| CWF-330 | n8n/workflows/CWF-330.json | INTERNAL_OPTIONAL | CWF-330 Asset Brief Generator Canonical | YES | OK |
| CWF-340 | n8n/workflows/CWF-340.json | INTERNAL_OPTIONAL | CWF-340 Lineage Validator Canonical | YES | OK |
| CWF-410 | n8n/workflows/CWF-410.json | INTERNAL_OPTIONAL | CWF-410 Thumbnail Generator Canonical | YES | OK |
| CWF-420 | n8n/workflows/CWF-420.json | INTERNAL_OPTIONAL | CWF-420 Visual Asset Planner Canonical | YES | OK |
| CWF-430 | n8n/workflows/CWF-430.json | INTERNAL_OPTIONAL | CWF-430 Audio Script Optimizer Canonical | YES | OK |
| CWF-440 | n8n/workflows/CWF-440.json | INTERNAL_OPTIONAL | CWF-440 Media Package Finalizer Canonical | YES | OK |
| CWF-510 | n8n/workflows/CWF-510.json | INTERNAL_OPTIONAL | CWF-510 Platform Metadata Generator Canonical | YES | OK |
| CWF-520 | n8n/workflows/CWF-520.json | INTERNAL_OPTIONAL | CWF-520 Distribution Planner Canonical | YES | OK |
| CWF-530 | n8n/workflows/CWF-530.json | INTERNAL_OPTIONAL | CWF-530 Publish Readiness Checker Canonical | YES | OK |
| CWF-610 | n8n/workflows/analytics/CWF-610-performance-metrics-collector.json | INTERNAL_OPTIONAL | CWF-610 Performance Metrics Collector | YES | OK |
| CWF-620 | n8n/workflows/analytics/CWF-620-audience-feedback-aggregator.json | INTERNAL_OPTIONAL | CWF-620 Audience Feedback Aggregator | YES | OK |
| CWF-630 | n8n/workflows/analytics/CWF-630-evolution-signal-synthesizer.json | INTERNAL_OPTIONAL | CWF-630 Evolution Signal Synthesizer | YES | OK |
