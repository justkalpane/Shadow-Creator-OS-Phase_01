const fs = require('fs');
const path = require('path');

const root = 'C:/ShadowEmpire-Git';
const generatedAt = new Date().toISOString();

const phase3b = [
  {
    id: 'M-216',
    name: 'Shot List Generator',
    aliases: [],
    legacyAlias: 'Shot List Generator',
    filePath: 'skills/media_video/M-216-shot-list-generator.skill.md',
    testPath: 'tests/skills/phase3b/test_M-216.md',
    schemaPath: 'schemas/packets/shot_list_packet.schema.json',
    namespace: 'shot_list_generator',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (strategic storyteller)',
    upstreamDetail: 'script_variants (from M-130), emotional_arc (from M-106), visual_specifications',
    upstreamIds: ['M-130', 'M-106'],
    downstreamDetail: 'M-217 B-Roll Sourcing Strategy',
    downstreamIds: ['M-217'],
    purpose: 'Generate detailed shot list for deterministic video production sequencing.',
    family: 'shot_list_packet',
    primaryField: 'shot_descriptions',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-217',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-217',
    name: 'B-Roll Sourcing Strategy',
    aliases: ['B-Roll Requirements Mapper'],
    legacyAlias: 'B-Roll Requirements Mapper',
    filePath: 'skills/media_video/M-217-b-roll-sourcing-strategy.skill.md',
    testPath: 'tests/skills/phase3b/test_M-217.md',
    schemaPath: 'schemas/packets/broll_packet.schema.json',
    namespace: 'b_roll_sourcing_strategy',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (organizer and mapper)',
    upstreamDetail: 'shot_list (from M-216), script_beat_breakdown',
    upstreamIds: ['M-216'],
    downstreamDetail: 'M-218 Video Editing Script',
    downstreamIds: ['M-218'],
    purpose: 'Specify B-roll and supplementary footage requirements with deterministic coverage mapping.',
    family: 'broll_packet',
    primaryField: 'footage_requirements',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-218',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-218',
    name: 'Video Editing Script',
    aliases: ['Editing Sequence Designer'],
    legacyAlias: 'Editing Sequence Designer',
    filePath: 'skills/media_video/M-218-video-editing-script.skill.md',
    testPath: 'tests/skills/phase3b/test_M-218.md',
    schemaPath: 'schemas/packets/editing_sequence_packet.schema.json',
    namespace: 'video_editing_script',
    owner: 'Shiva',
    strategic: 'Krishna',
    archetype: 'Shiva (transformer and editor)',
    upstreamDetail: 'shot_list (from M-216), pacing_engine_output (from M-114), emotional_arc (from M-106)',
    upstreamIds: ['M-216', 'M-114', 'M-106'],
    downstreamDetail: 'M-219 Color Grading Brief',
    downstreamIds: ['M-219'],
    purpose: 'Design editing sequence and cut strategy with deterministic transition logic.',
    family: 'editing_sequence_packet',
    primaryField: 'cut_specifications',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-219',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-219',
    name: 'Color Grading Brief',
    aliases: ['Color Grading Specification'],
    legacyAlias: 'Color Grading Specification',
    filePath: 'skills/media_video/M-219-color-grading-brief.skill.md',
    testPath: 'tests/skills/phase3b/test_M-219.md',
    schemaPath: 'schemas/packets/color_grading_packet.schema.json',
    namespace: 'color_grading_brief',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (visual mood strategist)',
    upstreamDetail: 'color_palette (from M-202), emotional_arc (from M-106)',
    upstreamIds: ['M-202', 'M-106'],
    downstreamDetail: 'M-220 Sound Design Specifications',
    downstreamIds: ['M-220'],
    purpose: 'Specify color grading and mood continuity across video segments.',
    family: 'color_grading_packet',
    primaryField: 'color_grade_specifications',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-220',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-220',
    name: 'Sound Design Specifications',
    aliases: ['Sound Design Brief'],
    legacyAlias: 'Sound Design Brief',
    filePath: 'skills/media_video/M-220-sound-design-specifications.skill.md',
    testPath: 'tests/skills/phase3b/test_M-220.md',
    schemaPath: 'schemas/packets/sound_design_packet.schema.json',
    namespace: 'sound_design_specifications',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (audio mood strategist)',
    upstreamDetail: 'pacing_engine_output (from M-114), emotional_arc (from M-106)',
    upstreamIds: ['M-114', 'M-106'],
    downstreamDetail: 'M-221 Motion Graphics Storyboard',
    downstreamIds: ['M-221'],
    purpose: 'Specify sound design palette and cue timing for cinematic coherence.',
    family: 'sound_design_packet',
    primaryField: 'sound_palette',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-221',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-221',
    name: 'Motion Graphics Storyboard',
    aliases: ['Motion Graphics Designer'],
    legacyAlias: 'Motion Graphics Designer',
    filePath: 'skills/media_video/M-221-motion-graphics-storyboard.skill.md',
    testPath: 'tests/skills/phase3b/test_M-221.md',
    schemaPath: 'schemas/packets/motion_graphics_packet.schema.json',
    namespace: 'motion_graphics_storyboard',
    owner: 'Shiva',
    strategic: 'Krishna',
    archetype: 'Shiva (motion transformer)',
    upstreamDetail: 'animation_specs (from M-210), design_brief (from M-201)',
    upstreamIds: ['M-210', 'M-201'],
    downstreamDetail: 'M-222 Video Transitions Optimizer',
    downstreamIds: ['M-222'],
    purpose: 'Design motion graphics and animated overlays with deterministic timing specs.',
    family: 'motion_graphics_packet',
    primaryField: 'animation_designs',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-222',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-222',
    name: 'Video Transitions Optimizer',
    aliases: ['Transition Sequence Builder'],
    legacyAlias: 'Transition Sequence Builder',
    filePath: 'skills/media_video/M-222-video-transitions-optimizer.skill.md',
    testPath: 'tests/skills/phase3b/test_M-222.md',
    schemaPath: 'schemas/packets/transition_packet.schema.json',
    namespace: 'video_transitions_optimizer',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (sequence strategist)',
    upstreamDetail: 'editing_sequence (from M-218), motion_graphics (from M-221)',
    upstreamIds: ['M-218', 'M-221'],
    downstreamDetail: 'M-223 Pacing and Rhythm Editor',
    downstreamIds: ['M-223'],
    purpose: 'Design transition effects and transition timing for flow consistency.',
    family: 'transition_packet',
    primaryField: 'transition_types',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-223',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-223',
    name: 'Pacing and Rhythm Editor',
    aliases: ['Pacing & Rhythm Optimizer'],
    legacyAlias: 'Pacing & Rhythm Optimizer',
    filePath: 'skills/media_video/M-223-pacing-rhythm-editor.skill.md',
    testPath: 'tests/skills/phase3b/test_M-223.md',
    schemaPath: 'schemas/packets/pacing_optimization_packet.schema.json',
    namespace: 'pacing_rhythm_editor',
    owner: 'Shiva',
    strategic: 'Krishna',
    archetype: 'Shiva (rhythm optimizer)',
    upstreamDetail: 'pacing_engine_output (from M-114), editing_sequence (from M-218), audio_specs (from M-220)',
    upstreamIds: ['M-114', 'M-218', 'M-220'],
    downstreamDetail: 'M-224 Title Card Generator',
    downstreamIds: ['M-224'],
    purpose: 'Optimize video pacing and rhythm with deterministic cut-timing refinements.',
    family: 'pacing_optimization_packet',
    primaryField: 'rhythm_curve',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-224',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-224',
    name: 'Title Card Generator',
    aliases: ['Title & Text Overlay Designer'],
    legacyAlias: 'Title & Text Overlay Designer',
    filePath: 'skills/media_video/M-224-title-card-generator.skill.md',
    testPath: 'tests/skills/phase3b/test_M-224.md',
    schemaPath: 'schemas/packets/title_text_packet.schema.json',
    namespace: 'title_card_generator',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (text composition organizer)',
    upstreamDetail: 'script (from M-110/M-120), typography (from M-203), design_brief (from M-201)',
    upstreamIds: ['M-110', 'M-120', 'M-203', 'M-201'],
    downstreamDetail: 'M-225 Thumbnail Designer',
    downstreamIds: ['M-225'],
    purpose: 'Design title cards, text overlays, and caption timing specifications.',
    family: 'title_text_packet',
    primaryField: 'title_designs',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-225',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-225',
    name: 'Thumbnail Designer',
    aliases: ['Thumbnail Optimizer'],
    legacyAlias: 'Thumbnail Optimizer',
    filePath: 'skills/media_video/M-225-thumbnail-designer.skill.md',
    testPath: 'tests/skills/phase3b/test_M-225.md',
    schemaPath: 'schemas/packets/thumbnail_packet.schema.json',
    namespace: 'thumbnail_designer',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (engagement strategist)',
    upstreamDetail: 'design_brief (from M-201), key_visuals',
    upstreamIds: ['M-201'],
    downstreamDetail: 'M-226 Video SEO Optimizer',
    downstreamIds: ['M-226'],
    purpose: 'Design video thumbnails optimized for engagement with deterministic variant criteria.',
    family: 'thumbnail_packet',
    primaryField: 'thumbnail_designs',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-226',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-226',
    name: 'Video SEO Optimizer',
    aliases: ['Video SEO Specification'],
    legacyAlias: 'Video SEO Specification',
    filePath: 'skills/media_video/M-226-video-seo-optimizer.skill.md',
    testPath: 'tests/skills/phase3b/test_M-226.md',
    schemaPath: 'schemas/packets/video_seo_packet.schema.json',
    namespace: 'video_seo_optimizer',
    owner: 'Saraswati',
    strategic: 'Krishna',
    archetype: 'Saraswati (language and metadata steward)',
    upstreamDetail: 'script (from M-110/M-120), youtube_script (from M-122), topic (from M-001)',
    upstreamIds: ['M-110', 'M-120', 'M-122', 'M-001'],
    downstreamDetail: 'M-227 Captions and Subtitle Generator',
    downstreamIds: ['M-227'],
    purpose: 'Specify video SEO metadata, keyword placement, and discoverability optimization.',
    family: 'video_seo_packet',
    primaryField: 'metadata_specifications',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-227',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-227',
    name: 'Captions and Subtitle Generator',
    aliases: ['Caption & Subtitle Generator', 'Captions & Subtitle Generator'],
    legacyAlias: 'Caption & Subtitle Generator',
    filePath: 'skills/media_video/M-227-captions-subtitle-generator.skill.md',
    testPath: 'tests/skills/phase3b/test_M-227.md',
    schemaPath: 'schemas/packets/caption_packet.schema.json',
    namespace: 'captions_subtitle_generator',
    owner: 'Saraswati',
    strategic: 'Krishna',
    archetype: 'Saraswati (clarity and accessibility steward)',
    upstreamDetail: 'script (from M-110/M-120), voiceover_transcript',
    upstreamIds: ['M-110', 'M-120'],
    downstreamDetail: 'M-228 Multi-Angle Cut Strategy',
    downstreamIds: ['M-228'],
    purpose: 'Generate caption and subtitle artifacts with deterministic timing and speaker mapping.',
    family: 'caption_packet',
    primaryField: 'subtitle_files',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-228',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-228',
    name: 'Multi-Angle Cut Strategy',
    aliases: ['Multi-Angle Coordination Engine'],
    legacyAlias: 'Multi-Angle Coordination Engine',
    filePath: 'skills/media_video/M-228-multi-angle-cut-strategy.skill.md',
    testPath: 'tests/skills/phase3b/test_M-228.md',
    schemaPath: 'schemas/packets/multiangle_packet.schema.json',
    namespace: 'multi_angle_cut_strategy',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (multi-stream organizer)',
    upstreamDetail: 'shot_list (from M-216), editing_sequence (from M-218)',
    upstreamIds: ['M-216', 'M-218'],
    downstreamDetail: 'M-229 Video Performance Predictor',
    downstreamIds: ['M-229'],
    purpose: 'Coordinate multi-camera and multi-angle cuts with deterministic synchronization rules.',
    family: 'multiangle_packet',
    primaryField: 'camera_assignments',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-229',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-229',
    name: 'Video Performance Predictor',
    aliases: [],
    legacyAlias: 'Video Performance Predictor',
    filePath: 'skills/media_video/M-229-video-performance-predictor.skill.md',
    testPath: 'tests/skills/phase3b/test_M-229.md',
    schemaPath: 'schemas/packets/performance_prediction_packet.schema.json',
    namespace: 'video_performance_predictor',
    owner: 'Krishna',
    strategic: 'Krishna',
    archetype: 'Krishna (strategist and forecaster)',
    upstreamDetail: 'all video specifications (M-216-M-228), historical_performance_data',
    upstreamIds: ['M-216', 'M-217', 'M-218', 'M-219', 'M-220', 'M-221', 'M-222', 'M-223', 'M-224', 'M-225', 'M-226', 'M-227', 'M-228'],
    downstreamDetail: 'M-230 Platform-Specific Video Adapter',
    downstreamIds: ['M-230'],
    purpose: 'Predict video performance metrics and risk flags using deterministic scoring frameworks.',
    family: 'performance_prediction_packet',
    primaryField: 'predicted_engagement_score',
    producer: 'CWF-410',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-230',
    onSuccessWorkflow: 'CWF-410'
  },
  {
    id: 'M-230',
    name: 'Platform-Specific Video Adapter',
    aliases: ['Platform Video Adapter'],
    legacyAlias: 'Platform Video Adapter',
    filePath: 'skills/media_video/M-230-platform-specific-video-adapter.skill.md',
    testPath: 'tests/skills/phase3b/test_M-230.md',
    schemaPath: 'schemas/packets/platform_video_packet.schema.json',
    namespace: 'platform_specific_video_adapter',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (platform adaptation strategist)',
    upstreamDetail: 'all video specifications (M-216-M-229)',
    upstreamIds: ['M-216', 'M-217', 'M-218', 'M-219', 'M-220', 'M-221', 'M-222', 'M-223', 'M-224', 'M-225', 'M-226', 'M-227', 'M-228', 'M-229'],
    downstreamDetail: 'Phase 3C audio production entry',
    downstreamIds: ['M-231'],
    purpose: 'Adapt video specifications for platform-specific technical and presentation requirements.',
    family: 'platform_video_packet',
    primaryField: 'platform_variant_specifications',
    producer: 'CWF-410',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-231',
    onSuccessWorkflow: 'CWF-430'
  }
];

