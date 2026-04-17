# Workflow Promotion Law

## Purpose
This law defines how a workflow pack moves from not-yet-repo-present to repo-present, and from repo-present to trusted runtime use.

## Promotion stages
1. not_repo_present
2. repo_present
3. repo_validated
4. runtime_validated

## Requirements for promotion from not_repo_present to repo_present
A workflow pack may be moved into the canonical repo-present workflow family register only if all of the following exist:
- parent workflow manifest
- parent workflow JSON
- child workflow manifests
- child workflow JSON files
- packet schemas required by the pack
- rule files required by the pack
- skill registry for the pack
- director binding for the pack
- initial skill population for the pack

## Requirements for promotion from repo_present to repo_validated
- repository validation scripts pass
- pack artifacts are referenced correctly by canonical registers and bindings
- no absent-pack conflicts remain

## Requirements for promotion from repo_validated to runtime_validated
- workflows import into n8n cleanly
- child workflows execute successfully
- parent workflow executes successfully
- expected packet contracts appear in runtime outputs
- no node corruption or broken import state remains

## Prohibited state
A workflow pack must not exist in both canonical registers at the same time.

## Current implication for Phase-1
WF-100 and WF-200 are repo-present and are candidates for runtime validation.
WF-300 and WF-400 remain not-yet-repo-present until their required artifact families are created.
