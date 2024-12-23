import React, { useState } from 'react';
import Img from './assets/background.jpg';
import './index.css';
const App = () => {
  const [text, setText] = useState('');  
  const [response, setResponse] = useState(null);  
  const [loading, setLoading] = useState(false); 

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleApiRequest = async () => {
    if (!text) return;

    setLoading(true);
    try {
      const apiResponse = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ text }),  
      });

      const result = await apiResponse.json();

      if (apiResponse.ok) {
        setResponse(result); 
      } else {
        console.error('Error:', result);
        setResponse(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-green-500';
      case 'Negative':
        return 'text-red-500';
      case 'Neutral':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <>


<div
  className="min-h-screen flex flex-col justify-between" 
  style={{
    backgroundImage: `url(${Img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="flex-grow flex justify-center items-center px-4 sm:px-8"> 
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Sentiment Analysis</h1>

      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text"
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
      />

      <button
        onClick={handleApiRequest}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Analyze Sentiment'}
      </button>

      {response && (
        <div className="mt-4 text-center">
          <p className={`font-semibold ${getSentimentColor(response.sentiment)}`}>
            Sentiment: {response.sentiment.charAt(0).toUpperCase() + response.sentiment.slice(1)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Confidence: {response.confidence.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  </div>


  <div className="bg-blue-700 w-full h-9 text-white flex items-center justify-center">
    Made with &#10084; by Parva
  </div>
</div>
  </>
  );
};

export default App;