const newIds = phase3b.map((s) => s.id);

function writeFile(relPath, content) {
  const abs = path.join(root, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
}

function buildSkillContent(s) {
  const descriptions = [
    (x) => `Valid required inputs produce deterministic ${x.family} output`,
    () => 'Missing dossier_id routes to WF-900 with explicit validation details',
    () => 'Missing route_id routes to WF-900 without packet emission',
    () => 'Missing required upstream packet fails closed and escalates to WF-900',
    () => 'Lineage references are preserved for all upstream dependencies',
    (x) => `Primary output field ${x.primaryField} is present and non-empty`,
    () => 'Deterministic logic yields same output structure for identical input state',
    () => 'Schema validation rejects untyped payload prior to dossier mutation',
    (x) => `Dossier writes target only dossier.media_vein.${x.namespace}`,
    () => 'Mutation uses append_to_array and never overwrites prior data',
    () => 'se_packet_index append row includes lineage_reference and instance_id',
    () => 'Replay branch routes to WF-021 for remodify requests',
    () => 'Escalation branch routes to WF-900 for validation or policy failures',
    () => 'Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version',
    () => 'Forbidden mutation attempt is blocked and audited',
    () => 'Downstream routing hints are registry-bound and deterministic',
    () => 'Audit entry includes operation, route_id, source packet, and confidence markers',
    () => 'Acceptance gate fails closed when governance metadata is incomplete'
  ];

  const tests = Array.from({ length: 18 }, (_, i) => {
    const idx = String(i + 1).padStart(3, '0');
    return `- TEST-PH3B-${s.id}-${idx}: ${descriptions[i](s)}`;
  });

  const bestPractices = [
    '- Keep all video decisions deterministic and rule-based.',
    '- Preserve lineage from script and graphics packets into video outputs.',
    '- Enforce platform and technical constraints before optimization.',
    '- Validate accessibility and metadata contracts where applicable.',
    '- Keep packet payloads schema-bound and typed.',
    '- Route policy or validation failures to WF-900 immediately.',
    '- Route replay and remodify requests to WF-021 with stable metadata.',
    '- Keep dossier writes append-only under owned media namespace.',
    '- Never overwrite historical packets or index rows.',
    '- Keep downstream routing deterministic and registry-aligned.',
    '- Record complete mutation metadata for every write.',
    '- Keep alias naming in metadata for cross-section compatibility.'
  ];

  return `# SKL-PH3B-${s.id}-${s.namespace.toUpperCase()}

## 1. Skill Identity
- Skill ID: ${s.id}
- Skill Name: ${s.name}
- Legacy Alias (Compatibility): ${s.legacyAlias}
- Alias Names: ${s.aliases.length ? s.aliases.join(', ') : 'none'}
- Vein Assignment: media_vein
- Phase Assignment: PHASE_3B_VIDEO
- Owner Director: ${s.owner}
- Strategic Authority Director: ${s.strategic}

## 2. Purpose
${s.purpose}

## 3. DNA Injection
- Archetype: ${s.archetype}
- Behavior Model: deterministic, packet-typed, governance-bound, append-only
- Operating Pattern: ingest -> validate -> transform -> verify -> emit -> append -> route
- Operating Constraint: no randomization, no untyped packet emission, no destructive mutations

## 4. Workflow Injection
- Producer Workflow: ${s.producer}
- Consumer Workflows: ${s.consumers.join(', ')}
- Upstream Dependencies: ${s.upstreamDetail}
- Upstream Skill IDs: ${s.upstreamIds.join(', ')}
- Downstream Consumers: ${s.downstreamDetail}
- Downstream Skill IDs: ${s.downstreamIds.join(', ')}
- Escalation Path: WF-900
- Replay Path: WF-021
- Fallback Mode: emit status PARTIAL only when optional inputs are missing and schema integrity is preserved

## 5. Inputs
**Required Inputs**
- dossier_id (string): target dossier identity
- route_id (string): active orchestration route
- instance_id (string): runtime execution instance
- workflow_context (object): workflow metadata and lineage envelope
- upstream_packets (array): packet set required by upstream dependencies
- governance_context (object): policy and mutation-law controls

**Optional Inputs**
- platform_constraints (object): platform-specific technical constraints
- creator_brand_guidelines (object): brand and identity constraints
- prior_replay_packet (object): replay context from WF-021
- execution_hints (object): deterministic operator hints

## 6. Execution Logic
STEP 1: Validate input envelope and required fields against declared contract.
STEP 2: Resolve upstream packet lineage and dependency closure.
STEP 3: Load deterministic video policy profile for ${s.name}.
STEP 4: Build transformation frame.
  A. Normalize upstream specs and constraints.
  B. Apply deterministic sequencing and scoring rules.
  C. Preserve narrative and brand integrity boundaries.
STEP 5: Generate primary output payload field ${s.primaryField}.
STEP 6: Generate bounded variants and ranking keys where applicable.
STEP 7: Run governance and safety checks.
  A. Validate schema and packet typing readiness.
  B. Validate append-only mutation compliance.
  C. Validate WF-900 and WF-021 routing completeness.
STEP 8: Assemble typed output packet ${s.family}.
STEP 9: Append packet to dossier.media_vein.${s.namespace} and append se_packet_index row.
STEP 10: Emit deterministic routing decision to ${s.onSuccessSkill} or WF-900/WF-021.

## 7. Outputs
- Output Packet Family: ${s.family}
- JSON Schema Reference: ${s.schemaPath}
- Dossier Write Target: dossier.media_vein.${s.namespace}
- se_packet_index Registration: required append row with lineage and audit metadata

~~~json
{
  "instance_id": "${s.id}-[timestamp]-[instance]",
  "artifact_family": "${s.family}",
  "schema_version": "1.0.0",
  "producer_workflow": "${s.producer}",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO-8601]",
  "status": "CREATED|PARTIAL|FAILED",
  "payload": {
    "skill_id": "${s.id}",
    "skill_name": "${s.name}",
    "primary_output": {
      "${s.primaryField}": "[artifact]"
    },
    "routing": {
      "on_success": "${s.onSuccessSkill}",
      "on_error": "WF-900",
      "on_replay": "WF-021"
    }
  }
}
~~~

## 8. Governance
- Governance Owner: ${s.owner}
- Strategic Authority: ${s.strategic}
- Approval Contract: deterministic execution, typed packets, append-only mutation enforcement
- Escalation Trigger Classes: validation failure, schema failure, lineage failure, mutation-law violation
- Mandatory Escalation Workflow: WF-900
- Replay or Remodify Workflow: WF-021

## 9. Tool/Runtime Usage
**Allowed**
- Deterministic video analysis and transformation engines
- Registered schema validation
- Registry lookups (skill_registry.yaml, workflow_bindings.yaml, schema_registry.yaml, director_binding.yaml)
- Append-only dossier and packet-index writers

**Forbidden**
- Non-deterministic generation paths
- Randomized scoring or routing behavior
- Untyped packet emission
- Direct overwrite, delete, or replace mutation behavior
- Bypassing WF-900 or WF-021 obligations

## 10. Mutation Law
**Allowed Mutations**
- append_to_array
- create_new_packet
- create_new_index_row
- append_audit_entry

**Required Mutation Metadata**
- timestamp
- writer_id
- skill_id
- instance_id
- schema_version
- lineage_reference
- audit_entry

**Forbidden Mutations**
- overwrite existing dossier fields
- replace arrays
- delete prior data
- mutate historical packets
- mutate historical approval decisions
- mutate existing se_packet_index rows

## 11. Best Practices
${bestPractices.join('\n')}

## 12. Validation/Done
**Test Cases**
${tests.join('\n')}

**Acceptance Criteria**
- All 12 required sections are present in exact order.
- Execution logic has at least 10 deterministic steps.
- Output packet family is typed and schema-bound.
- Dossier mutation is append-only and restricted to dossier.media_vein namespace.
- se_packet_index append row includes full lineage metadata.
- Escalation path WF-900 and replay path WF-021 are explicitly wired.
- Minimum 18 tests are defined and traceable to requirements.
- Upstream and downstream contract references are complete and non-ambiguous.
`;
}

function buildTestDoc(s) {
  const rows = Array.from({ length: 18 }, (_, i) => {
    const idx = String(i + 1).padStart(3, '0');
    return `- TEST-PH3B-${s.id}-${idx}: deterministic phase3b validation case ${idx}`;
  });
  return `# Test Definition: ${s.id} ${s.name}

## Scope
- Skill file: ${s.filePath}
- Packet family: ${s.family}
- Schema: ${s.schemaPath}
- Dossier target: dossier.media_vein.${s.namespace}

## Deterministic Test Matrix (18 Cases)
${rows.join('\n')}

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
`;
}

function buildSchemaObject(s) {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: s.family,
    type: 'object',
    additionalProperties: false,
    required: ['instance_id', 'artifact_family', 'schema_version', 'producer_workflow', 'dossier_ref', 'created_at', 'status', 'payload'],
    properties: {
      instance_id: { type: 'string' },
      artifact_family: { type: 'string', const: s.family },
      schema_version: { type: 'string' },
      producer_workflow: { type: 'string' },
      dossier_ref: { type: 'string' },
      created_at: { type: 'string' },
      status: { type: 'string', enum: ['CREATED', 'PARTIAL', 'FAILED', 'EMPTY'] },
      payload: {
        type: 'object',
        additionalProperties: true,
        required: ['skill_id', 'skill_name', 'primary_output', 'routing'],
        properties: {
          skill_id: { type: 'string', const: s.id },
          skill_name: { type: 'string' },
          primary_output: { type: 'object' },
          routing: { type: 'object' }
        }
      }
    }
  };
}

