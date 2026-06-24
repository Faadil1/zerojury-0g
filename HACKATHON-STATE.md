project: ZeroJury
hackathon: 0G Zero Cup 2026
phase: DELIVER
status: ACTIVE
team: Faadil Labs
repository: https://github.com/Faadil1/zerojury-0g
technical:
  sponsor_technology: 0G Compute Router
  first_real_inference: PENDING
evidence:
  classification: UNKNOWN
next_gate: Prove one real 0G Compute inference

deltas:
  - date: 2026-06-23
    phase: DELIVER
    gate: first_real_0g_inference
    status: PASS
    evidence_level: OBSERVED
    network: 0G Compute mainnet
    endpoint: https://router-api.0g.ai/v1
    model: zai-org/GLM-5-FP8
    evidence:
      - evidence/first-inference.sanitized.json
    security:
      api_key_committed: false
      raw_reasoning_published: false
    next_gate: Build the minimal ZeroJury application around the proven inference path

  - date: 2026-06-23
    phase: DELIVER
    gate: complete_zerojury_jury_flow
    status: PASS
    evidence_level: OBSERVED
    implementation:
      jurors:
        - Optimist
        - Skeptic
        - Operator
      synthesis_calls: 1
      total_0g_calls: 4
      model: zai-org/GLM-5-FP8
      providers_observed: 2
    evidence:
      - evidence/jury-live.sanitized.json
    security:
      api_key_server_side_only: true
      raw_reasoning_exposed: false
      secret_scan: PASS
    next_gate: Deploy the working application to Cloud Run

  - date: 2026-06-23
    phase: DELIVER
    gate: inference_reliability
    status: PASS
    evidence_level: OBSERVED
    changes:
      glm_thinking_disabled: true
      default_0g_failover: true
      empty_content_retry_limit: 1
      safe_token_budget_restored: true
    validation:
      local_http_status: 200
      jurors: 3
      synthesis_calls: 1
      total_0g_calls: 4
    external_dependency:
      0g_compute_balance_required: true
    next_gate: Redeploy and verify one public structured verdict

  - date: 2026-06-23
    phase: AUDIT
    gate: judge_ready_synthesis
    status: PASS
    evidence_level: OBSERVED
    validation:
      http_status: 200
      jurors: 3
      synthesis_structured: true
      confidence_present: true
      disagreements_present: 3
      risks_present: 3
      total_0g_calls: 4
    submission_readiness: READY
    next_gate: Redeploy and submit the Group Stage snapshot

  - date: 2026-06-24
    phase: AUDIT
    gate: decision_bench_live_preview
    status: PASS
    evidence_level: LIVE
    branch: round32-decision-bench
    deployed_code_sha: 407ace330ced558c36a0d58cf38a1f1fbd4921ed
    preview_url: https://zerojury-preview-z7k2tehgxq-uc.a.run.app
    validation:
      real_0g_compute_call: true
      network: mainnet
      jurors: 3
      inference_calls: 4
      providers_observed: 2
      verdict_visible: true
      confidence_visible: true
      sponsor_proof_visible_without_click: true
      desktop_journey_verified: true
      formatting_defects_resolved: true
    production_service_modified: false
    freeze_rule: No further UI changes unless required by judge feedback or a confirmed defect

  - date: 2026-06-24
    phase: SUBMIT
    gate: zero_cup_submission
    status: SUBMITTED / FROZEN
    evidence_level: LIVE
    platform: 0G Arena
    project: ZeroJury
    team: Faadil Labs
    repository: https://github.com/Faadil1/zerojury-0g
    submitted_code_sha: 407ace330ced558c36a0d58cf38a1f1fbd4921ed
    submitted_tag: decision-bench-v1
    live_demo: https://zerojury-preview-48096573117.us-central1.run.app
    verified_workflow:
      jurors: 3
      synthesis_calls: 1
      total_0g_calls: 4
      network: 0G Compute mainnet
      providers_observed: 2
      sponsor_proof_visible: true
    submission_status: submitted
    production_baseline_preserved: true
    freeze_rule: No code, UI, evidence, assets, deployment, or submission changes unless required by organizers, a confirmed defect, or a new tournament round
    reopen_triggers:
      - organizer feedback
      - confirmed submission defect
      - advancement to next round
