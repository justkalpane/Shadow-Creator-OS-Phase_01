# Unified Hierarchy Report

Generated: 2026-04-23T08:52:06.417862+00:00

## Executive Summary
- Agents: 114
- Sub-agents: 36
- Directors: 32
- Primary routed directors: 9
- Covered directors: 32

## Scope
- This report merges the agent runtime matrix, sub-agent matrix, and director binding matrix into one routing view.
- `ROOT` denotes workflows with no declared parent pack in the sub-agent matrix.
- Pack sections are ordered from root to higher workflow packs for easier navigation.

## Routing Map
| Director | Agent runtime | Sub-agent primary | Workflow primary IDs | Workflow support IDs | Escalation WF | Source packs |
|---|---:|---:|---|---|---|---|
| Agastya | 1 | 0 | none | none | WF-600 | none |
| Agni | 1 | 0 | none | none | WF-900 | none |
| Arjuna | 1 | 0 | none | none | WF-900 | none |
| Aruna | 5 | 1 | WF-023 | none | WF-020 | none |
| Brahma | 1 | 0 | none | none | WF-900 | none |
| Chanakya | 1 | 2 | CWF-120, CWF-510 | CWF-110, CWF-130, CWF-520 | WF-900 | WF-100, WF-500, WF-600 |
| Chandra | 1 | 1 | WF-600 | CWF-110, CWF-130 | WF-600 | WF-100, WF-200, WF-600 |
| Chitragupta | 1 | 0 | none | WF-600 | WF-900 | WF-600 |
| Durga | 1 | 3 | CWF-330, CWF-410, CWF-420 | CWF-140, CWF-220, CWF-240, CWF-310, CWF-430, CWF-440, WF-400 | WF-900 | WF-100, WF-200, WF-300, WF-400 |
| Ganesha | 6 | 0 | none | none | WF-900 | none |
| Garuda | 1 | 0 | none | none | WF-500 | none |
| Hanuman | 1 | 0 | none | none | WF-900 | none |
| Indra | 1 | 0 | none | none | WF-400 | none |
| Kama | 1 | 0 | none | none | WF-500 | none |
| Krishna | 13 | 18 | CWF-130, CWF-220, CWF-240, CWF-310, CWF-340, CWF-440, CWF-520, CWF-610, CWF-620, CWF-630, WF-000, WF-001, WF-010, WF-022, WF-300, WF-400, WF-500, WF-900 | CWF-120, CWF-140, CWF-210, CWF-230, CWF-320, CWF-420, CWF-510, CWF-530, WF-020, WF-021, WF-023, WF-500 | WF-010 | WF-100, WF-200, WF-300, WF-400, WF-500 |
| Kubera | 1 | 0 | none | CWF-120, CWF-340, WF-022, WF-100, WF-200, WF-300 | WF-020 | WF-300, WF-400, WF-500 |
| Maya | 21 | 0 | none | none | WF-400 | none |
| Narada | 6 | 2 | CWF-110, WF-100 | CWF-130 | WF-500 | WF-100 |
| Nataraja | 1 | 0 | none | none | WF-400 | none |
| Parashara | 1 | 0 | none | none | WF-600 | none |
| Ravana | 1 | 0 | none | none | WF-900 | none |
| Saraswati | 1 | 3 | CWF-230, CWF-320, CWF-430 | CWF-140, CWF-210, CWF-220, CWF-240, CWF-330, CWF-410, CWF-440, CWF-510, WF-400 | WF-600 | WF-100, WF-200, WF-300, WF-400 |
| Shakti | 1 | 0 | none | none | WF-500 | none |
| Shiva | 1 | 0 | none | none | WF-900 | none |
| Tumburu | 1 | 0 | none | none | WF-400 | none |
| Valmiki | 19 | 0 | none | none | WF-600 | none |
| Varuna | 1 | 0 | none | none | WF-900 | none |
| Vishnu | 9 | 0 | none | none | WF-900 | none |
| Vishwakarma | 1 | 0 | none | none | WF-400 | none |
| Vyasa | 1 | 3 | CWF-140, CWF-210, WF-200 | CWF-230, WF-021 | WF-600 | WF-100, WF-200, WF-600 |
| Yama | 11 | 3 | CWF-530, WF-020, WF-021 | CWF-120, CWF-220, CWF-340, WF-022, WF-100, WF-200, WF-300, WF-500, WF-600 | WF-020 | WF-200, WF-300, WF-400, WF-500, WF-600 |
| Yudhishthira | 1 | 0 | none | none | WF-900 | none |

