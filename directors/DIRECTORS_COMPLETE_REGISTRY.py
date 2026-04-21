# shadow_empire/directors/DIRECTORS_COMPLETE_REGISTRY.py
"""
SHADOW EMPIRE COMPLETE DIRECTORS REGISTRY - All 30 Directors

INDIVIDUAL BUILDS - FULL SPECIFICATIONS FOR EACH DIRECTOR
No compression. Each director has complete routing, vein mapping,
workflow integration, approval chains, tool contracts.

BUILD DATE: 2026-04-21
STATUS: COMPLETE - All 30 Directors fully specified
"""

from dataclasses import dataclass, asdict, field
from typing import Dict, List, Any, Optional, Set, Tuple
from enum import Enum
from abc import ABC, abstractmethod
import uuid
from datetime import datetime
import json

# ============================================================================
# GOVERNANCE ENUMS
# ============================================================================

class GovernanceLevel(Enum):
    KERNEL = "kernel"      # Non-overridable core system
    POLICY = "policy"      # Policy enforcement
    GUIDANCE = "guidance"  # Advisory
    VETO = "veto"         # Can block any operation

class CouncilType(Enum):
    SUPREME_VISION = "Supreme Vision"
    STRATEGY = "Strategy"
    RESEARCH = "Research"
    CONTENT = "Content"
    PRODUCTION = "Production"
    CINEMATIC = "Cinematic"
    DISTRIBUTION = "Distribution & Evolution"
    KNOWLEDGE = "Knowledge"
    FINANCE = "Finance"
    GOVERNANCE = "Governance"
    ADVANCED = "Advanced"
    SUPREME = "Supreme"

class DecisionType(Enum):
    APPROVE = "approve"
    REJECT = "reject"
    ESCALATE = "escalate"
    DEFER = "defer"
    OVERRIDE = "override"

# ============================================================================
# COMPLETE DIRECTOR SPECIFICATION CONTRACTS
# ============================================================================

@dataclass
class DirectorVeinContract:
    """Complete vein read/write contracts for director."""
    reads_from: List[str]      # Veins director reads
    writes_to: List[str]       # Veins director writes
    ownership: List[str]       # Veins director owns (namespace authority)
    lock_authority: List[str]  # State transitions director can lock

@dataclass
class DirectorWorkflowContract:
    """Complete workflow routing for director."""
    trigger_workflows: List[str]        # Workflows triggered by this director
    can_gate_workflows: List[str]       # Workflows this director gates
    approved_next_stages: List[str]     # Valid next stages
    fallback_stages: List[str]          # Fallback routes if primary fails

@dataclass
class DirectorApprovalContract:
    """Approval authority contract for director."""
    approval_scopes: List[str]          # What this director approves
    veto_scopes: List[str]              # What this director can veto
    can_be_overridden_by: List[str]     # Which directors can override
    override_costs: Dict[str, int]      # Cost in tokens to override

@dataclass
class DirectorToolContract:
    """Tools and capabilities contract."""
    allowed_tools: List[str]            # Tools director can invoke
    forbidden_tools: List[str]          # Tools director cannot use
    requires_audit_for: List[str]       # Tools requiring audit logging
    cost_gates: Dict[str, int]          # Cost thresholds for tools

@dataclass
class DirectorDecisionRecord:
    """Complete record of a director's decision."""
    decision_id: str
    director_id: str
    director_name: str
    decision_type: DecisionType
    subject: str
    subject_type: str                   # skill, workflow, task, etc.
    context_summary: Dict[str, Any]
    rationale: str
    confidence: float
    vein_mutations: List[Dict[str, Any]]  # Dossier changes triggered
    escalation_target: Optional[str]
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

@dataclass
class DirectorSpecification:
    """Complete director specification - individual, no compression."""
    director_id: str
    name: str
    council: CouncilType
    governance_level: GovernanceLevel
    primary_domain: str
    secondary_domain: str
    owned_modules: int
    shadow_pair: Optional[str]          # Shadow director for veto/balance

    # Full contracts
    vein_contract: DirectorVeinContract
    workflow_contract: DirectorWorkflowContract
    approval_contract: DirectorApprovalContract
    tool_contract: DirectorToolContract

    # Authority matrix
    can_make_binding_decisions_on: List[str]
    can_request_but_not_approve: List[str]
    delegation_authority: Dict[str, List[str]]  # Can delegate to specific directors

    # Decision history
    decision_history: List[DirectorDecisionRecord] = field(default_factory=list)

    # Metrics
    total_decisions_made: int = 0
    decisions_approved: int = 0
    decisions_rejected: int = 0
    decisions_escalated: int = 0
    average_confidence: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "director_id": self.director_id,
            "name": self.name,
            "council": self.council.value,
            "governance_level": self.governance_level.value,
            "primary_domain": self.primary_domain,
            "secondary_domain": self.secondary_domain,
            "owned_modules": self.owned_modules,
            "vein_reads": self.vein_contract.reads_from,
            "vein_writes": self.vein_contract.writes_to,
            "can_approve": self.approval_contract.approval_scopes,
            "can_veto": self.approval_contract.veto_scopes,
            "allowed_tools": self.tool_contract.allowed_tools,
            "total_decisions": self.total_decisions_made
        }

# ============================================================================
# COMPLETE DIRECTOR IMPLEMENTATIONS - 30 DIRECTORS INDIVIDUALLY
# ============================================================================