for (const s of phase3b) {
  writeFile(s.filePath, buildSkillContent(s));
  writeFile(s.testPath, buildTestDoc(s));
  writeFile(s.schemaPath, `${JSON.stringify(buildSchemaObject(s), null, 2)}\n`);
}

function updateStatus(text, value) {
  return text.replace(/^status:\s+.*$/m, `status: ${value}`);
}

function updateGeneratedAt(text, value) {
  return text.replace(/^generated_at:\s+.*$/m, `generated_at: "${value}"`);
}

function updateNote(text, noteText) {
  return text.replace(/^  note:\s+.*$/m, `  note: ${noteText}`);
}

function updateAuthoritativeFor(text, idsToAdd) {
  const rx = /(registry_scope:\r?\n  authoritative_for:\r?\n)([\s\S]*?)(\r?\n  note:)/m;
  const m = text.match(rx);
  if (!m) return text;
  const currentBlock = m[2];
  const existing = new Set((currentBlock.match(/-\s+(M-\d{3})/g) || []).map((v) => v.replace(/.*-\s+/, '').trim()));
  const addLines = idsToAdd.filter((id) => !existing.has(id)).map((id) => `    - ${id}`).join('\n');
  if (!addLines) return text;
  const updated = `${m[1]}${currentBlock.trimEnd()}\n${addLines}${m[3]}`;
  return text.replace(rx, updated);
}

