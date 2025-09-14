from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv
from typing import List, Optional
import asyncio

from models.product import Product, SimilarityResult
from services.image_service import ImageService
from services.similarity_service import SimilarityService
from services.product_service import ProductService


# Load environment variables
load_dotenv()

# Initialize services globally
image_service = ImageService()
similarity_service = SimilarityService()
product_service = ProductService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup"""
    print("🚀 Starting Visual Product Matcher API...")
    try:
        await similarity_service.initialize()
        await product_service.initialize()
        print("✅ Services initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing services: {e}")
        # Continue startup even if services fail to initialize
    
    yield
    
    # Cleanup on shutdown
    print("🔄 Shutting down Visual Product Matcher API...")

app = FastAPI(
    title="Visual Product Matcher API",
    description="AI-powered visual product matching using CLIP embeddings",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



# Allowed origins
allowed_origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "https://pic-match-ai.onrender.com"  # Deployed frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount static files for serving uploaded images
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Visual Product Matcher API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "visual-product-matcher"}

@app.post("/api/upload-image", response_model=dict)
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and return metadata"""
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Process the uploaded image
        image_data = await image_service.process_uploaded_file(file)
        
        return {
            "success": True,
            "image_data": image_data,
            "message": "Image uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/api/upload-url", response_model=dict)
async def upload_image_url(image_url: str = Form(...)):
    """Process an image from URL and return metadata"""
    try:
        # Process the image from URL
        image_data = await image_service.process_image_url(image_url)
        
        return {
            "success": True,
            "image_data": image_data,
            "message": "Image processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image URL: {str(e)}")

@app.post("/api/find-similar", response_model=List[SimilarityResult])
async def find_similar_products(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    min_similarity: float = Form(0.0),
    max_results: int = Form(20),
    category_filter: Optional[str] = Form(None)
):
    """Find visually similar products based on uploaded image or URL"""
    try:
        if not file and not image_url:
            raise HTTPException(status_code=400, detail="Either file or image_url must be provided")
        
        # Process the input image
        if file:
            image_data = await image_service.process_uploaded_file(file)
        else:
            image_data = await image_service.process_image_url(image_url)
        
        # Find similar products
        similar_products = await similarity_service.find_similar_products(
            image_data["image_path"],
            min_similarity=min_similarity,
            max_results=max_results,
            category_filter=category_filter
        )
        
        return similar_products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding similar products: {str(e)}")

@app.get("/api/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get all products with optional filtering"""
    try:
        products = await product_service.get_products(
            category=category,
            limit=limit,
            offset=offset
        )
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    try:
        product = await product_service.get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")

@app.get("/api/categories")
async def get_categories():
    """Get all available product categories"""
    try:
        categories = await product_service.get_categories()
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
