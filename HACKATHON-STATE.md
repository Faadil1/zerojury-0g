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
