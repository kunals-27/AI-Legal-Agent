import os
import time
from pymilvus import (
    connections,
    FieldSchema, CollectionSchema, DataType,
    Collection, utility
)

MILVUS_HOST = os.getenv("MILVUS_HOST", "localhost")
MILVUS_PORT = os.getenv("MILVUS_PORT", "19530")
COLLECTION = os.getenv("MILVUS_COLLECTION", "legal_chunks")
DIM = 1536  # OpenAI text-embedding-3-small


def ensure_collection():
    # Wait for Milvus to be ready (handles cold start)
    deadline = time.time() + 120  # up to 2 minutes
    last_err = None
    while time.time() < deadline:
        try:
            connections.connect(alias="default", host=MILVUS_HOST, port=MILVUS_PORT)
            # a lightweight call to confirm service availability
            _ = utility.get_server_version()
            print(f"Connected to Milvus at {MILVUS_HOST}:{MILVUS_PORT}, version: {_}")
            break
        except Exception as e:
            last_err = e
            print(f"Milvus not ready yet: {e}. Retrying in 3s...")
            time.sleep(3)
    else:
        raise RuntimeError(f"Failed to connect to Milvus at {MILVUS_HOST}:{MILVUS_PORT}: {last_err}")

    if utility.has_collection(COLLECTION):
        print(f"Collection '{COLLECTION}' already exists")
        return

    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
        FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=1024),
        FieldSchema(name="section", dtype=DataType.VARCHAR, max_length=1024),
        FieldSchema(name="meta", dtype=DataType.VARCHAR, max_length=65535),
        FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=DIM),
    ]
    schema = CollectionSchema(fields=fields, description="Legal chunks for RAG")
    col = Collection(name=COLLECTION, schema=schema)

    # Create index on vector
    index_params = {
        "index_type": "HNSW",
        "metric_type": "COSINE",
        "params": {"M": 16, "efConstruction": 200},
    }
    col.create_index(field_name="vector", index_params=index_params)
    col.load()
    print(f"Created and loaded collection '{COLLECTION}' with HNSW index")


if __name__ == "__main__":
    ensure_collection()
