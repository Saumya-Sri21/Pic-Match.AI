import json
import os
from typing import List, Optional, Dict, Any
from pathlib import Path
import uuid
from datetime import datetime

from models.product import Product

class ProductService:
    def __init__(self):
        self.data_dir = Path("data")
        self.products_file = self.data_dir / "products.json"
        self.products: List[Product] = []
        
    async def initialize(self):
        """Initialize the product service and load sample data"""
        self.data_dir.mkdir(exist_ok=True)
        
        if self.products_file.exists():
            await self._load_products()
        else:
            await self._create_sample_products()
        
        print(f"✅ Loaded {len(self.products)} products")
    
    async def _load_products(self):
        """Load products from JSON file"""
        try:
            with open(self.products_file, 'r', encoding='utf-8') as f:
                products_data = json.load(f)
                self.products = [Product(**product) for product in products_data]
        except Exception as e:
            print(f"Error loading products: {e}")
            await self._create_sample_products()
    
    async def _save_products(self):
        """Save products to JSON file"""
        try:
            products_data = [product.dict() for product in self.products]
            with open(self.products_file, 'w', encoding='utf-8') as f:
                json.dump(products_data, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving products: {e}")
    
    async def _create_sample_products(self):
        """Create sample products with diverse categories"""
        sample_products = [
            # Electronics
            {
                "id": str(uuid.uuid4()),
                "name": "iPhone 15 Pro",
                "category": "Electronics",
                "description": "Latest iPhone with titanium design and advanced camera system",
                "image_url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
                "price": 999.99,
                "brand": "Apple",
                "tags": ["smartphone", "mobile", "apple", "premium"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "MacBook Pro 16\"",
                "category": "Electronics",
                "description": "Professional laptop with M3 chip",
                "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
                "price": 2499.99,
                "brand": "Apple",
                "tags": ["laptop", "computer", "apple", "professional"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Samsung Galaxy S24",
                "category": "Electronics",
                "description": "Android flagship with AI features",
                "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
                "price": 899.99,
                "brand": "Samsung",
                "tags": ["smartphone", "android", "samsung"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Sony WH-1000XM5",
                "category": "Electronics",
                "description": "Premium noise-canceling headphones",
                "image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
                "price": 399.99,
                "brand": "Sony",
                "tags": ["headphones", "audio", "wireless", "noise-canceling"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "iPad Pro 12.9\"",
                "category": "Electronics",
                "description": "Professional tablet with M2 chip",
                "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
                "price": 1099.99,
                "brand": "Apple",
                "tags": ["tablet", "ipad", "apple", "creative"]
            },
            
            # Fashion
            {
                "id": str(uuid.uuid4()),
                "name": "Nike Air Jordan 1",
                "category": "Fashion",
                "description": "Classic basketball sneakers",
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                "price": 170.00,
                "brand": "Nike",
                "tags": ["sneakers", "shoes", "basketball", "classic"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Levi's 501 Jeans",
                "category": "Fashion",
                "description": "Original straight fit jeans",
                "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
                "price": 89.99,
                "brand": "Levi's",
                "tags": ["jeans", "denim", "casual", "classic"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Adidas Ultraboost 22",
                "category": "Fashion",
                "description": "Premium running shoes",
                "image_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
                "price": 180.00,
                "brand": "Adidas",
                "tags": ["sneakers", "running", "sport", "comfort"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Ray-Ban Aviator",
                "category": "Fashion",
                "description": "Classic aviator sunglasses",
                "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
                "price": 154.00,
                "brand": "Ray-Ban",
                "tags": ["sunglasses", "aviator", "classic", "eyewear"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Patagonia Down Jacket",
                "category": "Fashion",
                "description": "Lightweight down insulation jacket",
                "image_url": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
                "price": 229.00,
                "brand": "Patagonia",
                "tags": ["jacket", "outdoor", "winter", "down"]
            },
            
            # Home & Garden
            {
                "id": str(uuid.uuid4()),
                "name": "Dyson V15 Detect",
                "category": "Home & Garden",
                "description": "Cordless vacuum with laser detection",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
                "price": 749.99,
                "brand": "Dyson",
                "tags": ["vacuum", "cordless", "cleaning", "technology"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "KitchenAid Stand Mixer",
                "category": "Home & Garden",
                "description": "Professional 5-quart stand mixer",
                "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
                "price": 379.99,
                "brand": "KitchenAid",
                "tags": ["mixer", "kitchen", "baking", "appliance"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Instant Pot Duo",
                "category": "Home & Garden",
                "description": "7-in-1 electric pressure cooker",
                "image_url": "https://images.unsplash.com/photo-1585515656973-a0b1b2c8b7b0?w=500",
                "price": 99.99,
                "brand": "Instant Pot",
                "tags": ["pressure cooker", "kitchen", "cooking", "appliance"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Philips Hue Smart Bulbs",
                "category": "Home & Garden",
                "description": "Color-changing smart LED bulbs",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
                "price": 199.99,
                "brand": "Philips",
                "tags": ["smart home", "lighting", "led", "color"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Monstera Deliciosa Plant",
                "category": "Home & Garden",
                "description": "Large tropical houseplant",
                "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
                "price": 45.00,
                "brand": "Nature",
                "tags": ["plant", "houseplant", "tropical", "green"]
            },
            
            # Sports & Outdoors
            {
                "id": str(uuid.uuid4()),
                "name": "Yeti Rambler Tumbler",
                "category": "Sports & Outdoors",
                "description": "Insulated stainless steel tumbler",
                "image_url": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
                "price": 35.00,
                "brand": "Yeti",
                "tags": ["tumbler", "insulated", "outdoor", "drink"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Patagonia Houdini Jacket",
                "category": "Sports & Outdoors",
                "description": "Ultralight windbreaker jacket",
                "image_url": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
                "price": 129.00,
                "brand": "Patagonia",
                "tags": ["jacket", "windbreaker", "outdoor", "lightweight"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "REI Co-op Backpack",
                "category": "Sports & Outdoors",
                "description": "Hiking backpack with 65L capacity",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                "price": 199.00,
                "brand": "REI",
                "tags": ["backpack", "hiking", "outdoor", "travel"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Hydro Flask Water Bottle",
                "category": "Sports & Outdoors",
                "description": "Insulated stainless steel water bottle",
                "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
                "price": 44.95,
                "brand": "Hydro Flask",
                "tags": ["water bottle", "insulated", "outdoor", "hydration"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Coleman Camping Tent",
                "category": "Sports & Outdoors",
                "description": "4-person dome tent for camping",
                "image_url": "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500",
                "price": 129.99,
                "brand": "Coleman",
                "tags": ["tent", "camping", "outdoor", "shelter"]
            },
            
            # Books & Media
            {
                "id": str(uuid.uuid4()),
                "name": "The Design of Everyday Things",
                "category": "Books & Media",
                "description": "Classic design book by Don Norman",
                "image_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
                "price": 16.99,
                "brand": "Basic Books",
                "tags": ["book", "design", "ux", "psychology"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Kindle Paperwhite",
                "category": "Books & Media",
                "description": "Waterproof e-reader with adjustable light",
                "image_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
                "price": 139.99,
                "brand": "Amazon",
                "tags": ["e-reader", "kindle", "books", "reading"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Vinyl Record Player",
                "category": "Books & Media",
                "description": "Bluetooth turntable with built-in speakers",
                "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
                "price": 199.99,
                "brand": "Audio-Technica",
                "tags": ["turntable", "vinyl", "music", "audio"]
            },
            
            # Beauty & Personal Care
            {
                "id": str(uuid.uuid4()),
                "name": "Dyson Airwrap Styler",
                "category": "Beauty & Personal Care",
                "description": "Multi-styler for hair with no extreme heat",
                "image_url": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500",
                "price": 599.99,
                "brand": "Dyson",
                "tags": ["hair styler", "beauty", "hair care", "technology"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Fenty Beauty Foundation",
                "category": "Beauty & Personal Care",
                "description": "Pro Filt'r soft matte foundation",
                "image_url": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500",
                "price": 36.00,
                "brand": "Fenty Beauty",
                "tags": ["foundation", "makeup", "beauty", "cosmetics"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "The Ordinary Niacinamide",
                "category": "Beauty & Personal Care",
                "description": "10% niacinamide + 1% zinc serum",
                "image_url": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500",
                "price": 7.20,
                "brand": "The Ordinary",
                "tags": ["skincare", "serum", "niacinamide", "beauty"]
            },
            
            # Automotive
            {
                "id": str(uuid.uuid4()),
                "name": "Tesla Model 3",
                "category": "Automotive",
                "description": "Electric sedan with autopilot",
                "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
                "price": 38990.00,
                "brand": "Tesla",
                "tags": ["electric car", "sedan", "tesla", "autopilot"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Michelin Pilot Sport Tires",
                "category": "Automotive",
                "description": "High-performance summer tires",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
                "price": 299.99,
                "brand": "Michelin",
                "tags": ["tires", "automotive", "performance", "summer"]
            },
            
            # Toys & Games
            {
                "id": str(uuid.uuid4()),
                "name": "LEGO Creator Expert Set",
                "category": "Toys & Games",
                "description": "Advanced building set for adults",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
                "price": 179.99,
                "brand": "LEGO",
                "tags": ["lego", "building", "toys", "creative"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Nintendo Switch OLED",
                "category": "Toys & Games",
                "description": "Handheld gaming console with OLED screen",
                "image_url": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500",
                "price": 349.99,
                "brand": "Nintendo",
                "tags": ["gaming", "console", "nintendo", "portable"]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Monopoly Board Game",
                "category": "Toys & Games",
                "description": "Classic property trading game",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
                "price": 19.99,
                "brand": "Hasbro",
                "tags": ["board game", "monopoly", "family", "classic"]
            }
        ]
        
        # Add more products to reach 50+
        additional_products = []
        categories = ["Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", "Books & Media"]
        
        for i in range(25):  # Add 25 more products
            category = categories[i % len(categories)]
            additional_products.append({
                "id": str(uuid.uuid4()),
                "name": f"Sample Product {i+1}",
                "category": category,
                "description": f"High-quality {category.lower()} product",
                "image_url": f"https://images.unsplash.com/photo-{1500000000 + i}?w=500",
                "price": round(50 + (i * 10.5), 2),
                "brand": f"Brand {i % 10 + 1}",
                "tags": [category.lower(), "sample", "quality"]
            })
        
        all_products = sample_products + additional_products
        
        self.products = []
        for product_data in all_products:
            product_data['created_at'] = datetime.utcnow()
            self.products.append(Product(**product_data))
        
        await self._save_products()
        print(f"✅ Created {len(self.products)} sample products")
    
    async def get_products(
        self,
        category: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Product]:
        """Get products with optional filtering"""
        filtered_products = self.products
        
        if category:
            filtered_products = [
                p for p in filtered_products 
                if p.category.lower() == category.lower()
            ]
        
        return filtered_products[offset:offset + limit]
    
    async def get_all_products(self) -> List[Product]:
        """Get all products"""
        return self.products
    
    async def get_product_by_id(self, product_id: str) -> Optional[Product]:
        """Get a specific product by ID"""
        for product in self.products:
            if product.id == product_id:
                return product
        return None
    
    async def add_product(self, product: Product) -> Product:
        """Add a new product"""
        self.products.append(product)
        await self._save_products()
        return product
    
    async def update_product(self, updated_product: Product) -> Optional[Product]:
        """Update an existing product"""
        for i, product in enumerate(self.products):
            if product.id == updated_product.id:
                self.products[i] = updated_product
                await self._save_products()
                return updated_product
        return None
    
    async def delete_product(self, product_id: str) -> bool:
        """Delete a product"""
        for i, product in enumerate(self.products):
            if product.id == product_id:
                del self.products[i]
                await self._save_products()
                return True
        return False
    
    async def get_categories(self) -> List[str]:
        """Get all unique categories"""
        categories = set(product.category for product in self.products)
        return sorted(list(categories))
