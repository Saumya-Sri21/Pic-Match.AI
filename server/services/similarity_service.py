import os
import numpy as np
import faiss
from PIL import Image
from sentence_transformers import SentenceTransformer
import torch
from typing import List, Optional
from pathlib import Path

from models.product import SimilarityResult, Product
from services.product_service import ProductService

class SimilarityService:
    def __init__(self):
        self.model_name = os.getenv("CLIP_MODEL_NAME", "clip-ViT-B-32")
        self.model = None
        self.index = None
        self.product_service = None
        self.embedding_dim = 512  # CLIP embedding dimension
        
    async def initialize(self):
        """Initialize the CLIP model and FAISS index"""
        print("🔄 Loading CLIP model...")
        
        try:
            # Initialize product service first
            self.product_service = ProductService()
            await self.product_service.initialize()
            
            # Load CLIP model
            self.model = SentenceTransformer(self.model_name)
            
            # Create or load FAISS index
            await self._initialize_faiss_index()
            
            print("✅ CLIP model and FAISS index initialized")
        except Exception as e:
            print(f"❌ Error initializing similarity service: {e}")
            # Ensure product service is still available for mock results
            if not self.product_service:
                self.product_service = ProductService()
                await self.product_service.initialize()
            # Create a dummy model for development
            self.model = None
            self.index = None
    
    async def _initialize_faiss_index(self):
        """Initialize FAISS index with product embeddings"""
        index_path = Path("data/faiss_index.bin")
        
        if index_path.exists():
            # Load existing index
            self.index = faiss.read_index(str(index_path))
            print("📂 Loaded existing FAISS index")
        else:
            # Create new index
            self.index = faiss.IndexFlatIP(self.embedding_dim)  # Inner product for cosine similarity
            
            # Get all products and compute embeddings
            products = await self.product_service.get_all_products()
            
            if products:
                print(f"🔄 Computing embeddings for {len(products)} products...")
                embeddings = []
                
                for product in products:
                    if product.embedding:
                        # Use pre-computed embedding
                        embeddings.append(product.embedding)
                    else:
                        # Compute embedding from image
                        embedding = await self._compute_image_embedding(product.image_url)
                        embeddings.append(embedding)
                        
                        # Update product with embedding
                        product.embedding = embedding.tolist()
                        await self.product_service.update_product(product)
                
                if embeddings:
                    # Normalize embeddings for cosine similarity
                    embeddings_array = np.array(embeddings, dtype=np.float32)
                    faiss.normalize_L2(embeddings_array)
                    
                    # Add to index
                    self.index.add(embeddings_array)
                    
                    # Save index
                    index_path.parent.mkdir(exist_ok=True)
                    faiss.write_index(self.index, str(index_path))
                    
                    print("✅ FAISS index created and saved")
    
    async def _compute_image_embedding(self, image_path_or_url: str) -> np.ndarray:
        """Compute CLIP embedding for an image"""
        try:
            if image_path_or_url.startswith(('http://', 'https://')):
                # Handle URL
                import httpx
                async with httpx.AsyncClient() as client:
                    response = await client.get(image_path_or_url)
                    response.raise_for_status()
                    
                    import io
                    image = Image.open(io.BytesIO(response.content))
            else:
                # Handle local file path
                image = Image.open(image_path_or_url)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Encode image
            embedding = self.model.encode([image], convert_to_tensor=False)[0]
            
            return np.array(embedding, dtype=np.float32)
            
        except Exception as e:
            print(f"Error computing embedding for {image_path_or_url}: {e}")
            # Return zero embedding as fallback
            return np.zeros(self.embedding_dim, dtype=np.float32)
    
    async def find_similar_products(
        self,
        query_image_path: str,
        min_similarity: float = 0.0,
        max_results: int = 20,
        category_filter: Optional[str] = None
    ) -> List[SimilarityResult]:
        """Find visually similar products"""
        try:
            # If model is not initialized, return mock results
            if not self.model or not self.index:
                print("⚠️ CLIP model not initialized, returning mock results")
                return await self._get_mock_results(max_results, category_filter)
            
            # Compute embedding for query image
            query_embedding = await self._compute_image_embedding(query_image_path)
            
            # Normalize for cosine similarity
            query_embedding = query_embedding.reshape(1, -1).astype(np.float32)
            faiss.normalize_L2(query_embedding)
            
            # Search in FAISS index
            k = min(max_results * 2, self.index.ntotal)  # Get more results to filter
            similarities, indices = self.index.search(query_embedding, k)
            
            # Get products
            products = await self.product_service.get_all_products()
            
            results = []
            for i, (similarity, idx) in enumerate(zip(similarities[0], indices[0])):
                if idx == -1:  # Invalid index
                    continue
                    
                if similarity < min_similarity:
                    continue
                
                if idx >= len(products):
                    continue
                    
                product = products[idx]
                
                # Apply category filter
                if category_filter and product.category.lower() != category_filter.lower():
                    continue
                
                results.append(SimilarityResult(
                    product=product,
                    similarity_score=float(similarity)
                ))
                
                if len(results) >= max_results:
                    break
            
            return results
            
        except Exception as e:
            print(f"Error finding similar products: {e}")
            return await self._get_mock_results(max_results, category_filter)
    
    async def _get_mock_results(self, max_results: int = 20, category_filter: Optional[str] = None) -> List[SimilarityResult]:
        """Return mock similarity results for development"""
        try:
            # Ensure product service is initialized
            if not self.product_service:
                self.product_service = ProductService()
                await self.product_service.initialize()
            
            products = await self.product_service.get_all_products()
            
            # Filter by category if specified
            if category_filter:
                products = [p for p in products if p.category.lower() == category_filter.lower()]
            
            # Take first max_results products and assign mock similarity scores
            results = []
            import random
            for i, product in enumerate(products[:max_results]):
                # Generate decreasing similarity scores with some randomness
                base_score = 0.95 - (i * 0.05)
                random_factor = random.uniform(-0.1, 0.1)
                similarity_score = max(0.1, min(0.99, base_score + random_factor))
                
                results.append(SimilarityResult(
                    product=product,
                    similarity_score=similarity_score
                ))
            
            return results
        except Exception as e:
            print(f"Error generating mock results: {e}")
            return []
    
    async def add_product_to_index(self, product: Product):
        """Add a new product to the FAISS index"""
        try:
            # Compute embedding if not present
            if not product.embedding:
                embedding = await self._compute_image_embedding(product.image_url)
                product.embedding = embedding.tolist()
            else:
                embedding = np.array(product.embedding, dtype=np.float32)
            
            # Normalize and add to index
            embedding = embedding.reshape(1, -1)
            faiss.normalize_L2(embedding)
            self.index.add(embedding)
            
            # Save updated index
            index_path = Path("data/faiss_index.bin")
            index_path.parent.mkdir(exist_ok=True)
            faiss.write_index(self.index, str(index_path))
            
        except Exception as e:
            print(f"Error adding product to index: {e}")
    
    async def rebuild_index(self):
        """Rebuild the entire FAISS index"""
        # Remove existing index
        index_path = Path("data/faiss_index.bin")
        if index_path.exists():
            os.remove(index_path)
        
        # Recreate index
        self.index = faiss.IndexFlatIP(self.embedding_dim)
        await self._initialize_faiss_index()