function appendUniqueEntries(text, entries, key) {
  let out = text;
  for (const e of entries) {
    if (!out.includes(`${key}: ${e.id}`)) {
      out = `${out.trimEnd()}\n${e.block}\n`;
    }
  }
  return out;
}

let skillRegistry = fs.readFileSync(path.join(root, 'registries/skill_registry.yaml'), 'utf8');
skillRegistry = updateGeneratedAt(skillRegistry, generatedAt);
skillRegistry = updateStatus(skillRegistry, 'PARTIAL_WAVE_4_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C');
skillRegistry = updateNote(skillRegistry, 'canonical registry contains Waves 1 through 4 scopes; additional skills appended in later waves');
skillRegistry = updateAuthoritativeFor(skillRegistry, newIds);
const skillBlocks = phase3b.map((s) => ({
  id: s.id,
  block: `  - skill_id: ${s.id}
    skill_name: ${s.name}
    legacy_skill_name: ${s.legacyAlias}
    alias_names:
${s.aliases.length ? s.aliases.map((a) => `      - ${a}`).join('\n') : '      - none'}
    file_path: ${s.filePath}
    phase_assignment: PHASE_3B_VIDEO
    vein_assignment: media_vein
    owner_director: ${s.owner}
    strategic_authority_director: ${s.strategic}
    upstream_skill_dependencies:
${s.upstreamIds.map((i) => `      - ${i}`).join('\n')}
    downstream_skill_consumers:
${s.downstreamIds.map((i) => `      - ${i}`).join('\n')}
    producer_workflow: ${s.producer}
    consumer_workflows:
${s.consumers.map((i) => `      - ${i}`).join('\n')}
    output_packet_family: ${s.family}
    schema_ref: ${s.schemaPath}
    dossier_write_target: dossier.media_vein.${s.namespace}
    escalation_workflow: WF-900
    replay_workflow: WF-021
    status: ACTIVE_WAVE_4`
}));
skillRegistry = appendUniqueEntries(skillRegistry, skillBlocks, 'skill_id');
writeFile('registries/skill_registry.yaml', skillRegistry);

