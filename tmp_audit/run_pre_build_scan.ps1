$ErrorActionPreference = 'Stop'

$root = 'C:\ShadowEmpire-Git'

function Safe-GetFiles {
  param(
    [string]$Path,
    [string]$Filter = '*'
  )
  if (Test-Path $Path) {
    return Get-ChildItem -Path $Path -Recurse -File -Filter $Filter
  }
  return @()
}

$summary = [ordered]@{}

$skillFiles = Safe-GetFiles -Path "$root\skills" -Filter '*.skill.md'
$skillPyFiles = Safe-GetFiles -Path "$root\skills" -Filter '*.py'

$summary.skill_files_count = $skillFiles.Count
$summary.skill_py_count = $skillPyFiles.Count

$idPattern = '(?i)\b([A-Z]-\d{3})\b'
$skillIds = @()
foreach ($f in $skillFiles) {
  if ($f.Name -match $idPattern) {
    $skillIds += $matches[1].ToUpper()
  }
}

$summary.skill_ids_unique_count = ($skillIds | Sort-Object -Unique).Count
$summary.skill_id_duplicates = @(
  $skillIds | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object {
    [ordered]@{
      id = $_.Name
      count = $_.Count
    }
  }
)

$requiredSections = @(
  'Skill Identity',
  'Purpose',
  'DNA Injection',
  'Workflow Injection',
  'Inputs',
  'Execution Logic',
  'Outputs',
  'Governance',
  'Tool/Runtime Usage',
  'Mutation Law',
  'Best Practices',
  'Validation/Done'
)

$skillAudit = @()
foreach ($f in $skillFiles) {
  $raw = Get-Content -LiteralPath $f.FullName -Raw
  $missingSections = @()
  foreach ($section in $requiredSections) {
    if ($raw -notmatch [regex]::Escape($section)) {
      $missingSections += $section
    }
  }

  $testCount = 0
  if ($raw -match '(?is)(Validation/Done.*)$') {
    $validationChunk = $matches[1]
    $testCount = ([regex]::Matches($validationChunk, '(?m)^\s*[-*]\s*(Test\s*)?(Case\s*)?\d+\b')).Count
    if ($testCount -eq 0) {
      $testCount = ([regex]::Matches($validationChunk, '(?mi)\btest\b')).Count
    }
  }

  $classification = 'COMPLETE'
  if ($raw.Trim().Length -lt 800) {
    $classification = 'SKELETON'
  } elseif ($missingSections.Count -gt 0 -or $testCount -lt 18) {
    $classification = 'PARTIAL'
  }

  if ($raw -match '(?i)\bTODO\b|\bTBD\b|placeholder') {
    if ($classification -eq 'COMPLETE') {
      $classification = 'PARTIAL'
    }
  }

  $skillAudit += [pscustomobject]@{
    file = $f.FullName
    id = if ($f.Name -match $idPattern) { $matches[1].ToUpper() } else { '' }
    missing_sections = $missingSections
    detected_test_count = $testCount
    classification = $classification
  }
}

$summary.skills_complete = ($skillAudit | Where-Object { $_.classification -eq 'COMPLETE' }).Count
$summary.skills_partial = ($skillAudit | Where-Object { $_.classification -eq 'PARTIAL' }).Count
$summary.skills_skeleton = ($skillAudit | Where-Object { $_.classification -eq 'SKELETON' }).Count
$summary.skills_missing_sections = ($skillAudit | Where-Object { $_.missing_sections.Count -gt 0 }).Count
$summary.skills_under_18_tests = ($skillAudit | Where-Object { $_.detected_test_count -lt 18 }).Count
$summary.skills_partial_sample = @(
  $skillAudit | Where-Object { $_.classification -ne 'COMPLETE' } | Select-Object -First 40
)

$paths = [ordered]@{
  skills = "$root\skills"
  directors = "$root\directors"
  registries = "$root\registries"
  schemas = "$root\schemas"
  n8n_workflows = "$root\n8n\workflows"
  n8n_manifests = "$root\n8n\manifests"
  engine = "$root\engine"
  validators = "$root\validators"
  tests = "$root\tests"
  docs = "$root\docs"
}

$pathSummary = @{}
foreach ($k in $paths.Keys) {
  $files = Safe-GetFiles -Path $paths[$k]
  $pathSummary[$k] = [ordered]@{
    exists = (Test-Path $paths[$k])
    file_count = $files.Count
    sample = @($files | Select-Object -First 10 -ExpandProperty FullName)
  }
}
$summary.path_summary = $pathSummary

$directorMd = Safe-GetFiles -Path "$root\directors" -Filter '*.md' | Where-Object {
  $_.Name -notmatch '^DIRECTORS_' -and $_.Name -notmatch '^DIRECTOR_REGISTRY' -and $_.Name -notmatch 'summary'
}
$summary.director_markdown_count = $directorMd.Count
$summary.director_files = @($directorMd.FullName)