## Pack Routing Tree
### ROOT
- Workflow count: 17
- Primary directors: Aruna, Chandra, Krishna, Narada, Vyasa, Yama
- Supporting directors: Krishna, Vyasa
- Director bindings: Aruna, Chandra, Krishna, Narada, Vyasa, Yama

| Workflow ID | Workflow name | Class | Primary director | Supporting directors | Required inputs | Escalates to |
|---|---|---|---|---|---|---|
| CWF-610 | performance_metrics_collector | child_workflow | Krishna | none | none | WF-900 |
| CWF-620 | audience_feedback_aggregator | child_workflow | Krishna | none | none | WF-900 |
| CWF-630 | evolution_signal_synthesizer | child_workflow | Krishna | none | none | WF-900 |
| WF-000 | wf000_health_check | system | Krishna | none | health_probe_request | WF-900 |
| WF-001 | wf001_dossier_create | parent | Krishna | none | intake_packet | WF-900 |
| WF-010 | wf010_parent_orchestrator | parent | Krishna | none | dossier_record, route_signal | WF-900 |
| WF-020 | wf020_final_approval | governance | Yama | none | final_script_packet, media_production_packet | WF-900 |
| WF-021 | wf021_replay_remodify | governance | Yama | Krishna, Vyasa | rejection_packet, replay_context | WF-900 |
| WF-022 | wf022_provider_packet_bridge | system_bridge | Krishna | none | approved_packet, provider_target | WF-900 |
| WF-023 | wf023_downstream_resource_preparation | planning | Aruna | none | final_script_packet, context_engineering_packet | WF-900 |
| WF-100 | wf100_topic_intelligence_pack | parent_pack | Narada | none | dossier_record, orchestration_decision | WF-900 |
| WF-200 | wf200_script_intelligence_pack | parent_pack | Vyasa | none | topic_finalization_packet, research_synthesis_packet, orchestration_decision | WF-900 |
| WF-300 | wf300_context_engineering_pack | parent_pack | Krishna | none | final_script_packet | WF-900 |
| WF-400 | wf400_media_production_pack | parent_pack | Krishna | none | context_engineering_packet | WF-900 |
| WF-500 | wf500_publishing_distribution_pack | parent_pack | Krishna | none | media_production_packet | WF-900 |
| WF-600 | wf600_analytics_evolution_pack | parent_pack | Chandra | none | publish_ready_packet, runtime_context | WF-900 |
| WF-900 | wf900_error_handler | system | Krishna | none | error_event | WF-900 |

### WF-100
- Workflow count: 4
- Primary directors: Chanakya, Krishna, Narada, Vyasa
- Supporting directors: Chanakya, Chandra, Durga, Krishna, Kubera, Narada, Saraswati, Yama
- Director bindings: Chanakya, Chandra, Durga, Krishna, Narada, Saraswati, Vyasa

| Workflow ID | Workflow name | Class | Primary director | Supporting directors | Required inputs | Escalates to |
|---|---|---|---|---|---|---|
| CWF-110 | cwf110_topic_discovery | child | Narada | Chanakya, Chandra | dossier_record, topic_intake_packet | WF-900 |
| CWF-120 | cwf120_topic_qualification | child | Chanakya | Krishna, Yama, Kubera | topic_candidate_board | WF-900 |
| CWF-130 | cwf130_topic_scoring | child | Krishna | Narada, Chanakya, Chandra | topic_finalization_packet | WF-900 |
| CWF-140 | cwf140_research_synthesis | child | Vyasa | Saraswati, Durga, Krishna | topic_finalization_packet | WF-900 |

### WF-200
- Workflow count: 4
- Primary directors: Krishna, Saraswati, Vyasa
- Supporting directors: Durga, Krishna, Saraswati, Vyasa, Yama
- Director bindings: Chandra, Durga, Krishna, Saraswati, Vyasa, Yama

| Workflow ID | Workflow name | Class | Primary director | Supporting directors | Required inputs | Escalates to |
|---|---|---|---|---|---|---|
| CWF-210 | cwf210_script_generation | child | Vyasa | Saraswati, Krishna | topic_finalization_packet, research_synthesis_packet | WF-900 |
| CWF-220 | cwf220_script_debate | child | Krishna | Durga, Yama, Saraswati | script_draft_packet | WF-900 |
| CWF-230 | cwf230_script_refinement | child | Saraswati | Krishna, Vyasa | script_debate_packet | WF-900 |
| CWF-240 | cwf240_final_script_shaping | child | Krishna | Saraswati, Durga | script_refinement_packet | WF-900 |

### WF-300
- Workflow count: 4
- Primary directors: Durga, Krishna, Saraswati
- Supporting directors: Durga, Krishna, Kubera, Saraswati, Yama
- Director bindings: Durga, Krishna, Kubera, Saraswati, Yama

| Workflow ID | Workflow name | Class | Primary director | Supporting directors | Required inputs | Escalates to |
|---|---|---|---|---|---|---|
| CWF-310 | cwf310_execution_context_builder | child | Krishna | Durga | final_script_packet | WF-900 |
| CWF-320 | cwf320_platform_packager | child | Saraswati | Krishna | execution_context_packet | WF-900 |
| CWF-330 | cwf330_asset_brief_generator | child | Durga | Saraswati | platform_package_packet | WF-900 |
| CWF-340 | cwf340_lineage_validator | child | Krishna | Yama, Kubera | asset_brief_packet, execution_context_packet, platform_package_packet, final_script_packet | WF-900 |

### WF-400
- Workflow count: 4
- Primary directors: Durga, Krishna, Saraswati
- Supporting directors: Durga, Krishna, Saraswati
- Director bindings: Durga, Krishna, Kubera, Saraswati, Yama

| Workflow ID | Workflow name | Class | Primary director | Supporting directors | Required inputs | Escalates to |
|---|---|---|---|---|---|---|
| CWF-410 | cwf410_thumbnail_generator | child | Durga | Saraswati | context_engineering_packet | WF-900 |
| CWF-420 | cwf420_visual_asset_planner | child | Durga | Krishna | thumbnail_concept_packet | WF-900 |
| CWF-430 | cwf430_audio_script_optimizer | child | Saraswati | Durga | visual_asset_plan_packet | WF-900 |
| CWF-440 | cwf440_media_package_finalizer | child | Krishna | Durga, Saraswati | audio_optimized_script_packet, visual_asset_plan_packet, thumbnail_concept_packet | WF-900 |

### WF-500
- Workflow count: 3
- Primary directors: Chanakya, Krishna, Yama
- Supporting directors: Chanakya, Krishna, Saraswati
- Director bindings: Chanakya, Krishna, Kubera, Yama

| Workflow ID | Workflow name | Class | Primary director | Supporting directors | Required inputs | Escalates to |
|---|---|---|---|---|---|---|
| CWF-510 | cwf510_platform_metadata_generator | child | Chanakya | Krishna, Saraswati | media_production_packet | WF-900 |
| CWF-520 | cwf520_distribution_planner | child | Krishna | Chanakya | platform_metadata_packet | WF-900 |
| CWF-530 | cwf530_publish_readiness_checker | child | Yama | Krishna | distribution_plan_packet, platform_metadata_packet | WF-900 |

### WF-600
- Workflow count: 0
- Primary directors: none
- Supporting directors: none
- Director bindings: Chanakya, Chandra, Chitragupta, Vyasa, Yama
- No sub-agent workflows are rooted here; this pack acts as a governance or binding boundary only.

## Agent Estate
### Agastya
- Runtime agents: 1
- Agent slugs: agastya
- Artifact families: agastya-agent-packet
- Director binding: DIR-RSRCHv1-003

### Agni
- Runtime agents: 1
- Agent slugs: agni
- Artifact families: agni-agent-packet
- Director binding: DIR-PRODv1-005

### Arjuna
- Runtime agents: 1
- Agent slugs: arjuna
- Artifact families: arjuna-agent-packet
- Director binding: DIR-PRODv1-002

### Aruna
- Runtime agents: 5
- Agent slugs: agent_plugin_runtime_001, agent_plugin_runtime_002, agent_plugin_runtime_003, agent_plugin_runtime_004, aruna
- Artifact families: aruna-agent-packet, plugin-runtime-worker-agent-packet
- Director binding: KERNEL-FLOW-001

### Brahma
- Runtime agents: 1
- Agent slugs: brahma
- Artifact families: brahma-agent-packet
- Director binding: DIR-ORCHv1-004

### Chanakya
- Runtime agents: 1
- Agent slugs: chanakya
- Artifact families: chanakya-agent-packet
- Director binding: DIR-STRTv1-001

### Chandra
- Runtime agents: 1
- Agent slugs: chandra
- Artifact families: chandra-agent-packet
- Director binding: DIR-ANLYv1-001

### Chitragupta
- Runtime agents: 1
- Agent slugs: chitragupta
- Artifact families: chitragupta-agent-packet
- Director binding: DIR-AUDTv1-001

### Durga
- Runtime agents: 1
- Agent slugs: durga
- Artifact families: durga-agent-packet
- Director binding: DIR-STRTv1-004

### Ganesha
- Runtime agents: 6
- Agent slugs: agent_control_plane_001, agent_control_plane_002, agent_control_plane_003, agent_control_plane_004, agent_control_plane_005, ganesha
- Artifact families: control-plane-worker-agent-packet, ganesha-agent-packet
- Director binding: DIR-RSRCHv1-005

### Garuda
- Runtime agents: 1
- Agent slugs: garuda
- Artifact families: garuda-agent-packet
- Director binding: DIR-CINv1-003

### Hanuman
- Runtime agents: 1
- Agent slugs: hanuman
- Artifact families: hanuman-agent-packet
- Director binding: DIR-CINv1-001

### Indra
- Runtime agents: 1
- Agent slugs: indra
- Artifact families: indra-agent-packet
- Director binding: DIR-CINv1-005

### Kama
- Runtime agents: 1
- Agent slugs: kama
- Artifact families: kama-agent-packet
- Director binding: DIR-DISTv1-001

### Krishna
- Runtime agents: 13
- Agent slugs: agent_kernel_001, agent_kernel_002, agent_kernel_003, agent_kernel_004, agent_kernel_005, agent_kernel_006, agent_kernel_007, agent_kernel_008, agent_kernel_009, agent_kernel_010, agent_kernel_011, agent_kernel_012, krishna
- Artifact families: kernel-orchestrator-agent-packet, krishna-agent-packet
- Director binding: DIR-ORCHv1-001

### Kubera
- Runtime agents: 1
- Agent slugs: kubera
- Artifact families: kubera-agent-packet
- Director binding: KERNEL-COST-001

### Maya
- Runtime agents: 21
- Agent slugs: agent_media_001, agent_media_002, agent_media_003, agent_media_004, agent_media_005, agent_media_006, agent_media_007, agent_media_008, agent_media_009, agent_media_010, agent_media_011, agent_media_012, agent_media_013, agent_media_014, agent_media_015, agent_media_016, agent_media_017, agent_media_018, agent_media_019, agent_media_020, maya
- Artifact families: maya-agent-packet, media-worker-agent-packet
- Director binding: DIR-PRODv1-003

### Narada
- Runtime agents: 6
- Agent slugs: agent_evolution_001, agent_evolution_002, agent_evolution_003, agent_evolution_004, agent_evolution_005, narada
- Artifact families: evolution-worker-agent-packet, narada-discovery-packet
- Director binding: DIR-STRTv1-002

### Nataraja
- Runtime agents: 1
- Agent slugs: nataraja
- Artifact families: nataraja-agent-packet
- Director binding: DIR-CINv1-002

### Parashara
- Runtime agents: 1
- Agent slugs: parashara
- Artifact families: parashara-agent-packet
- Director binding: DIR-RSRCHv1-004

