from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Product(BaseModel):
    id: str = Field(..., description="Unique product identifier")
    name: str = Field(..., description="Product name")
    category: str = Field(..., description="Product category")
    description: Optional[str] = Field(None, description="Product description")
    image_url: str = Field(..., description="Product image URL")
    price: Optional[float] = Field(None, description="Product price")
    brand: Optional[str] = Field(None, description="Product brand")
    tags: List[str] = Field(default_factory=list, description="Product tags")
    embedding: Optional[List[float]] = Field(None, description="CLIP embedding vector")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SimilarityResult(BaseModel):
    product: Product
    similarity_score: float = Field(..., description="Similarity score (0-1)")
    
class ImageMetadata(BaseModel):
    filename: str
    size: int
    width: int
    height: int
    format: str
    content_type: str
    image_path: str
    thumbnail_path: Optional[str] = None
