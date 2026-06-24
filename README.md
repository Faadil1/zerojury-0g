# ZeroJury

Ask once. See where AI models agree — and where they do not.

ZeroJury is a multi-perspective decision assistant powered by 0G Compute.

## Status

Live and judge-ready. ZeroJury runs three independent AI jurors — Optimist,
Skeptic, Operator — plus a final synthesis, entirely on **0G Compute
mainnet**. Every session performs four real inference calls through the 0G
Compute Router. Verified evidence (provider addresses, request IDs, and a
SHA-256 hash of one raw response) is recorded under `evidence/`.

Submitted to the 0G Zero Cup 2026, Group Stage (tag `group-stage-v1`).

## Security

API keys are used only server-side and are never committed to the repository.

## Network

Production (`server.js`) defaults to **0G Compute mainnet**
(`https://router-api.0g.ai/v1`) and can be overridden with `ZERO_G_BASE_URL`
if needed.

`scripts/spike-0g.sh` is a standalone dev-spike script, separate from
production. It defaults to the 0G **testnet** router and is intended for
local experimentation only — it does not affect what the deployed app uses.
Override `ZERO_G_BASE_URL` when running the script if you want to point it
at mainnet instead.
