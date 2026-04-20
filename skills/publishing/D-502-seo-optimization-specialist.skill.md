# D-502: SEO Optimization Specialist

## 1. Skill Identity
- **Skill ID**: D-502
- **Name**: SEO Optimization Specialist
- **Category**: Publishing & Distribution
- **Skill Pack**: WF-500
- **Phase**: Phase 1
- **Owner Director**: Chanakya
- **Governance Authority**: Krishna, Yama
- **Status**: active
- **Version**: 1.0.0

## 2. Purpose
Optimize platform metadata for search engine visibility and discoverability. Takes raw platform-specific metadata from D-501 and applies SEO best practices including keyword optimization, meta description crafting, schema markup guidance, and platform-algorithm signals for maximum visibility.

## 3. DNA Injection

### Role Statement
SEO specialist translates raw platform metadata into search-optimized content. Maximizes discoverability across platforms while respecting content authenticity and platform policies.

### Behavior Model
- **Upstream**: Receives raw_metadata map from D-501 (platform metadata generator)
- **Reads**: dossier.publishing.platform_metadata_packets, platform SEO convention rules
- **Produces**: seo_optimized_metadata with keyword density scores and algorithm recommendations
- **Downstream**: CWF-530-publish-readiness-checker consumes SEO-optimized metadata
- **Escalation**: SEO policy violations → WF-900
- **Fallback**: Missing keyword data → use content topic as primary keyword

### Operating Method
1. Parse raw_metadata for each platform
2. Extract content signals (title, topic, key claims)
3. Apply SEO research (keyword optimization, related terms)
4. Optimize meta descriptions for click-through rate
5. Add schema markup recommendations
6. Generate algorithm signal guidance per platform
7. Emit seo_optimized_metadata with optimization scores

## 4. Workflow Injection

### Producer Contracts
- **Triggered By**: CWF-520-distribution-planner
- **Input Packet Family**: platform_metadata_packet (raw, from D-501)
- **Input Expectations**:
  - raw_metadata contains platform-specific titles, descriptions, tags
  - dossier has context with target audience and tone

### Consumer Contracts
- **Consumed By**: CWF-530-publish-readiness-checker
- **Output Packet Family**: seo_optimized_metadata_packet
- **Output Guarantees**:
  - Keyword-optimized titles and descriptions
  - Meta description snippets for each platform
  - Schema markup recommendations
  - Algorithm signal guidance
  - Optimization score per platform (0-1)

### Workflow Vein
- **Vein Name**: publishing_vein
- **Vein Role**: Optimize metadata for search visibility
- **Reads From**:
  - se_route_runs (route context)
  - se_dossier_index (dossier metadata)
  - se_packet_index (raw metadata packets)
- **Writes To**:
  - se_packet_index (append seo_optimized_metadata_packet)
  - dossier.publishing.seo_optimized_metadata (patch mutation, append_to_array)
- **Next Stage**: CWF-530-publish-readiness-checker

## 5. Inputs

### Required Inputs
```json
{
  "platform_metadata_packet": {
    "instance_id": "PMP-xxxx",
    "payload": {
      "narrative": {
        "content_title": "string",
        "primary_topic": "string"
      },
      "evidence": {
        "raw_metadata": {
          "youtube": {
            "title": "string",
            "description": "string",
            "tags": ["array"]
          },
          "instagram": {
            "caption": "string",
            "hashtags": ["array"]
          }
        }
      }
    }
  },
  "dossier_context": {
    "target_audience": "string",
    "tone": "string",
    "primary_keyword": "string (optional)"
  }
}
```

### Optional Inputs
- keyword_research_data (SEO research on target keywords)
- competitor_analysis (competitive SEO benchmarks)
- platform_algorithm_signals (platform-specific ranking factors)

## 6. Execution Logic

