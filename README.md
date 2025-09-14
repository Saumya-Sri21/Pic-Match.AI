# Visual Product Matcher

A full-stack web application that uses AI-powered visual similarity matching to find products similar to uploaded images. Built with React, FastAPI, and CLIP (Contrastive Language-Image Pre-training) technology.

# Links
Frontend deployed Link : [Link](https://pic-match-ai.onrender.com/)

Backend deployed Link : [Link](https://pic-match-ai-backend.onrender.com)

## 🚀 Features

- **Image Upload & URL Input**: Support for both file uploads and image URL processing
- **AI-Powered Similarity Search**: Uses OpenAI's CLIP model for advanced image understanding
- **Smart Product Matching**: FAISS vector similarity search for fast and accurate results
- **Rich Product Database**: 50+ sample products across multiple categories
- **Advanced Filtering**: Filter by category, similarity score, and sort options
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Preview**: Image metadata display and thumbnail generation
- **Production Ready**: Docker support and deployment configurations

## 🛠️ Tech Stack

### Frontend
- **React** with Vite for fast development
- **Tailwind CSS** for responsive styling
- **React Query** for efficient data fetching
- **React Dropzone** for drag-and-drop uploads
- **Lucide React** for beautiful icons
- **React Hot Toast** for notifications

### Backend
- **FastAPI** for high-performance API
- **Python** with async/await support
- **CLIP Model** via Sentence Transformers
- **FAISS** for vector similarity search
- **Pillow** for image processing
- **Uvicorn** ASGI server

### AI/ML
- **OpenAI CLIP** (ViT-B/32) for image embeddings
- **FAISS** for efficient similarity search
- **Sentence Transformers** for model management

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Visual-Image-Matcher
```

2. **Backend Setup**
```bash
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start the server
python main.py
```

3. **Frontend Setup**
```bash
cd client

# Install dependencies
npm install
Or yarn install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 🌐 Deployment

### Frontend Deployment (Render)
#### Render
1. Connect your GitHub repository
2. Select the `client` directory as root
3. Set build command: `npm install && npm run build`
4. Configure environment variables

### Backend Deployment (Render)

#### Render
1. Connect your GitHub repository
2. Select the `server` directory as root
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Configure environment variables

### Environment Variables

#### Backend (.env)
```env
PORT=8000
HOST=0.0.0.0
FRONTEND_URL=https://your-frontend-domain.com
SENTENCE_MODEL_NAME=sentence-transformers/paraphrase-MiniLM-L6-v2
MAX_SIMILARITY_RESULTS=20
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Visual Product Matcher
VITE_MAX_FILE_SIZE=10485760
```

## 📖 API Documentation

### Endpoints

#### Health Check
- `GET /health` - Check API health status

#### Image Processing
- `POST /api/upload-image` - Upload image file
- `POST /api/upload-url` - Process image from URL

#### Product Search
- `POST /api/find-similar` - Find visually similar products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/{id}` - Get specific product
- `GET /api/categories` - Get available categories

### Example API Usage

```javascript
// Upload image and find similar products
const formData = new FormData()
formData.append('file', imageFile)
formData.append('min_similarity', '0.5')
formData.append('max_results', '10')

const response = await fetch('/api/find-similar', {
  method: 'POST',
  body: formData
})

const results = await response.json()
```

## 🔧 Configuration

### Model Configuration
The application uses OpenAI's CLIP model by default. You can configure different models:

```env
CLIP_MODEL_NAME=openai/clip-vit-base-patch32  # Default
# CLIP_MODEL_NAME=openai/clip-vit-large-patch14  # Larger model
```

### Performance Tuning
- **FAISS Index**: Automatically built on startup
- **Image Processing**: Thumbnails generated for faster loading
- **Caching**: API responses cached with React Query
- **Compression**: Images automatically optimized

## 🧪 Testing

### Backend Tests
```bash
cd server
pytest tests/
```

### Frontend Tests
```bash
cd client
npm test
```

### Manual Testing
1. Upload various image types (JPEG, PNG, WebP)
2. Test URL input with different image sources
3. Verify similarity search accuracy
4. Test filtering and sorting functionality
5. Check responsive design on mobile devices

## 🚨 Troubleshooting

### Common Issues

#### Model Loading Errors
```bash
# Clear model cache
rm -rf ~/.cache/huggingface/
```

#### CORS Issues
- Ensure `FRONTEND_URL` is correctly set in backend environment
- Check that frontend URL matches exactly (including protocol)

#### Memory Issues
- Reduce `MAX_SIMILARITY_RESULTS` for lower memory usage
- Use smaller CLIP model variant

#### Upload Failures
- Check file size limits (10MB default)
- Verify supported image formats
- Ensure upload directory permissions

### Performance Optimization

1. **Backend**
   - Use GPU if available for faster CLIP inference
   - Implement Redis caching for embeddings
   - Use CDN for product images

2. **Frontend**
   - Enable service worker for offline functionality
   - Implement image lazy loading
   - Add pagination for large result sets

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- [OpenAI CLIP](https://github.com/openai/CLIP) for the vision-language model
- [FAISS](https://github.com/facebookresearch/faiss) for efficient similarity search
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python web framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend stack
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling


