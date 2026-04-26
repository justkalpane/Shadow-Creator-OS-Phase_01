$ErrorActionPreference = 'Stop'

$root = 'C:\ShadowEmpire-Git'
$generatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')

$wave1 = @(
  [pscustomobject]@{ Id='M-121'; Name='TikTok Script Optimizer'; LegacyAlias='Algorithm Intelligence Core'; File='skills/swarm_expansion/M-121-algorithm-intelligence-core.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Narada'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='tiktok_script_packet'; Schema='schemas/packets/tiktok_script_packet.schema.json'; Dossier='dossier.script_vein.tiktok_script_optimizer'; Namespace='tiktok_script_optimizer'; PrimaryField='compressed_script'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Narada (platform strategist)'; Purpose='Compress script to short-form TikTok format with pacing and cue optimization.'; TestFile='tests/skills/phase2c/test_M-121_tiktok_script_optimizer.md' },
  [pscustomobject]@{ Id='M-122'; Name='YouTube Script Optimizer'; LegacyAlias='Data Signal Collector'; File='skills/swarm_expansion/M-122-data-signal-collector.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Vyasa'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='youtube_script_packet'; Schema='schemas/packets/youtube_script_packet.schema.json'; Dossier='dossier.script_vein.youtube_script_optimizer'; Namespace='youtube_script_optimizer'; PrimaryField='optimized_script'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Vyasa (structure organizer)'; Purpose='Adapt base scripts for long-form YouTube narrative coherence and retention.'; TestFile='tests/skills/phase2c/test_M-122_youtube_script_optimizer.md' },
  [pscustomobject]@{ Id='M-123'; Name='Blog Article Generator'; LegacyAlias='Algorithm Pattern Analyzer'; File='skills/swarm_expansion/M-123-algorithm-pattern-analyzer.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Saraswati'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120','M-018'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='blog_article_packet'; Schema='schemas/packets/blog_article_packet.schema.json'; Dossier='dossier.script_vein.blog_article_generator'; Namespace='blog_article_generator'; PrimaryField='article_draft'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Saraswati (knowledge keeper)'; Purpose='Transform script content into structured long-form blog article output.'; TestFile='tests/skills/phase2c/test_M-123_blog_article_generator.md' },
  [pscustomobject]@{ Id='M-124'; Name='Podcast Script Generator'; LegacyAlias='Watch-Time Analyzer'; File='skills/swarm_expansion/M-124-watch-time-analyzer.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Narada'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='podcast_script_packet'; Schema='schemas/packets/podcast_script_packet.schema.json'; Dossier='dossier.script_vein.podcast_script_generator'; Namespace='podcast_script_generator'; PrimaryField='podcast_script'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Narada (distribution strategist)'; Purpose='Convert scripts into spoken-format podcast narratives with cue structure.'; TestFile='tests/skills/phase2c/test_M-124_podcast_script_generator.md' },
  [pscustomobject]@{ Id='M-125'; Name='LinkedIn Article Generator'; LegacyAlias='Retention Drop Detector'; File='skills/swarm_expansion/M-125-retention-drop-detector.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Krishna'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='linkedin_packet'; Schema='schemas/packets/linkedin_packet.schema.json'; Dossier='dossier.script_vein.linkedin_article_generator'; Namespace='linkedin_article_generator'; PrimaryField='linkedin_article'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Krishna (strategic authority)'; Purpose='Generate professional LinkedIn-native article variants from approved script assets.'; TestFile='tests/skills/phase2c/test_M-125_linkedin_article_generator.md' },
  [pscustomobject]@{ Id='M-126'; Name='Infographic Script Generator'; LegacyAlias='Retention Repair Engine'; File='skills/swarm_expansion/M-126-retention-repair-engine.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Vyasa'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120','M-107'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='infographic_script_packet'; Schema='schemas/packets/infographic_script_packet.schema.json'; Dossier='dossier.script_vein.infographic_script_generator'; Namespace='infographic_script_generator'; PrimaryField='infographic_script'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Vyasa (structure organizer)'; Purpose='Translate script arguments into infographic-ready narrative blocks and labels.'; TestFile='tests/skills/phase2c/test_M-126_infographic_script_generator.md' },
  [pscustomobject]@{ Id='M-127'; Name='Email Sequence Generator'; LegacyAlias='Viral Pattern Library'; File='skills/swarm_expansion/M-127-viral-pattern-library.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Krishna'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120','M-002','M-109'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='email_sequence_packet'; Schema='schemas/packets/email_sequence_packet.schema.json'; Dossier='dossier.script_vein.email_sequence_generator'; Namespace='email_sequence_generator'; PrimaryField='email_sequence'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Krishna (orchestrator)'; Purpose='Build deterministic multi-email narrative sequences from source script.'; TestFile='tests/skills/phase2c/test_M-127_email_sequence_generator.md' },
  [pscustomobject]@{ Id='M-128'; Name='Social Media Caption Generator'; LegacyAlias='Viral Pattern Replicator'; File='skills/swarm_expansion/M-128-viral-pattern-replicator.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Narada'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='social_media_packet'; Schema='schemas/packets/social_media_packet.schema.json'; Dossier='dossier.script_vein.social_media_caption_generator'; Namespace='social_media_caption_generator'; PrimaryField='caption_set'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Narada (platform signal strategist)'; Purpose='Produce platform-compliant short caption variants for social distribution.'; TestFile='tests/skills/phase2c/test_M-128_social_media_caption_generator.md' },
  [pscustomobject]@{ Id='M-129'; Name='Newsletter Script Generator'; LegacyAlias='Thumbnail Heatmap Analyzer'; File='skills/swarm_expansion/M-129-thumbnail-heatmap-analyzer.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Vyasa'; Strategic='Krishna'; UpstreamIds=@('M-110','M-120','M-002'); DownstreamIds=@('M-130'); Producer='CWF-230'; Consumers=@('CWF-240'); Family='newsletter_packet'; Schema='schemas/packets/newsletter_packet.schema.json'; Dossier='dossier.script_vein.newsletter_script_generator'; Namespace='newsletter_script_generator'; PrimaryField='newsletter_script'; OnSuccessSkill='M-130'; OnSuccessWorkflow='CWF-240'; Archetype='Vyasa (narrative organizer)'; Purpose='Generate structured newsletter narratives and sections from script assets.'; TestFile='tests/skills/phase2c/test_M-129_newsletter_script_generator.md' },
  [pscustomobject]@{ Id='M-130'; Name='Multi-Format Coordinate Manager'; LegacyAlias='Thumbnail Optimization Engine'; File='skills/swarm_expansion/M-130-thumbnail-optimization-engine.skill.md'; Phase='PHASE_2C_PLATFORM_VARIANTS'; Vein='script_vein'; Owner='Shiva'; Strategic='Krishna'; UpstreamIds=@('M-121','M-122','M-123','M-124','M-125','M-126','M-127','M-128','M-129'); DownstreamIds=@('M-201','M-216','M-231'); Producer='CWF-240'; Consumers=@('CWF-310'); Family='format_coordination_packet'; Schema='schemas/packets/format_coordination_packet.schema.json'; Dossier='dossier.script_vein.multi_format_coordinate_manager'; Namespace='multi_format_coordinate_manager'; PrimaryField='coordinated_asset_matrix'; OnSuccessSkill='M-201'; OnSuccessWorkflow='CWF-310'; Archetype='Shiva (harmonizer)'; Purpose='Coordinate and align all phase-2C format variants for media pipeline handoff.'; TestFile='tests/skills/phase2c/test_M-130_multi_format_coordinate_manager.md' }
)

$phase1c = @(
  [pscustomobject]@{ Id='M-021'; Name='Primary Source Interrogator'; LegacyAlias='Fact Cross-Verification Unit'; File='skills/research_intelligence/M-021-fact-cross-verification-unit.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Saraswati'; Strategic='Krishna'; Archetype='Saraswati (knowledge keeper)'; UpstreamDetail='verified_claims (from M-015), expert_opinions (from M-017)'; UpstreamIds=@('M-015','M-017'); DownstreamDetail='M-022 Longitudinal Analysis Engine'; DownstreamIds=@('M-022'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='primary_source_interrogation_packet'; Schema='schemas/packets/primary_source_interrogation_packet.schema.json'; Dossier='dossier.research_vein.primary_source_interrogator'; Namespace='primary_source_interrogator'; PrimaryField='extracted_assumptions'; OnSuccessSkill='M-022'; OnSuccessWorkflow='CWF-140'; Purpose='Deep interrogation of primary sources to extract latent claims and assumptions.'; TestFile='tests/skills/phase1c/test_M-021_primary_source_interrogator.md' },
  [pscustomobject]@{ Id='M-022'; Name='Longitudinal Analysis Engine'; LegacyAlias='Knowledge Graph Builder'; File='skills/research_intelligence/M-022-knowledge-graph-builder.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Shiva'; Strategic='Krishna'; Archetype='Shiva (transformer, change analyzer)'; UpstreamDetail='research_narrative (from M-018), historical_data_sources'; UpstreamIds=@('M-018'); DownstreamDetail='M-023 Causal Inference Builder'; DownstreamIds=@('M-023'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='longitudinal_packet'; Schema='schemas/packets/longitudinal_packet.schema.json'; Dossier='dossier.research_vein.longitudinal_analysis_engine'; Namespace='longitudinal_analysis_engine'; PrimaryField='temporal_trends'; OnSuccessSkill='M-023'; OnSuccessWorkflow='CWF-140'; Purpose='Identify temporal patterns, trend evolution, and lag structures over time.'; TestFile='tests/skills/phase1c/test_M-022_longitudinal_analysis_engine.md' },
  [pscustomobject]@{ Id='M-023'; Name='Causal Inference Builder'; LegacyAlias='Trend Risk Evaluator'; File='skills/topic_intelligence/M-023-trend-risk-evaluator.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Brihaspati'; Strategic='Krishna'; Archetype='Brihaspati (wisdom keeper, logical analyzer)'; UpstreamDetail='verified_claims (from M-015), counterarguments (from M-016), longitudinal_analysis (from M-022)'; UpstreamIds=@('M-015','M-016','M-022'); DownstreamDetail='M-024 Meta-Analysis Synthesizer'; DownstreamIds=@('M-024'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='causal_inference_packet'; Schema='schemas/packets/causal_inference_packet.schema.json'; Dossier='dossier.research_vein.causal_inference_builder'; Namespace='causal_inference_builder'; PrimaryField='causal_models'; OnSuccessSkill='M-024'; OnSuccessWorkflow='CWF-140'; Purpose='Construct formal causal models from correlational evidence and confounder checks.'; TestFile='tests/skills/phase1c/test_M-023_causal_inference_builder.md' },
  [pscustomobject]@{ Id='M-024'; Name='Meta-Analysis Synthesizer'; LegacyAlias='Topic Finalization Engine'; File='skills/topic_intelligence/M-024-topic-finalization-engine.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Vyasa'; Strategic='Krishna'; Archetype='Vyasa (organizer, synthesizer)'; UpstreamDetail='M-021, M-022, M-023 deep research outputs'; UpstreamIds=@('M-021','M-022','M-023'); DownstreamDetail='M-025 Assumption Validator'; DownstreamIds=@('M-025'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='meta_analysis_packet'; Schema='schemas/packets/meta_analysis_packet.schema.json'; Dossier='dossier.research_vein.meta_analysis_synthesizer'; Namespace='meta_analysis_synthesizer'; PrimaryField='synthesized_effect_sizes'; OnSuccessSkill='M-025'; OnSuccessWorkflow='CWF-140'; Purpose='Synthesize findings across studies into convergent confidence-weighted conclusions.'; TestFile='tests/skills/phase1c/test_M-024_meta_analysis_synthesizer.md' },
  [pscustomobject]@{ Id='M-025'; Name='Assumption Validator'; LegacyAlias='Research Archive Manager'; File='skills/research_intelligence/M-025-research-archive-manager.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Saraswati'; Strategic='Krishna'; Archetype='Saraswati (transparency advocate)'; UpstreamDetail='M-023 causal inference and M-024 meta-analysis outputs'; UpstreamIds=@('M-023','M-024'); DownstreamDetail='M-026 Knowledge Gap Identifier'; DownstreamIds=@('M-026'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='assumption_validation_packet'; Schema='schemas/packets/assumption_validation_packet.schema.json'; Dossier='dossier.research_vein.assumption_validator'; Namespace='assumption_validator'; PrimaryField='assumptions_identified'; OnSuccessSkill='M-026'; OnSuccessWorkflow='CWF-140'; Purpose='Surface and test hidden assumptions and quantify sensitivity impacts.'; TestFile='tests/skills/phase1c/test_M-025_assumption_validator.md' },
  [pscustomobject]@{ Id='M-026'; Name='Knowledge Gap Identifier'; LegacyAlias='Title Engineer'; File='skills/script_intelligence_army/M-026-title-engineer.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Saraswati'; Strategic='Krishna'; Archetype='Saraswati (knowledge keeper)'; UpstreamDetail='all Phase 1B and Phase 1C outputs (research artifacts)'; UpstreamIds=@('M-008','M-009','M-010','M-011','M-012','M-013','M-014','M-015','M-016','M-017','M-018','M-019','M-020','M-021','M-022','M-023','M-024','M-025'); DownstreamDetail='M-027 Nuance Capture Engine'; DownstreamIds=@('M-027'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='knowledge_gap_packet'; Schema='schemas/packets/knowledge_gap_packet.schema.json'; Dossier='dossier.research_vein.knowledge_gap_identifier'; Namespace='knowledge_gap_identifier'; PrimaryField='identified_gaps'; OnSuccessSkill='M-027'; OnSuccessWorkflow='CWF-140'; Purpose='Identify unknowns and evidence gaps requiring explicit downstream caveats.'; TestFile='tests/skills/phase1c/test_M-026_knowledge_gap_identifier.md' },
  [pscustomobject]@{ Id='M-027'; Name='Nuance Capture Engine'; LegacyAlias='SEO Architect'; File='skills/script_intelligence_army/M-027-seo-architect.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Narada'; Strategic='Krishna'; Archetype='Narada (strategic information gatherer)'; UpstreamDetail='knowledge_gaps (M-026), research_narrative (M-018), expert_opinions (M-017)'; UpstreamIds=@('M-026','M-018','M-017'); DownstreamDetail='M-028 Predictive Extrapolation'; DownstreamIds=@('M-028'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='nuance_packet'; Schema='schemas/packets/nuance_packet.schema.json'; Dossier='dossier.research_vein.nuance_capture_engine'; Namespace='nuance_capture_engine'; PrimaryField='identified_nuances'; OnSuccessSkill='M-028'; OnSuccessWorkflow='CWF-140'; Purpose='Capture edge cases and contextual nuances omitted by baseline narratives.'; TestFile='tests/skills/phase1c/test_M-027_nuance_capture_engine.md' },
  [pscustomobject]@{ Id='M-028'; Name='Predictive Extrapolation'; LegacyAlias='Metadata Builder'; File='skills/script_intelligence_army/M-028-metadata-builder.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Krishna'; Strategic='Krishna'; Archetype='Krishna (strategist, forecaster)'; UpstreamDetail='longitudinal_data (M-022), causal_models (M-023), assumptions (M-025)'; UpstreamIds=@('M-022','M-023','M-025'); DownstreamDetail='M-029 Research Limitations Documenter'; DownstreamIds=@('M-029'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='prediction_packet'; Schema='schemas/packets/prediction_packet.schema.json'; Dossier='dossier.research_vein.predictive_extrapolation'; Namespace='predictive_extrapolation'; PrimaryField='base_case_forecast'; OnSuccessSkill='M-029'; OnSuccessWorkflow='CWF-140'; Purpose='Extrapolate research findings into bounded future scenarios with confidence bands.'; TestFile='tests/skills/phase1c/test_M-028_predictive_extrapolation.md' },
  [pscustomobject]@{ Id='M-029'; Name='Research Limitations Documenter'; LegacyAlias='Audience Analyzer'; File='skills/script_intelligence_army/M-029-audience-analyzer.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Saraswati'; Strategic='Krishna'; Archetype='Saraswati (transparency)'; UpstreamDetail='all M-021 through M-028 artifacts plus methodology and assumptions'; UpstreamIds=@('M-021','M-022','M-023','M-024','M-025','M-026','M-027','M-028'); DownstreamDetail='M-030 Final Research Dossier Seal'; DownstreamIds=@('M-030'); Producer='CWF-140'; Consumers=@('CWF-140'); Family='limitations_packet'; Schema='schemas/packets/limitations_packet.schema.json'; Dossier='dossier.research_vein.research_limitations_documenter'; Namespace='research_limitations_documenter'; PrimaryField='scope_limitations'; OnSuccessSkill='M-030'; OnSuccessWorkflow='CWF-140'; Purpose='Document research limitations and boundary conditions for transparent scripting.'; TestFile='tests/skills/phase1c/test_M-029_research_limitations_documenter.md' },
  [pscustomobject]@{ Id='M-030'; Name='Final Research Dossier Seal'; LegacyAlias='Engagement Predictor'; File='skills/script_intelligence_army/M-030-engagement-predictor.skill.md'; Phase='PHASE_1C_CONDITIONAL_RESEARCH'; Vein='research_vein'; Owner='Brihaspati'; Strategic='Krishna'; Archetype='Brihaspati (final judge)'; UpstreamDetail='M-021 through M-029 outputs'; UpstreamIds=@('M-021','M-022','M-023','M-024','M-025','M-026','M-027','M-028','M-029'); DownstreamDetail='M-105 Script Generation'; DownstreamIds=@('M-105'); Producer='CWF-140'; Consumers=@('WF-200','CWF-210'); Family='phase_1c_completion_packet'; Schema='schemas/packets/phase_1c_completion_packet.schema.json'; Dossier='dossier.research_vein.final_research_dossier_seal'; Namespace='final_research_dossier_seal'; PrimaryField='certification_decision'; OnSuccessSkill='M-105'; OnSuccessWorkflow='WF-200'; Purpose='Finalize and certify conditional research depth before script generation.'; TestFile='tests/skills/phase1c/test_M-030_final_research_dossier_seal.md' }
)

function Build-SkillContent {
  param([pscustomobject]$s)

  $isPhase1c = $s.Phase -eq 'PHASE_1C_CONDITIONAL_RESEARCH'
  $conditionLine = if ($isPhase1c) { '- Runtime Condition: execute only if M-020 research_confidence_score < 0.85' } else { '- Runtime Condition: always execute when upstream artifacts are available' }
  $execCondition = if ($isPhase1c) { 'm020_confidence_score_lt_0_85' } else { 'phase2c_platform_variant_generation' }
  $veinDossier = if ($isPhase1c) { 'dossier.research_vein.' + $s.Namespace } else { 'dossier.script_vein.' + $s.Namespace }
  $testsPrefix = if ($isPhase1c) { 'TEST-PH1C' } else { 'TEST-PH2C' }

  $tests = @(
    "Valid required inputs produce deterministic $($s.Family) output",
    'Missing dossier_id routes to WF-900 with explicit validation details',
    'Missing route_id routes to WF-900 without packet emission',
    'Missing required upstream packet fails closed and escalates to WF-900',
    'Lineage references are preserved for all upstream dependencies',
    "Primary output field $($s.PrimaryField) is present and non-empty",
    'Deterministic logic yields same output structure for identical input state',
    'Schema validation rejects untyped payload prior to dossier mutation',
    "Dossier writes target only $veinDossier",
    'Mutation uses append_to_array and never overwrites prior data',
    'se_packet_index append row includes lineage_reference and instance_id',
    'Replay branch routes to WF-021 for remodify requests',
    'Escalation branch routes to WF-900 for validation or policy failures',
    'Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version',
    'Forbidden mutation attempt is blocked and audited',
    'Downstream routing hints are registry-bound and deterministic',
    'Audit entry includes operation, route_id, source packet, and confidence markers',
    'Acceptance gate fails closed when governance metadata is incomplete'
  )

  $testLines = @()
  for ($i = 0; $i -lt $tests.Count; $i++) {
    $idx = '{0:D3}' -f ($i + 1)
    $testLines += "- $testsPrefix-$($s.Id)-${idx}: $($tests[$i])"
  }

  $best = @(
    '- Keep transforms deterministic and replay-safe.',
    '- Preserve upstream evidence and lineage references.',
    '- Fail closed on missing required inputs.',
    '- Validate schema before dossier writes.',
    '- Keep writes append-only in the declared dossier namespace.',
    '- Route critical errors to WF-900 with typed error payloads.',
    '- Keep WF-021 replay path available for remodify flows.',
    '- Never mutate historical packets or approval decisions.',
    '- Emit only typed packets bound to schema registry entries.',
    '- Keep confidence and scoring logic formula-bound and auditable.',
    '- Record timestamp, writer_id, skill_id, and lineage_reference on every write.',
    '- Keep downstream routing deterministic and registry-driven.'
  )

  $upstreamIds = if ($s.UpstreamIds.Count -gt 0) { [string]::Join(', ', $s.UpstreamIds) } else { 'none' }
  $downstreamIds = if ($s.DownstreamIds.Count -gt 0) { [string]::Join(', ', $s.DownstreamIds) } else { 'none' }
  $consumers = if ($s.Consumers.Count -gt 0) { [string]::Join(', ', $s.Consumers) } else { 'none' }

  $lines = @(
    "# SKL-$($s.Phase)-$($s.Id)-$($s.Namespace.ToUpper())",
    "",
    "## 1. Skill Identity",
    "- Skill ID: $($s.Id)",
    "- Skill Name: $($s.Name)",
    "- Legacy Alias (Filename Compatibility): $($s.LegacyAlias)",
    "- Vein Assignment: $($s.Vein)",
    "- Phase Assignment: $($s.Phase)",
    "- Owner Director: $($s.Owner)",
    "- Strategic Authority Director: $($s.Strategic)",
    "",
    "## 2. Purpose",
    $s.Purpose,
    "",
    "## 3. DNA Injection",
    "- Archetype: $($s.Archetype)",
    "- Behavior Model: deterministic, packet-typed, governance-bound, append-only",
    "- Operating Pattern: ingest -> validate -> transform -> verify -> emit -> append -> route",
    "- Strategic Authority Context: $($s.Strategic) arbitration for policy and replay paths",
    "",
    "## 4. Workflow Injection",
    "- Producer Workflow: $($s.Producer)",
    "- Consumer Workflows: $consumers",
    "- Upstream Dependencies: $($s.UpstreamDetail)",
    "- Upstream Skill IDs: $upstreamIds",
    "- Downstream Consumers: $($s.DownstreamDetail)",
    "- Downstream Skill IDs: $downstreamIds",
    "- Escalation Path: WF-900",
    "- Replay Path: WF-021",
    $conditionLine,
    "",
    "## 5. Inputs",
    "**Required Inputs**",
    "- dossier_id (string): target dossier identity",
    "- route_id (string): active orchestration route",
    "- instance_id (string): runtime execution instance",
    "- workflow_context (object): workflow metadata and lineage envelope",
    "- upstream_packets (array): ordered packet set required by upstream dependencies",
    "- governance_context (object): policy and mutation-law controls",
    "",
    "**Optional Inputs**",
    "- expert_feedback_packet (object): supplementary expert interpretation",
    "- prior_replay_packet (object): replay context from WF-021",
    "- confidence_threshold_override (number): governance-approved threshold override",
    "- execution_hints (object): deterministic operator hints",
    "",
    "## 6. Execution Logic",
    "STEP 1: Validate input envelope and required fields against declared contract.",
    "STEP 2: Resolve upstream packet lineage and dependency closure.",
    "STEP 3: Enforce workflow condition and governance prechecks.",
    "STEP 4: Build deterministic analysis frame for $($s.Name).",
    "  A. Normalize upstream evidence artifacts.",
    "  B. Apply fixed transformation and scoring rules.",
    "  C. Preserve factual claims and dependency references.",
    "STEP 5: Generate primary output payload field $($s.PrimaryField).",
    "STEP 6: Assemble routing metadata and replay context markers.",
    "STEP 7: Run governance and safety checks.",
    "  A. Validate mutation-law compliance.",
    "  B. Validate packet typing and schema binding.",
    "  C. Validate escalation and replay path completeness.",
    "STEP 8: Validate typed packet against $($s.Schema).",
    "STEP 9: Append packet to $veinDossier and append se_packet_index lineage row.",
    "STEP 10: Emit deterministic routing decision to $($s.OnSuccessSkill) or WF-900/WF-021.",
    "",
    "## 7. Outputs",
    "- Output Packet Family: $($s.Family)",
    "- JSON Schema Reference: $($s.Schema)",
    "- Dossier Write Target: $veinDossier",
    "- se_packet_index Registration: required append row with lineage and audit metadata",
    "",
    "~~~json",
    "{",
    "  ""instance_id"": ""$($s.Id)-[timestamp]-[instance]"",",
    "  ""artifact_family"": ""$($s.Family)"",",
    "  ""schema_version"": ""1.0.0"",",
    "  ""producer_workflow"": ""$($s.Producer)"",",
    "  ""dossier_ref"": ""[dossier_id]"",",
    "  ""created_at"": ""[ISO-8601]"",",
    "  ""status"": ""CREATED|PARTIAL|FAILED"",",
    "  ""payload"": {",
    "    ""skill_id"": ""$($s.Id)"",",
    "    ""skill_name"": ""$($s.Name)"",",
    "    ""execution_condition"": ""$execCondition"",",
    "    ""primary_output"": {",
    "      ""$($s.PrimaryField)"": ""[artifact]""",
    "    },",
    "    ""routing"": {",
    "      ""on_success"": ""$($s.OnSuccessSkill)"",",
    "      ""on_error"": ""WF-900"",",
    "      ""on_replay"": ""WF-021""",
    "    }",
    "  }",
    "}",
    "~~~",
    "",
    "## 8. Governance",
    "- Governance Owner: $($s.Owner)",
    "- Strategic Authority: $($s.Strategic)",
    "- Approval Contract: deterministic execution, no untyped packets, append-only mutation law",
    "- Escalation Trigger Classes: validation failure, schema failure, lineage failure, mutation-law violation",
    "- Mandatory Escalation Workflow: WF-900",
    "- Replay or Remodify Workflow: WF-021",
    "",
    "## 9. Tool/Runtime Usage",
    "**Allowed**",
    "- Deterministic text/analysis transforms",
    "- Registered schema validation",
    "- Registry lookups (skill_registry.yaml, workflow_bindings.yaml, schema_registry.yaml, director_binding.yaml)",
    "- Append-only dossier and packet-index writers",
    "",
    "**Forbidden**",
    "- Non-deterministic or random logic paths",
    "- Untyped packet emission",
    "- Unregistered external tool calls",
    "- Direct overwrite, delete, or replace mutation behavior",
    "- Bypassing WF-900 or WF-021 routing obligations",
    "",
    "## 10. Mutation Law",
    "**Allowed Mutations**",
    "- append_to_array",
    "- create_new_packet",
    "- create_new_index_row",
    "- append_audit_entry",
    "",
    "**Required Mutation Metadata**",
    "- timestamp",
    "- writer_id",
    "- skill_id",
    "- instance_id",
    "- schema_version",
    "- lineage_reference",
    "- audit_entry",
    "",
    "**Forbidden Mutations**",
    "- overwrite existing dossier fields",
    "- replace arrays",
    "- delete prior data",
    "- mutate historical packets",
    "- mutate historical approval decisions",
    "- mutate existing se_packet_index rows",
    "",
    "## 11. Best Practices"
  ) + $best + @(
    "",
    "## 12. Validation/Done",
    "**Test Cases**"
  ) + $testLines + @(
    "",
    "**Acceptance Criteria**",
    "- All 12 required sections are present in exact order.",
    "- Execution logic has at least 10 deterministic steps.",
    "- Output packet family is typed and schema-bound.",
    "- Dossier mutation is append-only and restricted to declared dossier namespace.",
    "- se_packet_index append row includes full lineage metadata.",
    "- Escalation path WF-900 and replay path WF-021 are explicitly wired.",
    "- Minimum 18 tests are defined and traceable to requirements.",
    "- Upstream and downstream contract references are complete and non-ambiguous."
  )

  return ($lines -join "`r`n")
}

function Build-TestDoc {
  param([pscustomobject]$s)
  $prefix = if ($s.Phase -eq 'PHASE_1C_CONDITIONAL_RESEARCH') { 'TEST-PH1C' } else { 'TEST-PH2C' }
  $rows = @()
  for ($i = 1; $i -le 18; $i++) {
    $idx = '{0:D3}' -f $i
    $rows += "- $prefix-$($s.Id)-${idx}: deterministic validation case $idx"
  }
  $lines = @(
    "# Test Definition: $($s.Id) $($s.Name)",
    "",
    "## Scope",
    "- Skill file: $($s.File)",
    "- Packet family: $($s.Family)",
    "- Schema: $($s.Schema)",
    "- Dossier target: $($s.Dossier)",
    "",
    "## Deterministic Test Matrix (18 Cases)"
  ) + $rows + @(
    "",
    "## Pass Condition",
    "- All 18 tests pass with deterministic outputs.",
    "- Any contract violation routes to WF-900.",
    "- Replay requests route to WF-021."
  )
  return ($lines -join "`r`n")
}

function Build-SchemaObject {
  param([pscustomobject]$s)
  return [ordered]@{
    '$schema'='https://json-schema.org/draft/2020-12/schema'
    title=$s.Family
    type='object'
    additionalProperties=$false
    required=@('instance_id','artifact_family','schema_version','producer_workflow','dossier_ref','created_at','status','payload')
    properties=[ordered]@{
      instance_id=@{ type='string' }
      artifact_family=@{ type='string'; const=$s.Family }
      schema_version=@{ type='string' }
      producer_workflow=@{ type='string' }
      dossier_ref=@{ type='string' }
      created_at=@{ type='string' }
      status=@{ type='string'; enum=@('CREATED','PARTIAL','FAILED','EMPTY') }
      payload=[ordered]@{
        type='object'
        additionalProperties=$true
        required=@('skill_id','skill_name','execution_condition','primary_output','routing')
        properties=[ordered]@{
          skill_id=@{ type='string'; const=$s.Id }
          skill_name=@{ type='string' }
          execution_condition=@{ type='string' }
          primary_output=@{ type='object' }
          routing=@{ type='object' }
        }
      }
    }
  }
}

foreach ($s in $phase1c) {
  $skillPath = Join-Path $root $s.File
  Set-Content -LiteralPath $skillPath -Value (Build-SkillContent -s $s) -Encoding UTF8

  $testPath = Join-Path $root $s.TestFile
  $testDir = Split-Path -Parent $testPath
  if (-not (Test-Path $testDir)) { New-Item -ItemType Directory -Path $testDir -Force | Out-Null }
  Set-Content -LiteralPath $testPath -Value (Build-TestDoc -s $s) -Encoding UTF8

  $schemaPath = Join-Path $root $s.Schema
  $schemaDir = Split-Path -Parent $schemaPath
  if (-not (Test-Path $schemaDir)) { New-Item -ItemType Directory -Path $schemaDir -Force | Out-Null }
  Set-Content -LiteralPath $schemaPath -Value ((Build-SchemaObject -s $s) | ConvertTo-Json -Depth 20) -Encoding UTF8
}

$all = @($wave1 + $phase1c)

$authList = ($all.Id | ForEach-Object { "    - $_" }) -join "`r`n"
$skillEntries = @()
foreach ($s in $all) {
  $up = ($s.UpstreamIds | ForEach-Object { "      - $_" }) -join "`r`n"
  $down = ($s.DownstreamIds | ForEach-Object { "      - $_" }) -join "`r`n"
  $cons = ($s.Consumers | ForEach-Object { "      - $_" }) -join "`r`n"
  $status = if ($s.Phase -eq 'PHASE_1C_CONDITIONAL_RESEARCH') { 'ACTIVE_WAVE_2' } else { 'ACTIVE_WAVE_1' }
  $skillEntries += @"
  - skill_id: $($s.Id)
    skill_name: $($s.Name)
    legacy_skill_name: $($s.LegacyAlias)
    file_path: $($s.File)
    phase_assignment: $($s.Phase)
    vein_assignment: $($s.Vein)
    owner_director: $($s.Owner)
    strategic_authority_director: $($s.Strategic)
    upstream_skill_dependencies:
$up
    downstream_skill_consumers:
$down
    producer_workflow: $($s.Producer)
    consumer_workflows:
$cons
    output_packet_family: $($s.Family)
    schema_ref: $($s.Schema)
    dossier_write_target: $($s.Dossier)
    escalation_workflow: WF-900
    replay_workflow: WF-021
    status: $status
"@
}
$skillRegistry = @"
version: 1
registry_id: skill_registry
generated_at: "$generatedAt"
status: PARTIAL_WAVE_2_PHASE1C_AND_PHASE2C
registry_scope:
  authoritative_for:
$authList
  note: canonical registry contains Wave 1 and Wave 2 scopes; additional skills appended in later waves
skills:
$($skillEntries -join "`r`n")
"@
Set-Content -LiteralPath "$root\registries\skill_registry.yaml" -Value $skillRegistry -Encoding UTF8

$bindingEntries = @()
foreach ($s in $all) {
  $cons = ($s.Consumers | ForEach-Object { "      - $_" }) -join "`r`n"
  $bindingEntries += @"
  - skill_id: $($s.Id)
    producer_workflow: $($s.Producer)
    consumer_workflows:
$cons
    emitted_packet_family: $($s.Family)
    routing:
      on_success:
        next_skill: $($s.OnSuccessSkill)
        next_workflow: $($s.OnSuccessWorkflow)
      on_error: WF-900
      on_replay: WF-021
    deterministic_contract: true
"@
}
$workflowBindings = @"
version: 1
registry_id: workflow_bindings
generated_at: "$generatedAt"
status: PARTIAL_WAVE_2_PHASE1C_AND_PHASE2C
bindings:
$($bindingEntries -join "`r`n")
"@
Set-Content -LiteralPath "$root\registries\workflow_bindings.yaml" -Value $workflowBindings -Encoding UTF8

$schemaEntries = @()
foreach ($s in $all) {
  $schemaEntries += @"
  - artifact_family: $($s.Family)
    schema_version: "1.0.0"
    schema_path: $($s.Schema)
    producer_skills:
      - $($s.Id)
    producer_workflows:
      - $($s.Producer)
    envelope_contract:
      required_fields:
        - instance_id
        - artifact_family
        - schema_version
        - producer_workflow
        - dossier_ref
        - created_at
        - status
        - payload
"@
}
$schemaRegistry = @"
version: 1
registry_id: schema_registry
generated_at: "$generatedAt"
status: PARTIAL_WAVE_2_PHASE1C_AND_PHASE2C
schemas:
$($schemaEntries -join "`r`n")
"@
Set-Content -LiteralPath "$root\registries\schema_registry.yaml" -Value $schemaRegistry -Encoding UTF8

$directorBinding = @"
version: 1
registry_id: director_binding
generated_at: "$generatedAt"
status: PARTIAL_WAVE_2_PHASE1C_AND_PHASE2C
directors:
  - canonical_name: Narada
    director_id: DIR-STRTv1-002
    archetype: strategic information gatherer and platform strategist
    authority_level: OPERATIONS_CONTROL
    governance_role: routing and platform adaptation owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic execution with registry-bound routing
    routing_responsibility: phase1c nuance capture and phase2c adaptation routes
    failure_handling_responsibility: escalate validation failures to WF-900
    mapped_skills:
      - M-027
      - M-121
      - M-124
      - M-128
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
  - canonical_name: Vyasa
    director_id: DIR-RSRCHv1-002
    archetype: organizer and synthesis authority
    authority_level: NARRATIVE_CONTROL
    governance_role: synthesis and structure integrity owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic structure-first transformation
    routing_responsibility: research and script structure synthesis
    failure_handling_responsibility: escalate integrity conflicts to WF-900
    mapped_skills:
      - M-024
      - M-122
      - M-126
      - M-129
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
  - canonical_name: Saraswati
    director_id: DIR-DISTv1-002
    archetype: knowledge keeper and transparency advocate
    authority_level: CONTENT_CONTROL
    governance_role: evidence clarity and assumption transparency owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic evidence-grounded conversion
    routing_responsibility: source interrogation and limitations transparency
    failure_handling_responsibility: escalate evidence inconsistencies to WF-900
    mapped_skills:
      - M-021
      - M-025
      - M-026
      - M-029
      - M-123
    mapped_workflows:
      - CWF-140
      - CWF-230
  - canonical_name: Krishna
    director_id: DIR-ORCHv1-001
    archetype: strategic authority and orchestrator
    authority_level: STRATEGIC_CONTROL
    governance_role: arbitration, policy authority, and routing governance
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic orchestration and governance arbitration
    routing_responsibility: threshold-gated routing and cross-phase handoff control
    failure_handling_responsibility: authorize replay and escalation decisions
    mapped_skills:
      - M-028
      - M-125
      - M-127
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
      - WF-021
      - WF-900
  - canonical_name: Shiva
    director_id: DIR-ORCHv1-003
    archetype: transformer and harmonizer
    authority_level: COORDINATION_CONTROL
    governance_role: temporal analysis and cross-format coordination owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic harmonization and change analysis
    routing_responsibility: longitudinal transitions and coordination routing
    failure_handling_responsibility: escalate temporal integrity violations
    mapped_skills:
      - M-022
      - M-130
    mapped_workflows:
      - CWF-140
      - CWF-240
      - CWF-310
      - WF-900
  - canonical_name: Brihaspati
    director_id: DIR-RSRCHv1-003
    archetype: logical analyzer and final judge
    authority_level: RESEARCH_ADJUDICATION
    governance_role: causal adjudication and final research certification
    allowed_skill_families:
      - phase1c_conditional_research
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic adjudication and confidence certification
    routing_responsibility: causal inference and final phase1c seal routing
    failure_handling_responsibility: escalate unresolved logical conflicts to WF-900
    mapped_skills:
      - M-023
      - M-030
    mapped_workflows:
      - CWF-140
      - WF-200
      - WF-900
"@
Set-Content -LiteralPath "$root\registries\director_binding.yaml" -Value $directorBinding -Encoding UTF8

$workflowPath = "$root\n8n\workflows\topic\CWF-140-research-synthesis.json"
$workflowObject = [ordered]@{
  name = 'CWF-140 Research Synthesis'
  description = 'Research synthesis with conditional Phase 1C routing based on M-020 research_confidence_score threshold 0.85.'
  nodes = @(
    [ordered]@{ parameters=@{}; id='cwf140_trigger'; name='Workflow Input'; type='n8n-nodes-base.manualTrigger'; typeVersion=1; position=@(260,340) },
    [ordered]@{
      parameters=@{
        jsCode = "const incoming = $json || {}; const m020 = incoming.m020_confidence_packet || {}; const confidence = Number(m020.research_confidence_score ?? incoming.research_confidence_score ?? 0.85); return [{ json: { workflow_id: 'CWF-140', dossier_id: incoming.dossier_id || 'DOSSIER-UNSET', route_id: incoming.route_id || 'ROUTE_PHASE1_STANDARD', selected_topic: incoming.selected_topic || {}, research_confidence_score: confidence, execution_timestamp: incoming.execution_timestamp || new Date().toISOString() } }];"
      }
      id='normalize_input'; name='Normalize Research Input'; type='n8n-nodes-base.code'; typeVersion=2; position=@(500,340)
    },
    [ordered]@{
      parameters=@{
        jsCode = "const synthesis = { main_claim: $json.selected_topic.topic_statement || 'Research topic', supporting_claims: [{ claim: 'Support point 1', confidence: 0.86 }, { claim: 'Support point 2', confidence: 0.81 }], contradictions: [], evidence_gaps: ['Optional deep dive if confidence below threshold'] }; return [{ json: { ...$json, synthesis } }];"
      }
      id='synthesize_research'; name='Execute Research Synthesis'; type='n8n-nodes-base.code'; typeVersion=2; position=@(740,340)
    },
    [ordered]@{
      parameters=@{
        jsCode = "const routeKey = `${$json.dossier_id}-${$json.route_id}`; return [{ json: { instance_id: `RSP-${routeKey}`, artifact_family: 'research_synthesis_packet', schema_version: '1.0.0', producer_workflow: 'CWF-140', dossier_ref: $json.dossier_id, created_at: $json.execution_timestamp, status: 'CREATED', payload: { topic_statement: $json.selected_topic.topic_statement || null, research_confidence_score: Number($json.research_confidence_score), synthesis: $json.synthesis, route_id: $json.route_id } } }];"
      }
      id='build_packet'; name='Build Research Packet'; type='n8n-nodes-base.code'; typeVersion=2; position=@(980,340)
    },
    [ordered]@{
      parameters=@{
        conditions=[ordered]@{
          options=[ordered]@{ caseSensitive=$true; leftValue=''; typeValidation='strict'; version=2 }
          conditions=@(
            [ordered]@{
              id='m020_conf_threshold'
              leftValue='={{ Number($json.payload.research_confidence_score) }}'
              rightValue=0.85
              operator=[ordered]@{ type='number'; operation='smaller' }
            }
          )
          combinator='and'
        }
        options=[ordered]@{}
      }
      id='threshold_gate'; name='Phase 1C Threshold Gate'; type='n8n-nodes-base.if'; typeVersion=2.2; position=@(1220,340)
    },
    [ordered]@{
      parameters=@{
        jsCode = "return [{ json: { workflow_id: 'CWF-140', decision: 'EXECUTE_PHASE_1C', threshold: '<0.85', execute_phase_1c: true, phase_1c_skill_chain: ['M-021','M-022','M-023','M-024','M-025','M-026','M-027','M-028','M-029','M-030'], next_skill: 'M-021', next_workflow: 'CWF-140', on_error: 'WF-900', on_replay: 'WF-021', research_packet: $json } }];"
      }
      id='route_phase1c'; name='Route To Phase 1C'; type='n8n-nodes-base.code'; typeVersion=2; position=@(1460,220)
    },
    [ordered]@{
      parameters=@{
        jsCode = "return [{ json: { workflow_id: 'CWF-140', decision: 'SKIP_PHASE_1C', threshold: '>=0.85', execute_phase_1c: false, phase_1c_skill_chain: [], next_skill: 'M-105', next_workflow: 'WF-200', on_error: 'WF-900', on_replay: 'WF-021', research_packet: $json } }];"
      }
      id='route_direct'; name='Route Direct To Script'; type='n8n-nodes-base.code'; typeVersion=2; position=@(1460,460)
    },
    [ordered]@{
      parameters=@{
        jsCode = "const d = $json.decision || 'UNSET'; return [{ json: { workflow_id: 'CWF-140', execution_status: 'SUCCESS', completion_packet: { instance_id: `CWF140-DECISION-${d}`, artifact_family: 'research_route_decision_packet', schema_version: '1.0.0', producer_workflow: 'CWF-140', created_at: $json.research_packet?.created_at || new Date().toISOString(), status: 'CREATED', payload: { decision: d, execute_phase_1c: $json.execute_phase_1c, next_workflow: $json.next_workflow, next_skill: $json.next_skill, threshold_rule: 'M-020 research_confidence_score < 0.85 => execute Phase 1C' } }, routing: { on_error: 'WF-900', on_replay: 'WF-021' } } }];"
      }
      id='emit_result'; name='Emit Research Result'; type='n8n-nodes-base.code'; typeVersion=2; position=@(1700,340)
    }
  )
  connections = [ordered]@{
    'Workflow Input' = [ordered]@{ main=@(@([ordered]@{ node='Normalize Research Input'; type='main'; index=0 })) }
    'Normalize Research Input' = [ordered]@{ main=@(@([ordered]@{ node='Execute Research Synthesis'; type='main'; index=0 })) }
    'Execute Research Synthesis' = [ordered]@{ main=@(@([ordered]@{ node='Build Research Packet'; type='main'; index=0 })) }
    'Build Research Packet' = [ordered]@{ main=@(@([ordered]@{ node='Phase 1C Threshold Gate'; type='main'; index=0 })) }
    'Phase 1C Threshold Gate' = [ordered]@{
      main=@(
        @([ordered]@{ node='Route To Phase 1C'; type='main'; index=0 }),
        @([ordered]@{ node='Route Direct To Script'; type='main'; index=0 })
      )
    }
    'Route To Phase 1C' = [ordered]@{ main=@(@([ordered]@{ node='Emit Research Result'; type='main'; index=0 })) }
    'Route Direct To Script' = [ordered]@{ main=@(@([ordered]@{ node='Emit Research Result'; type='main'; index=0 })) }
  }
  meta = [ordered]@{
    workflow_id='CWF-140'
    phase='phase1'
    vein='research_vein'
    owner_director='Vyasa'
    threshold_rule='IF M-020 research_confidence_score < 0.85 execute M-021..M-030; ELSE route to WF-200'
    escalation='WF-900'
    replay='WF-021'
  }
  active = $true
  settings = [ordered]@{}
}
Set-Content -LiteralPath $workflowPath -Value ($workflowObject | ConvertTo-Json -Depth 30) -Encoding UTF8

Write-Output 'Wave 2 generation complete.'
