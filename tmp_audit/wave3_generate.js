const fs = require('fs');
const path = require('path');

const root = 'C:/ShadowEmpire-Git';
const generatedAt = new Date().toISOString();

const phase3a = [
  {
    id: 'M-201',
    name: 'Visual Design Brief Generator',
    aliases: ['Design Brief Generator'],
    legacyAlias: 'Design Brief Generator',
    filePath: 'skills/media_graphics/M-201-visual-design-brief-generator.skill.md',
    testPath: 'tests/skills/phase3a/test_M-201.md',
    schemaPath: 'schemas/packets/design_brief_packet.schema.json',
    namespace: 'visual_design_brief_generator',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (organizer, synthesizer)',
    upstreamDetail: 'script_variants (from M-130), brand_guidelines, audience_profile',
    upstreamIds: ['M-130'],
    downstreamDetail: 'M-202 through M-215 (all graphics skills)',
    downstreamIds: ['M-202', 'M-203', 'M-204', 'M-205', 'M-206', 'M-207', 'M-208', 'M-209', 'M-210', 'M-211', 'M-212', 'M-213', 'M-214', 'M-215'],
    purpose: 'Generate comprehensive design brief from script artifacts for deterministic media design execution.',
    family: 'design_brief_packet',
    primaryField: 'visual_direction',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-202',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-202',
    name: 'Color Palette Optimizer',
    aliases: [],
    legacyAlias: 'Color Palette Optimizer',
    filePath: 'skills/media_graphics/M-202-color-palette-optimizer.skill.md',
    testPath: 'tests/skills/phase3a/test_M-202.md',
    schemaPath: 'schemas/packets/color_palette_packet.schema.json',
    namespace: 'color_palette_optimizer',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (strategic information gatherer)',
    upstreamDetail: 'design_brief (from M-201), audience_profile, brand_guidelines',
    upstreamIds: ['M-201'],
    downstreamDetail: 'M-203 Typography Selector',
    downstreamIds: ['M-203'],
    purpose: 'Select optimal color palette for audience, topic, and brand while enforcing accessibility constraints.',
    family: 'color_palette_packet',
    primaryField: 'primary_colors',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-203',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-203',
    name: 'Typography Selector',
    aliases: [],
    legacyAlias: 'Typography Selector',
    filePath: 'skills/media_graphics/M-203-typography-selector.skill.md',
    testPath: 'tests/skills/phase3a/test_M-203.md',
    schemaPath: 'schemas/packets/typography_packet.schema.json',
    namespace: 'typography_selector',
    owner: 'Saraswati',
    strategic: 'Krishna',
    archetype: 'Saraswati (clarity and language steward)',
    upstreamDetail: 'design_brief (from M-201), audience_sophistication_level',
    upstreamIds: ['M-201'],
    downstreamDetail: 'M-204 Layout Composition Strategist',
    downstreamIds: ['M-204'],
    purpose: 'Select fonts and establish typography hierarchy with readability safeguards.',
    family: 'typography_packet',
    primaryField: 'font_selections',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-204',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-204',
    name: 'Layout Composition Strategist',
    aliases: ['Layout Grid Generator'],
    legacyAlias: 'Layout Grid Generator',
    filePath: 'skills/media_graphics/M-204-layout-composition-strategist.skill.md',
    testPath: 'tests/skills/phase3a/test_M-204.md',
    schemaPath: 'schemas/packets/layout_packet.schema.json',
    namespace: 'layout_composition_strategist',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (organizer, synthesizer)',
    upstreamDetail: 'design_brief (from M-201), format_specs (from M-130)',
    upstreamIds: ['M-201', 'M-130'],
    downstreamDetail: 'M-205 Icon and Illustration Mapper',
    downstreamIds: ['M-205'],
    purpose: 'Create layout grids and proportional systems for cross-format visual consistency.',
    family: 'layout_packet',
    primaryField: 'grid_specifications',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-205',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-205',
    name: 'Icon and Illustration Mapper',
    aliases: ['Icon Set Designer'],
    legacyAlias: 'Icon Set Designer',
    filePath: 'skills/media_graphics/M-205-icon-illustration-mapper.skill.md',
    testPath: 'tests/skills/phase3a/test_M-205.md',
    schemaPath: 'schemas/packets/icon_set_packet.schema.json',
    namespace: 'icon_illustration_mapper',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (organizer, synthesizer)',
    upstreamDetail: 'design_brief (from M-201), component_specs (from M-204)',
    upstreamIds: ['M-201', 'M-204'],
    downstreamDetail: 'M-206 Brand Consistency Validator',
    downstreamIds: ['M-206'],
    purpose: 'Design icon and illustration mappings for deterministic visual communication coverage.',
    family: 'icon_set_packet',
    primaryField: 'icon_specifications',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-206',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-206',
    name: 'Brand Consistency Validator',
    aliases: [],
    legacyAlias: 'Brand Consistency Validator',
    filePath: 'skills/media_graphics/M-206-brand-consistency-validator.skill.md',
    testPath: 'tests/skills/phase3a/test_M-206.md',
    schemaPath: 'schemas/packets/brand_consistency_packet.schema.json',
    namespace: 'brand_consistency_validator',
    owner: 'Brihaspati',
    strategic: 'Krishna',
    archetype: 'Brihaspati (logical analyzer and adjudicator)',
    upstreamDetail: 'color_palette (from M-202), typography (from M-203), layout (from M-204), icons (from M-205)',
    upstreamIds: ['M-202', 'M-203', 'M-204', 'M-205'],
    downstreamDetail: 'M-207 Accessibility Analyzer',
    downstreamIds: ['M-207'],
    purpose: 'Ensure all visual elements remain consistent with brand guidance and governance.',
    family: 'brand_consistency_packet',
    primaryField: 'compliance_scores',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-207',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-207',
    name: 'Accessibility Analyzer',
    aliases: ['Graphics Accessibility Auditor'],
    legacyAlias: 'Accessibility Auditor (Graphics)',
    filePath: 'skills/media_graphics/M-207-accessibility-analyzer.skill.md',
    testPath: 'tests/skills/phase3a/test_M-207.md',
    schemaPath: 'schemas/packets/accessibility_packet.schema.json',
    namespace: 'accessibility_analyzer',
    owner: 'Saraswati',
    strategic: 'Krishna',
    archetype: 'Saraswati (clarity and accessibility steward)',
    upstreamDetail: 'color_palette (from M-202), layout (from M-204), typography (from M-203)',
    upstreamIds: ['M-202', 'M-203', 'M-204'],
    downstreamDetail: 'M-208 Image Asset Sourcing Advisor',
    downstreamIds: ['M-208'],
    purpose: 'Audit visual design for contrast, readability, and color-blind accessibility compliance.',
    family: 'accessibility_packet',
    primaryField: 'contrast_scores',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-208',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-208',
    name: 'Image Asset Sourcing Advisor',
    aliases: ['Asset Library Manager'],
    legacyAlias: 'Asset Library Manager',
    filePath: 'skills/media_graphics/M-208-image-asset-sourcing-advisor.skill.md',
    testPath: 'tests/skills/phase3a/test_M-208.md',
    schemaPath: 'schemas/packets/asset_library_packet.schema.json',
    namespace: 'image_asset_sourcing_advisor',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (organizer and library curator)',
    upstreamDetail: 'all graphics outputs (M-201 through M-207)',
    upstreamIds: ['M-201', 'M-202', 'M-203', 'M-204', 'M-205', 'M-206', 'M-207'],
    downstreamDetail: 'M-209 Infographic Structure Designer',
    downstreamIds: ['M-209'],
    purpose: 'Organize and manage design assets with deterministic versioning and retrieval metadata.',
    family: 'asset_library_packet',
    primaryField: 'asset_inventory',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-209',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-209',
    name: 'Infographic Structure Designer',
    aliases: ['Infographic Data Visualizer'],
    legacyAlias: 'Infographic Data Visualizer',
    filePath: 'skills/media_graphics/M-209-infographic-structure-designer.skill.md',
    testPath: 'tests/skills/phase3a/test_M-209.md',
    schemaPath: 'schemas/packets/data_visualization_packet.schema.json',
    namespace: 'infographic_structure_designer',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (data-to-structure synthesizer)',
    upstreamDetail: 'design_brief (from M-201), infographic_script (from M-126), data_claims (from M-015)',
    upstreamIds: ['M-201', 'M-126', 'M-015'],
    downstreamDetail: 'M-210 Animation and Transition Specifier',
    downstreamIds: ['M-210'],
    purpose: 'Design infographic structure and data visualization specifications with narrative sequencing.',
    family: 'data_visualization_packet',
    primaryField: 'chart_specifications',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-210',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-210',
    name: 'Animation and Transition Specifier',
    aliases: ['Animation Specification Designer'],
    legacyAlias: 'Animation Specification Designer',
    filePath: 'skills/media_graphics/M-210-animation-transition-specifier.skill.md',
    testPath: 'tests/skills/phase3a/test_M-210.md',
    schemaPath: 'schemas/packets/animation_spec_packet.schema.json',
    namespace: 'animation_transition_specifier',
    owner: 'Shiva',
    strategic: 'Krishna',
    archetype: 'Shiva (visual transformer)',
    upstreamDetail: 'design_brief (from M-201), layout (from M-204), data_visualizations (from M-209)',
    upstreamIds: ['M-201', 'M-204', 'M-209'],
    downstreamDetail: 'M-211 Mobile-First Layout Optimizer',
    downstreamIds: ['M-211'],
    purpose: 'Specify animations and transitions with deterministic timing and performance constraints.',
    family: 'animation_spec_packet',
    primaryField: 'animation_sequences',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-211',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-211',
    name: 'Mobile-First Layout Optimizer',
    aliases: ['Mobile Optimization Engine'],
    legacyAlias: 'Mobile Optimization Engine',
    filePath: 'skills/media_graphics/M-211-mobile-first-layout-optimizer.skill.md',
    testPath: 'tests/skills/phase3a/test_M-211.md',
    schemaPath: 'schemas/packets/mobile_optimization_packet.schema.json',
    namespace: 'mobile_first_layout_optimizer',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (platform strategist)',
    upstreamDetail: 'all graphics outputs (M-201 through M-210)',
    upstreamIds: ['M-201', 'M-202', 'M-203', 'M-204', 'M-205', 'M-206', 'M-207', 'M-208', 'M-209', 'M-210'],
    downstreamDetail: 'M-212 Dark Mode Variant Generator',
    downstreamIds: ['M-212'],
    purpose: 'Optimize graphics for mobile-first consumption with responsive breakpoint and touch constraints.',
    family: 'mobile_optimization_packet',
    primaryField: 'mobile_variants',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-212',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-212',
    name: 'Dark Mode Variant Generator',
    aliases: [],
    legacyAlias: 'Dark Mode Variant Generator',
    filePath: 'skills/media_graphics/M-212-dark-mode-variant-generator.skill.md',
    testPath: 'tests/skills/phase3a/test_M-212.md',
    schemaPath: 'schemas/packets/dark_mode_packet.schema.json',
    namespace: 'dark_mode_variant_generator',
    owner: 'Shiva',
    strategic: 'Krishna',
    archetype: 'Shiva (visual transformer)',
    upstreamDetail: 'color_palette (from M-202), all graphics outputs',
    upstreamIds: ['M-202', 'M-201', 'M-203', 'M-204', 'M-205', 'M-206', 'M-207', 'M-208', 'M-209', 'M-210', 'M-211'],
    downstreamDetail: 'M-213 Print-Ready Format Converter',
    downstreamIds: ['M-213'],
    purpose: 'Generate dark-mode variants with contrast safety and readability verification.',
    family: 'dark_mode_packet',
    primaryField: 'dark_variant_colors',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-213',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-213',
    name: 'Print-Ready Format Converter',
    aliases: ['Print Format Adapter'],
    legacyAlias: 'Print Format Adapter',
    filePath: 'skills/media_graphics/M-213-print-ready-format-converter.skill.md',
    testPath: 'tests/skills/phase3a/test_M-213.md',
    schemaPath: 'schemas/packets/print_adaptation_packet.schema.json',
    namespace: 'print_ready_format_converter',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (format organizer)',
    upstreamDetail: 'all graphics outputs (M-201 through M-212)',
    upstreamIds: ['M-201', 'M-202', 'M-203', 'M-204', 'M-205', 'M-206', 'M-207', 'M-208', 'M-209', 'M-210', 'M-211', 'M-212'],
    downstreamDetail: 'M-214 Social Media Graphics Optimizer',
    downstreamIds: ['M-214'],
    purpose: 'Adapt graphics to print-ready specifications when print distribution is requested.',
    family: 'print_adaptation_packet',
    primaryField: 'print_specifications',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-214',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-214',
    name: 'Social Media Graphics Optimizer',
    aliases: ['Social Media Asset Generator'],
    legacyAlias: 'Social Media Asset Generator',
    filePath: 'skills/media_graphics/M-214-social-media-graphics-optimizer.skill.md',
    testPath: 'tests/skills/phase3a/test_M-214.md',
    schemaPath: 'schemas/packets/social_asset_packet.schema.json',
    namespace: 'social_media_graphics_optimizer',
    owner: 'Narada',
    strategic: 'Krishna',
    archetype: 'Narada (distribution strategist)',
    upstreamDetail: 'design_brief (from M-201), social_captions (from M-128)',
    upstreamIds: ['M-201', 'M-128'],
    downstreamDetail: 'M-215 Banner and Header Designer',
    downstreamIds: ['M-215'],
    purpose: 'Generate platform-specific social media graphics with deterministic dimension matrices.',
    family: 'social_asset_packet',
    primaryField: 'platform_specific_dimensions',
    producer: 'CWF-310',
    consumers: ['CWF-310'],
    onSuccessSkill: 'M-215',
    onSuccessWorkflow: 'CWF-310'
  },
  {
    id: 'M-215',
    name: 'Banner and Header Designer',
    aliases: ['Banner/Header Designer'],
    legacyAlias: 'Banner/Header Designer',
    filePath: 'skills/media_graphics/M-215-banner-header-designer.skill.md',
    testPath: 'tests/skills/phase3a/test_M-215.md',
    schemaPath: 'schemas/packets/banner_packet.schema.json',
    namespace: 'banner_header_designer',
    owner: 'Vyasa',
    strategic: 'Krishna',
    archetype: 'Vyasa (organizer and synthesis authority)',
    upstreamDetail: 'design_brief (from M-201), brand_guidelines',
    upstreamIds: ['M-201'],
    downstreamDetail: 'Phase 3B video production entry',
    downstreamIds: ['M-216'],
    purpose: 'Design banners, headers, and top-level visual branding assets for downstream media production.',
    family: 'banner_packet',
    primaryField: 'banner_designs',
    producer: 'CWF-310',
    consumers: ['CWF-410'],
    onSuccessSkill: 'M-216',
    onSuccessWorkflow: 'CWF-410'
  }
];

