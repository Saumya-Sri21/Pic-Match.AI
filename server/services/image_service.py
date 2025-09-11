import os
import uuid
import httpx
from PIL import Image
from fastapi import UploadFile, HTTPException
from typing import Dict, Any
import aiofiles
from pathlib import Path

from models.product import ImageMetadata

class ImageService:
    def __init__(self):
        self.upload_dir = Path("uploads")
        self.upload_dir.mkdir(exist_ok=True)
        
        self.thumbnail_dir = Path("uploads/thumbnails")
        self.thumbnail_dir.mkdir(exist_ok=True)
        
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.allowed_formats = {'JPEG', 'PNG', 'WEBP', 'BMP', 'GIF'}
    
    async def process_uploaded_file(self, file: UploadFile) -> Dict[str, Any]:
        """Process an uploaded image file"""
        # Validate file size
        contents = await file.read()
        if len(contents) > self.max_file_size:
            raise HTTPException(status_code=400, detail="File too large. Max size is 10MB")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = self.upload_dir / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(contents)
        
        # Process image and get metadata
        return await self._process_image(file_path, file.filename)
    
    async def process_image_url(self, image_url: str) -> Dict[str, Any]:
        """Process an image from URL"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(image_url, timeout=30.0)
                response.raise_for_status()
                
                if not response.headers.get('content-type', '').startswith('image/'):
                    raise HTTPException(status_code=400, detail="URL does not point to an image")
                
                # Generate unique filename
                file_extension = image_url.split('.')[-1].split('?')[0].lower()
                if file_extension not in ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif']:
                    file_extension = 'jpg'
                
                unique_filename = f"{uuid.uuid4()}.{file_extension}"
                file_path = self.upload_dir / unique_filename
                
                # Save image
                async with aiofiles.open(file_path, 'wb') as f:
                    await f.write(response.content)
                
                # Process image and get metadata
                return await self._process_image(file_path, image_url.split('/')[-1])
                
        except httpx.RequestError as e:
            raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing image URL: {str(e)}")
    
    async def _process_image(self, file_path: Path, original_filename: str) -> Dict[str, Any]:
        """Process image and extract metadata"""
        try:
            with Image.open(file_path) as img:
                # Validate format
                if img.format not in self.allowed_formats:
                    os.remove(file_path)
                    raise HTTPException(status_code=400, detail=f"Unsupported image format: {img.format}")
                
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                    img.save(file_path, 'JPEG', quality=95)
                
                # Create thumbnail
                thumbnail_path = await self._create_thumbnail(img, file_path.stem)
                
                # Get file stats
                file_stats = os.stat(file_path)
                
                metadata = ImageMetadata(
                    filename=original_filename,
                    size=file_stats.st_size,
                    width=img.width,
                    height=img.height,
                    format=img.format,
                    content_type=f"image/{img.format.lower()}",
                    image_path=f"/uploads/{file_path.name}",
                    thumbnail_path=f"/uploads/thumbnails/{thumbnail_path.name}" if thumbnail_path else None
                )
                
                return metadata.dict()
                
        except Exception as e:
            # Clean up file if processing fails
            if file_path.exists():
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
    async def _create_thumbnail(self, img: Image.Image, base_name: str) -> Path:
        """Create a thumbnail of the image"""
        try:
            thumbnail_size = (300, 300)
            thumbnail = img.copy()
            thumbnail.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
            
            thumbnail_filename = f"{base_name}_thumb.jpg"
            thumbnail_path = self.thumbnail_dir / thumbnail_filename
            
            thumbnail.save(thumbnail_path, 'JPEG', quality=85)
            return thumbnail_path
            
        except Exception as e:
            print(f"Warning: Could not create thumbnail: {e}")
            return None
    
    def cleanup_temp_files(self, older_than_hours: int = 24):
        """Clean up temporary uploaded files older than specified hours"""
        import time
        current_time = time.time()
        cutoff_time = current_time - (older_than_hours * 3600)
        
        for file_path in self.upload_dir.rglob("*"):
            if file_path.is_file() and file_path.stat().st_mtime < cutoff_time:
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Warning: Could not remove file {file_path}: {e}")