### Ravana
- Runtime agents: 1
- Agent slugs: ravana
- Artifact families: ravana-agent-packet
- Director binding: DIR-STRTv1-003

### Saraswati
- Runtime agents: 1
- Agent slugs: saraswati
- Artifact families: saraswati-agent-packet
- Director binding: DIR-DISTv1-002

### Shakti
- Runtime agents: 1
- Agent slugs: shakti
- Artifact families: shakti-agent-packet
- Director binding: DIR-ORCHv1-005

### Shiva
- Runtime agents: 1
- Agent slugs: shiva
- Artifact families: shiva-agent-packet
- Director binding: DIR-ORCHv1-003

### Tumburu
- Runtime agents: 1
- Agent slugs: tumburu
- Artifact families: tumburu-agent-packet
- Director binding: DIR-PRODv1-001

### Valmiki
- Runtime agents: 19
- Agent slugs: agent_research_001, agent_research_002, agent_research_003, agent_research_004, agent_research_005, agent_research_006, agent_research_007, agent_research_008, agent_research_009, agent_research_010, agent_research_011, agent_research_012, agent_research_013, agent_research_014, agent_research_015, agent_research_016, agent_research_017, agent_research_018, valmiki
- Artifact families: research-worker-agent-packet, valmiki-agent-packet
- Director binding: DIR-RSRCHv1-001

### Varuna
- Runtime agents: 1
- Agent slugs: varuna
- Artifact families: varuna-agent-packet
- Director binding: DIR-CINv1-004

### Vishnu
- Runtime agents: 9
- Agent slugs: agent_recovery_001, agent_recovery_002, agent_recovery_003, agent_recovery_004, agent_recovery_005, agent_recovery_006, agent_recovery_007, agent_recovery_008, vishnu
- Artifact families: recovery-worker-agent-packet, vishnu-agent-packet
- Director binding: DIR-ORCHv1-002

### Vishwakarma
- Runtime agents: 1
- Agent slugs: vishwakarma
- Artifact families: vishwakarma-agent-packet
- Director binding: DIR-PRODv1-004

### Vyasa
- Runtime agents: 1
- Agent slugs: vyasa
- Artifact families: vyasa-agent-packet
- Director binding: DIR-RSRCHv1-002

### Yama
- Runtime agents: 11
- Agent slugs: agent_governance_001, agent_governance_002, agent_governance_003, agent_governance_004, agent_governance_005, agent_governance_006, agent_governance_007, agent_governance_008, agent_governance_009, agent_governance_010, yama
- Artifact families: governance-worker-agent-packet, yama-agent-packet
- Director binding: KERNEL-POLICY-001

### Yudhishthira
- Runtime agents: 1
- Agent slugs: yudhishthira
- Artifact families: yudhishthira-agent-packet
- Director binding: DIR-STRTv1-005

## Sub-agent Estate
### Aruna
- Primary sub-agents: 1
- Workflow IDs: WF-023
- Workflow families: system_bridge
- Required inputs: context_engineering_packet, final_script_packet

### Chanakya
- Primary sub-agents: 2
- Workflow IDs: CWF-120, CWF-510
- Workflow families: publishing, topic
- Required inputs: media_production_packet, topic_candidate_board

### Chandra
- Primary sub-agents: 1
- Workflow IDs: WF-600
- Workflow families: parent_pack
- Required inputs: publish_ready_packet, runtime_context

### Durga
- Primary sub-agents: 3
- Workflow IDs: CWF-330, CWF-410, CWF-420
- Workflow families: context, media
- Required inputs: context_engineering_packet, platform_package_packet, thumbnail_concept_packet

### Krishna
- Primary sub-agents: 18
- Workflow IDs: CWF-130, CWF-220, CWF-240, CWF-310, CWF-340, CWF-440, CWF-520, CWF-610, CWF-620, CWF-630, WF-000, WF-001, WF-010, WF-022, WF-300, WF-400, WF-500, WF-900
- Workflow families: analytics, context, media, parent_pack, publishing, script, system_bridge, system_error, system_foundation, topic
- Required inputs: approved_packet, asset_brief_packet, audio_optimized_script_packet, context_engineering_packet, dossier_record, error_event, execution_context_packet, final_script_packet, health_probe_request, intake_packet, media_production_packet, platform_metadata_packet, platform_package_packet, provider_target, route_signal, script_draft_packet, script_refinement_packet, thumbnail_concept_packet, topic_finalization_packet, visual_asset_plan_packet