const newIds = phase3a.map((s) => s.id);

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
    return `- TEST-PH3A-${s.id}-${idx}: ${descriptions[i](s)}`;
  });

  const bestPractices = [
    '- Keep all visual decisions deterministic and rule-based.',
    '- Preserve lineage from M-130 through all graphics outputs.',
    '- Enforce brand constraints before style polishing.',
    '- Validate accessibility constraints before packet emission.',
    '- Keep packet payloads schema-bound and typed.',
    '- Route policy or validation failures to WF-900 immediately.',
    '- Route replay and remodify requests to WF-021 with stable metadata.',
    '- Keep dossier writes append-only under owned media namespace.',
    '- Never overwrite historical packets or index rows.',
    '- Keep downstream routing deterministic and registry-aligned.',
    '- Record complete mutation metadata for every write.',
    '- Keep alias naming in metadata for cross-section compatibility.'
  ];

  return `# SKL-PH3A-${s.id}-${s.namespace.toUpperCase()}

## 1. Skill Identity
- Skill ID: ${s.id}
- Skill Name: ${s.name}
- Legacy Alias (Compatibility): ${s.legacyAlias}
- Alias Names: ${s.aliases.length ? s.aliases.join(', ') : 'none'}
- Vein Assignment: media_vein
- Phase Assignment: PHASE_3A_GRAPHICS
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
- creator_brand_guidelines (object): brand and identity constraints
- audience_profile_extension (object): additional demographic/psychographic hints
- prior_replay_packet (object): replay context from WF-021
- execution_hints (object): deterministic operator hints

## 6. Execution Logic
STEP 1: Validate input envelope and required fields against declared contract.
STEP 2: Resolve upstream packet lineage and dependency closure.
STEP 3: Load deterministic graphics policy profile for ${s.name}.
STEP 4: Build transformation frame.
  A. Normalize upstream assets and constraints.
  B. Apply deterministic scoring and selection rules.
  C. Preserve factual and brand integrity boundaries.
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
- Deterministic graphics analysis and transformation engines
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
    return `- TEST-PH3A-${s.id}-${idx}: deterministic phase3a validation case ${idx}`;
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

for (const s of phase3a) {
  writeFile(s.filePath, buildSkillContent(s));
  writeFile(s.testPath, buildTestDoc(s));
  writeFile(s.schemaPath, `${JSON.stringify(buildSchemaObject(s), null, 2)}\n`);
}

function updateStatus(text, value) {
  return text.replace(/^status:\s+.*$/m, `status: ${value}`);
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
skillRegistry = updateStatus(skillRegistry, 'PARTIAL_WAVE_3_PHASE3A_PHASE1C_AND_PHASE2C');
skillRegistry = updateAuthoritativeFor(skillRegistry, newIds);
const skillBlocks = phase3a.map((s) => ({
  id: s.id,
  block: `  - skill_id: ${s.id}
    skill_name: ${s.name}
    legacy_skill_name: ${s.legacyAlias}
    alias_names:
