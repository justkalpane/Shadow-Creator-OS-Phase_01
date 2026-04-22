from __future__ import annotations

import csv
import importlib.util
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


REPO_ROOT = Path(__file__).resolve().parents[1]
TMP_AUDIT_DIR = REPO_ROOT / "tmp_audit"


@dataclass
class GapRow:
    name: str
    status: str
    gaps: str
    action: str


def _join(items: Iterable[str], empty_value: str) -> str:
    cleaned = [x.strip() for x in items if x and x.strip()]
    return " ".join(cleaned) if cleaned else empty_value


def _count_sections(text: str) -> int:
    return sum(1 for line in text.splitlines() if line.strip().startswith("## "))


def _has_control_chars(path: Path) -> bool:
    for b in path.read_bytes():
        if b < 9 or (13 < b < 32):
            return True
    return False


def _write_csv(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(rows)


def _title_case_from_slug(slug: str) -> str:
    return slug[:1].upper() + slug[1:]


def build_directors() -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    rows_audit: list[dict[str, str]] = []
    rows_gap: list[dict[str, str]] = []

    director_paths = sorted(
        p
        for p in (REPO_ROOT / "directors").glob("*/*.md")
        if p.name.lower() not in {"garuda_varuna_indra_summary.md"}
    )

    for path in director_paths:
        slug = path.stem.lower()
        contract_name = f"{_title_case_from_slug(slug)}-Contract.md"
        contract_path = REPO_ROOT / "registries" / "director_contracts" / contract_name

        text = path.read_text(encoding="utf-8", errors="replace")
        section_count = _count_sections(text)
        has_contract = contract_path.exists()
        has_runtime_spec_text = (
            "Workflow Integration Matrix" in text
            and "Mutation Law" in text
            and "Failure Surfaces" in text
        )

        gaps: list[str] = []
        actions: list[str] = []
        if not has_contract:
            gaps.append("Missing runtime contract file under registries/director_contracts.")
            actions.append("Create [Name]-Contract.md and register in manifest/runtime loader.")
        if section_count < 16:
            gaps.append("Spec depth below canonical director DNA envelope.")
            actions.append("Expand director spec to match canonical section depth and runtime fields.")

        if not gaps:
            status = "Fully Built"
            gap_text = "No blocking file-level contract gap detected; live n8n export validation still pending."
            action_text = "Run contract-schema validation and live workflow bind test in n8n."
        else:
            status = "Partially Built" if has_contract else "Broken"
            gap_text = _join(gaps, "")
            action_text = _join(actions, "")

        rows_audit.append(
            {
                "Name": slug,
                "Path": str(path),
                "Group": path.parent.name,
                "SectionCount": str(section_count),
                "HasContract": str(has_contract),
                "HasRuntimeSpecText": str(has_runtime_spec_text),
            }
        )
        rows_gap.append(
            {
                "Name/Label": slug,
                "Build Status": status,
                "Gaps/Issues": gap_text,
                "Action Required": action_text,
            }
        )

    return rows_audit, rows_gap


def build_skills() -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    rows_audit: list[dict[str, str]] = []
    rows_gap: list[dict[str, str]] = []

    for path in sorted((REPO_ROOT / "skills").glob("*/*.skill.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        runtime_py_path = path.with_suffix("").with_suffix(".py")

        fulldna_v2_sections = [
            "## 1. Skill Identity",
            "## 2. Purpose",
            "## 3. DNA Injection",
            "## 4. Workflow Injection",
            "## 5. Inputs",
            "## 6. Execution Logic",
            "## 7. Outputs",
            "## 8. Governance",
            "## 9. Tool / Runtime Usage",
            "## 10. Mutation Law",
            "## 11. Best Practices",
            "## 12. Validation / Done",
        ]
        has_fulldna_v2 = all(section in text for section in fulldna_v2_sections)

        if "## SECTION 1: SKILL IDENTITY & OWNERSHIP" in text:
            fmt = "FULLDNA"
        elif has_fulldna_v2:
            fmt = "FULLDNA"
        elif "## 1. Skill Identity" in text:
            fmt = "FLATDNA"
        else:
            fmt = "OTHER_FORMAT"

        bad_fence = text.count("```") % 2 != 0
        has_ctrl = _has_control_chars(path)
        bad_route = "**Owner Workflow:** WF" in text
        weak_owner = bad_route
        runtime_py = runtime_py_path.exists()

        gaps: list[str] = []
        actions: list[str] = []
        if bad_fence or has_ctrl:
            gaps.append("Malformed markdown/code-fence structure in skill body; runtime parsing risk.")
            actions.append("Repair markdown fence blocks and control-character corruption; re-validate against SKILL_DNA_TEMPLATE.")
        if fmt != "FULLDNA":
            gaps.append("Does not fully conform to latest SKILL_DNA_TEMPLATE section model.")
            actions.append("Migrate to full DNA schema sections and required ownership/authority/read-write blocks.")
        if not runtime_py:
            gaps.append("Missing runtime executable counterpart (.py) for n8n runtime handoff.")
            actions.append("Add paired runtime executor with validated input/output packet contract.")
        if bad_route:
            gaps.append("Weak owner workflow token (WF) instead of canonical workflow id.")
            actions.append("Replace generic owner workflow token with canonical producer workflow id.")

        if bad_fence or has_ctrl:
            status = "Broken"
        elif gaps:
            status = "Partially Built"
        else:
            status = "Fully Built"

        gap_text = _join(gaps, "No blocking file-level gap detected; live runtime orchestration verification pending.")
        action_text = _join(actions, "Run end-to-end workflow execution and packet validation in n8n runtime.")

        rows_audit.append(
            {
                "Name": path.name,
                "Path": str(path),
                "Category": path.parent.name,
                "Format": fmt,
                "RuntimePy": str(runtime_py),
                "BadRoute": str(bad_route),
                "BadFence": str(bad_fence or has_ctrl),
                "WeakOwnerWorkflow": str(weak_owner),
            }
        )
        rows_gap.append(
            {
                "Name/Label": path.name,
                "Build Status": status,
                "Gaps/Issues": gap_text,
                "Action Required": action_text,
            }
        )

    return rows_audit, rows_gap


def build_agents() -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    rows_audit: list[dict[str, str]] = []
    rows_gap: list[dict[str, str]] = []

    agent_files = sorted(
        p
        for p in (REPO_ROOT / "agents").glob("*/*_agent.py")
        if p.parent.name != "common"
    )

    for path in agent_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        has_class = "class " in text and "Agent" in text
        has_main = "__main__" in text
        has_requests = "requests" in text
        has_retry = "_request_with_retry" in text or "max_retries" in text
        has_timeout = "timeout_seconds" in text

        runtime_contract_ok = False
        runtime_error = ""
        agent_class_name = "".join(part.capitalize() for part in path.parent.name.split("_")) + "Agent"
        try:
            spec = importlib.util.spec_from_file_location(f"audit_{path.stem}", path)
            if spec is None or spec.loader is None:
                raise RuntimeError("spec_loader_missing")
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            if not hasattr(module, agent_class_name):
                raise RuntimeError(f"class_missing:{agent_class_name}")
            klass = getattr(module, agent_class_name)
            agent = klass()
            result = agent.run({"dossier_id": "AUDIT-DOSSIER", "route_id": "ROUTE_PHASE1_STANDARD"})
            required = {"status", "artifact_family", "producer_agent", "governance", "payload"}
            runtime_contract_ok = isinstance(result, dict) and required.issubset(result.keys())
            if runtime_contract_ok:
                has_retry = has_retry or bool(getattr(agent, "max_retries", 0))
                has_timeout = has_timeout or bool(getattr(agent, "timeout_seconds", 0))
        except Exception as exc:
            runtime_error = str(exc)

        gaps: list[str] = []
        actions: list[str] = []
        if not has_retry:
            gaps.append("No retry/backoff handling.")
            actions.append("Add retry/backoff policy for external and runtime-sensitive calls.")
        if not has_timeout:
            gaps.append("No explicit timeout control for external calls.")
            actions.append("Add explicit timeout configuration with safe defaults.")
        if not runtime_contract_ok:
            gaps.append("Missing governance/packetized runtime contract envelope.")
            actions.append("Emit governance + packet envelope aligned with runtime laws.")
        if not has_class or not has_main:
            gaps.append("Missing executable agent class/main contract shape.")
            actions.append("Align file to canonical `<Director>Agent` + `__main__` entrypoint pattern.")

        status = "Fully Built" if not gaps else "Partially Built"
        gap_text = _join(gaps, "No blocking file-level gap detected; runtime behavior checks recommended.")
        action_text = _join(actions, "Run behavior/regression tests for agent runtime decisions and escalation.")

        rows_audit.append(
            {
                "Name": path.name,
                "Path": str(path),
                "HasClass": str(has_class),
                "HasMain": str(has_main),
                "HasRequests": str(has_requests),
                "HasRetry": str(has_retry),
                "HasTimeout": str(has_timeout),
                "RuntimeContractOK": str(runtime_contract_ok),
                "RuntimeError": runtime_error,
                "Lines": str(len(text.splitlines())),
            }
        )
        rows_gap.append(
            {
                "Name/Label": path.name,
                "Build Status": status,
                "Gaps/Issues": gap_text,
                "Action Required": action_text,
            }
        )

    return rows_audit, rows_gap


def build_subskills() -> list[dict[str, str]]:
    candidates = sorted((REPO_ROOT / "skills").glob("*/*.subskill.md"))
    if not candidates:
        return [
            {
                "Name/Label": "Data not available",
                "Build Status": "Not Yet Built",
                "Gaps/Issues": "No dedicated sub-skill module files detected in repository scope; only textual mentions.",
                "Action Required": "Define sub-skill registry + file estate, then implement contract/spec/runtime per PRD registry law.",
            }
        ]

    rows: list[dict[str, str]] = []
    for p in candidates:
        text = p.read_text(encoding="utf-8", errors="replace")
        runtime_py = p.with_suffix("").with_suffix(".py").exists()
        required_sections = [
            "## SECTION 1: SKILL IDENTITY & OWNERSHIP",
            "## SECTION 2: AUTHORITY MATRIX",
            "## SECTION 3: READS (INPUT VEINS)",
            "## SECTION 4: WRITES (OUTPUT VEINS)",
            "## SECTION 5: EXECUTION FLOW & ALGORITHM",
            "## SECTION 6: SCORING FRAMEWORK",
            "## SECTION 7: BEST PRACTICES",
            "## SECTION 8: EXECUTION RULES & CONSTRAINTS",
            "## SECTION 9: FAILURE MODES & RECOVERY",
            "## SECTION 10: TOOL POLICY",
            "## SECTION 11: N8N + OLLAMA PLUGGABILITY",
            "## SECTION 12: VALIDATION & ACCEPTANCE",
        ]
        has_contract = all(token in text for token in required_sections)
        has_plug = "n8n_consumer_workflows:" in text and "ollama_reasoning_injection: true" in text
        status = "Fully Built" if runtime_py and has_contract and has_plug else "Partially Built"
        rows.append(
            {
                "Name/Label": p.name,
                "Build Status": status,
                "Gaps/Issues": (
                    "No blocking file-level gap detected; integration validation still pending."
                    if status == "Fully Built"
                    else "Sub-skill file exists but runtime pairing, contract sections, or pluggability markers are incomplete."
                ),
                "Action Required": (
                    "Run sub-skill integration and route-binding validation."
                    if status == "Fully Built"
                    else "Add missing runtime pair, full contract sections, and n8n/Ollama pluggability markers, then validate bindings."
                ),
            }
        )
    return rows


def build_subagents() -> list[dict[str, str]]:
    candidates = sorted(
        p
        for p in (REPO_ROOT / "sub_agents").glob("**/*.py")
        if p.name != "__init__.py"
    )

    if not candidates:
        return [
            {
                "Name/Label": "Data not available",
                "Build Status": "Not Yet Built",
                "Gaps/Issues": "No dedicated sub-agent module files detected in repository scope; only textual mentions.",
                "Action Required": "Define sub-agent registry + runtime modules + governance contracts, then bind into n8n routes.",
            }
        ]

    rows: list[dict[str, str]] = []
    for p in candidates:
        text = p.read_text(encoding="utf-8", errors="replace")
        has_runtime_shape = "class " in text and ("SubAgent" in text or "WorkflowSubAgentBase" in text)
        status = "Fully Built" if has_runtime_shape else "Partially Built"
        rows.append(
            {
                "Name/Label": p.name,
                "Build Status": status,
                "Gaps/Issues": (
                    "No blocking file-level gap detected; integration validation still pending."
                    if has_runtime_shape
                    else "Sub-agent file exists but canonical runtime class contract is incomplete."
                ),
                "Action Required": (
                    "Run sub-agent integration and route-binding validation."
                    if has_runtime_shape
                    else "Align to canonical sub-agent class/runtime contract and bind into registry."
                ),
            }
        )
    return rows


def _render_table(rows: list[dict[str, str]]) -> str:
    if not rows:
        return "| Name/Label | Build Status | Gaps/Issues | Action Required |\n|---|---|---|---|\n"
    header = "| Name/Label | Build Status | Gaps/Issues | Action Required |\n|---|---|---|---|\n"
    lines = [
        f"| {r['Name/Label']} | {r['Build Status']} | {r['Gaps/Issues']} | {r['Action Required']} |"
        for r in rows
    ]
    return header + "\n".join(lines) + "\n"


def build_report(
    directors: list[dict[str, str]],
    skills: list[dict[str, str]],
    agents: list[dict[str, str]],
    subskills: list[dict[str, str]],
    subagents: list[dict[str, str]],
) -> str:
    return (
        "# Deep GAP Analysis Report (PRD + n8n)\n\n"
        "## Directors\n"
        f"{_render_table(directors)}\n"
        "## Skills\n"
        f"{_render_table(skills)}\n"
        "## Agents\n"
        f"{_render_table(agents)}\n"
        "## Sub Skills\n"
        f"{_render_table(subskills)}\n"
        "## Sub Agents\n"
        f"{_render_table(subagents)}"
    )


def main() -> None:
    TMP_AUDIT_DIR.mkdir(parents=True, exist_ok=True)

    directors_audit, directors_gap = build_directors()
    skills_audit, skills_gap = build_skills()
    agents_audit, agents_gap = build_agents()
    subskills_gap = build_subskills()
    subagents_gap = build_subagents()

    _write_csv(
        TMP_AUDIT_DIR / "directors_audit.csv",
        ["Name", "Path", "Group", "SectionCount", "HasContract", "HasRuntimeSpecText"],
        directors_audit,
    )
    _write_csv(
        TMP_AUDIT_DIR / "directors_gap_table.csv",
        ["Name/Label", "Build Status", "Gaps/Issues", "Action Required"],
        directors_gap,
    )
    _write_csv(
        TMP_AUDIT_DIR / "skills_audit.csv",
        ["Name", "Path", "Category", "Format", "RuntimePy", "BadRoute", "BadFence", "WeakOwnerWorkflow"],
        skills_audit,
    )
    _write_csv(
        TMP_AUDIT_DIR / "skills_gap_table.csv",
        ["Name/Label", "Build Status", "Gaps/Issues", "Action Required"],
        skills_gap,
    )
    _write_csv(
        TMP_AUDIT_DIR / "agents_audit.csv",
        [
            "Name",
            "Path",
            "HasClass",
            "HasMain",
            "HasRequests",
            "HasRetry",
            "HasTimeout",
            "RuntimeContractOK",
            "RuntimeError",
            "Lines",
        ],
        agents_audit,
    )
    _write_csv(
        TMP_AUDIT_DIR / "agents_gap_table.csv",
        ["Name/Label", "Build Status", "Gaps/Issues", "Action Required"],
        agents_gap,
    )
    _write_csv(
        TMP_AUDIT_DIR / "subskills_gap_table.csv",
        ["Name/Label", "Build Status", "Gaps/Issues", "Action Required"],
        subskills_gap,
    )
    _write_csv(
        TMP_AUDIT_DIR / "subagents_gap_table.csv",
        ["Name/Label", "Build Status", "Gaps/Issues", "Action Required"],
        subagents_gap,
    )

    report = build_report(directors_gap, skills_gap, agents_gap, subskills_gap, subagents_gap)
    (TMP_AUDIT_DIR / "DEEP_GAP_ANALYSIS_REPORT.md").write_text(report, encoding="utf-8")

    print("Regenerated tmp_audit gap tables and DEEP_GAP_ANALYSIS_REPORT.md from live repo state.")
    print(f"Directors: {len(directors_gap)}")
    print(f"Skills: {len(skills_gap)}")
    print(f"Agents: {len(agents_gap)}")
    print(f"Sub Skills: {len(subskills_gap)}")
    print(f"Sub Agents: {len(subagents_gap)}")


if __name__ == "__main__":
    main()
