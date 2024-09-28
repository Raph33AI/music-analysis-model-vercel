'use client';

import { useState } from 'react';
import { analyzeMusic } from '../lib/analyzeMusic';
import MusicAnalysis from '../components/MusicAnalysis';

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      try {
        const buffer = await file.arrayBuffer();
        const result = await analyzeMusic(buffer);
        setAnalysis(result);
      } catch (err) {
        setError('Error analyzing music: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Music Analyzer</h1>
      <div className="mb-8">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>
      {isLoading && <p className="text-center">Analyzing music...</p>}
      {error && <p className="text-red-300 text-center">{error}</p>}
      {analysis && <MusicAnalysis analysis={analysis} />}
    </main>
  );
}
