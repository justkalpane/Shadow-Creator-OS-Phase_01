const fs = require('fs');
const path = require('path');

const root = 'C:/ShadowEmpire-Git';
const generatedAt = new Date().toISOString();

const phase3c = [
  {
    id: 'M-231',
    name: 'Voiceover Direction Script',
    aliases: ['Voiceover Direction Specification'],
    legacyAlias: 'Voiceover Direction Specification',
    filePath: 'skills/media_audio/M-231-voiceover-direction-script.skill.md',
    testPath: 'tests/skills/phase3c/test_M-231.md',
    schemaPath: 'schemas/packets/voiceover_spec_packet.schema.json',
    namespace: 'voiceover_direction_script',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (sonic storyteller and performance strategist)',
    upstreamDetail:
      'script (from M-110/M-120), tone_variants (from M-113), emotional_arc (from M-106)',
    upstreamIds: ['M-110', 'M-120', 'M-113', 'M-106'],
    downstreamDetail: 'M-232 Sound Design Brief',
    downstreamIds: ['M-232'],
    purpose:
      'Specify voiceover direction and performance notes for deterministic narration quality.',
    family: 'voiceover_spec_packet',
    primaryField: 'performance_direction',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-232',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-232',
    name: 'Sound Design Brief',
    aliases: ['Sound Design Palette Creator'],
    legacyAlias: 'Sound Design Palette Creator',
    filePath: 'skills/media_audio/M-232-sound-design-brief.skill.md',
    testPath: 'tests/skills/phase3c/test_M-232.md',
    schemaPath: 'schemas/packets/sound_palette_packet.schema.json',
    namespace: 'sound_design_brief',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (atmosphere and sonic palette strategist)',
    upstreamDetail: 'sound_design_brief (from M-220), emotional_arc (from M-106)',
    upstreamIds: ['M-220', 'M-106'],
    downstreamDetail: 'M-233 Music Selection Advisor',
    downstreamIds: ['M-233'],
    purpose:
      'Create deterministic sound palette and environmental audio atmosphere specifications.',
    family: 'sound_palette_packet',
    primaryField: 'ambient_sounds',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-233',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-233',
    name: 'Music Selection Advisor',
    aliases: ['Music Selection Curator'],
    legacyAlias: 'Music Selection Curator',
    filePath: 'skills/media_audio/M-233-music-selection-advisor.skill.md',
    testPath: 'tests/skills/phase3c/test_M-233.md',
    schemaPath: 'schemas/packets/music_packet.schema.json',
    namespace: 'music_selection_advisor',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (mood and timing music strategist)',
    upstreamDetail:
      'pacing_engine_output (from M-114), emotional_arc (from M-106), brand_guidelines',
    upstreamIds: ['M-114', 'M-106'],
    downstreamDetail: 'M-234 Podcast Audio Optimization',
    downstreamIds: ['M-234'],
    purpose:
      'Select and specify music tracks with deterministic mood and licensing alignment.',
    family: 'music_packet',
    primaryField: 'music_selections',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-234',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-234',
    name: 'Podcast Audio Optimization',
    aliases: ['Podcast Optimization Engine'],
    legacyAlias: 'Podcast Optimization Engine',
    filePath: 'skills/media_audio/M-234-podcast-audio-optimization.skill.md',
    testPath: 'tests/skills/phase3c/test_M-234.md',
    schemaPath: 'schemas/packets/podcast_audio_packet.schema.json',
    namespace: 'podcast_audio_optimization',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (podcast structure and optimization organizer)',
    upstreamDetail:
      'podcast_script (from M-124), voiceover_specs (from M-231), sound_design (from M-232)',
    upstreamIds: ['M-124', 'M-231', 'M-232'],
    downstreamDetail: 'M-235 Acoustic Environment Analyzer',
    downstreamIds: ['M-235'],
    purpose:
      'Optimize podcast audio specifications with deterministic format and level controls.',
    family: 'podcast_audio_packet',
    primaryField: 'podcast_format_specs',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-235',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-235',
    name: 'Acoustic Environment Analyzer',
    aliases: [],
    legacyAlias: 'Acoustic Environment Analyzer',
    filePath: 'skills/media_audio/M-235-acoustic-environment-analyzer.skill.md',
    testPath: 'tests/skills/phase3c/test_M-235.md',
    schemaPath: 'schemas/packets/acoustics_packet.schema.json',
    namespace: 'acoustic_environment_analyzer',
    owner: 'Saraswati',
    strategic: 'Krishna',
    archetype: 'Saraswati (clarity and recording-environment steward)',
    upstreamDetail: 'production_environment_specs',
    upstreamIds: ['M-234'],
    downstreamDetail: 'M-236 Noise Reduction Strategy',
    downstreamIds: ['M-236'],
    purpose:
      'Analyze and specify recording environment parameters for acoustic clarity.',
    family: 'acoustics_packet',
    primaryField: 'environment_specifications',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-236',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-236',
    name: 'Noise Reduction Strategy',
    aliases: ['Noise Reduction Specification'],
    legacyAlias: 'Noise Reduction Specification',
    filePath: 'skills/media_audio/M-236-noise-reduction-strategy.skill.md',
    testPath: 'tests/skills/phase3c/test_M-236.md',
    schemaPath: 'schemas/packets/noise_reduction_packet.schema.json',
    namespace: 'noise_reduction_strategy',
    owner: 'Shiva',
    strategic: 'Krishna',
    archetype: 'Shiva (signal cleanup and correction transformer)',
    upstreamDetail: 'acoustics_analysis (from M-235), production_notes',
    upstreamIds: ['M-235'],
    downstreamDetail: 'M-237 Audio Levels and Normalization',
    downstreamIds: ['M-237'],
    purpose: 'Specify deterministic noise reduction and cleanup operations.',
    family: 'noise_reduction_packet',
    primaryField: 'noise_profiles',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-237',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-237',
    name: 'Audio Levels and Normalization',
    aliases: ['Levels & Dynamics Optimizer'],
    legacyAlias: 'Levels & Dynamics Optimizer',
    filePath: 'skills/media_audio/M-237-audio-levels-normalization.skill.md',
    testPath: 'tests/skills/phase3c/test_M-237.md',
    schemaPath: 'schemas/packets/levels_packet.schema.json',
    namespace: 'audio_levels_normalization',
    owner: 'Brihaspati',
    strategic: 'Krishna',
    archetype: 'Brihaspati (measurement and dynamics adjudicator)',
    upstreamDetail:
      'voiceover_spec (from M-231), music (from M-233), sound_design (from M-232)',
    upstreamIds: ['M-231', 'M-233', 'M-232'],
    downstreamDetail: 'M-238 Compression and EQ Specifications',
    downstreamIds: ['M-238'],
    purpose:
      'Optimize audio levels and dynamic range with deterministic loudness targets.',
    family: 'levels_packet',
    primaryField: 'target_levels',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-238',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-238',
    name: 'Compression and EQ Specifications',
    aliases: ['Compression & EQ Specification'],
    legacyAlias: 'Compression & EQ Specification',
    filePath: 'skills/media_audio/M-238-compression-eq-specifications.skill.md',
    testPath: 'tests/skills/phase3c/test_M-238.md',
    schemaPath: 'schemas/packets/compression_eq_packet.schema.json',
    namespace: 'compression_eq_specifications',
    owner: 'Shiva',
    strategic: 'Krishna',
    archetype: 'Shiva (tonal and dynamics transformer)',
    upstreamDetail: 'levels_optimization (from M-237), audio_characteristics',
    upstreamIds: ['M-237'],
    downstreamDetail: 'M-239 Reverb and Effects Designer',
    downstreamIds: ['M-239'],
    purpose:
      'Specify deterministic compression and EQ processing chain settings.',
    family: 'compression_eq_packet',
    primaryField: 'eq_curve_specs',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-239',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-239',
    name: 'Reverb and Effects Designer',
    aliases: ['Reverb & Spatial Effects Designer'],
    legacyAlias: 'Reverb & Spatial Effects Designer',
    filePath: 'skills/media_audio/M-239-reverb-effects-designer.skill.md',
    testPath: 'tests/skills/phase3c/test_M-239.md',
    schemaPath: 'schemas/packets/reverb_effects_packet.schema.json',
    namespace: 'reverb_effects_designer',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (spatial immersion strategist)',
    upstreamDetail: 'emotional_arc (from M-106), voiceover_spec (from M-231)',
    upstreamIds: ['M-106', 'M-231'],
    downstreamDetail: 'M-240 Audio Mixing Guide',
    downstreamIds: ['M-240'],
    purpose:
      'Design deterministic reverb and spatial effect specifications for immersion.',
    family: 'reverb_effects_packet',
    primaryField: 'reverb_specifications',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-240',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-240',
    name: 'Audio Mixing Guide',
    aliases: ['Mix & Master Specification'],
    legacyAlias: 'Mix & Master Specification',
    filePath: 'skills/media_audio/M-240-audio-mixing-guide.skill.md',
    testPath: 'tests/skills/phase3c/test_M-240.md',
    schemaPath: 'schemas/packets/mix_master_packet.schema.json',
    namespace: 'audio_mixing_guide',
    owner: 'Brihaspati',
    strategic: 'Krishna',
    archetype: 'Brihaspati (mix and quality adjudicator)',
    upstreamDetail: 'all audio elements (M-231-M-239)',
    upstreamIds: [
      'M-231',
      'M-232',
      'M-233',
      'M-234',
      'M-235',
      'M-236',
      'M-237',
      'M-238',
      'M-239'
    ],
    downstreamDetail: 'M-241 Mastering Specifications',
    downstreamIds: ['M-241'],
    purpose:
      'Specify deterministic mix and master processing envelope and target loudness profile.',
    family: 'mix_master_packet',
    primaryField: 'mix_balance_specs',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-241',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-241',
    name: 'Mastering Specifications',
    aliases: ['Intro & Outro Designer'],
    legacyAlias: 'Intro & Outro Designer',
    filePath: 'skills/media_audio/M-241-mastering-specifications.skill.md',
    testPath: 'tests/skills/phase3c/test_M-241.md',
    schemaPath: 'schemas/packets/intro_outro_packet.schema.json',
    namespace: 'mastering_specifications',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (format finisher and packaging organizer)',
    upstreamDetail: 'design_brief (from M-201), music (from M-233), brand_guidelines',
    upstreamIds: ['M-201', 'M-233'],
    downstreamDetail: 'M-242 Podcast Intro or Outro Designer',
    downstreamIds: ['M-242'],
    purpose:
      'Produce mastering-oriented intro and outro design specifications with deterministic brand alignment.',
    family: 'intro_outro_packet',
    primaryField: 'intro_design',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-242',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-242',
    name: 'Podcast Intro or Outro Designer',
    aliases: ['Transition Sound Designer'],
    legacyAlias: 'Transition Sound Designer',
    filePath: 'skills/media_audio/M-242-podcast-intro-outro-designer.skill.md',
    testPath: 'tests/skills/phase3c/test_M-242.md',
    schemaPath: 'schemas/packets/transition_sound_packet.schema.json',
    namespace: 'podcast_intro_outro_designer',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (audio transition strategist)',
    upstreamDetail: 'editing_sequence (from M-218), sound_design (from M-232)',
    upstreamIds: ['M-218', 'M-232'],
    downstreamDetail: 'M-243 Audio Transitions Optimizer',
    downstreamIds: ['M-243'],
    purpose:
      'Design deterministic transition sound effects for segment boundaries and hooks.',
    family: 'transition_sound_packet',
    primaryField: 'transition_effects',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-243',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-243',
    name: 'Audio Transitions Optimizer',
    aliases: ['Transcript & Captions Generator'],
    legacyAlias: 'Transcript & Captions Generator',
    filePath: 'skills/media_audio/M-243-audio-transitions-optimizer.skill.md',
    testPath: 'tests/skills/phase3c/test_M-243.md',
    schemaPath: 'schemas/packets/transcript_packet.schema.json',
    namespace: 'audio_transitions_optimizer',
    owner: 'Saraswati',
    strategic: 'Krishna',
    archetype: 'Saraswati (clarity and transcript steward)',
    upstreamDetail: 'voiceover_script (from M-110/M-124), audio_file',
    upstreamIds: ['M-110', 'M-124'],
    downstreamDetail: 'M-244 Transcript Generator',
    downstreamIds: ['M-244'],
    purpose:
      'Generate deterministic transcript and caption timing artifacts for accessibility readiness.',
    family: 'transcript_packet',
    primaryField: 'transcript_text',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-244',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-244',
    name: 'Transcript Generator',
    aliases: ['Accessibility Audio Specification'],
    legacyAlias: 'Accessibility Audio Specification',
    filePath: 'skills/media_audio/M-244-transcript-generator.skill.md',
    testPath: 'tests/skills/phase3c/test_M-244.md',
    schemaPath: 'schemas/packets/audio_accessibility_packet.schema.json',
    namespace: 'transcript_generator',
    owner: 'Saraswati',
    strategic: 'Krishna',
    archetype: 'Saraswati (accessibility compliance steward)',
    upstreamDetail: 'transcript (from M-243), audio_specifications',
    upstreamIds: ['M-243'],
    downstreamDetail: 'M-245 Accessibility Audio Description',
    downstreamIds: ['M-245'],
    purpose:
      'Ensure audio accessibility compliance with deterministic transcript and caption checks.',
    family: 'audio_accessibility_packet',
    primaryField: 'transcript_quality_verification',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-245',
    onSuccessWorkflow: 'CWF-430'
  },
  {
    id: 'M-245',
    name: 'Accessibility Audio Description',
    aliases: ['Audio Performance Predictor'],
    legacyAlias: 'Audio Performance Predictor',
    filePath: 'skills/media_audio/M-245-accessibility-audio-description.skill.md',
    testPath: 'tests/skills/phase3c/test_M-245.md',
    schemaPath: 'schemas/packets/audio_performance_packet.schema.json',
    namespace: 'accessibility_audio_description',
    owner: 'Krishna',
    strategic: 'Krishna',
    archetype: 'Krishna (strategic quality and performance forecaster)',
    upstreamDetail:
      'all audio specifications (M-231-M-244), historical_audio_performance_data',
    upstreamIds: [
      'M-231',
      'M-232',
      'M-233',
      'M-234',
      'M-235',
      'M-236',
      'M-237',
      'M-238',
      'M-239',
      'M-240',
      'M-241',
      'M-242',
      'M-243',
      'M-244'
    ],
    downstreamDetail: 'Phase 4A publishing entry',
    downstreamIds: ['M-301'],
    purpose:
      'Predict audio quality and engagement metrics with deterministic governance-bound scoring.',
    family: 'audio_performance_packet',
    primaryField: 'quality_predictions',
    producer: 'CWF-430',
    consumers: ['CWF-430'],
    onSuccessSkill: 'M-301',
    onSuccessWorkflow: 'CWF-430'
  }
];