### Narada
- Primary sub-agents: 2
- Workflow IDs: CWF-110, WF-100
- Workflow families: parent_pack, topic
- Required inputs: dossier_record, orchestration_decision, topic_intake_packet

### Saraswati
- Primary sub-agents: 3
- Workflow IDs: CWF-230, CWF-320, CWF-430
- Workflow families: context, media, script
- Required inputs: execution_context_packet, script_debate_packet, visual_asset_plan_packet

### Vyasa
- Primary sub-agents: 3
- Workflow IDs: CWF-140, CWF-210, WF-200
- Workflow families: parent_pack, script, topic
- Required inputs: orchestration_decision, research_synthesis_packet, topic_finalization_packet

### Yama
- Primary sub-agents: 3
- Workflow IDs: CWF-530, WF-020, WF-021
- Workflow families: governance, publishing
- Required inputs: distribution_plan_packet, final_script_packet, media_production_packet, platform_metadata_packet, rejection_packet, replay_context

## Director Coverage Notes
- Agastya: 1 agent runtime node(s)
- Agni: 1 agent runtime node(s)
- Arjuna: 1 agent runtime node(s)
- Aruna: 5 agent runtime node(s), 1 sub-agent primary node(s), 1 workflow primary binding(s)
- Brahma: 1 agent runtime node(s)
- Chanakya: 1 agent runtime node(s), 2 sub-agent primary node(s), 2 workflow primary binding(s), 3 workflow support binding(s)
- Chandra: 1 agent runtime node(s), 1 sub-agent primary node(s), 1 workflow primary binding(s), 2 workflow support binding(s)
- Chitragupta: 1 agent runtime node(s), 1 workflow support binding(s)
- Durga: 1 agent runtime node(s), 3 sub-agent primary node(s), 3 workflow primary binding(s), 7 workflow support binding(s)
- Ganesha: 6 agent runtime node(s)
- Garuda: 1 agent runtime node(s)
- Hanuman: 1 agent runtime node(s)
- Indra: 1 agent runtime node(s)
- Kama: 1 agent runtime node(s)
- Krishna: 13 agent runtime node(s), 18 sub-agent primary node(s), 18 workflow primary binding(s), 12 workflow support binding(s)
- Kubera: 1 agent runtime node(s), 6 workflow support binding(s)
- Maya: 21 agent runtime node(s)
- Narada: 6 agent runtime node(s), 2 sub-agent primary node(s), 2 workflow primary binding(s), 1 workflow support binding(s)
- Nataraja: 1 agent runtime node(s)
- Parashara: 1 agent runtime node(s)
- Ravana: 1 agent runtime node(s)
- Saraswati: 1 agent runtime node(s), 3 sub-agent primary node(s), 3 workflow primary binding(s), 9 workflow support binding(s)
- Shakti: 1 agent runtime node(s)
- Shiva: 1 agent runtime node(s)
- Tumburu: 1 agent runtime node(s)
- Valmiki: 19 agent runtime node(s)
- Varuna: 1 agent runtime node(s)
- Vishnu: 9 agent runtime node(s)
- Vishwakarma: 1 agent runtime node(s)
- Vyasa: 1 agent runtime node(s), 3 sub-agent primary node(s), 3 workflow primary binding(s), 2 workflow support binding(s)
- Yama: 11 agent runtime node(s), 3 sub-agent primary node(s), 3 workflow primary binding(s), 9 workflow support binding(s)
- Yudhishthira: 1 agent runtime node(s)

## Cross-Layer Observations
- Agent runtime now includes explicit runtime nodes for every agent-binding director.
- Sub-agent coverage is normalized by workflow primary director and reflected in the hierarchy map.
- Director binding coverage surfaces both pack-level ownership and direct workflow support.
- Secondary directors may appear in workflow support even when they do not have runtime agents; that is preserved as governance-only truth.
