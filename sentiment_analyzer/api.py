from typing import Dict

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from pydantic import BaseModel

from .classifier.model import Model, get_model

# Initialize FastAPI app
app = FastAPI()

# Add CORSMiddleware to handle cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Pydantic model for request body
class SentimentRequest(BaseModel):
    text: str

# Pydantic model for response body
class SentimentResponse(BaseModel):
    probabilities: Dict[str, float]
    sentiment: str
    confidence: float

# API endpoint for sentiment analysis
@app.post("/predict", response_model=SentimentResponse)
def predict(request: SentimentRequest, model: Model = Depends(get_model)):
    sentiment, confidence, probabilities = model.predict(request.text)
    return SentimentResponse(
        sentiment=sentiment, confidence=confidence, probabilities=probabilities
    )