### Algorithm
```javascript
function optimize_for_seo(raw_metadata, context) {
  optimized_metadata = {}
  
  // Phase 1: Keyword analysis
  primary_keyword = context.primary_keyword || extract_primary_keyword(context.title)
  related_keywords = research_related_keywords(primary_keyword)
  
  // Phase 2: Per-platform optimization
  for platform in raw_metadata.keys():
    platform_data = raw_metadata[platform]
    
    // Optimize title
    optimized_title = optimize_title_for_seo(
      platform_data.title,
      primary_keyword,
      platform.character_limit
    )
    
    // Optimize description
    optimized_description = optimize_description_for_seo({
      content: platform_data.description,
      primary_keyword: primary_keyword,
      related_keywords: related_keywords,
      platform_name: platform,
      character_limit: platform.character_limit
    })
    
    // Generate schema markup
    schema_markup = generate_schema_markup({
      content_type: infer_content_type(raw_metadata),
      title: optimized_title,
      description: optimized_description,
      platform: platform
    })
    
    // Algorithm signals
    algo_signals = {
      ctr_optimization: assess_title_ctr_potential(optimized_title),
      keyword_density: calculate_keyword_density(optimized_description, primary_keyword),
      semantic_relevance: assess_semantic_relevance(optimized_description, primary_keyword),
      platform_signals: get_platform_specific_signals(platform)
    }
    
    optimized_metadata[platform] = {
      title: optimized_title,
      description: optimized_description,
      schema_markup: schema_markup,
      algorithm_signals: algo_signals,
      optimization_score: calculate_optimization_score(algo_signals),
      platform: platform
    }
  
  return optimized_metadata
}
```

### Quality Checks
- Primary keyword appears in title and first 150 chars of description
- Keyword density 1-3% (optimal range)
- No keyword stuffing (excessive repetition)
- Descriptions are unique per platform
- Schema markup valid JSON-LD format
- All optimizations respect platform character limits

## 7. Outputs

### Primary Output: seo_optimized_metadata_packet

```json
{
  "instance_id": "SOM-timestamp",
  "artifact_family": "seo_optimized_metadata_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-520-Distribution-Planner",
  "dossier_ref": "dossier_id",
  "created_at": "ISO8601",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "primary_keyword": "string",
      "related_keywords": ["keyword1", "keyword2"],
      "optimization_target": "search_visibility"
    },
    "context": {
      "sourced_from_packet_id": "PMP-xxxx",
      "target_platforms": ["youtube", "instagram"]
    },
    "evidence": {
      "optimized_metadata": {
        "youtube": {
          "optimized_title": "string (keyword-optimized)",
          "optimized_description": "string (SEO-optimized)",
          "schema_markup": "JSON-LD structure",
          "algorithm_signals": {
            "ctr_potential": 0.0-1.0,
            "keyword_density": "percentage",
            "semantic_relevance": 0.0-1.0
          }
        }
      },
      "optimization_reports": [
        {
          "platform": "youtube",
          "changes_made": ["keyword added to title", "description restructured"],
          "rationale": "Improve CTR and discoverability"
        }
      ]
    },
    "quality": {
      "keyword_optimization": 0.92,
      "description_quality": 0.88,
      "schema_markup_validity": true,
      "platform_compliance": 1.0,
      "overall_seo_score": 0.90
    },
    "status": {
      "seo_optimization_complete": true,
      "all_platforms_optimized": true,
      "keyword_density_optimal": true,
      "next_stage": "CWF-530",
      "decision": "PROCEED_TO_PUBLISH_READINESS_CHECK"
    }
  }
}
```

### Secondary Outputs
- **Keyword Research Report**: Related keywords and search intent analysis
- **Optimization Summary**: Per-platform changes and impact estimates
- **Algorithm Signal Analysis**: Platform-specific ranking factor assessment

## 8. Governance

### Approval Gates
- No pre-approval required (optimization phase)
- Post-validation: keyword density must be in optimal range

