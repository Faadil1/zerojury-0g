#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${ZERO_G_API_KEY:-}" ]]; then
  echo "ERROR: ZERO_G_API_KEY is not set."
  exit 1
fi

BASE_URL="${ZERO_G_BASE_URL:-https://router-api-testnet.integratenetwork.work/v1}"
MODEL="${ZERO_G_MODEL:-zai-org/GLM-5-FP8}"

curl --fail-with-body --silent --show-error \
  "$BASE_URL/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZERO_G_API_KEY" \
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [
      {
        \"role\": \"system\",
        \"content\": \"You are Juror A in ZeroJury. Return a concise recommendation, assumptions, risks, and confidence from 0 to 100.\"
      },
      {
        \"role\": \"user\",
        \"content\": \"Should a small software company launch an AI customer support agent before completing an external security audit?\"
      }
    ]
  }"