let workflowBindings = fs.readFileSync(path.join(root, 'registries/workflow_bindings.yaml'), 'utf8');
workflowBindings = updateGeneratedAt(workflowBindings, generatedAt);
workflowBindings = updateStatus(workflowBindings, 'PARTIAL_WAVE_4_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C');
const wbBlocks = phase3b.map((s) => ({
  id: s.id,
  block: `  - skill_id: ${s.id}
    producer_workflow: ${s.producer}
    consumer_workflows:
${s.consumers.map((i) => `      - ${i}`).join('\n')}
    emitted_packet_family: ${s.family}
    routing:
      on_success:
        next_skill: ${s.onSuccessSkill}
        next_workflow: ${s.onSuccessWorkflow}
      on_error: WF-900
      on_replay: WF-021
    deterministic_contract: true`
}));
workflowBindings = appendUniqueEntries(workflowBindings, wbBlocks, 'skill_id');
writeFile('registries/workflow_bindings.yaml', workflowBindings);

let schemaRegistry = fs.readFileSync(path.join(root, 'registries/schema_registry.yaml'), 'utf8');
schemaRegistry = updateGeneratedAt(schemaRegistry, generatedAt);
schemaRegistry = updateStatus(schemaRegistry, 'PARTIAL_WAVE_4_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C');
const srBlocks = phase3b.map((s) => ({
  id: s.family,
  block: `  - artifact_family: ${s.family}
    schema_version: "1.0.0"
    schema_path: ${s.schemaPath}
    producer_skills:
      - ${s.id}
    producer_workflows:
      - ${s.producer}
    envelope_contract:
      required_fields:
        - instance_id
        - artifact_family
        - schema_version
        - producer_workflow
        - dossier_ref
        - created_at
        - status
        - payload`
}));
schemaRegistry = appendUniqueEntries(schemaRegistry, srBlocks, 'artifact_family');
writeFile('registries/schema_registry.yaml', schemaRegistry);

