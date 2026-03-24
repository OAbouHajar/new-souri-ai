# Souri AI — Developer Guide

## Current State

- All Azure resources have been **deleted** (`azd down`) to save costs (Azure Search was the main cost driver).
- The app supports a **LOCAL_DEV_MODE** that runs without any Azure connection — chat responses are mocked.
- All code, Bicep infrastructure templates, and data files are in the repo and can be fully recreated.

---

## 1. Run Locally — Without Azure (Mock Mode)

No Azure subscription or resources needed. The chat will return mock responses.

### Prerequisites

- Python 3.11+
- Node.js + pnpm (for frontend)

### Steps

1. **Activate the virtual environment:**

   ```bash
   cd get-started-with-ai-chat
   source .venv/bin/activate
   ```

2. **Make sure `src/.env` has `LOCAL_DEV_MODE=true`:**

   ```env
   LOCAL_DEV_MODE=true
   AZURE_AI_CHAT_DEPLOYMENT_NAME=gpt-4o-mini
   AZURE_AI_SEARCH_ENDPOINT=
   AZURE_EXISTING_AIPROJECT_ENDPOINT=
   ```

3. **Start the backend:**

   ```bash
   cd src
   python -m uvicorn "api.main:create_app" --factory --reload
   ```

4. **Start the frontend (separate terminal):**

   ```bash
   cd src/frontend
   pnpm run setup
   ```

5. Open **http://127.0.0.1:8000** in your browser. Chat will return mock responses.

---

## 2. Run Locally — With Azure Connection

Requires active Azure resources (AI Foundry project + optionally Azure AI Search).

### Prerequisites

- Azure subscription with deployed resources
- Azure Developer CLI (`azd`) logged in
- `azd auth login` completed

### Steps

1. **Deploy resources first** (see Section 3) or use existing ones.

2. **Update `src/.env`:**

   ```env
   LOCAL_DEV_MODE=false
   AZURE_TENANT_ID=<your-tenant-id>
   AZURE_AI_CHAT_DEPLOYMENT_NAME=gpt-4o-mini
   AZURE_AI_EMBED_DEPLOYMENT_NAME=text-embedding-3-small
   AZURE_AI_EMBED_DIMENSIONS=100
   AZURE_AI_SEARCH_INDEX_NAME=souri-index
   AZURE_AI_SEARCH_ENDPOINT=https://<your-search-service>.search.windows.net
   AZURE_EXISTING_AIPROJECT_ENDPOINT=https://<your-ai-account>.cognitiveservices.azure.com/
   ```

   You can get these values after `azd up` from `.azure/<env-name>/.env`.

3. **Activate venv and start:**

   ```bash
   source .venv/bin/activate
   cd src
   python -m uvicorn "api.main:create_app" --factory --reload
   ```

4. Open **http://127.0.0.1:8000** — chat will use real Azure AI.

---

## 3. Deploy to Azure with `azd`

### First-time deployment

```bash
azd auth login
azd up
```

This will:
- Provision all Azure resources (AI Foundry, Container App, Search, Container Registry, etc.)
- Build and deploy the app to Azure Container Apps
- Run `scripts/postdeploy.sh` automatically

### Take it down (to save costs)

```bash
azd down --purge
```

This **deletes all resources**. Data (search indexes, embeddings) will be lost. Code stays in the repo.

If `azd down` leaves orphaned resources, delete the resource group directly:

```bash
az group delete --name <your-resource-group> --yes
```

### Bring it back up

```bash
azd up
```

Then re-index your data files (see Section 4).

---

## 4. Re-index Data Files (Search Index)

The pre-computed embeddings file (`src/api/data/embeddings.csv`) is already in the repo. You do **not** need to regenerate it unless you add/change the `.md` data files in `src/api/data/`.

### What happens automatically

When deployed to Azure (via `azd up`), the app uses **gunicorn** which automatically:
1. Creates the Azure Search index (if it doesn't exist)
2. Uploads all documents from `embeddings.csv` into the index

So after `azd up`, the search index is populated automatically — **no manual step needed**.

### When running locally with Azure connection

The uvicorn dev server creates the index structure on startup but does **not** upload documents. To manually upload:

```bash
source .venv/bin/activate
python scripts/generate_embeddings.py
```

### Only regenerate embeddings if you changed data files

If you added/modified `.md` files in `src/api/data/`, regenerate the CSV:

```bash
source .venv/bin/activate
python scripts/generate_embeddings.py
```

This reads all `.md` files, generates new embeddings, writes `embeddings.csv`, and uploads to the search index.

---

## Quick Reference

| Action | Command |
|---|---|
| Run locally (mock) | `LOCAL_DEV_MODE=true` + `python -m uvicorn "api.main:create_app" --factory --reload` |
| Run locally (Azure) | `LOCAL_DEV_MODE=false` + configure endpoints in `src/.env` |
| Deploy to Azure | `azd up` |
| Tear down Azure | `azd down --purge` |
| Re-index data | Only if `.md` files changed: `python scripts/generate_embeddings.py` |
| Frontend dev | `cd src/frontend && pnpm run setup` |