$requiredFiles = @(
  'registries\skill_registry.yaml',
  'registries\workflow_bindings.yaml',
  'registries\director_binding.yaml',
  'registries\schema_registry.yaml',
  'registries\provider_registry.yaml',
  'registries\mode_registry.yaml',
  'registries\governance_rules.yaml',
  'SYSTEM_MANIFEST.yaml',
  'DEPLOYMENT_STATUS.md',
  'RUNBOOK_PHASE1_EXECUTION.md',
  'validators\workflow_validator.js',
  'validators\schema_validator.js',
  'validators\registry_validator.js',
  'validators\runtime_validator.js',
  'engine\skill_loader\skill_loader.js',
  'engine\skill_loader\skill_registry_resolver.js',
  'engine\skill_loader\skill_executor.js',
  'engine\dossier\dossier_writer.js',
  'engine\dossier\dossier_reader.js',
  'engine\dossier\dossier_delta_manager.js',
  'engine\packets\packet_validator.js',
  'engine\packets\packet_router.js',
  'engine\packets\packet_index_writer.js',
  'engine\approval\approval_writer.js',
  'engine\approval\approval_resolver.js',
  'engine\approval\approval_router.js',
  'n8n\workflows\CWF-110.json',
  'n8n\workflows\CWF-120.json',
  'n8n\workflows\CWF-130.json',
  'n8n\workflows\CWF-140.json',
  'n8n\workflows\CWF-210.json',
  'n8n\workflows\CWF-220.json',
  'n8n\workflows\CWF-230.json',
  'n8n\workflows\CWF-240.json',
  'n8n\workflows\WF-020.json',
  'n8n\workflows\WF-021.json'
)

$requiredState = @()
foreach ($rf in $requiredFiles) {
  $requiredState += [pscustomobject]@{
    file = $rf
    exists = (Test-Path (Join-Path $root $rf))
  }
}
$summary.required_file_presence = $requiredState

$workflowJsonFiles = Safe-GetFiles -Path "$root\n8n\workflows" -Filter '*.json'
$workflowJsonStatus = @()
foreach ($wf in $workflowJsonFiles) {
  $ok = $true
  try {
    Get-Content -LiteralPath $wf.FullName -Raw | ConvertFrom-Json | Out-Null
  } catch {
    $ok = $false
  }
  $workflowJsonStatus += [pscustomobject]@{
    file = $wf.FullName
    valid_json = $ok
  }
}
$summary.workflow_json_count = $workflowJsonFiles.Count
$summary.workflow_json_invalid_count = ($workflowJsonStatus | Where-Object { -not $_.valid_json }).Count
$summary.workflow_json_invalid_files = @($workflowJsonStatus | Where-Object { -not $_.valid_json } | Select-Object -ExpandProperty file)

$registryYamlFiles = Safe-GetFiles -Path "$root\registries" -Filter '*.yaml'
$yamlStatus = @()
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if ($null -eq $pythonCmd) {
  foreach ($f in $registryYamlFiles) {
    $yamlStatus += [pscustomobject]@{
      file = $f.FullName
      status = 'unknown_no_python'
    }
  }
} else {
  foreach ($f in $registryYamlFiles) {
    & python -c "import sys, pathlib; p=pathlib.Path(sys.argv[1]); import yaml; yaml.safe_load(p.read_text(encoding='utf-8'))" $f.FullName 2>$null
    $status = if ($LASTEXITCODE -eq 0) { 'valid' } else { 'invalid' }
    $yamlStatus += [pscustomobject]@{
      file = $f.FullName
      status = $status
    }
  }
}
$summary.registry_yaml_count = $registryYamlFiles.Count
$summary.registry_yaml_invalid_count = ($yamlStatus | Where-Object { $_.status -eq 'invalid' }).Count
$summary.registry_yaml_unknown_count = ($yamlStatus | Where-Object { $_.status -like 'unknown*' }).Count
$summary.registry_yaml_invalid_files = @($yamlStatus | Where-Object { $_.status -eq 'invalid' } | Select-Object -ExpandProperty file)

$allFiles = Get-ChildItem -Path $root -Recurse -File
$summary.duplicate_basenames = @(
  $allFiles | Group-Object Name | Where-Object { $_.Count -gt 1 } | Select-Object -First 80 Name, Count
)

$summary.n8n_manifest_files = @((Safe-GetFiles -Path "$root\n8n\manifests").FullName)
$summary.workflow_files = @($workflowJsonFiles.FullName)
$summary.test_files = @((Safe-GetFiles -Path "$root\tests").FullName)

$summary.git_status_porcelain = @((git -C $root status --porcelain))

$outPath = "$root\tmp_audit\pre_build_scan.json"
$summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $outPath -Encoding UTF8
Write-Output "WROTE:$outPath"