const newIds = phase3c.map((s) => s.id);

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
    return `- TEST-PH3C-${s.id}-${idx}: ${descriptions[i](s)}`;
  });

  const bestPractices = [
    '- Keep all audio decisions deterministic and rule-based.',
    '- Preserve lineage from script, video, and upstream audio packets into outputs.',
    '- Enforce technical constraints before optimization and transformation.',
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

  return `# SKL-PH3C-${s.id}-${s.namespace.toUpperCase()}

## 1. Skill Identity
- Skill ID: ${s.id}
- Skill Name: ${s.name}
- Legacy Alias (Compatibility): ${s.legacyAlias}
- Alias Names: ${s.aliases.length ? s.aliases.join(', ') : 'none'}
- Vein Assignment: media_vein
- Phase Assignment: PHASE_3C_AUDIO
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
- audio_environment_constraints (object): production environment and delivery constraints
- creator_brand_guidelines (object): brand and identity constraints
- prior_replay_packet (object): replay context from WF-021
- execution_hints (object): deterministic operator hints

## 6. Execution Logic
STEP 1: Validate input envelope and required fields against declared contract.
STEP 2: Resolve upstream packet lineage and dependency closure.
STEP 3: Load deterministic audio policy profile for ${s.name}.
STEP 4: Build transformation frame.
  A. Normalize upstream specs and constraints.
  B. Apply deterministic audio sequencing and scoring rules.
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
- Deterministic audio analysis and transformation engines
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
    return `- TEST-PH3C-${s.id}-${idx}: deterministic phase3c validation case ${idx}`;
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
    required: [
      'instance_id',
      'artifact_family',
      'schema_version',
      'producer_workflow',
      'dossier_ref',
      'created_at',
      'status',
      'payload'
    ],
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

for (const s of phase3c) {
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
  const existing = new Set(
    (currentBlock.match(/-\s+(M-\d{3})/g) || []).map((v) =>
      v.replace(/.*-\s+/, '').trim()
    )
  );
  const addLines = idsToAdd
    .filter((id) => !existing.has(id))
    .map((id) => `    - ${id}`)
    .join('\n');
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
skillRegistry = updateStatus(
  skillRegistry,
  'PARTIAL_WAVE_5_PHASE3C_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C'
);
skillRegistry = updateNote(
  skillRegistry,
  'canonical registry contains Waves 1 through 5 scopes; additional skills appended in later waves'
);
skillRegistry = updateAuthoritativeFor(skillRegistry, newIds);
const skillBlocks = phase3c.map((s) => ({
  id: s.id,
  block: `  - skill_id: ${s.id}
    skill_name: ${s.name}
    legacy_skill_name: ${s.legacyAlias}
    alias_names:
${s.aliases.length ? s.aliases.map((a) => `      - ${a}`).join('\n') : '      - none'}
    file_path: ${s.filePath}
    phase_assignment: PHASE_3C_AUDIO
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
    status: ACTIVE_WAVE_5`
}));
skillRegistry = appendUniqueEntries(skillRegistry, skillBlocks, 'skill_id');
writeFile('registries/skill_registry.yaml', skillRegistry);

let workflowBindings = fs.readFileSync(
  path.join(root, 'registries/workflow_bindings.yaml'),
  'utf8'
);
workflowBindings = updateGeneratedAt(workflowBindings, generatedAt);
workflowBindings = updateStatus(
  workflowBindings,
  'PARTIAL_WAVE_5_PHASE3C_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C'
);
const wbBlocks = phase3c.map((s) => ({
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
schemaRegistry = updateStatus(
  schemaRegistry,
  'PARTIAL_WAVE_5_PHASE3C_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C'
);
const srBlocks = phase3c.map((s) => ({
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
status: PARTIAL_WAVE_5_PHASE3C_PHASE3B_PHASE3A_PHASE1C_AND_PHASE2C
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
      - phase3c_audio
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic execution with registry-bound routing
    routing_responsibility: phase1c nuance capture, phase2c adaptation, phase3a distribution-safe visual routing, phase3b video adaptation, and phase3c audio adaptation
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
      - M-231
      - M-232
      - M-233
      - M-239
      - M-242
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
      - phase3c_audio
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic structure-first transformation
    routing_responsibility: research, script structure, graphics composition, video sequencing coherence, and audio package structuring
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
      - M-234
      - M-241
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
      - phase3c_audio
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic evidence-grounded conversion
    routing_responsibility: source interrogation, readability, accessibility, limitations transparency, metadata integrity, and audio accessibility compliance
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
      - M-235
      - M-243
      - M-244
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-310
      - CWF-410
      - CWF-430
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
      - phase3c_audio
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
      - M-245
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
      - phase3c_audio
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic harmonization and change analysis
    routing_responsibility: longitudinal transitions, animation harmonization, dark-mode adaptation, edit rhythm optimization, and signal-chain transformation
    failure_handling_responsibility: escalate temporal integrity violations
    mapped_skills:
      - M-022
      - M-130
      - M-210
      - M-212
      - M-218
      - M-221
      - M-223
      - M-236
      - M-238
    mapped_workflows:
      - CWF-140
      - CWF-240
      - CWF-310
      - CWF-410
      - CWF-430
      - WF-900
  - canonical_name: Brihaspati
    director_id: DIR-RSRCHv1-003
    archetype: logical analyzer and final judge
    authority_level: RESEARCH_ADJUDICATION
    governance_role: causal adjudication, final research certification, and quality adjudication
    allowed_skill_families:
      - phase1c_conditional_research
      - phase3a_graphics
      - phase3c_audio
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic adjudication and confidence certification
    routing_responsibility: causal inference, brand validation adjudication, final stage integrity checks, and audio quality adjudication
    failure_handling_responsibility: escalate unresolved logical conflicts to WF-900
    mapped_skills:
      - M-023
      - M-030
      - M-206
      - M-237
      - M-240
    mapped_workflows:
      - CWF-140
      - CWF-310
      - CWF-430
      - WF-200
      - WF-900
`;
writeFile('registries/director_binding.yaml', directorBinding);

console.log('Wave 5 generation complete');