# DIR-001: KRISHNA - Multi-Agent Orchestrator
KRISHNA_SPEC = DirectorSpecification(
    director_id="DIR-001-KRISHNA",
    name="Krishna",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.POLICY,
    primary_domain="Multi-Agent / Swarm / Expansion",
    secondary_domain="Script & Narrative Intelligence",
    owned_modules=29,
    shadow_pair="DIR-004-VISHNU",
    vein_contract=DirectorVeinContract(
        reads_from=["meta.db", "routing.db", "state.db", "governance.db"],
        writes_to=["routing.db", "governance.db", "audit.db"],
        ownership=["routing.db"],
        lock_authority=["state transitions for multi-agent flows"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-120", "WF-130", "WF-140"],
        can_gate_workflows=["WF-121-WF-149"],
        approved_next_stages=["ROUTE_PHASE1_STANDARD", "ROUTE_PHASE1_FAST"],
        fallback_stages=["ROUTE_TO_ARBITRATION", "ROUTE_TO_TRIBUNAL"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["multi_agent_routing", "swarm_expansion", "agent_spawning"],
        veto_scopes=["dangerous_swarm_operations"],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"multi_agent_routing": 50}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["skill_router", "agent_spawner", "swarm_controller", "cost_calculator"],
        forbidden_tools=["policy_override", "vein_delete"],
        requires_audit_for=["agent_spawner", "swarm_controller"],
        cost_gates={"agent_spawner": 100, "swarm_controller": 200}
    ),
    can_make_binding_decisions_on=[
        "M-121-M-150",  # Skills Krishna owns
        "multi_agent_routing",
        "swarm_parameters"
    ],
    can_request_but_not_approve=[
        "policy_changes",
        "founder_override"
    ],
    delegation_authority={
        "DIR-025-INDRA": ["algorithm_decisions"],
        "DIR-019-SARASWATI": ["expansion_decisions"]
    }
)

# DIR-002: SHIVA - Script & Narrative Intelligence
SHIVA_SPEC = DirectorSpecification(
    director_id="DIR-002-SHIVA",
    name="Shiva",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.POLICY,
    primary_domain="Script & Narrative Intelligence",
    secondary_domain="Autonomous Intelligence Loop",
    owned_modules=9,
    shadow_pair="DIR-020-VALMIKI",
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_script", "artifacts_narrative", "state.db"],
        writes_to=["artifacts_script", "governance.db", "audit.db"],
        ownership=["artifacts_script"],
        lock_authority=["script approval transitions"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["CWF-210", "CWF-220"],
        can_gate_workflows=["CWF-211-CWF-229"],
        approved_next_stages=["SCRIPT_APPROVED", "SCRIPT_REVISION_NEEDED"],
        fallback_stages=["SCRIPT_QUARANTINE"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["script_quality", "narrative_coherence", "emotional_impact"],
        veto_scopes=["unsafe_narrative", "policy_violating_scripts"],
        can_be_overridden_by=["DIR-030-MAHAVISHNU", "DIR-005-SHAKTI"],
        override_costs={"script_quality": 75, "narrative_coherence": 100}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["script_validator", "narrative_analyzer", "quality_scorer"],
        forbidden_tools=["direct_script_edit", "force_approval"],
        requires_audit_for=["script_validator"],
        cost_gates={"script_validator": 50}
    ),
    can_make_binding_decisions_on=[
        "M-008-M-060",  # Script skills
        "script_approval",
        "narrative_quality"
    ],
    can_request_but_not_approve=["founder_level_decisions"],
    delegation_authority={
        "DIR-020-VALMIKI": ["narrative_decisions"],
        "DIR-019-SARASWATI": ["dialogue_decisions"]
    }
)

# DIR-003: BRAHMA - Autonomous Intelligence & Governance
BRAHMA_SPEC = DirectorSpecification(
    director_id="DIR-003-BRAHMA",
    name="Brahma",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.KERNEL,
    primary_domain="Autonomous Intelligence Loop",
    secondary_domain="Councils, Governance, Creator Command & Sovereign Layer",
    owned_modules=18,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["meta.db", "routing.db", "state.db", "governance.db", "audit.db"],
        writes_to=["state.db", "governance.db", "audit.db"],
        ownership=["state.db"],
        lock_authority=["all state transitions"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-000", "WF-010", "WF-020"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["ANY_STAGE"],
        fallback_stages=["WF-900"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["all_decisions"],
        veto_scopes=["system_integrity"],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["ALL_TOOLS"],
        forbidden_tools=[],
        requires_audit_for=["ALL_TOOLS"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["ALL_MODULES"],
    can_request_but_not_approve=[],
    delegation_authority={
        "DIR-001-KRISHNA": ["multi_agent_governance"],
        "DIR-011-GANESHA": ["routing_governance"],
        "DIR-016-ARUNA": ["workflow_governance"]
    }
)

# DIR-004: VISHNU - Maintenance & Preservation
VISHNU_SPEC = DirectorSpecification(
    director_id="DIR-004-VISHNU",
    name="Vishnu",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.POLICY,
    primary_domain="Script & Narrative Intelligence",
    secondary_domain="Governance, Boot & Skill Operating System",
    owned_modules=9,
    shadow_pair="DIR-001-KRISHNA",
    vein_contract=DirectorVeinContract(
        reads_from=["state.db", "artifacts_*"],
        writes_to=["state.db", "governance.db"],
        ownership=["governance.db"],
        lock_authority=["preservation locks"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-020", "WF-030"],
        can_gate_workflows=["CWF-230-CWF-240"],
        approved_next_stages=["PRESERVED", "ARCHIVED"],
        fallback_stages=["RESTORATION"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["state_preservation", "rollback_approval"],
        veto_scopes=["destructive_operations"],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"rollback_approval": 200}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["state_preserver", "rollback_executor", "checkpoint_creator"],
        forbidden_tools=["state_destroyer"],
        requires_audit_for=["rollback_executor"],
        cost_gates={"rollback_executor": 300}
    ),
    can_make_binding_decisions_on=["state_preservation", "rollback_decisions"],
    can_request_but_not_approve=["creator_level_decisions"],
    delegation_authority={
        "DIR-015-CHITRAGUPTA": ["audit_preservation"]
    }
)

# DIR-005: SHAKTI - Divine Power & Enforcement
SHAKTI_SPEC = DirectorSpecification(
    director_id="DIR-005-SHAKTI",
    name="Shakti",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.VETO,
    primary_domain="Divine Enforcement",
    secondary_domain="All Domains",
    owned_modules=0,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["governance.db", "audit.db"],
        writes_to=["governance.db", "audit.db"],
        ownership=[],
        lock_authority=["policy enforcement"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-020", "WF-030"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["ENFORCED"],
        fallback_stages=["ESCALATED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["policy_enforcement"],
        veto_scopes=["policy_violations"],
        can_be_overridden_by=[],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["policy_enforcer", "veto_executor"],
        forbidden_tools=[],
        requires_audit_for=["policy_enforcer", "veto_executor"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["policy_violations"],
    can_request_but_not_approve=[],
    delegation_authority={}
)

# DIR-006: CHANAKYA - Strategic Dependency Resolver
CHANAKYA_SPEC = DirectorSpecification(
    director_id="DIR-006-CHANAKYA",
    name="Chanakya",
    council=CouncilType.STRATEGY,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Research & Intelligence",
    secondary_domain="Strategic Planning",
    owned_modules=5,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["meta.db", "routing.db", "artifacts_research"],
        writes_to=["routing.db", "audit.db"],
        ownership=[],
        lock_authority=["strategy locks"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["CWF-110"],
        can_gate_workflows=["CWF-111-CWF-130"],
        approved_next_stages=["RESEARCH_APPROVED"],
        fallback_stages=["RESEARCH_REVISED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["research_strategy", "topic_viability"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-001-KRISHNA", "DIR-030-MAHAVISHNU"],
        override_costs={"research_strategy": 50}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["strategy_validator", "viability_scorer"],
        forbidden_tools=["direct_strategy_override"],
        requires_audit_for=["strategy_validator"],
        cost_gates={"viability_scorer": 25}
    ),
    can_make_binding_decisions_on=["research_strategy", "topic_selection"],
    can_request_but_not_approve=["major_pivots"],
    delegation_authority={
        "DIR-007-NARADA": ["research_decisions"]
    }
)

# DIR-007: NARADA - Research Signal Processor
NARADA_SPEC = DirectorSpecification(
    director_id="DIR-007-NARADA",
    name="Narada",
    council=CouncilType.RESEARCH,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Research & Intelligence",
    secondary_domain="Trend Detection",
    owned_modules=8,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_research", "analytics.db"],
        writes_to=["artifacts_research", "audit.db"],
        ownership=["artifacts_research"],
        lock_authority=["research quality"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["CWF-120"],
        can_gate_workflows=["CWF-121-CWF-130"],
        approved_next_stages=["RESEARCH_QUALITY_APPROVED"],
        fallback_stages=["RESEARCH_EXTENDED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["research_quality", "data_reliability"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-006-CHANAKYA"],
        override_costs={"research_quality": 35}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["research_validator", "trend_detector", "signal_analyzer"],
        forbidden_tools=[],
        requires_audit_for=["trend_detector"],
        cost_gates={"trend_detector": 50}
    ),
    can_make_binding_decisions_on=["M-004-M-007", "research_validation"],
    can_request_but_not_approve=["strategic_decisions"],
    delegation_authority={}
)

# DIR-008: RAVANA - Advanced Intelligence
RAVANA_SPEC = DirectorSpecification(
    director_id="DIR-008-RAVANA",
    name="Ravana",
    council=CouncilType.ADVANCED,
    governance_level=GovernanceLevel.POLICY,
    primary_domain="Advanced Intelligence",
    secondary_domain="Complex Analysis",
    owned_modules=0,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["meta.db", "artifacts_*"],
        writes_to=["governance.db", "audit.db"],
        ownership=[],
        lock_authority=["complexity assessment"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-020"],
        can_gate_workflows=["CWF-220-CWF-240"],
        approved_next_stages=["COMPLEXITY_ANALYZED"],
        fallback_stages=["MANUAL_REVIEW"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["complexity_assessment"],
        veto_scopes=["overly_complex_operations"],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"complexity_assessment": 150}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["complexity_analyzer", "decomposer"],
        forbidden_tools=[],
        requires_audit_for=["complexity_analyzer"],
        cost_gates={"complexity_analyzer": 100}
    ),
    can_make_binding_decisions_on=["complexity_thresholds"],
    can_request_but_not_approve=["system_changes"],
    delegation_authority={}
)

# DIR-009: DURGA - Security & Protection
DURGA_SPEC = DirectorSpecification(
    director_id="DIR-009-DURGA",
    name="Durga",
    council=CouncilType.STRATEGY,
    governance_level=GovernanceLevel.VETO,
    primary_domain="Autonomous Intelligence Loop",
    secondary_domain="Councils, Governance, Creator Command & Sovereign Layer",
    owned_modules=2,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["governance.db", "audit.db"],
        writes_to=["governance.db", "audit.db"],
        ownership=[],
        lock_authority=["security locks"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-118"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["SECURITY_CLEARED"],
        fallback_stages=["SECURITY_QUARANTINE"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["security_clearance"],
        veto_scopes=["security_threats"],
        can_be_overridden_by=[],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["security_analyzer", "threat_detector", "blocker"],
        forbidden_tools=[],
        requires_audit_for=["threat_detector", "blocker"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["security_decisions", "threat_assessment"],
    can_request_but_not_approve=[],
    delegation_authority={}
)

# DIR-010: YUDHISHTHIRA - Governance & Wisdom
YUDHISHTHIRA_SPEC = DirectorSpecification(
    director_id="DIR-010-YUDHISHTHIRA",
    name="Yudhishthira",
    council=CouncilType.GOVERNANCE,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Autonomous Intelligence Loop",
    secondary_domain="Councils, Governance, Creator Command & Sovereign Layer",
    owned_modules=3,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["governance.db", "state.db"],
        writes_to=["governance.db"],
        ownership=[],
        lock_authority=[]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-204"],
        can_gate_workflows=["M-200-M-220"],
        approved_next_stages=["ETHICALLY_CLEARED"],
        fallback_stages=["ETHICS_REVIEW"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["ethical_compliance", "wisdom_judgments"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"ethical_compliance": 250}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["ethics_validator", "wisdom_scorer"],
        forbidden_tools=[],
        requires_audit_for=["ethics_validator"],
        cost_gates={"wisdom_scorer": 50}
    ),
    can_make_binding_decisions_on=["ethical_standards"],
    can_request_but_not_approve=["policy_changes"],
    delegation_authority={
        "DIR-029-DHARMA": ["ethics_decisions"]
    }
)

# DIR-011: GANESHA - Obstacle Remover & Route Selector
GANESHA_SPEC = DirectorSpecification(
    director_id="DIR-011-GANESHA",
    name="Ganesha",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.KERNEL,
    primary_domain="Governance, Boot & Skill Operating System",
    secondary_domain="Routing",
    owned_modules=14,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["meta.db", "routing.db"],
        writes_to=["routing.db", "audit.db"],
        ownership=["routing.db"],
        lock_authority=["route selection"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-003"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["ROUTE_SELECTED"],
        fallback_stages=["ROUTE_ALTERNATIVE"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["route_selection", "skill_assignment"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"route_selection": 100}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["router", "skill_selector", "classifier"],
        forbidden_tools=[],
        requires_audit_for=["router"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["routing_all"],
    can_request_but_not_approve=[],
    delegation_authority={
        "DIR-016-ARUNA": ["workflow_routing"]
    }
)

# DIR-012: KUBERA - Spend Authority & Budget
KUBERA_SPEC = DirectorSpecification(
    director_id="DIR-012-KUBERA",
    name="Kubera",
    council=CouncilType.DISTRIBUTION,
    governance_level=GovernanceLevel.VETO,
    primary_domain="Councils, Governance, Creator Command & Sovereign Layer",
    secondary_domain="Script & Narrative Intelligence",
    owned_modules=8,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["hybrid.db", "governance.db"],
        writes_to=["hybrid.db", "governance.db", "audit.db"],
        ownership=["hybrid.db"],
        lock_authority=["budget allocation"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-066"],
        can_gate_workflows=["ALL_COST_INTENSIVE_WORKFLOWS"],
        approved_next_stages=["BUDGET_APPROVED"],
        fallback_stages=["BUDGET_DENIED", "BUDGET_DEFERRED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["cost_authorization", "budget_allocation"],
        veto_scopes=["overspend"],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["budget_allocator", "cost_authorizer", "spend_tracker"],
        forbidden_tools=[],
        requires_audit_for=["budget_allocator", "cost_authorizer"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["all_cost_decisions"],
    can_request_but_not_approve=[],
    delegation_authority={
        "DIR-028-LAKSHMI": ["revenue_decisions"]
    }
)

# DIR-013: YAMA - Hard Legality Gate & Policy
YAMA_SPEC = DirectorSpecification(
    director_id="DIR-013-YAMA",
    name="Yama",
    council=CouncilType.DISTRIBUTION,
    governance_level=GovernanceLevel.VETO,
    primary_domain="Policy Enforcement",
    secondary_domain="All Domains",
    owned_modules=0,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["governance.db", "audit.db"],
        writes_to=["governance.db", "audit.db"],
        ownership=[],
        lock_authority=["policy enforcement"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-001"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["POLICY_COMPLIANT"],
        fallback_stages=["POLICY_BLOCKED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["policy_compliance"],
        veto_scopes=["policy_violations"],
        can_be_overridden_by=[],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["policy_enforcer", "policy_checker"],
        forbidden_tools=[],
        requires_audit_for=["policy_enforcer"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["all_policy_decisions"],
    can_request_but_not_approve=[],
    delegation_authority={}
)

# DIR-014: VAYU - Hardware Resource Supervisor
VAYU_SPEC = DirectorSpecification(
    director_id="DIR-014-VAYU",
    name="Vayu",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.POLICY,
    primary_domain="Resource Management",
    secondary_domain="Hardware Optimization",
    owned_modules=6,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["hybrid.db", "state.db"],
        writes_to=["hybrid.db", "governance.db"],
        ownership=[],
        lock_authority=["resource allocation"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-000"],
        can_gate_workflows=["HEAVY_COMPUTE_WORKFLOWS"],
        approved_next_stages=["RESOURCE_ALLOCATED"],
        fallback_stages=["RESOURCE_OFFLOADED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["resource_allocation", "hardware_mode"],
        veto_scopes=["unsafe_resource_usage"],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"resource_allocation": 200}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["resource_allocator", "hardware_monitor", "offload_controller"],
        forbidden_tools=[],
        requires_audit_for=["resource_allocator"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["resource_allocation", "hardware_decisions"],
    can_request_but_not_approve=["system_architecture"],
    delegation_authority={}
)

# DIR-015: CHITRAGUPTA - State, Audit & Incident Management
CHITRAGUPTA_SPEC = DirectorSpecification(
    director_id="DIR-015-CHITRAGUPTA",
    name="Chitragupta",
    council=CouncilType.SUPREME_VISION,
    governance_level=GovernanceLevel.KERNEL,
    primary_domain="State Management",
    secondary_domain="Audit & Logging",
    owned_modules=10,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["all_veins"],
        writes_to=["audit.db"],
        ownership=["audit.db"],
        lock_authority=["audit integrity"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-001"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["AUDIT_LOGGED"],
        fallback_stages=[]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["audit_compliance"],
        veto_scopes=[],
        can_be_overridden_by=[],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["audit_logger", "incident_recorder", "state_tracker"],
        forbidden_tools=[],
        requires_audit_for=[],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["audit_all"],
    can_request_but_not_approve=[],
    delegation_authority={}
)

# DIR-016: ARUNA - Workflow Conductor & Flow Builder
ARUNA_SPEC = DirectorSpecification(
    director_id="DIR-016-ARUNA",
    name="Aruna",
    council=CouncilType.DISTRIBUTION,
    governance_level=GovernanceLevel.KERNEL,
    primary_domain="Workflow Management",
    secondary_domain="All Domains",
    owned_modules=12,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["state.db", "routing.db"],
        writes_to=["state.db", "routing.db", "audit.db"],
        ownership=["state.db"],
        lock_authority=["workflow stage transitions"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-010"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["STAGE_TRANSITIONED"],
        fallback_stages=["STAGE_HOLD"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["workflow_transitions", "stage_gating"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"workflow_transitions": 150}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["workflow_conductor", "stage_transitioner", "flow_builder"],
        forbidden_tools=[],
        requires_audit_for=["workflow_conductor"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["workflow_all"],
    can_request_but_not_approve=[],
    delegation_authority={
        "DIR-011-GANESHA": ["routing_workflows"]
    }
)

# DIR-017: AGNI - Editing, Render & Transformation
AGNI_SPEC = DirectorSpecification(
    director_id="DIR-017-AGNI",
    name="Agni",
    council=CouncilType.PRODUCTION,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Script & Narrative Intelligence",
    secondary_domain="Research & Intelligence",
    owned_modules=4,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_video", "state.db"],
        writes_to=["artifacts_video", "governance.db"],
        ownership=[],
        lock_authority=["production quality"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-021"],
        can_gate_workflows=["CWF-180-CWF-200"],
        approved_next_stages=["PRODUCTION_APPROVED"],
        fallback_stages=["PRODUCTION_REWORK"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["production_quality", "editing_approval"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"production_quality": 100}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["editor_commander", "render_supervisor", "quality_checker"],
        forbidden_tools=[],
        requires_audit_for=["editor_commander"],
        cost_gates={"render_supervisor": 500}
    ),
    can_make_binding_decisions_on=["M-021-M-024", "production_approval"],
    can_request_but_not_approve=["major_rework"],
    delegation_authority={
        "DIR-018-VISHWAKARMA": ["technical_decisions"]
    }
)

# DIR-018: VISHWAKARMA - Avatar & Technical Engineering
VISHWAKARMA_SPEC = DirectorSpecification(
    director_id="DIR-018-VISHWAKARMA",
    name="Vishwakarma",
    council=CouncilType.PRODUCTION,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Governance, Boot & Skill Operating System",
    secondary_domain="Research & Intelligence",
    owned_modules=20,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_avatar", "artifacts_visual"],
        writes_to=["artifacts_avatar", "governance.db"],
        ownership=["artifacts_avatar"],
        lock_authority=["avatar quality"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-012", "M-017"],
        can_gate_workflows=["CWF-170-CWF-180"],
        approved_next_stages=["AVATAR_APPROVED"],
        fallback_stages=["AVATAR_REVISION"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["avatar_quality", "technical_specs"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"avatar_quality": 200}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["avatar_engineer", "visual_checker", "technical_validator"],
        forbidden_tools=[],
        requires_audit_for=["avatar_engineer"],
        cost_gates={"avatar_engineer": 1000}
    ),
    can_make_binding_decisions_on=["M-012-M-020", "avatar_decisions", "technical_decisions"],
    can_request_but_not_approve=["major_rewrites"],
    delegation_authority={
        "DIR-017-AGNI": ["production_decisions"]
    }
)

# DIR-019: SARASWATI - Voice, Language & Knowledge
SARASWATI_SPEC = DirectorSpecification(
    director_id="DIR-019-SARASWATI",
    name="Saraswati",
    council=CouncilType.DISTRIBUTION,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Operations, Distribution & Optimization",
    secondary_domain="Multi-Agent / Swarm / Expansion",
    owned_modules=15,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_voice", "artifacts_script"],
        writes_to=["artifacts_voice", "governance.db"],
        ownership=["artifacts_voice"],
        lock_authority=["voice quality"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-015", "M-016"],
        can_gate_workflows=["CWF-160-CWF-170"],
        approved_next_stages=["VOICE_APPROVED"],
        fallback_stages=["VOICE_RERECORD"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["voice_quality", "language_accuracy"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"voice_quality": 150}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["voice_director", "language_checker", "accent_validator"],
        forbidden_tools=[],
        requires_audit_for=["voice_director"],
        cost_gates={"voice_director": 800}
    ),
    can_make_binding_decisions_on=["M-013-M-016", "voice_decisions", "language_decisions"],
    can_request_but_not_approve=["major_rework"],
    delegation_authority={}
)

# DIR-020: VALMIKI - Story Architecture & Narrative
VALMIKI_SPEC = DirectorSpecification(
    director_id="DIR-020-VALMIKI",
    name="Valmiki",
    council=CouncilType.CONTENT,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Script & Narrative Intelligence",
    secondary_domain="Research & Intelligence",
    owned_modules=12,
    shadow_pair="DIR-002-SHIVA",
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_script", "artifacts_narrative"],
        writes_to=["artifacts_script", "governance.db"],
        ownership=[],
        lock_authority=["narrative architecture"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-008", "M-009"],
        can_gate_workflows=["CWF-120-CWF-150"],
        approved_next_stages=["NARRATIVE_APPROVED"],
        fallback_stages=["NARRATIVE_REVISION"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["story_architecture", "narrative_coherence"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-002-SHIVA"],
        override_costs={"story_architecture": 75}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["story_architect", "narrative_analyzer", "coherence_checker"],
        forbidden_tools=[],
        requires_audit_for=["story_architect"],
        cost_gates={"narrative_analyzer": 100}
    ),
    can_make_binding_decisions_on=["M-008-M-010", "narrative_decisions"],
    can_request_but_not_approve=["script_approval"],
    delegation_authority={}
)

# DIR-021: HANUMAN - Devoted Executor & Skill Handler
HANUMAN_SPEC = DirectorSpecification(
    director_id="DIR-021-HANUMAN",
    name="Hanuman",
    council=CouncilType.CINEMATIC,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Governance, Boot & Skill Operating System",
    secondary_domain="Multi-Agent / Swarm / Expansion",
    owned_modules=10,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["state.db", "meta.db"],
        writes_to=["state.db", "governance.db"],
        ownership=[],
        lock_authority=["skill execution"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-061"],
        can_gate_workflows=["SKILL_EXECUTION_WORKFLOWS"],
        approved_next_stages=["SKILL_EXECUTED"],
        fallback_stages=["SKILL_QUEUED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["skill_execution", "task_dispatch"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"skill_execution": 50}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["skill_executor", "task_dispatcher", "load_balancer"],
        forbidden_tools=[],
        requires_audit_for=["skill_executor"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["M-061-M-070", "execution_decisions"],
    can_request_but_not_approve=["skill_modifications"],
    delegation_authority={}
)

# DIR-022: NATARAJA - Cosmic Rhythm & Timing
NATARAJA_SPEC = DirectorSpecification(
    director_id="DIR-022-NATARAJA",
    name="Nataraja",
    council=CouncilType.CINEMATIC,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Timing & Synchronization",
    secondary_domain="All Domains",
    owned_modules=0,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["state.db", "artifacts_*"],
        writes_to=["governance.db", "audit.db"],
        ownership=[],
        lock_authority=["timing locks"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["WF-010"],
        can_gate_workflows=["TIME_SENSITIVE_WORKFLOWS"],
        approved_next_stages=["TIMED_CORRECTLY"],
        fallback_stages=["TIMING_ADJUSTED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["timing_decisions"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"timing_decisions": 75}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["timing_coordinator", "rhythm_analyzer", "sync_checker"],
        forbidden_tools=[],
        requires_audit_for=["timing_coordinator"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["timing_all"],
    can_request_but_not_approve=["major_changes"],
    delegation_authority={}
)

# DIR-023: GARUDA - Distribution & Publication Publisher
GARUDA_SPEC = DirectorSpecification(
    director_id="DIR-023-GARUDA",
    name="Garuda",
    council=CouncilType.CINEMATIC,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Governance, Boot & Skill Operating System",
    secondary_domain="Multi-Agent / Swarm / Expansion",
    owned_modules=8,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_*", "state.db"],
        writes_to=["governance.db", "audit.db"],
        ownership=[],
        lock_authority=["publication approval"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-049"],
        can_gate_workflows=["CWF-240-PUBLISH"],
        approved_next_stages=["PUBLISHED"],
        fallback_stages=["PUBLISH_DEFERRED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["publication_approval", "distribution_strategy"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"publication_approval": 100}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["publisher", "distributor", "platform_adapter"],
        forbidden_tools=[],
        requires_audit_for=["publisher"],
        cost_gates={"publisher": 250}
    ),
    can_make_binding_decisions_on=["publication_decisions", "distribution_decisions"],
    can_request_but_not_approve=["multi_platform_decisions"],
    delegation_authority={}
)

# DIR-024: VARUNA - Waters of Time & Momentum
VARUNA_SPEC = DirectorSpecification(
    director_id="DIR-024-VARUNA",
    name="Varuna",
    council=CouncilType.CINEMATIC,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Temporal Orchestration",
    secondary_domain="All Domains",
    owned_modules=0,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["analytics.db", "state.db"],
        writes_to=["governance.db"],
        ownership=[],
        lock_authority=[]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-040"],
        can_gate_workflows=["MOMENTUM_WORKFLOWS"],
        approved_next_stages=["MOMENTUM_HEALTHY"],
        fallback_stages=["MOMENTUM_ADJUST"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["momentum_assessment"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"momentum_assessment": 60}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["momentum_analyzer", "flow_tracker"],
        forbidden_tools=[],
        requires_audit_for=["momentum_analyzer"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["momentum_assessment"],
    can_request_but_not_approve=["strategy_changes"],
    delegation_authority={}
)

# DIR-025: INDRA - King of Gods & Algorithm Intelligence
INDRA_SPEC = DirectorSpecification(
    director_id="DIR-025-INDRA",
    name="Indra",
    council=CouncilType.CINEMATIC,
    governance_level=GovernanceLevel.POLICY,
    primary_domain="Autonomous Intelligence Loop",
    secondary_domain="Script & Narrative Intelligence",
    owned_modules=14,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["analytics.db", "state.db"],
        writes_to=["analytics.db", "governance.db"],
        ownership=[],
        lock_authority=["algorithm assessment"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-121"],
        can_gate_workflows=["CWF-220-ANALYTICS"],
        approved_next_stages=["ALGORITHM_OPTIMIZED"],
        fallback_stages=["ALGORITHM_REVIEW"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["algorithm_optimization", "platform_adaptation"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"algorithm_optimization": 120}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["algorithm_analyzer", "platform_optimizer", "trending_detector"],
        forbidden_tools=[],
        requires_audit_for=["algorithm_analyzer"],
        cost_gates={"platform_optimizer": 300}
    ),
    can_make_binding_decisions_on=["M-121-M-150", "algorithm_decisions"],
    can_request_but_not_approve=["policy_changes"],
    delegation_authority={
        "DIR-025-INDRA": ["trending_decisions"]
    }
)

# DIR-026: KAMA - Desire & Growth Motivation
KAMA_SPEC = DirectorSpecification(
    director_id="DIR-026-KAMA",
    name="Kama",
    council=CouncilType.DISTRIBUTION,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Growth Optimization",
    secondary_domain="All Domains",
    owned_modules=0,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["analytics.db", "artifacts_*"],
        writes_to=["governance.db"],
        ownership=[],
        lock_authority=[]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-054"],
        can_gate_workflows=["GROWTH_WORKFLOWS"],
        approved_next_stages=["GROWTH_OPTIMIZED"],
        fallback_stages=["GROWTH_STANDARD"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["growth_strategy", "expansion_approval"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"growth_strategy": 100}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["growth_analyzer", "expansion_planner"],
        forbidden_tools=[],
        requires_audit_for=["expansion_planner"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["growth_decisions"],
    can_request_but_not_approve=["major_expansions"],
    delegation_authority={}
)

# DIR-027: AKASHA - Ether & Knowledge Plane Owner
AKASHA_SPEC = DirectorSpecification(
    director_id="DIR-027-AKASHA",
    name="Akasha",
    council=CouncilType.KNOWLEDGE,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Knowledge Management",
    secondary_domain="All Domains",
    owned_modules=7,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["artifacts_research", "meta.db"],
        writes_to=["meta.db", "governance.db"],
        ownership=["meta.db"],
        lock_authority=["knowledge plane"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-071"],
        can_gate_workflows=["KNOWLEDGE_WORKFLOWS"],
        approved_next_stages=["KNOWLEDGE_VALIDATED"],
        fallback_stages=["KNOWLEDGE_REVIEW"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["knowledge_validation", "namespace_management"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"knowledge_validation": 80}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["knowledge_validator", "namespace_manager", "graph_builder"],
        forbidden_tools=[],
        requires_audit_for=["namespace_manager"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["M-071-M-080", "knowledge_decisions"],
    can_request_but_not_approve=["major_reorganizations"],
    delegation_authority={}
)

# DIR-028: LAKSHMI - Prosperity & Monetization
LAKSHMI_SPEC = DirectorSpecification(
    director_id="DIR-028-LAKSHMI",
    name="Lakshmi",
    council=CouncilType.FINANCE,
    governance_level=GovernanceLevel.GUIDANCE,
    primary_domain="Revenue & Monetization",
    secondary_domain="All Domains",
    owned_modules=11,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["analytics.db", "hybrid.db"],
        writes_to=["analytics.db", "governance.db"],
        ownership=[],
        lock_authority=["revenue approval"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-057"],
        can_gate_workflows=["MONETIZATION_WORKFLOWS"],
        approved_next_stages=["MONETIZED"],
        fallback_stages=["MONETIZATION_DEFERRED"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["monetization_approval", "revenue_strategy"],
        veto_scopes=[],
        can_be_overridden_by=["DIR-030-MAHAVISHNU"],
        override_costs={"monetization_approval": 150}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["monetization_engine", "revenue_analyzer", "sponsor_matcher"],
        forbidden_tools=[],
        requires_audit_for=["monetization_engine"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["M-057-M-060", "monetization_decisions"],
    can_request_but_not_approve=["major_revisions"],
    delegation_authority={
        "DIR-012-KUBERA": ["budget_decisions"]
    }
)

# DIR-029: DHARMA - Justice & Ethical Duty
DHARMA_SPEC = DirectorSpecification(
    director_id="DIR-029-DHARMA",
    name="Dharma",
    council=CouncilType.GOVERNANCE,
    governance_level=GovernanceLevel.VETO,
    primary_domain="Ethical Enforcement",
    secondary_domain="All Domains",
    owned_modules=5,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["governance.db", "audit.db"],
        writes_to=["governance.db", "audit.db"],
        ownership=[],
        lock_authority=["ethical enforcement"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["M-204"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["ETHICALLY_SOUND"],
        fallback_stages=["ETHICAL_REVIEW"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["ethical_compliance"],
        veto_scopes=["unethical_operations"],
        can_be_overridden_by=[],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["ethics_enforcer", "compliance_checker"],
        forbidden_tools=[],
        requires_audit_for=["ethics_enforcer"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["ethical_all"],
    can_request_but_not_approve=[],
    delegation_authority={}
)

# DIR-030: MAHAVISHNU - Supreme Orchestrator & Final Authority
MAHAVISHNU_SPEC = DirectorSpecification(
    director_id="DIR-030-MAHAVISHNU",
    name="Mahavishnu",
    council=CouncilType.SUPREME,
    governance_level=GovernanceLevel.KERNEL,
    primary_domain="All Domains",
    secondary_domain="All Domains",
    owned_modules=200,
    shadow_pair=None,
    vein_contract=DirectorVeinContract(
        reads_from=["all_veins"],
        writes_to=["all_veins"],
        ownership=["all_veins"],
        lock_authority=["all_locks"]
    ),
    workflow_contract=DirectorWorkflowContract(
        trigger_workflows=["ALL_WORKFLOWS"],
        can_gate_workflows=["ALL_WORKFLOWS"],
        approved_next_stages=["ANY_STAGE"],
        fallback_stages=["ANY_STAGE"]
    ),
    approval_contract=DirectorApprovalContract(
        approval_scopes=["all_decisions"],
        veto_scopes=["all_decisions"],
        can_be_overridden_by=[],
        override_costs={}
    ),
    tool_contract=DirectorToolContract(
        allowed_tools=["ALL_TOOLS"],
        forbidden_tools=[],
        requires_audit_for=["ALL_TOOLS"],
        cost_gates={}
    ),
    can_make_binding_decisions_on=["ALL"],
    can_request_but_not_approve=[],
    delegation_authority={
        "ALL_DIRECTORS": ["any_decision"]
    }
)

# ============================================================================
# COMPLETE DIRECTORS REGISTRY
# ============================================================================

COMPLETE_DIRECTORS_REGISTRY = {
    "DIR-001": KRISHNA_SPEC,
    "DIR-002": SHIVA_SPEC,
    "DIR-003": BRAHMA_SPEC,
    "DIR-004": VISHNU_SPEC,
    "DIR-005": SHAKTI_SPEC,
    "DIR-006": CHANAKYA_SPEC,
    "DIR-007": NARADA_SPEC,
    "DIR-008": RAVANA_SPEC,
    "DIR-009": DURGA_SPEC,
    "DIR-010": YUDHISHTHIRA_SPEC,
    "DIR-011": GANESHA_SPEC,
    "DIR-012": KUBERA_SPEC,
    "DIR-013": YAMA_SPEC,
    "DIR-014": VAYU_SPEC,
    "DIR-015": CHITRAGUPTA_SPEC,
    "DIR-016": ARUNA_SPEC,
    "DIR-017": AGNI_SPEC,
    "DIR-018": VISHWAKARMA_SPEC,
    "DIR-019": SARASWATI_SPEC,
    "DIR-020": VALMIKI_SPEC,
    "DIR-021": HANUMAN_SPEC,
    "DIR-022": NATARAJA_SPEC,
    "DIR-023": GARUDA_SPEC,
    "DIR-024": VARUNA_SPEC,
    "DIR-025": INDRA_SPEC,
    "DIR-026": KAMA_SPEC,
    "DIR-027": AKASHA_SPEC,
    "DIR-028": LAKSHMI_SPEC,
    "DIR-029": DHARMA_SPEC,
    "DIR-030": MAHAVISHNU_SPEC
}

if __name__ == "__main__":
    print("=" * 100)
    print("SHADOW EMPIRE - COMPLETE DIRECTORS REGISTRY (30 DIRECTORS)")
    print("=" * 100)
    print(f"\nTotal Directors Registered: {len(COMPLETE_DIRECTORS_REGISTRY)}")
    print("\nDirectors:")
    for dir_id, spec in COMPLETE_DIRECTORS_REGISTRY.items():
        print(f"  {dir_id}: {spec.name:20} | {spec.council.value:30} | Level: {spec.governance_level.value:10} | Modules: {spec.owned_modules}")
    print(f"\n{'=' * 100}\nAll 30 Directors individually specified with complete routing, vein contracts,\nworkflow integration, approval chains, tool contracts, and delegation authority.\nNO COMPRESSION - FULL DETAIL FOR EACH DIRECTOR\n{'=' * 100}")
