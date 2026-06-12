#!/usr/bin/env bash
set -euo pipefail

# Cloud Run デプロイスクリプト (toddler-nas-photo-indexer)
# 使い方:
#   GCP_PROJECT_ID=your-project-id \
#   bash scripts/deploy-cloudrun.sh

PROJECT_ID="${GCP_PROJECT_ID:?GCP_PROJECT_ID is required}"
REGION="${REGION:-asia-northeast1}"
BACKEND_SERVICE="toddler-nas-photo-indexer-backend"
FRONTEND_SERVICE="toddler-nas-photo-indexer-frontend"
BACKEND_IMAGE="gcr.io/${PROJECT_ID}/${BACKEND_SERVICE}"
FRONTEND_IMAGE="gcr.io/${PROJECT_ID}/${FRONTEND_SERVICE}"

echo "== Cloud Run デプロイ: toddler-nas-photo-indexer =="
echo "Project: ${PROJECT_ID} | Region: ${REGION}"

# Backend: Cloud Build でビルド & デプロイ
echo "--- Backend ---"
gcloud builds submit ./backend \
  --project="${PROJECT_ID}" \
  --tag="${BACKEND_IMAGE}" \
  --timeout=600s

gcloud run deploy "${BACKEND_SERVICE}" \
  --image="${BACKEND_IMAGE}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="CORS_ORIGINS=https://${FRONTEND_SERVICE}-$(gcloud config get-value project 2>/dev/null | tr ':.' '-').a.run.app" \
  --memory=512Mi \
  --timeout=300 \
  --quiet || true

BACKEND_URL=$(gcloud run services describe "${BACKEND_SERVICE}" \
  --region="${REGION}" --project="${PROJECT_ID}" \
  --format='value(status.url)' 2>/dev/null || echo "")

echo "Backend URL: ${BACKEND_URL:-N/A}"

echo ""
echo "== デプロイ完了 =="
echo "注: NAS ファイルアクセスが必要なため、本アプリは Cloud Run よりもオンプレミス環境での利用を推奨します。"
echo "    Cloud Run での動作は API の基本機能のみ確認可能です。"