### Veto/Restriction Points
- Cannot proceed if keyword research incomplete
- Cannot optimize if character limits violated
- Cannot use prohibited keywords or terminology

### Policy Constraints
- All optimizations must maintain content authenticity
- Cannot violate platform SEO policy guidelines
- Must respect trademark and brand guidelines
- No black-hat SEO tactics (keyword stuffing, cloaking, etc.)

## 9. Tool/Runtime Usage

### Allowed Tools
- Dossier reader (fetch metadata and context)
- Packet validator (pre-emission validation)
- SEO research tools (keyword databases, related terms)
- Route registry (fetch platform-specific SEO rules)

### Forbidden Tools
- Cannot publish content directly
- Cannot modify script or context namespaces
- Cannot write directly to dossier (only via packet validator)

## 10. Mutation Law

### Reads (Allowed)
- `dossier.publishing.platform_metadata_packets` (read-only)
- `dossier.context.execution_context` (read-only)
- se_packet_index (metadata lookup)
- se_dossier_index (dossier metadata)

### Writes (Allowed)
- `dossier.publishing.seo_optimized_metadata` (patch: append_to_array only)
- `se_packet_index` (packet metadata)

### Forbidden Writes
- Cannot overwrite existing metadata
- Cannot modify context or script namespaces
- Cannot write to approval or other namespaces

### Audit Trail
```json
{
  "timestamp": "ISO8601",
  "skill_id": "D-502",
  "operation": "seo_metadata_optimization_completed",
  "dossier_id": "xxx",
  "packet_id": "SOM-xxx",
  "platforms_optimized": "int",
  "primary_keyword": "string",
  "avg_optimization_score": "float"
}
```

## 11. Best Practices

### SEO Optimization Principles
1. **Primary Keyword Focus**: Title, first 150 chars of description, header tags
2. **Keyword Density**: 1-3% optimal range (1-2 mentions per 100 words)
3. **Natural Language**: Keyword placement sounds natural, not forced
4. **Semantic Relevance**: Related keywords support primary keyword context
5. **Platform Conventions**: Respect each platform's ranking algorithm

### Common Pitfalls
- Keyword stuffing (over-optimization leading to spam signals)
- Neglecting platform-specific signals (YouTube favors watch time, Instagram favors engagement)
- Ignoring user intent (targeting wrong search queries)
- Duplicate descriptions across platforms (missed personalization)
- Character limit truncation losing important information

### Iteration Path
If SEO optimization rejected:
1. Review keyword research (may need broader or narrower terms)
2. Reassess content positioning
3. Check platform algorithm changes
4. Adjust optimization strategy
5. Replay CWF-520 with revised keyword focus

## 12. Validation/Done Criteria

### Skill Execution Validation
- ✓ Primary keyword identified and optimized
- ✓ Keyword density in optimal range (1-3%)
- ✓ All platform descriptions optimized and unique
- ✓ Schema markup generated and valid
- ✓ Character limits respected
- ✓ Algorithm signals assessed per platform
- ✓ Packet schema validation passes

### Acceptance Criteria (for CWF-520)
- ✓ seo_optimized_metadata_packet emitted with status CREATED
- ✓ All platforms have optimized titles and descriptions
- ✓ Keyword optimization score ≥ 0.85
- ✓ Dossier delta recorded to publishing namespace
- ✓ Audit entry created with keyword and scores
- ✓ Next workflow (CWF-530) receives valid packet

### Test References
- `test/skills/publishing/D-502-seo-optimization-happy-path.test.js`
- `test/skills/publishing/D-502-keyword-density-validation.test.js`
- `test/skills/publishing/D-502-platform-compliance.test.js`

### Regression Tests
- Verify keyword appears in title and first 150 chars
- Verify no dossier overwrites (append-only)
- Verify packet lineage unbroken
- Verify optimization score deterministic

---

**Last Updated**: 2026-04-20  
**Status**: Implementation Ready  
**Next Skill**: D-503-publish-readiness-checker