${s.aliases.length ? s.aliases.map((a) => `      - ${a}`).join('\n') : '      - none'}
    file_path: ${s.filePath}
    phase_assignment: PHASE_3A_GRAPHICS
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
    status: ACTIVE_WAVE_3`
}));
skillRegistry = appendUniqueEntries(skillRegistry, skillBlocks, 'skill_id');
writeFile('registries/skill_registry.yaml', skillRegistry);

let workflowBindings = fs.readFileSync(path.join(root, 'registries/workflow_bindings.yaml'), 'utf8');
workflowBindings = updateStatus(workflowBindings, 'PARTIAL_WAVE_3_PHASE3A_PHASE1C_AND_PHASE2C');
const wbBlocks = phase3a.map((s) => ({
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
schemaRegistry = updateStatus(schemaRegistry, 'PARTIAL_WAVE_3_PHASE3A_PHASE1C_AND_PHASE2C');
const srBlocks = phase3a.map((s) => ({
  id: s.family,
  family: s.family,
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
status: PARTIAL_WAVE_3_PHASE3A_PHASE1C_AND_PHASE2C
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
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic execution with registry-bound routing
    routing_responsibility: phase1c nuance capture, phase2c adaptation, and phase3a distribution-safe visual routing
    failure_handling_responsibility: escalate validation failures to WF-900
    mapped_skills:
      - M-027
      - M-121
      - M-124
      - M-128
      - M-202
      - M-211
      - M-214
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
      - CWF-310
  - canonical_name: Vyasa
    director_id: DIR-RSRCHv1-002
    archetype: organizer and synthesis authority
    authority_level: NARRATIVE_CONTROL
    governance_role: synthesis and structure integrity owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
      - phase3a_graphics
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic structure-first transformation
    routing_responsibility: research, script structure, and graphics composition coherence
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
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-240
      - CWF-310
      - CWF-410
  - canonical_name: Saraswati
    director_id: DIR-DISTv1-002
    archetype: knowledge keeper and transparency advocate
    authority_level: CONTENT_CONTROL
    governance_role: evidence clarity and accessibility transparency owner
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
      - phase3a_graphics
    escalation_authority: WF-900
    veto_authority: no
    behavior_model: deterministic evidence-grounded conversion
    routing_responsibility: source interrogation, readability, accessibility, and limitations transparency
    failure_handling_responsibility: escalate evidence inconsistencies to WF-900
    mapped_skills:
      - M-021
      - M-025
      - M-026
      - M-029
      - M-123
      - M-203
      - M-207
    mapped_workflows:
      - CWF-140
      - CWF-230
      - CWF-310
  - canonical_name: Krishna
    director_id: DIR-ORCHv1-001
    archetype: strategic authority and orchestrator
    authority_level: STRATEGIC_CONTROL
    governance_role: arbitration, policy authority, and routing governance
    allowed_skill_families:
      - phase1c_conditional_research
      - phase2c_platform_variants
      - phase3a_graphics
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
      - CWF-310
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
    escalation_authority: WF-900
    veto_authority: yes
    behavior_model: deterministic harmonization and change analysis
    routing_responsibility: longitudinal transitions, animation harmonization, and dark-mode adaptation
    failure_handling_responsibility: escalate temporal integrity violations
    mapped_skills:
      - M-022
      - M-130
      - M-210
      - M-212
    mapped_workflows:
      - CWF-140
      - CWF-240
      - CWF-310
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

console.log('Wave 3 generation complete');
