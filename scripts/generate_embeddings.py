#!/usr/bin/env python3
"""
Generate embeddings.csv from all .md files in src/api/data/.

Usage:
    cd <project root>
    .venv/bin/python scripts/generate_embeddings.py
"""
import asyncio
import os
import sys

# Load .env from src/
from pathlib import Path
src_dir = Path(__file__).resolve().parent.parent / "src"
env_file = src_dir / ".env"
if env_file.exists():
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())

# Add src to path so we can import api modules
sys.path.insert(0, str(src_dir))


async def main():
    from urllib.parse import urlparse
    from azure.identity import AzureDeveloperCliCredential
    from azure.ai.inference.aio import EmbeddingsClient
    from api.search_index_manager import SearchIndexManager

    project_endpoint = os.environ.get("AZURE_EXISTING_AIPROJECT_ENDPOINT")
    search_endpoint = os.environ.get("AZURE_AI_SEARCH_ENDPOINT")
    index_name = os.environ.get("AZURE_AI_SEARCH_INDEX_NAME", "souri-index")
    embed_model = os.environ.get("AZURE_AI_EMBED_DEPLOYMENT_NAME", "text-embedding-3-small")
    dimensions = int(os.environ.get("AZURE_AI_EMBED_DIMENSIONS") or "100")
    tenant_id = os.environ.get("AZURE_TENANT_ID")

    if not project_endpoint:
        print("ERROR: AZURE_EXISTING_AIPROJECT_ENDPOINT not set. Run scripts/write_env.sh first.")
        sys.exit(1)
    if not search_endpoint:
        print("ERROR: AZURE_AI_SEARCH_ENDPOINT not set.")
        sys.exit(1)

    # Build inference endpoint: https://<account>.services.ai.azure.com/models
    inference_endpoint = f"https://{urlparse(project_endpoint).netloc}/models"

    data_dir = str(src_dir / "api" / "data")
    output_file = str(src_dir / "api" / "data" / "embeddings.csv")

    import glob
    md_count = len(glob.glob(os.path.join(data_dir, "*.md")))
    print(f"Found {md_count} .md files in {data_dir}")
    print(f"Embedding model: {embed_model}, dimensions: {dimensions}")
    print(f"Inference endpoint: {inference_endpoint}")
    print(f"Search endpoint: {search_endpoint}")
    print(f"Index name: {index_name}")
    print(f"Output: {output_file}")
    print()

    if tenant_id:
        creds = AzureDeveloperCliCredential(tenant_id=tenant_id)
    else:
        creds = AzureDeveloperCliCredential()

    embeddings_client = EmbeddingsClient(
        endpoint=inference_endpoint,
        credential=creds,
        credential_scopes=["https://ai.azure.com/.default"],
    )

    search_mgr = SearchIndexManager(
        endpoint=search_endpoint,
        credential=creds,
        index_name=index_name,
        dimensions=dimensions,
        model=embed_model,
        embeddings_client=embeddings_client,
    )

    print("Step 1/3: Building embeddings file (this may take a while)...")
    await search_mgr.build_embeddings_file(
        input_directory=data_dir,
        output_file=output_file,
    )
    print(f"  Done! Embeddings written to {output_file}")

    # Check file size
    size_mb = os.path.getsize(output_file) / (1024 * 1024)
    print(f"  File size: {size_mb:.1f} MB")

    print("\nStep 2/3: Creating search index...")
    created = await search_mgr.create_index(vector_index_dimensions=dimensions)
    if created:
        print("  Index created.")
    else:
        print("  Index already exists.")

    print("\nStep 3/3: Uploading documents to search index...")
    await search_mgr.upload_documents(output_file)
    print("  Upload complete!")

    await search_mgr.close()
    await embeddings_client.close()

    print("\nAll done! RAG is ready.")


if __name__ == "__main__":
    asyncio.run(main())
