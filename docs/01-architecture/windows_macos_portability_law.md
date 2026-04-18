# Windows / macOS Portability Law
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Platform Portability
## Status: Wave 00 Established

---

## CORE LAW

Windows and macOS are **mainline operator surfaces**. This is not aspirational.
The current Phase-1 target machine is a Windows laptop (WIN_MID_16G class).

No module, skill, script, or workflow may assume a Linux-only execution surface.
No module may assume any single hardware class.

Every module that has hardware-class implications must declare:
- safe local mode behavior
- hybrid/offload requirement (if any)
- cloud requirement (if any)
- degraded mode behavior on low-resource classes
- blocked behavior on low-resource classes

---

## CANONICAL REGISTRY REFERENCE

`registries/portability_hardware_matrix.yaml`

---

## CURRENT MACHINE TRUTH (Phase-1)

| Property | Value |
|----------|-------|
| Platform | Windows |
| Hardware class | WIN_MID_16G |
| Machine model | Lenovo ThinkPad T480S class |
| RAM | 16GB |
| GPU | Optional dedicated |
| Python available | NO (RB-006) |
| Ollama available | YES |
| n8n instance | Local single instance |
| Execution model | Sequential, one workflow at a time |

---

## WHAT WINDOWS MEANS FOR THE REPO

**Path separators:**
All file paths in PowerShell scripts must use `C:\ShadowEmpire\` format.
All n8n file-read nodes on Windows must use backslash paths or forward-slash
equivalents (n8n normalizes forward slashes on Windows).

**PowerShell scripts:**
`scripts/windows/` contains the canonical Windows bootstrap and sync scripts.
These are the primary setup scripts for the current target machine.

**Python unavailability:**
All `tests/*.py` scripts require Python 3. Python 3 is not installed on the
current machine (RB-006). Options:
1. Install Python 3 on the machine and rerun validators
2. Run validators in a GitHub Actions CI workflow
3. Rewrite validators as n8n workflows (acceptable for Phase-1)

**No Docker requirement in Phase-1:**
The current posture is a direct n8n installation, not Docker-based.
Any Docker-based setup guidance is advisory only.

---

## WHAT macOS MEANS FOR FUTURE SESSIONS

If Chethan switches to macOS (M4 class recommended per hardware analysis):
- Path separators become `/Users/.../ShadowEmpire/`
- Python 3 is typically pre-installed on macOS
- Ollama is available via `ollama run` directly
- `scripts/windows/` scripts have macOS equivalents that must be created in P1 or P2

The portability matrix must be updated when the hardware class changes.

---

## HEAVY MEDIA POSTURE

Heavy media generation (HeyGen avatar render, ElevenLabs voice, FFmpeg processing)
is **cloud-first** in Phase-1 because:
- HeyGen and ElevenLabs are cloud APIs (no local execution path)
- FFmpeg can run locally but is not currently installed on the target machine
- Local video processing would require significant disk and CPU headroom

For Phase-1: heavy media is deferred. The repo contains specs and contracts
for heavy media but does not execute it locally.

---

## PORTABILITY REQUIREMENTS PER MODULE CLASS

| Module Class | Local | Hybrid | Cloud | Degraded |
|-------------|-------|--------|-------|---------|
| Health check | ✓ | ✓ | ✓ | ✓ (limited checks) |
| Dossier management | ✓ | ✓ | ✓ | ✓ |
| Route orchestration | ✓ | ✓ | ✓ | ✗ (needs state) |
| Topic intelligence | ✓ (Ollama) | ✓ | ✓ | ✗ (needs 7B+) |
| Script intelligence | ✓ (Ollama) | ✓ | ✓ | ✗ (needs 7B+) |
| Voice generation | ✗ | ✓ (EL API) | ✓ | ✗ |
| Avatar rendering | ✗ | ✓ (HeyGen) | ✓ | ✗ |
| Publishing | ✗ | ✓ (YT API) | ✓ | ✗ |

---

## RELATED FILES

- `registries/portability_hardware_matrix.yaml`
- `registries/worker_router_contract.yaml`
- `registries/release_blocker_matrix.yaml` (RB-006)
- `scripts/windows/bootstrap-shadow-empire.ps1`
- `docs/03-deployment/windows-local-bootstrap.md`
- `docs/03-deployment/windows-local-repo-read-strategy.md`