const directorBinding = `version: 1
registry_id: director_binding
generated_at: "${generatedAt}"
status: PARTIAL_WAVE_4_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C
directors:
  - canonical_name: Narada
    director_id: DIR-STRTv1-002
    archetype: strategic information gatherer and platform strategist
    authority_level: OPERATIONS_CONTROL
    governance_role: routing and platform adaptation owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
      - phase3a_graphics
      - phase3b_video
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic execution with registry-bound routing
    routing_responsibility: phase1c nuance capture, phase2c adaptation, phase3a distribution-safe visual routing, and phase3b video adaptation
    failure_handling_responsibility: escalate validation failures to WF-900
    mapped_skills:
      - M-027
      - M-121
      - M-124
      - M-128
      - M-202
      - M-211
      - M-214
      - M-216
      - M-219
      - M-220
      - M-222
      - M-225
      - M-230
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
      - CWF-310
      - CWF-410
      - CWF-430
  - canonical_name: Vyasa
    director_id: DIR-RSRCHv1-002
    archetype: organizer and synthesis authority
    authority_level: NARRATIVE_CONTROL
    governance_role: synthesis and structure integrity owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
      - phase3a_graphics
      - phase3b_video
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic structure-first transformation
    routing_responsibility: research, script structure, graphics composition, and video sequencing coherence
    failure_handling_responsibility: escalate integrity conflicts to WF-900
    mapped_skills:
      - M-024
      - M-122
      - M-126
      - M-129
      - M-201
      - M-204
      - M-205
      - M-208
      - M-209
      - M-213
      - M-215
      - M-217
      - M-224
      - M-228
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
      - CWF-310
      - CWF-410
      - CWF-430
  - canonical_name: Saraswati
    director_id: DIR-DISTv1-002
    archetype: knowledge keeper and transparency advocate
    authority_level: CONTENT_CONTROL
    governance_role: evidence clarity and accessibility transparency owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
      - phase3a_graphics
      - phase3b_video
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic evidence-grounded conversion
    routing_responsibility: source interrogation, readability, accessibility, limitations transparency, and metadata integrity
    failure_handling_responsibility: escalate evidence inconsistencies to WF-900
    mapped_skills:
      - M-021
      - M-025
      - M-026
      - M-029
      - M-123
      - M-203
      - M-207
      - M-226
      - M-227
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-310
      - CWF-410
  - canonical_name: Krishna
    director_id: DIR-ORCHv1-001
    archetype: strategic authority and orchestrator
    authority_level: STRATEGIC_CONTROL
    governance_role: arbitration, policy authority, and routing governance
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
      - phase3a_graphics
      - phase3b_video
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic orchestration and governance arbitration
    routing_responsibility: threshold-gated routing and cross-phase handoff control
    failure_handling_responsibility: authorize replay and escalation decisions
    mapped_skills:
      - M-028
      - M-125
      - M-127
      - M-229
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
      - CWF-310
      - CWF-410
      - CWF-430
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
      - phase3a_graphics
      - phase3b_video
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic harmonization and change analysis
    routing_responsibility: longitudinal transitions, animation harmonization, dark-mode adaptation, and edit rhythm optimization
    failure_handling_responsibility: escalate temporal integrity violations
    mapped_skills:
      - M-022
      - M-130
      - M-210
      - M-212
      - M-218
      - M-221
      - M-223
    mapped_workflows:
      - CWF-140
      - CWF-240
      - CWF-310
      - CWF-410
      - WF-900
  - canonical_name: Brihaspati
    director_id: DIR-RSRCHv1-003
    archetype: logical analyzer and final judge
    authority_level: RESEARCH_ADJUDICATION
    governance_role: causal adjudication, final research certification, and brand-rule adjudication
    allowed_skill_families:
      - phase1c_conditional_research
      - phase3a_graphics
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic adjudication and confidence certification
    routing_responsibility: causal inference, brand validation adjudication, and final stage integrity checks
    failure_handling_responsibility: escalate unresolved logical conflicts to WF-900
    mapped_skills:
      - M-023
      - M-030
      - M-206
    mapped_workflows:
      - CWF-140
      - CWF-310
      - WF-200
      - WF-900
`;
writeFile('registries/director_binding.yaml', directorBinding);

console.log('Wave 4 generation complete');
